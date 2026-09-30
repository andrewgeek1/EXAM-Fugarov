
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS conferences CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE conferences;

DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;



CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  login         VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(64)  NOT NULL,      -- хеш пароля
  fio           VARCHAR(150) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  email         VARCHAR(100) NOT NULL,
  role          ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE rooms (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('аудитория', 'коворкинг', 'кинозал') NOT NULL
);



CREATE TABLE applications (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT  NOT NULL,
  room_id        INT  NOT NULL,
  event_date     DATE NOT NULL,
  payment_method ENUM('очно', 'СБП') NOT NULL,
  status         ENUM('Новая', 'Мероприятие назначено', 'Завершено') NOT NULL DEFAULT 'Новая',
  review_text    TEXT NULL,                      
  review_rating  TINYINT NULL,               
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (room_id) REFERENCES rooms (id)
);



INSERT INTO rooms (name, type) VALUES
  ('Большая аудитория «Форум»', 'аудитория'),
  ('Аудитория «Лекторий»', 'аудитория'),
  ('Коворкинг «Точка сборки»', 'коворкинг'),
  ('Коворкинг «Открытое пространство»', 'коворкинг'),
  ('Кинозал «Премьер»', 'кинозал'),
  ('Малый кинозал «Арт»', 'кинозал');


INSERT INTO users (login, password_hash, fio, phone, email, role) VALUES
  ('Conf2027', SHA2('Demo77', 256), 'Администратор', '8(800)000-00-00', 'admin@conf.ru', 'admin');
