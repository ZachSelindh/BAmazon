DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE store (
id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
product_name VARCHAR(50),
department VARCHAR(50),
price DECIMAL(5,2),
stock INTEGER
);

INSERT INTO store (product_name, department, price, stock)
VALUES ("Television", "Electronics", 300, 10),
 ("Playstation", "Consoles", 250, 20),
 ("XBox", "Consoles", 250, 5),
 ("Nintendo Switch", "Consoles", 250, 25),
 ("Super Mario", "Games", 60, 25),
 ("Pokemon Let's Go", "Games", 65, 20),
 ("Dark Souls 3", "Games", 35, 10),
 ("Devil May Cry 5", "Games", 100, 30),
 ("Civilization 5", "Games", 45, 20),
 ("Halo: Combat Evolved", "Games", 10, 30)
 ;

SELECT * FROM store;