DROP DATABASE IF EXISTS patient;
CREATE DATABASE patient;

\c clinic;
CREATE TABLE patient(
   id             SERIAL PRIMARY KEY     NOT NULL,
   id_category     varchar (255),
   id_clinic       varchar (255),
   phone_number    varchar (255),
   first_name      varchar (255),
   last_name       varchar (255),
   lineID          varchar (255),
   created_at      timestamp default (now() at time zone 'utc'),
   updated_at      timestamp default (now() at time zone 'utc')
);

INSERT INTO patient (id_category, id_clinic, phone_number, first_name, last_name, lineID)
  VALUES ('1', '1', '123456', 'alex', 'nurdin', 'alexnurdin');

INSERT INTO patient (id_category, id_clinic, phone_number, first_name, last_name, lineID)
  VALUES ('1', '1', '123456', 'siti', 'nurhalizah', 'sitinurhalizah');

  