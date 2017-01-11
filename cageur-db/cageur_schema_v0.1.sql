-- Use cageur_db for database
\c cageur_db;

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

DROP TABLE IF EXISTS content;
CREATE TABLE content (
  id SERIAL NOT NULL,
  disease_group_id INT,
  is_all BOOLEAN DEFAULT TRUE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  updated_at TIMESTAMP DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (id),
  FOREIGN KEY (disease_group_id) REFERENCES disease_group(id) ON DELETE CASCADE
);

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

DROP TRIGGER IF EXISTS update_updated_at ON content;
CREATE TRIGGER update_updated_at BEFORE UPDATE
  ON content FOR EACH ROW EXECUTE PROCEDURE
  update_column_updated_at();
