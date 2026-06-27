---
title: "Migrating Data from CockroachDB to PostgreSQL"
date: 2024-12-10
tags: ["database migration", "prisma", "cockroachdb", "postgresql"]
---
### Migrating Data from CockroachDB to PostgreSQL

Had to migrate database recently, we’ll explore how to migrate data from **CockroachDB** to **PostgreSQL** using Prisma and custom scripts.

This is one of different kind of issue that I worked on recently, While I can't share the entire source, I have abstracted pieces and put in here.

### Step 1: Export Data from CockroachDB

The first step is to export data from the existing CockroachDB database. This can be done using a custom shell script (`export-data.sh`) that uses the `\COPY` command to extract table data into CSV files.

Run the script with the appropriate database URL:

```bash
DB_URL="postgres://user:<hidden-password>@HOST_COCKROACH/database" ./docker/export-data.sh
```

I used the following `tables.txt` file to list the tables to export, started off initially with putting all tables in the file but the script was getting littered with table names. More over could reused the same file for other scripts.

```text:title=tables.txt
accounts
users
foo
bar
```

Refer to the following `export-data.sh` script for the full implementation. This script exports data for all specified tables into CSV files, ready to be imported into the new database.

```bash:title=export-data.sh
#!/bin/bash

# Ensure DB_URL is set
if [[ -z "$DB_URL" ]]; then
  echo "Error: DB_URL environment variable is not set."
  exit 1
fi

# Path to the tables list file
TABLES_FILE="./tables.txt"

# Check if the tables file exists
if [[ ! -f "$TABLES_FILE" ]]; then
  echo "Error: Tables list file (${TABLES_FILE}) not found."
  exit 1
fi

# Directory to store the CSV files
EXPORT_DIR="./data/"
mkdir -p "$EXPORT_DIR"

# Loop through tables and export them
while IFS= read -r table; do
  CSV_FILE="${EXPORT_DIR}/${table}.csv"

  echo "Exporting ${table} to ${CSV_FILE}..."
  psql "$DB_URL" <<EOF
\COPY ${table} TO '${CSV_FILE}' WITH CSV HEADER DELIMITER ',';
EOF
  if [[ $? -ne 0 ]]; then
    echo "Failed to export ${table}. Continuing with next table..."
    continue
  fi
  echo "${table} exported successfully."
done < "$TABLES_FILE"

echo "All tables exported."

```

---

### Step 2: Set Up Tables in PostgreSQL

To prepare the new database, follow these steps:

#### **2.1 Pull Existing Schema**

Use Prisma's `prisma db pull` command to introspect the current database schema. Ensure the `schema.prisma` file is set to the appropriate provider (e.g., `postgresql` or `cockroachdb`):

```bash
npx prisma db pull
```

#### **2.2 Apply Schema to the New Database**

If you're migrating to a clean database, use Prisma’s migration tools to set up the schema. You might need to recreate migration files to reflect the updated schema:

```bash
npx prisma migrate dev
```

This command generates migration files and applies them to the target PostgreSQL database.

---

### Step 3: Import Data into PostgreSQL

Once the schema is ready, you can import the exported data into PostgreSQL using the `import-data.sh` script. This script reads the CSV files and uses the `\COPY` command to import the data:

```bash
DB_URL="postgres://user:<hidden-password>@localhost/dev" ./docker/import-data.sh
```

The script maps the data in the CSV files to their corresponding tables in the PostgreSQL database.

```bash:title=import-data.sh
# Ensure DB_URL is set
if [[ -z "$DB_URL" ]]; then
  echo "Error: DB_URL environment variable is not set."
  exit 1
fi

# Path to the tables list file
TABLES_FILE="./tables.txt"

# Check if the tables file exists
if [[ ! -f "$TABLES_FILE" ]]; then
  echo "Error: Tables list file (${TABLES_FILE}) not found."
  exit 1
fi

# Directory containing the CSV files
CSV_DIR="./data"

# Read tables from the file and import them
while IFS= read -r table; do
  CSV_FILE="${CSV_DIR}/${table}.csv"
  echo "Importing ${table} from ${CSV_FILE}..."
  psql "$DB_URL" <<EOF
\COPY ${table} FROM '${CSV_FILE}' WITH CSV HEADER DELIMITER ',';
EOF

  if [[ $? -ne 0 ]]; then
    echo "Failed to import ${table}."
  else
    echo "${table} imported successfully."
  fi
done < "$TABLES_FILE"

echo "All tables imported."
```

---

### Running PostgreSQL Locally with Docker Compose

If you need to set up a PostgreSQL instance locally for testing or development, you can use Docker Compose. Here’s an example `docker-compose.yml` file:

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:15
    container_name: local-postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: dev
    ports:
      - "5432:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    restart: always
```

Run the following command to start PostgreSQL locally:

```bash
docker-compose up -d
```

This configuration mounts the database files to a directory on your host machine (`./postgres-data`) and exposes the service on port 5432.

---

### Prisma’s Role in Simplifying the Process

Prisma simplifies database migrations in several ways:

- **Schema Management:** Prisma’s schema file ensures consistency across different databases.
- **Easy Setup:** Commands like `prisma db pull` and `prisma migrate dev` eliminate the need for manual adjustments.
- **Provider Flexibility:** Switching between CockroachDB and PostgreSQL is as simple as updating the `provider` in the `schema.prisma` file.

---

If you have to just migrate data from one database to another, dumping and importing data using CSV files is a straightforward approach. However, if you need to migrate more complex data structures or handle more complex relationships, Prisma can help simplify the process.

> Note: Parts of this note is Generated using LLMs, so it might not be 100% accurate.
