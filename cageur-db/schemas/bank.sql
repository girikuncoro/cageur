DROP DATABASE IF EXISTS bank;
CREATE DATABASE bank;

\c bank;

CREATE TABLE bank(
   id             SERIAL PRIMARY KEY     NOT NULL,
   name           TEXT    NOT NULL,
   account_holder TEXT    NOT NULL,
   account_number INT     NOT NULL,
   created_at     timestamp default (now() at time zone 'utc'),
   updated_at     timestamp default (now() at time zone 'utc')
);


INSERT INTO bank (name, account_holder, account_number)
  VALUES ('bank ABC', 'Guta Saputra', '123456');

INSERT INTO bank (name, account_holder, account_number)
  VALUES ('bank ABC', 'Toro Rudy', '123456');

INSERT INTO bank (name, account_holder, account_number)
  VALUES ('bank ABC', 'Giri Kuncoro', '123456');