# Cageur DB
Cageur database stored in Postgres

## Requirement
* Python 2.7

## How to install dependencies
```
# install postgres adaptor on local machine
brew install postgresql

# install python libraries
pip install -r requirements.txt
```

## Generate dummy data
Run your `cageur-db` from Docker (the schema is loaded through Dockerfile), then run:
```
# Insert dummy clinic data from dummy data folder
python tools/insert_clinic_data.py

# Insert dummy disease group data from dummy data folder
python tools/insert_disease_group_data.py

# Generate random patient name and insert
python tools/insert_patient_data.py
```

## Helpful tools
Python virtual environment
```
# Init python virtual environment
virtualenv venv

# Activate and isolate the environment
. venv/bin/activate
```
