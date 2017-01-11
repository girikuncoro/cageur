DROP DATABASE IF EXISTS clinic;
CREATE DATABASE clinic;

\c clinic;

CREATE TABLE clinic(
   id             SERIAL PRIMARY KEY     NOT NULL,
   name           TEXT    NOT NULL,
   address        TEXT    NOT NULL,
   phone          INT     NOT NULL,
   fax            INT     NOT NULL,
   created_at     timestamp default (now() at time zone 'utc'),
   updated_at     timestamp default (now() at time zone 'utc')
);


INSERT INTO clinic (name, address, phone, fax)
  VALUES ('clinic ABC', 'Bandung', '123456', '654321');

INSERT INTO clinic (name, address, phone, fax)
  VALUES ('clinic DEF', 'Bandung', '123456', '654321');

INSERT INTO clinic (name, address, phone, fax)
  VALUES ('clinic GHI', 'Bandung', '123456', '654321');

INSERT INTO clinic (name, address, phone, fax)
  VALUES ('clinic JKL', 'Bandung', '123456', '654321');

INSERT INTO clinic (name, address, phone, fax)
  VALUES ('clinic MNO', 'Bandung', '123456', '654321');