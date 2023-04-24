\echo 'Delete and recreate mapApplicationDB db?'
\prompt 'Return for yes or control C to cancel' yes

DROP DATABASE IF EXISTS mapApplicationDB;
CREATE DATABASE mapApplicationDB;
\connect mapApplicationDB

DROP TABLE IF EXISTS tripitems CASCADE;
DROP TABLE IF EXISTS tripnames CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  username varchar(255) PRIMARY KEY NOT NULL,
  password varchar(255) NOT NULL,
  firstname varchar(255) NOT NULL,
  lastname varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  privilegelevel varchar(255) NOT NULL
);

CREATE TABLE tripnames (
  id varchar(255) PRIMARY KEY NOT NULL,
  tripname varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);

CREATE TABLE tripitems (
  itemid varchar(255) PRIMARY KEY NOT NULL,
  type varchar(60) NOT NULL,
  route varchar(60) NOT NULL,
  name varchar(1000) NOT NULL,
  description varchar(10000) NOT NULL,
  parkcode varchar(1000) NOT NULL,
  latitude varchar(60) NOT NULL,
  longitude varchar(60) NOT NULL,
  id varchar(255) NOT NULL,
  FOREIGN KEY (id) REFERENCES tripnames (id) ON DELETE CASCADE
);