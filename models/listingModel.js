const pool = require('../config/db');

const Listing = {
  async getAll(filters = {}) {
    let query = 'SELECT * FROM listings WHERE approved = 1';
    const params = [];
    if (filters.hostel) {
      query += ' AND hostel = ?';
      params.push(filters.hostel);
    }
    const [rows] = await pool.query(query, params);
    return rows;
  },
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM listings WHERE id=?', [id]);
    return rows[0];
  },
  async create(listing) {
    const [result] = await pool.query(
      `INSERT INTO listings (title, type, price, location, features, images, description, latitude, longitude, landlord_id, approved, hostel)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        listing.title, listing.type, listing.price, listing.location,
        JSON.stringify(listing.features), JSON.stringify(listing.images),
        listing.description, listing.latitude, listing.longitude,
        listing.landlord_id, 0, listing.hostel
      ]
    );
    return result.insertId;
  },
  async update(id, updates) {
    const [result] = await pool.query(
      `UPDATE listings SET title=?, type=?, price=?, location=?, features=?, images=?, description=?, latitude=?, longitude=?, hostel=? WHERE id=?`,
      [
        updates.title, updates.type, updates.price, updates.location,
        JSON.stringify(updates.features), JSON.stringify(updates.images),
        updates.description, updates.latitude, updates.longitude, updates.hostel, id
      ]
    );
    return result;
  },
  async delete(id) {
    await pool.query('DELETE FROM listings WHERE id=?', [id]);
  },
  async approve(id) {
    await pool.query('UPDATE listings SET approved=1 WHERE id=?', [id]);
  }
};

module.exports = Listing;