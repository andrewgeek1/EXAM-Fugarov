class Validator {
  // Регистрация
  static registration(data) {
    const errors = {};
    if (!/^[a-zA-Z0-9]{6,}$/.test(data.login)) {
      errors.login = 'Логин: латинские буквы и цифры, не меньше 6 символов';
    }
    if (data.password.length < 5) {
      errors.password = 'Пароль: не меньше 5 символов';
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
    return errors;
  }

  // Новая заявка
  static application(data) {
    const errors = {};
    if (!/^\d+$/.test(data.room_id)) {
      errors.room_id = 'Выберите помещение';
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.event_date)) {
      errors.event_date = 'Укажите дату начала';
    } else if (data.event_date < Validator.today()) {
      errors.event_date = 'Дата уже прошла';
    }
    if (data.payment_method !== 'очно' && data.payment_method !== 'СБП') {
      errors.payment_method = 'Выберите способ оплаты';
    }
    return errors;
  }

  // Отзыв
  static review(data) {
    const errors = {};
    const rating = Number(data.review_rating);
    if (!(rating >= 1 && rating <= 5)) {
      errors.review_rating = 'Поставьте оценку от 1 до 5';
    }
    if (data.review_text === '') {
      errors.review_text = 'Напишите пару слов о мероприятии';
    }
    return errors;
  }


  
  static today() {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + month + '-' + day;
  }
}

module.exports = Validator;
