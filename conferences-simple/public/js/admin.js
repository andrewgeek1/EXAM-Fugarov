//  Панель администратора
const list = document.getElementById('applications');
const statusFilter = document.getElementById('status-filter');
const searchInput = document.getElementById('search');
let applications = [];


async function loadApplications() {
  applications = await getData('/api/admin/applications');
  showApplications();
}


function showApplications() {
  const status = statusFilter.value;
  const search = searchInput.value.trim().toLowerCase();

  const filtered = applications.filter((app) => {
    const statusOk = status === '' || app.status === status;
    const userOk = app.fio.toLowerCase().includes(search) || app.login.toLowerCase().includes(search);
    return statusOk && userOk;
  });

  document.getElementById('count').textContent = 'Найдено заявок: ' + filtered.length;

  list.innerHTML = '';
  filtered.forEach((app) => {
    list.innerHTML += cardHtml(app);
  });
}

// Одна карточка заявки
function cardHtml(app) {
  return `
    <div class="col-md-6 col-lg-4">
      <article class="card-app">
        <img src="${ROOM_IMAGES[app.room_type]}" alt="" width="400" height="250">
        <div class="card-app-body">
          <p class="number">Заявка ${app.id}</p>
          <h2>${safe(app.room_name)}</h2>
          <p>Дата начала: ${formatDate(app.event_date)}</p>
          <p>Оплата: ${app.payment_method}</p>
          <p class="person">${safe(app.fio)}<br>${safe(app.login)}, ${safe(app.phone)}<br>${safe(app.email)}</p>
          <span class="status ${STATUS_CLASSES[app.status]}">${app.status}</span>
          ${reviewHtml(app)}
          ${buttonsHtml(app)}
        </div>
      </article>
    </div>`;
}


function reviewHtml(app) {
  if (!app.review_text) {
    return '';
  }
  return `<p class="review">Отзыв, оценка ${app.review_rating} из 5:<br>${safe(app.review_text)}</p>`;
}


function buttonsHtml(app) {
  if (app.status === 'Завершено') {
    return '';
  }
  let buttons = '';
  if (app.status === 'Новая') {
    buttons += `<button class="btn-main" data-id="${app.id}" data-status="Мероприятие назначено">Мероприятие назначено</button>`;
  }
  buttons += `<button class="btn-line" data-id="${app.id}" data-status="Завершено">Завершено</button>`;
  return '<div class="actions">' + buttons + '</div>';
}


list.addEventListener('click', async (event) => {
  const button = event.target;
  if (button.tagName !== 'BUTTON') return;

  await sendData('/api/admin/status', { id: button.dataset.id, status: button.dataset.status });
  loadApplications();
});


statusFilter.addEventListener('change', showApplications);
searchInput.addEventListener('input', showApplications);

loadApplications();
