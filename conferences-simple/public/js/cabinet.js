const list = document.getElementById('applications');

// Загрузить заявки и нарисовать карточки
async function loadApplications() {
  const applications = await getData('/api/my-applications');

  if (applications.length === 0) {
    list.innerHTML = '<p class="empty">Заявок пока нет. Нажмите «Новая заявка».</p>';
    return;
  }

  list.innerHTML = '';
  applications.forEach((app) => {
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
          <h2>${safe(app.room_name)}</h2>
          <p>Дата начала: ${formatDate(app.event_date)}</p>
          <p>Оплата: ${app.payment_method}</p>
          <span class="status ${STATUS_CLASSES[app.status]}">${app.status}</span>
          ${reviewHtml(app)}
        </div>
      </article>
    </div>`;
}


function reviewHtml(app) {
  if (app.review_text) {
    return `<p class="review">Ваш отзыв, оценка ${app.review_rating} из 5:<br>${safe(app.review_text)}</p>`;
  }
  if (app.status !== 'Завершено') {
    return '<p class="hint">Отзыв можно оставить после завершения мероприятия</p>';
  }
  return `
    <form class="review-form" data-id="${app.id}" novalidate>
      <select class="form-select" name="review_rating">
        <option value="">Оценка</option>
        <option value="5">5 из 5</option>
        <option value="4">4 из 5</option>
        <option value="3">3 из 5</option>
        <option value="2">2 из 5</option>
        <option value="1">1 из 5</option>
      </select>
      <div class="error error-review_rating"></div>
      <textarea class="form-control" name="review_text" rows="3" placeholder="Как прошло мероприятие?"></textarea>
      <div class="error error-review_text"></div>
      <button class="btn-main" type="submit">Оставить отзыв</button>
    </form>`;
}


list.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;

  const data = {
    id: form.dataset.id,
    review_rating: form.review_rating.value,
    review_text: form.review_text.value.trim()
  };

  const errors = {};
  if (data.review_rating === '') errors.review_rating = 'Поставьте оценку';
  if (data.review_text === '') errors.review_text = 'Напишите пару слов о мероприятии';
  showErrors(form, errors);
  if (Object.keys(errors).length > 0) return;

  const result = await sendData('/api/review', data);
  if (result.ok) {
    loadApplications();
  } else {
    showErrors(form, result.errors || {});
  }
});

loadApplications();
