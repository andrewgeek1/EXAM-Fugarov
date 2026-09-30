//  файл с подключением к MySQL и все запросы

const mysql = require('mysql2/promise');

class Database {
  constructor(settings) {
    this.pool = mysql.createPool(settings);
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }





// логины
  async loginExists(login) {
    const rows = await this.query('SELECT id FROM users WHERE login = ?', [login]);
    return rows.length > 0;
  }

  async findUser(login, passwordHash) {
    const rows = await this.query(
      'SELECT id, login, fio, role FROM users WHERE login = ? AND password_hash = ?',
      [login, passwordHash]
    );
    return rows[0];
  }

  // Добавить нового пользователя
  async addUser(user) {
    await this.query(
      'INSERT INTO users (login, password_hash, fio, phone, email) VALUES (?, ?, ?, ?, ?)',
      [user.login, user.passwordHash, user.fio, user.phone, user.email]
    );
  }





  async getRooms() {
    return this.query('SELECT id, name, type FROM rooms ORDER BY type, name');
  }



  async addApplication(userId, data) {
    await this.query(
      'INSERT INTO applications (user_id, room_id, event_date, payment_method) VALUES (?, ?, ?, ?)',
      [userId, data.room_id, data.event_date, data.payment_method]
    );
  }


  async getUserApplications(userId) {
    return this.query(
      `SELECT applications.*, rooms.name AS room_name, rooms.type AS room_type
       FROM applications
       JOIN rooms ON rooms.id = applications.room_id
       WHERE applications.user_id = ?
       ORDER BY applications.id DESC`,
      [userId]
    );
  }


  async getAllApplications() {
    return this.query(
      `SELECT applications.*, rooms.name AS room_name, rooms.type AS room_type,
              users.fio, users.login, users.phone, users.email
       FROM applications
       JOIN rooms ON rooms.id = applications.room_id
       JOIN users ON users.id = applications.user_id
       ORDER BY applications.id DESC`
    );
  }


  async setStatus(id, status) {
    await this.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
  }


  async addReview(id, userId, text, rating) {
    const result = await this.query(
      `UPDATE applications SET review_text = ?, review_rating = ?
       WHERE id = ? AND user_id = ? AND status = 'Завершено' AND review_text IS NULL`,
      [text, rating, id, userId]
    );
    return result.affectedRows === 1;
  }
}

module.exports = Database;
