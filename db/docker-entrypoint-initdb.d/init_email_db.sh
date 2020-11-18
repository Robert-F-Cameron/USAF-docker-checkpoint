#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE TABLE emails (
        id serial primary key,
        sender varchar not null,
        recipient varchar not null,
        subject varchar,
        message varchar,
        date timestamp default CURRENT_TIMESTAMP
    );
EOSQL

