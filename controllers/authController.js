const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.register = async (req, res) => {
  const { name, access_number, email, password, role } = req.body;
  // Student registration: access_number required, email not used
  if (role === 'student') {
    if (!name || !access_number || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findByAccessNumber(access_number);
    if (existing) return res.status(409).json({ message: 'Access number exists' });
    const hashedPwd = await bcrypt.hash(password, 10);
    const userId = await User.create({ name, access_number, password: hashedPwd, role });
    return res.status(201).json({ userId });
  } else {
    // Landlord/admin registration: email required
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email exists' });
    const hashedPwd = await bcrypt.hash(password, 10);
    const userId = await User.create({ name, email, password: hashedPwd, role });
    return res.status(201).json({ userId });
  }
};

exports.login = async (req, res) => {
  const { access_number, email, password } = req.body;
  let user;
  // Student login via access_number
  if (access_number) {
    user = await User.findByAccessNumber(access_number);
  } else if (email) {
    user = await User.findByEmail(email);
  }
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
};