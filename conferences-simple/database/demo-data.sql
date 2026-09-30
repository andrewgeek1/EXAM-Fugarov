
USE conferences;

INSERT INTO users (login, password_hash, fio, phone, email) VALUES
  ('ivanova2026', SHA2('qwerty123', 256), 'Иванова Анна Сергеевна', '8(912)345-67-89', 'ivanova@mail.ru'),
  ('petrov2026',  SHA2('qwerty123', 256), 'Петров Игорь Николаевич', '8(903)111-22-33', 'petrov@yandex.ru');

INSERT INTO applications (user_id, room_id, event_date, payment_method, status, review_text, review_rating) VALUES
  (2, 1, '2026-09-10', 'СБП',  'Завершено', 'Хороший звук и удобные места.', 5),
  (2, 3, '2026-09-18', 'очно', 'Завершено', NULL, NULL),
  (2, 5, '2026-10-20', 'СБП',  'Мероприятие назначено', NULL, NULL),
  (3, 4, '2026-10-05', 'очно', 'Новая', NULL, NULL);
