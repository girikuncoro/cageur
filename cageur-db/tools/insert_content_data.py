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

# Get list of disease group_ids
disease_group_ids = ['NULL']  # null is for all group
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

# Generate random data for content
MAX_CONTENT = 5
sql_insert_content = '''
INSERT INTO content(disease_group_id, template)
VALUES ({}, '{}');
'''
fake = Factory.create()
for disease_id in disease_group_ids:
    for i in xrange(random.randint(1,MAX_CONTENT)):
        template = fake.text()
        template += ' ' + fake.text()

        # insert to database
        try:
            # parse SQL command
            insert_sql = sql_insert_content.format(
                disease_id, template)
            cursor.execute(insert_sql)
            db.commit()
        except psql.Error as err:
            print("Something went wrong: {}".format(err))
            db.rollback()

# Close the DB connection
db.close()
