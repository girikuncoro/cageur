"""
    This worker will be run every 10 minutes
    It will regularly check which messages have to be sent out,
    and update message to the next schedule
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
        self.period = 10 * 60

    def get_scheduled_message(self):
        pass

    def update_scheduled_message(self):
        pass

    def send_message(self):
        pass

    def run(self):
        pass

if __name__ == '__main__':
    worker = MessageScheduleWorker()
    worker.run()
