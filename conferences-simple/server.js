const path = require('path');
const crypto = require('crypto');             
const express = require('express');           
const session = require('express-session');   
const config = require('./config');
const Database = require('./classes/Database');
const Validator = require('./classes/Validator');

const app = express();
const db = new Database(config.db);



app.use(express.json());                                    
app.use(express.static(path.join(__dirname, 'public')));  
app.use(session({ secret: config.secret, resave: false, saveUninitialized: false }));





function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}


function text(value) {
  return String(value || '').trim();
}


function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}


function sendPage(res, name) {
  res.sendFile(path.join(__dirname, 'views', name + '.html'));
}



function onlyUsers(req, res, next) {
  if (req.session.user) {
    return next();
  }
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ ok: false, message: 'Войдите в систему' });
  }
  res.redirect('/login');
}


function onlyAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  if (req.path.startsWith('/api/')) {
    return res.status(403).json({ ok: false, message: 'Только для администратора' });
  }
  res.redirect('/login');
}



app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => sendPage(res, 'login'));
app.get('/register', (req, res) => sendPage(res, 'register'));
app.get('/cabinet', onlyUsers, (req, res) => sendPage(res, 'cabinet'));
app.get('/create', onlyUsers, (req, res) => sendPage(res, 'create'));
app.get('/admin', onlyAdmin, (req, res) => sendPage(res, 'admin'));

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});


// Регистрация и вход
app.post('/api/register', async (req, res) => {
  const data = {
    login: text(req.body.login),
    password: String(req.body.password || ''),
    fio: text(req.body.fio),
    phone: text(req.body.phone),
    email: text(req.body.email)
  };

  const errors = Validator.registration(data);
  if (!errors.login && await db.loginExists(data.login)) {
    errors.login = 'Такой логин уже занят';
  }
  if (hasErrors(errors)) {
    return res.json({ ok: false, errors });
  }

  data.passwordHash = hashPassword(data.password);
  await db.addUser(data);
  res.json({ ok: true });
});

app.post('/api/login', async (req, res) => {
  const login = text(req.body.login);
  const password = String(req.body.password || '');

  const user = await db.findUser(login, hashPassword(password));
  if (!user) {
    return res.json({ ok: false, message: 'Неверный логин или пароль' });
  }

  req.session.user = user;   
  res.json({ ok: true, redirect: user.role === 'admin' ? '/admin' : '/cabinet' });
});


// Заявки пользователя
app.get('/api/rooms', onlyUsers, async (req, res) => {
  res.json(await db.getRooms());
});


app.get('/api/my-applications', onlyUsers, async (req, res) => {
  res.json(await db.getUserApplications(req.session.user.id));
});

app.post('/api/applications', onlyUsers, async (req, res) => {
  const data = {
    room_id: text(req.body.room_id),
    event_date: text(req.body.event_date),
    payment_method: text(req.body.payment_method)
  };

  const errors = Validator.application(data);
  if (hasErrors(errors)) {
    return res.json({ ok: false, errors });
  }

  await db.addApplication(req.session.user.id, data);
  res.json({ ok: true });
});

app.post('/api/review', onlyUsers, async (req, res) => {
  const data = {
    id: text(req.body.id),
    review_text: text(req.body.review_text),
    review_rating: text(req.body.review_rating)
  };

  const errors = Validator.review(data);
  if (hasErrors(errors)) {
    return res.json({ ok: false, errors });
  }

  const saved = await db.addReview(data.id, req.session.user.id, data.review_text, data.review_rating);
  if (!saved) {
    return res.json({ ok: false, message: 'Отзыв можно оставить только после завершения мероприятия' });
  }
  res.json({ ok: true });
});


// Администратор
app.get('/api/admin/applications', onlyAdmin, async (req, res) => {
  res.json(await db.getAllApplications());
});

app.post('/api/admin/status', onlyAdmin, async (req, res) => {
  const status = text(req.body.status);
  if (status !== 'Мероприятие назначено' && status !== 'Завершено') {
    return res.json({ ok: false, message: 'Такого статуса нет' });
  }
  await db.setStatus(text(req.body.id), status);
  res.json({ ok: true });
});



app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({ ok: false, message: 'Ошибка сервера' });
});



app.listen(config.port, () => {
  console.log('Сайт работает: http://localhost:' + config.port);


  db.query('SELECT 1')
    .then(() => console.log('База данных подключена'))
    .catch((error) => console.log('Нет связи с базой: ' + error.message));
});
