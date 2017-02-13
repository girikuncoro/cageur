"""
    This worker will be run daily (midnight batch processing) or every X hours
    It will aggregate the total messages sent at that day.
    Example: at 1/22 23:00, the worker will aggregate all messages in 1/22
"""
import psycopg2 as psql
import os
import json
import sys
from datetime import datetime, time, timedelta
from collections import Counter

CAGEUR_DB_HOST = os.getenv('CAGEUR_DB_HOST', '127.0.0.1')
CAGEUR_DB_PORT = os.getenv('CAGEUR_DB_PORT', 5432)
CAGEUR_DB_USER = os.getenv('CAGEUR_DB_USER', 'cageur_user')
CAGEUR_DB_PASS = os.getenv('CAGEUR_DB_PASS', '123456')
CAGEUR_DB_NAME = os.getenv('CAGEUR_DB_NAME', 'cageur_db')

class AggregateWorker(object):
    def __init__(self):
        # Open database connection
        self.db = psql.connect(database=CAGEUR_DB_NAME, user=CAGEUR_DB_USER,
            password=CAGEUR_DB_PASS, host=CAGEUR_DB_HOST, port=CAGEUR_DB_PORT)

        # Create new db cursor
        self.cursor = self.db.cursor()

        self.now = datetime.utcnow()
        self.today = self.now.replace(hour=0, minute=0, second=0, microsecond=0)
        self.msg_counter = Counter()

        self.clinic_ids = []
        self.disease_group_ids = []

    # Get list of clinic_ids
    def get_clinic_ids(self):
        sql_get_clinics = '''
            SELECT id FROM clinic
        '''
        try:
            self.cursor.execute(sql_get_clinics)
            results = self.cursor.fetchall()
            for row in results:
                clinic_id = row[0]
                self.clinic_ids.append(clinic_id)
        except psql.Error as err:
            print 'Unable to fetch clinic data', err
            sys.exit()

    # Get list of disease group_ids
    def get_disease_group_ids(self):
        sql_get_disease_groups = '''
            SELECT id FROM disease_group
        '''
        try:
            self.cursor.execute(sql_get_disease_groups)
            results = self.cursor.fetchall()
            for row in results:
                disease_group_id = row[0]
                self.disease_group_ids.append(disease_group_id)
        except psql.Error as err:
            print 'Unable to fetch disease group data', err
            sys.exit()

    # Get and aggregate sent messages today
    # from current time back to 00:00 today
    def get_sent_message(self):
        start_time = self.today
        end_time = self.now

        sql_get_sent_message = '''
        SELECT processed, clinic_id, disease_group_id, count(*) AS total_message
        FROM sent_message
        WHERE created_at >= '{}' AND created_at < '{}'
        GROUP BY clinic_id, disease_group_id, processed
        '''
        try:
            sql = sql_get_sent_message.format(start_time, end_time)
            self.cursor.execute(sql)
            results = self.cursor.fetchall()

            for row in results:
                processed, clinic_id, disease_group_id, total_message = row
                self.msg_counter[(processed, clinic_id, disease_group_id)] = total_message

        except psql.Error as err:
            print 'Unable to retrieve sent messages', err
            sys.exit()

    # Update or insert aggregated messages to db
    def update_message_analytics(self):
        sql_update_message_analytics = '''
        INSERT INTO message_analytics (
            clinic_id, disease_group_id, time, pending, failed, delivered
        )
        VALUES({}, {}, '{}', {}, {}, {})
        ON CONFLICT (clinic_id, disease_group_id, time)
        DO UPDATE SET pending = {}, failed = {}, delivered = {}
        '''

        processed_status = ['pending', 'failed', 'delivered']
        for clinic_id in self.clinic_ids:
            for disease_group_id in self.disease_group_ids:
                ctr = Counter()
                for processed in processed_status:
                    ctr[processed] = self.msg_counter[(processed, clinic_id, disease_group_id)]

                try:
                    sql = sql_update_message_analytics.format(
                        clinic_id, disease_group_id, self.today,
                        ctr['pending'], ctr['failed'], ctr['delivered'],
                        ctr['pending'], ctr['failed'], ctr['delivered']
                    )
                    self.cursor.execute(sql)
                    self.db.commit()

                except psql.Error as err:
                    print 'Unable to retrieve sent messages', err
                    sys.exit()

    def run(self):
        print 'now: ', self.now
        print 'range: ', self.now, self.today
        print 'total messages sent between {} and {}'.format(
            self.now, self.today)

        # Main processing
        self.get_clinic_ids()
        self.get_disease_group_ids()
        self.get_sent_message()
        self.update_message_analytics()

        print 'aggregate: ', self.msg_counter

        # Close the DB connection
        self.db.close()

if __name__ == '__main__':
    worker = AggregateWorker()
    worker.run()
