// новая заявка
const form = document.getElementById('create-form');


async function loadRooms() {
  const rooms = await getData('/api/rooms');
  rooms.forEach((room) => {
    form.room_id.add(new Option(room.name + ' (' + room.type + ')', room.id));
  });
}
loadRooms();


form.event_date.min = new Date().toISOString().slice(0, 10);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = {
    room_id: form.room_id.value,
    event_date: form.event_date.value,
    payment_method: form.payment_method.value
  };

  // Проверка в браузере
  const errors = {};
  if (data.room_id === '') errors.room_id = 'Выберите помещение';
  if (data.event_date === '') errors.event_date = 'Укажите дату начала';
  if (data.payment_method === '') errors.payment_method = 'Выберите способ оплаты';
  showErrors(form, errors);
  if (Object.keys(errors).length > 0) return;

  // Отправка на сервер
  const result = await sendData('/api/applications', data);
  if (result.ok) {
    location.href = '/cabinet';
  } else {
    showErrors(form, result.errors);
  }
});
