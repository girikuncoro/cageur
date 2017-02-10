DROP DATABASE IF EXISTS users;
CREATE DATABASE users;

\c users;

CREATE TABLE users(
   id             SERIAL PRIMARY KEY     NOT NULL,
   role           INT     NOT NULL,
   first_name     TEXT    NOT NULL,
   last_name      TEXT    NOT NULL,
   email          TEXT    NOT NULL,
   password       TEXT    NOT NULL,
   last_login     timestamp default (now() at time zone 'utc'),
   created_at     timestamp default (now() at time zone 'utc'),
   updated_at     timestamp default (now() at time zone 'utc')
);


INSERT INTO users (role, first_name, last_name, email, password)
  VALUES ('1', 'super admin first name', 'super admin last name', 'superadmin@mailnator.com', '123456');
