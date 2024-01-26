CREATE DATABASE jsMysql CHARACTER SET utf8 COLLATE utf8_general_ci;
USE jsMysql;

CREATE TABLE workers(
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  city varchar(50),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO authors (id, name, city) VALUES
(1, 'Pam Shel', 'New York'),
(2, 'Maurene Oswald', 'Dubai'),
(3, 'Cori Vergil', 'Berlin'),
(4, 'Misty Thomas', 'Moscow');