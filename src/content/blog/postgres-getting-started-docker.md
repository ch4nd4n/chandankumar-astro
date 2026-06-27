---
title: "Postgres Installation Guide and Uncommon SQL Reference for Developers"
date: 2023-05-06
tags:
  - rdbms
  - postgres
---
# Postgres Installation Guide and Uncommon SQL Reference for Developers

> PostgreSQL Installation and Connection Using Docker and Docker Compose

PostgreSQL is a powerful and widely-used open-source relational database management system (RDBMS). It is known for its reliability, robustness, and ability to handle large data sets and high levels of concurrency. This note to self, how to install and connect to PostgreSQL using Docker and Docker Compose. Just in case I forget it again.

## Installation

Refer to the `docker-composer.yml`

```YML:title=docker-compose.yml
version: '3'
services:
  db:
    image: postgres:11.6
    container_name: "postgres"
    network_mode: bridge
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    ports:
      - "5432:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
```

I am using the official PostgreSQL image version `11.6` and setting the container name to "postgres", also setting the environment variables for the default user and password to "postgres". The ports are being exposed and mapped to the host machine and we are also creating a volume for the data to be stored.

To start the container, run the following command:

```bash
docker-compose up -d
```

or 

```bash
docker compose up -d 
```

This will start the container in detached mode, allowing it to run in the background.

### Connecting

It's often necessary to connect to the database and run SQL commands. We'll explain how to use the docker exec command to do just that.

#### 1. Using docker exec bash

```bash
docker exec -it postgres bash
```

This command will open a terminal session inside the container. The resulting prompt will look something like this:

```bash
root@1ab18a08c193:/#
```

To connect to the PostgreSQL database, we will use the psql command:

```bash
psql -U postgres

```

With these steps, you should now be able to successfully install and connect to a PostgreSQL database using Docker and Docker Compose.

#### Using Docker exec psql

```bash
docker exec -it postgres psql -U postgres
```

## Infrequently used SQLs in psql

```SQL
SELECT tablename, indexname, indexdef
  FROM pg_indexes WHERE schemaname = 'public'
  ORDER BY tablename, indexname;
```

Preceding query will show all the indexes in the database. Works on cockroachdb as well. Actually I ran this on cockroachdb.

## End to end Demo of using Postgres within Docker

1. Connect postgres using `docker exec`
2. Create Database `demo_1`
3. Create table `employees` with attributes "employee_id", "first_name", "last_name", and "job_title"
4. Insert few records in above employees table
5. drop table employees
6. drop database demo_1

> Note that these commands should be executed within the psql command-line interface after connecting to the container using docker exec.
> Make sure to take a backup of the data before dropping any table or database.

Steps

Connect to Postgres using docker exec:

```bash
docker exec -it postgres psql -U postgres
```

Create the demo_1 database:

```bash
CREATE DATABASE demo_1;
```

Connect to the demo_1 database and create the employees table:

```bash
\c demo_1

-- Create Table
CREATE TABLE employees (
employee_id SERIAL PRIMARY KEY,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
job_title VARCHAR(255) NOT NULL
);

```

Insert few records into the employees table:

```bash
INSERT INTO employees (first_name, last_name, job_title)
VALUES ('John', 'Doe', 'Manager'),
('Jane', 'Smith', 'Developer'),
('Bob', 'Johnson', 'Admin');
```

Here are a few more examples of SQL queries that can be used to retrieve data from the employees table:

    Select the distinct job titles from the employees table:

```sql
SELECT DISTINCT job_title FROM employees;

Select the first and last names of the employees who have 'John' as first name

SELECT first_name, last_name FROM employees WHERE first_name='John';

Select the first and last names of the employees and order the results by last name in descending order:

SELECT first_name, last_name FROM employees ORDER BY last_name DESC;

Select the first and last names of the employees and limit the results to 3:

SELECT first_name, last_name FROM employees LIMIT 3;

Select the first and last names of the employees, and the name of the department they belong to, using a join on the department_id:

SELECT employees.first_name, employees.last_name, departments.name
FROM employees
JOIN departments ON employees.department_id = departments.id;

    Select the number of employees for each job title, group the results by job title:

SELECT job_title, COUNT(\*) as employee_count FROM employees GROUP BY job_title;

    Select the first and last names of the employees who have been hired after a specific date:

SELECT first_name, last_name FROM employees WHERE hire_date > '2022-01-01';
```

These are just a few examples of the types of queries that can be run on the employees table, but you can use many other SQL clauses and functions to retrieve the data you need.

Drop the table

```bash
DROP TABLE employees;
```

    To drop the demo_1 database:

```bash
DROP DATABASE demo_1;
```

## Postgres Cheatsheet

Here are some common commands and tasks that you may need to perform when working with PostgreSQL.
Connect to the Database

```bash
psql -U [username] -d [database]
```

This command connects to the PostgreSQL database using the specified username and database. If no database is specified, it will connect to the default "postgres" database.

Show a list of all tables

```bash
\dt
```

Preceding command will show a list of all tables in the current database.

Describe a table

\d [table_name]

This command will provide information about the specified table, including its columns and their data types.
Show all data in a table

```bash
SELECT \* FROM [table_name];
```

This command will show all of the data in the specified table.
Create a new table

```bash
CREATE TABLE [table_name] (
[column_name_1] [data_type_1],
[column_name_2] [data_type_2],
...
);
```

This command creates a new table with the specified name and columns. The columns are defined with their names and data types.

Insert data into a table

```bash
INSERT INTO [table_name] ([column_name_1], [column_name_2], ...)
VALUES ([value_1], [value_2], ...);
```

This command inserts data into the specified table. The columns that the data will be inserted into must be specified, along with the corresponding values.
Update data in a table

```bash
UPDATE [table_name]
SET [column_name] = [new_value]
WHERE [condition];
```

This command updates data in the specified table. The column to be updated and the new value must be specified, along with a condition to determine which rows should be updated.
Delete data from a table

```bash
DELETE FROM [table_name] WHERE [condition];
```

This command deletes data from the specified table. A condition must be specified to determine which rows should be deleted.
Create a new user

```bash
CREATE USER [username] WITH PASSWORD '[password]';
```

This command creates a new user with the specified username and password.
Grant permissions to a user

```bash
GRANT [permission] ON [table_name] TO [username];
```

This command grants the specified permission on the specified table to the specified user. Permissions can include SELECT, INSERT, UPDATE, DELETE, and others.
Revoke permissions from a user

```bash
REVOKE [permission] ON [table_name] FROM [username];
```

This command revokes the specified permission on the specified table from the specified user.
