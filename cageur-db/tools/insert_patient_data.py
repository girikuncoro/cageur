import psycopg2 as psql
from faker import Factory
import random
import os
import json

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

# Get list of clinic
clinics = []
sql_get_clinics = '''
SELECT id,name FROM clinic;
'''
try:
    cursor.execute(sql_get_clinics)
    results = cursor.fetchall()
    for row in results:
        clinic_id = row[0]
        clinic_name = row[1].strip()
        clinics.append({'id': clinic_id, 'name': clinic_name})
except psql.Error as err:
    print 'Unable to fetch clinic data', err
    sys.exit()

# Get list of disease group
disease_groups = []
sql_get_disease_groups = '''
SELECT id,name FROM disease_group;
'''
try:
    cursor.execute(sql_get_disease_groups)
    results = cursor.fetchall()
    for row in results:
        disease_group_id = row[0]
        disease_group_name = row[1].strip()
        disease_groups.append({'id': disease_group_id, 'name': disease_group_name})
except psql.Error as err:
    print 'Unable to fetch disease group data', err
    sys.exit()

# Generate random data for patient
MAX_PATIENT = 100
sql_insert_patient = '''
INSERT INTO patient(
    disease_group_id, clinic_id, phone_number, first_name,
    last_name, line_user_id)
VALUES ('{}', '{}', '{}', '{}', '{}', '{}');
'''
fake = Factory.create()
total_disease_group = len(disease_groups)
for clinic in clinics:
    clinic_id = clinic['id']
    for i in xrange(MAX_PATIENT):
        disease_group_id = random.choice(disease_groups)['id']
        phone_number = '62{}{}'.format(str(random.randint(1111,9999)), i)
        patient_name = fake.name().split(' ')
        first_name = patient_name[0]
        last_name = ' '.join(patient_name[1:])
        line_user_id = last_name.replace(' ', '').lower() + phone_number

        # insert to database
        try:
            # parse SQL command
            insert_sql = sql_insert_patient.format(
                disease_group_id, clinic_id, phone_number, first_name,
                last_name, line_user_id)
            cursor.execute(insert_sql)
            db.commit()
        except psql.Error as err:
            print("Something went wrong: {}".format(err))
            db.rollback()

# Close the DB connection
db.close()
