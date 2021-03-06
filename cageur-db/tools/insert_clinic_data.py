import psycopg2 as psql
import os
import json
import sys

CAGEUR_DB_HOST = os.getenv('CAGEUR_DB_HOST', '127.0.0.1')
CAGEUR_DB_PORT = os.getenv('CAGEUR_DB_PORT', 5432)
CAGEUR_DB_USER = os.getenv('CAGEUR_DB_USER', 'cageur_user')
CAGEUR_DB_PASS = os.getenv('CAGEUR_DB_PASS', '123456')
CAGEUR_DB_NAME = os.getenv('CAGEUR_DB_NAME', 'cageur_db')


def insert_clinic_data(input_file):
    # Open database connection
    db = psql.connect(database=CAGEUR_DB_NAME, user=CAGEUR_DB_USER,
        password=CAGEUR_DB_PASS, host=CAGEUR_DB_HOST, port=CAGEUR_DB_PORT)

    # Create new db cursor
    cursor = db.cursor()

    data_file = open(input_file)
    data_clinic = json.load(data_file)
    sql_insert_clinic = '''
    INSERT INTO clinic(name, address, phone_number)
    VALUES (%s, %s, %s);
    '''

    for clinic in data_clinic['clinic']:
        clinic_name = clinic['name']
        clinic_address = clinic['address']
        clinic_phone_number = clinic['phone_number']

        # insert to the database
        try:
            cursor.execute(sql_insert_clinic, (clinic_name, clinic_address,
                clinic_phone_number))
            db.commit()
        except psql.Error as err:
            print("Something went wrong: {}".format(err))
            db.rollback()

    # Close the DB connection
    db.close()

    # Close the file stream
    data_file.close()

# python insert_clinic_data.py <input_file>
if __name__ == "__main__":
    input_file = sys.argv[1]
    if not input_file:
        print "please specify input_file to load from"
    insert_clinic_data(input_file)
