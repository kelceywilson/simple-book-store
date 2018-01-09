DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name varchar(50) NOT NULL,
  email varchar(50) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  role varchar(6) NOT NULL
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title varchar(100) CHECK (title != ''),
  author_last varchar(50),
  author_first varchar(50),
  genre varchar(50),
  publisher varchar(50),
  price money DEFAULT 0.00,
  image varchar(255),
  isbn varchar(20)
);
