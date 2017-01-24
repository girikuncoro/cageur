import psycopg2 as psql
from faker import Factory
import random
import os
import json
from datetime import datetime, timedelta

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

# Get list of disease group_ids
disease_group_ids = []
sql_get_disease_groups = '''
SELECT id,name FROM disease_group;
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

# Limit to 3 disease groups
disease_group_ids = disease_group_ids[:3]

# Get list of clinic
clinic_ids = []
sql_get_clinics = '''
SELECT id,name FROM clinic;
'''
try:
    cursor.execute(sql_get_clinics)
    results = cursor.fetchall()
    for row in results:
        clinic_id = int(row[0])
        clinic_name = row[1].strip()
        clinic_ids.append(clinic_id)
except psql.Error as err:
    print 'Unable to fetch clinic data', err
    sys.exit()

# Limit to 1 clinic
clinic_ids = clinic_ids[:1]

# Generate random data for message analytics
START_TIME = datetime(2015, 1, 1, 0, 0, 0)
END_TIME = datetime(2017, 1, 30, 0, 0, 0)

sql_insert_message_analytics = '''
INSERT INTO message_analytics(clinic_id, disease_group_id, time, pending, failed, delivered)
VALUES ({}, {}, '{}', '{}', '{}', '{}');
'''
for clinic_id in clinic_ids:
    for disease_id in disease_group_ids:
        current_time = START_TIME
        while current_time <= END_TIME:
            pending = random.randint(0, 100)
            failed = random.randint(0, 100)
            delivered = random.randint(0, 100)

            time = current_time.strftime('%Y-%m-%d')
            current_time += timedelta(days=1)

            # insert to database
            try:
                # parse SQL command
                insert_sql = sql_insert_message_analytics.format(
                    clinic_id, disease_id, time, pending, failed, delivered)
                cursor.execute(insert_sql)
                db.commit()
            except psql.Error as err:
                print("Something went wrong: {}".format(err))
                db.rollback()

# Close the DB connection
db.close()
