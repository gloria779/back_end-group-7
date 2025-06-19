const pool = require('../config/db');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    return rows[0];
  },
  async findByAccessNumber(access_number) {
    const [rows] = await pool.query('SELECT * FROM users WHERE access_number=?', [access_number]);
    return rows[0];
  },
  async create(user) {
    if (user.role === 'student') {
      const [result] = await pool.query(
        'INSERT INTO users (name, access_number, password, role) VALUES (?, ?, ?, ?)',
        [user.name, user.access_number, user.password, user.role]
      );
      return result.insertId;
    } else {
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [user.name, user.email, user.password, user.role]
      );
      return result.insertId;
    }
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [id]);
    return rows[0];
  }
};

module.exports = User;