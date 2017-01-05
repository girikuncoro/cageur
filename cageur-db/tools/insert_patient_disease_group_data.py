import psycopg2 as psql
import random
import os
import sys

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


# Get list of patient_ids
patient_ids = []
sql_get_patients = '''
SELECT id,first_name FROM patient;
'''
try:
    cursor.execute(sql_get_patients)
    results = cursor.fetchall()
    for row in results:
        patient_id = row[0]
        patient_ids.append(patient_id)
except psql.Error as err:
    print 'Unable to fetch disease group data', err
    sys.exit()

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

# Generate random data for patient disease
MAX_PATIENT_DISEASE_GROUP = 300
sql_insert_patient_disease_group = '''
INSERT INTO patient_disease_group(
    patient_id, disease_group_id)
VALUES ('{}', '{}');
'''

for i in xrange(MAX_PATIENT_DISEASE_GROUP):
    patient_id = random.choice(patient_ids)
    disease_group_id = random.choice(disease_group_ids)

    # insert to database
    try:
        # parse SQL command
        insert_sql = sql_insert_patient_disease_group.format(
            patient_id, disease_group_id)
        cursor.execute(insert_sql)
        db.commit()
    except psql.Error as err:
        print("Something went wrong: {}".format(err))
        db.rollback()

# Close the DB connection
db.close()
