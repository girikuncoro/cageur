"""
    This worker will be run every 10 minutes
    It will regularly check which messages have to be sent out,
    and update message to the next schedule
"""
import psycopg2 as psql
import os
import json
import sys
import requests
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

CAGEUR_DB_HOST = os.getenv('CAGEUR_DB_HOST', '127.0.0.1')
CAGEUR_DB_PORT = os.getenv('CAGEUR_DB_PORT', 5432)
CAGEUR_DB_USER = os.getenv('CAGEUR_DB_USER', 'cageur_user')
CAGEUR_DB_PASS = os.getenv('CAGEUR_DB_PASS', '123456')
CAGEUR_DB_NAME = os.getenv('CAGEUR_DB_NAME', 'cageur_db')

CAGEUR_API_URL = os.getenv('CAGEUR_API_URL', 'https://cageur-api-staging.herokuapp.com')
CAGEUR_SEND_API = '{}/api/v1/message/send'.format(CAGEUR_API_URL)

class MessageScheduleWorker(object):
    def __init__(self):
        # Open database connection
        self.db = psql.connect(database=CAGEUR_DB_NAME, user=CAGEUR_DB_USER,
            password=CAGEUR_DB_PASS, host=CAGEUR_DB_HOST, port=CAGEUR_DB_PORT)

        # Create new db cursor
        self.cursor = self.db.cursor()

        # Current time in UTC
        self.now = datetime.utcnow()

        # Check interval in seconds
        self.period = 60 * 60 * 24 * 17
        self.next = self.now + timedelta(seconds=self.period)

    def get_scheduled_message(self):
        scheduled_messages = []
        sql_get_scheduled_message = '''
            SELECT id, clinic_id, disease_group_id, content, scheduled_at, frequency
            FROM scheduled_message
            WHERE is_active = TRUE and scheduled_at >= '{}' AND scheduled_at < '{}'
        '''
        try:
            self.cursor.execute(sql_get_scheduled_message.format(self.now, self.next))
            results = self.cursor.fetchall()
            for row in results:
                scheduled_messages.append(row)
        except psql.Error as err:
            print 'Unable to fetch scheduled message data', err
            sys.exit()

        return scheduled_messages

    def send_message(self, clinic_id, **kwargs):
        # return requests.post(CAGEUR_API_URL, data=kwargs)
        print 'Clinic: {}, Send: {}'.format(clinic_id, kwargs)

    def update_scheduled_message(self, msg_id, **kwargs):
        frequency = kwargs['frequency']
        prev_at = scheduled_at = kwargs['scheduled_at']

        if frequency == 'none':
            sql_update_scheduled_message = '''
                UPDATE scheduled_message
                SET is_active = {}
                WHERE id = {}
            '''.format(False, msg_id)

        elif frequency == 'daily':
            scheduled_at += timedelta(days=1)
            sql_update_scheduled_message = '''
                UPDATE scheduled_message
                SET scheduled_at = '{}'
                WHERE id = {}
            '''.format(scheduled_at, msg_id)

        elif frequency == 'monthly':
            scheduled_at += relativedelta(months=1)
            sql_update_scheduled_message = '''
                UPDATE scheduled_message
                SET scheduled_at = '{}'
                WHERE id = {}
            '''.format(scheduled_at, msg_id)

        try:
            print 'Update: {} to {}'.format(prev_at, scheduled_at)
            self.cursor.execute(sql_update_scheduled_message)
            self.db.commit()
        except psql.Error as err:
            print 'Unable to update scheduled message data', err
            sys.exit()

    def run(self):
        scheduled_messages = self.get_scheduled_message()
        for msg in scheduled_messages:
            id, clinic_id, disease_group_id, content, scheduled_at, frequency = msg
            self.send_message(clinic_id, diseaseGroup=disease_group_id,
                body=content)
            self.update_scheduled_message(id, frequency=frequency,
                scheduled_at=scheduled_at)

        print '{} scheduled messages have been sent'.format(len(scheduled_messages))


if __name__ == '__main__':
    worker = MessageScheduleWorker()
    worker.run()
