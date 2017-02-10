DROP DATABASE IF EXISTS subscription;
CREATE DATABASE subscription;

\c subscription;

-- CREATE TYPE container AS ENUM ('new', 'existing');
-- container enum('new','existing')  default 'new',
-- idk why, but everytime i run this command, postgre always return error msg
-- type "enum" does not exist

CREATE TABLE subscription(
   id             SERIAL PRIMARY KEY     NOT NULL,
   clinic_id      INT     NOT NULL,
   bank_id      INT     NOT NULL,
   payment_date   timestamp default (now() at time zone 'utc'),
   amount         INT    NOT NULL,
   container  TEXT    NOT NULL,
   transfer_from  TEXT    NOT NULL,
   transfer_from_account_holder  TEXT    NOT NULL,
   transfer_from_bank_account  TEXT    NOT NULL,
   subscription_start timestamp NOT NULL,
   subscription_end timestamp NOT NULL,
   created_at     timestamp default (now() at time zone 'utc'),
   updated_at     timestamp default (now() at time zone 'utc')
);


INSERT INTO subscription (clinic_id, bank_id, payment_date, amount, container, transfer_from, transfer_from_account_holder, transfer_from_bank_account, subscription_start, subscription_end)
  VALUES ('144', '1', '2017-01-14 00:00:00', '0', 'new', 'default', 'default', 'default', '2017-01-14 00:00:00', '2017-02-14 00:00:00');
