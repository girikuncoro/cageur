DROP DATABASE IF EXISTS disease_group;
CREATE DATABASE disease_group;

\c disease_group;

CREATE TABLE disease_group(
   id             SERIAL PRIMARY KEY     NOT NULL,
   name           TEXT    NOT NULL,
   created_at     timestamp default (now() at time zone 'utc'),
   updated_at     timestamp default (now() at time zone 'utc')
);


INSERT INTO disease_group (name)
  VALUES ('asam urat');

INSERT INTO disease_group (name)
  VALUES ('batuk');

INSERT INTO disease_group (name)
  VALUES ('flu');

INSERT INTO disease_group (name)
  VALUES ('asma');

INSERT INTO disease_group (name)
  VALUES ('diabetes');