DROP DATABASE IF EXISTS patient;
CREATE DATABASE patient;

\c clinic;
CREATE TABLE patient(
   id             SERIAL PRIMARY KEY     NOT NULL,
   phoneNumber    varchar (255),
   firstName      varchar (255),
   lastName       varchar (255),
   categoryID     varchar (255),
   clinicID       varchar (255),
   lineID         varchar (255),
   createdAt      timestamp default (now() at time zone 'utc'),
   updatedAt      timestamp default (now() at time zone 'utc')
);