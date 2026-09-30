
const form = document.getElementById('login-form');
const message = document.getElementById('message');


if (location.search === '?registered') {
  message.textContent = 'Вы зарегистрированы. Теперь войдите';
  message.className = 'message message-ok';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();   

  const data = {
    login: form.login.value.trim(),
    password: form.password.value
  };

  // Проверка в браузере
  const errors = {};
  if (data.login === '') errors.login = 'Введите логин';
  if (data.password === '') errors.password = 'Введите пароль';
  showErrors(form, errors);
  if (Object.keys(errors).length > 0) return;

  // Отправка на сервер
  const result = await sendData('/api/login', data);
  if (result.ok) {
    location.href = result.redirect; 
  } else {
    message.textContent = result.message;
    message.className = 'message message-error';
  }
});
