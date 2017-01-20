import psycopg2 as psql
from faker import Factory
import random
import os
import json
from datetime import datetime

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

# Generate random data for content
MAX_CONTENT = 5
sql_insert_sent_message = '''
INSERT INTO sent_message(clinic_id, disease_group_id, title, content, processed, processed_at)
VALUES ({}, {}, '{}', '{}', '{}', {});
'''
fake = Factory.create()
for disease_id in disease_group_ids:
    for i in xrange(random.randint(1,MAX_CONTENT)):
        content = fake.text()
        title = ' '.join(content.split()[:5])
        content += ' ' + fake.text()

        clinic_id = random.choice(clinic_ids)
        processed = random.choice(['pending', 'failed', 'delivered'])
        processed_at = 'NULL'

        # insert to database
        try:
            if processed != 'pending':
                processed_at = 'now()'
            # parse SQL command
            insert_sql = sql_insert_sent_message.format(
                clinic_id, disease_id, title, content, processed, processed_at)
            cursor.execute(insert_sql)
            db.commit()
        except psql.Error as err:
            print("Something went wrong: {}".format(err))
            db.rollback()

# Close the DB connection
db.close()
