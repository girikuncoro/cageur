import psycopg2 as psql
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

data_file = open('../dummy_data/disease_group_data.json')
data_disease_group = json.load(data_file)
sql_insert_disease_group = '''
INSERT INTO disease_group(name)
VALUES ('{}');
'''

for disease_group in data_disease_group['disease_group']:
    disease_group_name = disease_group['name']

    # insert to the database
    try:
        cursor.execute(sql_insert_disease_group.format(disease_group_name))
        db.commit()
    except psql.Error as err:
        print("Something went wrong: {}".format(err))
        db.rollback()

# Close the DB connection
db.close()

# Close the file stream
data_file.close()
