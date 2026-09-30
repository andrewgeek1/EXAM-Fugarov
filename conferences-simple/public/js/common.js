
const ROOM_IMAGES = {
  'аудитория': '/img/auditorium.png',
  'коворкинг': '/img/coworking.jpg',
  'кинозал': '/img/cinema.jpg'
};


const STATUS_CLASSES = {
  'Новая': 'status-new',
  'Мероприятие назначено': 'status-assigned',
  'Завершено': 'status-done'
};


async function sendData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}


async function getData(url) {
  const response = await fetch(url);
  if (response.status === 401 || response.status === 403) {
    location.href = '/login';
  }
  return response.json();
}


function showErrors(form, errors) {

  form.querySelectorAll('.is-invalid').forEach((field) => field.classList.remove('is-invalid'));
  form.querySelectorAll('.error').forEach((box) => (box.textContent = ''));


  for (const name in errors) {
    form.elements[name].classList.add('is-invalid');
    form.querySelector('.error-' + name).textContent = errors[name];
  }
}


function safe(value) {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}


function formatDate(value) {
  return value.slice(0, 10).split('-').reverse().join('.');
}
