
const form = document.getElementById('register-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = {
    login: form.login.value.trim(),
    password: form.password.value,
    fio: form.fio.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim()
  };



  const errors = {};
  if (!/^[a-zA-Z0-9]{6,}$/.test(data.login)) {
    errors.login = 'Логин: латинские буквы и цифры, не меньше 6 символов';
  }
  if (data.password.length < 8) {
    errors.password = 'Пароль: не меньше 8 символов';
  }
  if (!/^[а-яА-ЯёЁ ]+$/.test(data.fio)) {
    errors.fio = 'ФИО: только русские буквы и пробелы';
  }
  if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(data.phone)) {
    errors.phone = 'Телефон в формате 8(XXX)XXX-XX-XX';
  }
  if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Почта в формате name@mail.ru';
  }
  showErrors(form, errors);
  if (Object.keys(errors).length > 0) return;



  
  const result = await sendData('/api/register', data);
  if (result.ok) {
    location.href = '/login?registered';
  } else {
    showErrors(form, result.errors);
  }
});
