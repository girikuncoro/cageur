-- Use cageur_db for database
\c cageur_db;

SET timezone = 'UTC';

DROP TABLE IF EXISTS disease_group;
CREATE TABLE disease_group (
  id SERIAL NOT NULL,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS clinic;
CREATE TABLE clinic (
  id SERIAL NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  phone_number VARCHAR(32),
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS patient;
CREATE TABLE patient (
  id SERIAL NOT NULL,
  clinic_id INT NOT NULL,
  phone_number VARCHAR(32) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  line_user_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id),
  FOREIGN KEY (clinic_id) REFERENCES clinic(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS patient_disease_group;
CREATE TABLE patient_disease_group (
  id SERIAL NOT NULL,
  patient_id INT NOT NULL,
  disease_group_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id),
  FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE,
  FOREIGN KEY (disease_group_id) REFERENCES disease_group(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS bank;
CREATE TABLE bank (
  id SERIAL NOT NULL,
  name VARCHAR(255) NOT NULL,
  account_holder VARCHAR(255) NOT NULL,
  account_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id)
);

DROP TYPE IF EXISTS subscription_type;
CREATE TYPE subscription_type AS ENUM ('new', 'existing');
DROP TABLE IF EXISTS subscription;
CREATE TABLE subscription (
  id SERIAL NOT NULL,
  clinic_id INT NOT NULL,
  bank_id INT NOT NULL,
  payment_date TIMESTAMP DEFAULT (now() at time zone 'utc'),
  amount INT NOT NULL,
  type subscription_type NOT NULL,
  transfer_from VARCHAR(255) NOT NULL,
  transfer_from_account_holder VARCHAR(255) NOT NULL,
  transfer_from_account_number INT NOT NULL,
  subscription_start TIMESTAMP NOT NULL,
  subscription_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id),
  FOREIGN KEY (clinic_id) REFERENCES clinic(id) ON DELETE CASCADE,
  FOREIGN KEY (bank_id) REFERENCES bank(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS template;
CREATE TABLE template (
  id SERIAL NOT NULL,
  disease_group_id INT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id),
  FOREIGN KEY (disease_group_id) REFERENCES disease_group(id) ON DELETE CASCADE
);
DROP INDEX IF EXISTS distinct_content;
CREATE UNIQUE INDEX distinct_content ON template (disease_group_id, content)
  WHERE disease_group_id IS NOT NULL;
DROP INDEX IF EXISTS distinct_content_null;
CREATE UNIQUE INDEX distinct_content_null ON template (content)
  WHERE disease_group_id IS NULL;

DROP TYPE IF EXISTS message_status;
CREATE TYPE message_status AS ENUM ('pending', 'failed', 'delivered');
DROP TABLE IF EXISTS sent_message;
CREATE TABLE sent_message (
  id SERIAL NOT NULL,
  clinic_id INT NOT NULL,
  disease_group_id INT,
  patient_id INT,  -- patient_id is for future use when individual message comes
  title VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  processed message_status DEFAULT 'pending',
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id),
  FOREIGN KEY (clinic_id) REFERENCES clinic(id) ON DELETE CASCADE,
  FOREIGN KEY (disease_group_id) REFERENCES disease_group(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE,
  CHECK (patient_id IS NOT NULL OR disease_group_id IS NOT NULL)
);

DROP TYPE IF EXISTS scheduled_frequency;
CREATE TYPE scheduled_frequency AS ENUM ('none', 'daily', 'monthly');
DROP TABLE IF EXISTS scheduled_message;
CREATE TABLE scheduled_message (
  id SERIAL NOT NULL,
  clinic_id INT NOT NULL,
  disease_group_id INT,
  patient_id INT,  -- patient_id is for future use when individual message comes
  title VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  frequency scheduled_frequency DEFAULT 'none',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id),
  FOREIGN KEY (clinic_id) REFERENCES clinic(id) ON DELETE CASCADE,
  FOREIGN KEY (disease_group_id) REFERENCES disease_group(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE,
  CHECK (patient_id IS NOT NULL OR disease_group_id IS NOT NULL)
);

DROP TABLE IF EXISTS message_analytics;
CREATE TABLE message_analytics (
  id SERIAL NOT NULL,
  clinic_id INT NOT NULL,
  disease_group_id INT NOT NULL,
  time TIMESTAMP NOT NULL,
  pending INT DEFAULT 0,
  failed INT DEFAULT 0,
  delivered INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id),
  FOREIGN KEY (clinic_id) REFERENCES clinic(id) ON DELETE CASCADE,
  FOREIGN KEY (disease_group_id) REFERENCES disease_group(id) ON DELETE CASCADE
);
DROP INDEX IF EXISTS distinct_time;
CREATE UNIQUE INDEX distinct_time ON message_analytics (clinic_id, disease_group_id, time);

DROP TYPE IF EXISTS user_role;
CREATE TYPE user_role AS ENUM ('superadmin', 'clinic');
DROP TABLE IF EXISTS cageur_user;
CREATE TABLE cageur_user (
  id SERIAL NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'clinic',
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id)
);
DROP INDEX IF EXISTS distinct_email;
CREATE UNIQUE INDEX distinct_email ON cageur_user (email);

-- In Postgres, updated timestamp
-- must be performed manually through trigger
CREATE OR REPLACE FUNCTION update_column_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_updated_at ON disease_group;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON disease_group FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();

DROP TRIGGER IF EXISTS update_updated_at ON clinic;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON clinic FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();

DROP TRIGGER IF EXISTS update_updated_at ON patient;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON patient FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();

DROP TRIGGER IF EXISTS update_updated_at ON patient_disease_group;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON patient_disease_group FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();

DROP TRIGGER IF EXISTS update_updated_at ON bank;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON bank FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();

DROP TRIGGER IF EXISTS update_updated_at ON subscription;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON subscription FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();

DROP TRIGGER IF EXISTS update_updated_at ON template;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON template FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();

DROP TRIGGER IF EXISTS update_updated_at ON sent_message;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON sent_message FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();

DROP TRIGGER IF EXISTS update_updated_at ON scheduled_message;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON scheduled_message FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();

DROP TRIGGER IF EXISTS update_updated_at ON message_analytics;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON message_analytics FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();

DROP TRIGGER IF EXISTS update_updated_at ON cageur_user;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON cageur_user FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();
