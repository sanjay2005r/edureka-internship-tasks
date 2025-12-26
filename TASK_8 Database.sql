CREATE DATABASE internship_db;
USE internship_db;
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  email VARCHAR(100)
);
INSERT INTO users(name, email)
VALUES ("Abishek", "abishek@gmail.com"), ("Balu","balu@gmail.com");
SELECT * FROM users;