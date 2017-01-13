# Insert dummy clinic data from dummy data folder
python tools/insert_clinic_data.py dummy_data/clinic_data.json

# Insert dummy disease group data from dummy data folder
python tools/insert_disease_group_data.py dummy_data/disease_group_data.json

# Generate random patient name and insert
python tools/insert_patient_data.py

# Generate random patient disease group
python tools/insert_patient_disease_group_data.py

# Generate random content template
python tools/insert_template_data.py
