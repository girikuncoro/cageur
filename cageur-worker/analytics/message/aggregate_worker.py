"""
    This worker will be run daily (midnight batch processing)
    It will aggregate the total messages sent at that day.
    Example: at 1/23 00:00, the worker will aggregate messages for 1/22
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

# Open database connection
db = psql.connect(database=CAGEUR_DB_NAME, user=CAGEUR_DB_USER,
    password=CAGEUR_DB_PASS, host=CAGEUR_DB_HOST, port=CAGEUR_DB_PORT)

# Create new db cursor
cursor = db.cursor()

# Get list of clinic_ids
clinic_ids = []
sql_get_clinics = '''
SELECT id FROM clinic
'''
try:
    cursor.execute(sql_get_clinics)
    results = cursor.fetchall()
    for row in results:
        clinic_id = row[0]
        clinic_ids.append(clinic_id)
except psql.Error as err:
    print 'Unable to fetch clinic data', err
    sys.exit()

# Get list of disease group_ids
disease_group_ids = []
sql_get_disease_groups = '''
SELECT id FROM disease_group
'''
try:
    cursor.execute(sql_get_disease_groups)
    results = cursor.fetchall()
    for row in results:
        disease_group_id = row[0]
        disease_group_ids.append(disease_group_id)
except psql.Error as err:
    print 'Unable to fetch disease group data', err
    sys.exit()

now = datetime.utcnow()
end_time = now
start_time = now.replace(hour=0, minute=0, second=0, microsecond=0)
msg_counter = Counter()

print 'now: ', now
print 'range: ', start_time, end_time
print 'total messages sent between {} and {}'.format(start_time, end_time)

sql_get_sent_message = '''
SELECT processed, clinic_id, disease_group_id, count(*) AS total_message
FROM sent_message
WHERE created_at >= '{}' AND created_at < '{}'
GROUP BY clinic_id, disease_group_id, processed
'''
try:
    sql = sql_get_sent_message.format(start_time, end_time)
    cursor.execute(sql)
    results = cursor.fetchall()

    for row in results:
        processed, clinic_id, disease_group_id, total_message = row
        msg_counter[(processed, clinic_id, disease_group_id)] = total_message

    print 'aggregate: ', msg_counter

except psql.Error as err:
    print 'Unable to retrieve sent messages', err
    sys.exit()

sql_update_message_analytics = '''
INSERT INTO message_analytics (
    clinic_id, disease_group_id, time, pending, failed, delivered
)
VALUES({}, {}, '{}', {}, {}, {})
ON CONFLICT (clinic_id, disease_group_id, time)
DO UPDATE SET pending = {}, failed = {}, delivered = {}
'''

processed_status = ['pending', 'failed', 'delivered']
for clinic_id in clinic_ids:
    for disease_group_id in disease_group_ids:
        ctr = Counter()
        for processed in processed_status:
            ctr[processed] = msg_counter[(processed, clinic_id, disease_group_id)]

        try:
            sql = sql_update_message_analytics.format(
                clinic_id, disease_group_id, start_time,
                ctr['pending'], ctr['failed'], ctr['delivered'],
                ctr['pending'], ctr['failed'], ctr['delivered']
            )
            cursor.execute(sql)
            db.commit()

        except psql.Error as err:
            print 'Unable to retrieve sent messages', err
            sys.exit()

# Close the DB connection
db.close()
