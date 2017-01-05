# Use postgres 9.6 as base (Heroku postgres default)
FROM postgres:9.6

ENV POSTGRES_USER cageur_user
ENV POSTGRES_PASSWORD 123456
ENV POSTGRES_DB cageur_db

# Load schema
ADD ./cageur_schema_v0.1.sql /docker-entrypoint-initdb.d

# Postgres binds to port 5432
EXPOSE 5432
