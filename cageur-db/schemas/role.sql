DROP DATABASE IF EXISTS role;
CREATE DATABASE role;

\c role;

CREATE TABLE role(
   id             SERIAL PRIMARY KEY     NOT NULL,
   role           TEXT    NOT NULL,
   created_at     timestamp default (now() at time zone 'utc'),
   updated_at     timestamp default (now() at time zone 'utc')
);


INSERT INTO role (role)
  VALUES ('superadmin');

INSERT INTO role (role)
  VALUES ('clinic');