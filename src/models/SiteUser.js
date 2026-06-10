const bcrypt = require('bcrypt');
const pool = require('../db');
const crypto = require('crypto');

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function createUser(fullName, email, phone, password) {
  const passwordHash = await hashPassword(password);
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
    [fullName, email, phone || '', passwordHash]
  );
  return result;
}

async function getUserByEmail(email) {
  const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return user;
}

async function getUserById(id) {
  const [[user]] = await pool.query('SELECT id, full_name, email, phone, language, is_active, created_at FROM users WHERE id = ?', [id]);
  return user;
}

async function updateProfile(id, fullName, phone) {
  const [result] = await pool.query(
    'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
    [fullName, phone || '', id]
  );
  return result;
}

async function verifyUser(email, password) {
  const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) return null;
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) return null;
  const { password_hash, ...safe } = user;
  return safe;
}

async function updateLanguage(id, language) {
  const [result] = await pool.query('UPDATE users SET language = ? WHERE id = ?', [language, id]);
  return result;
}

async function updatePassword(id, newPassword) {
  const passwordHash = await hashPassword(newPassword);
  const [result] = await pool.query(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, id]
  );
  return result;
}

async function requestPasswordReset(email) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const resetToken = generateResetToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await pool.query(
    'INSERT INTO user_password_resets (user_id, reset_token, expires_at) VALUES (?, ?, ?)',
    [user.id, resetToken, expiresAt]
  );

  return { token: resetToken, user };
}

async function verifyResetToken(token) {
  const [[reset]] = await pool.query(
    "SELECT * FROM user_password_resets WHERE reset_token = ? AND expires_at > datetime('now') AND is_used = false",
    [token]
  );
  if (!reset) return null;

  const user = await getUserById(reset.user_id);
  return { reset, user };
}

async function resetPasswordWithToken(token, newPassword) {
  const resetData = await verifyResetToken(token);
  if (!resetData) return null;

  const { reset, user } = resetData;
  
  // Update password
  await updatePassword(user.id, newPassword);
  
  // Mark token as used
  await pool.query(
    'UPDATE user_password_resets SET is_used = true WHERE id = ?',
    [reset.id]
  );

  return user;
}

// ====== Admin management methods for site users ======

async function getAllUsers(page = 1, limit = 20, search = '') {
  const offset = (page - 1) * limit;
  let query = 'SELECT id, full_name, email, phone, language, is_active, created_at, updated_at FROM users';
  let countQuery = 'SELECT COUNT(*) as total FROM users';
  const params = [];
  const countParams = [];

  if (search) {
    const whereClause = ' WHERE (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    const searchParam = `%${search}%`;
    query += whereClause;
    countQuery += whereClause;
    params.push(searchParam, searchParam, searchParam);
    countParams.push(searchParam, searchParam, searchParam);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [users] = await pool.query(query, params);
  const [[countResult]] = await pool.query(countQuery, countParams);

  return {
    users,
    total: countResult ? countResult.total : 0,
    page,
    totalPages: Math.ceil((countResult ? countResult.total : 0) / limit)
  };
}

async function getUserWithRegistrations(id) {
  const user = await getUserById(id);
  if (!user) return null;

  const [registrations] = await pool.query(
    `SELECT r.*, s.name as course_name, c.name as category_name
     FROM course_registrations r
     JOIN subcourses s ON r.subcourse_id = s.id
     JOIN categories c ON s.category_id = c.id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC`,
    [id]
  );

  return { ...user, registrations: registrations || [] };
}

async function toggleUserActive(id) {
  const [[user]] = await pool.query('SELECT is_active FROM users WHERE id = ?', [id]);
  if (!user) return null;
  const newStatus = user.is_active ? 0 : 1;
  await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, id]);
  return { id, is_active: !!newStatus };
}

async function getUserStats() {
  const [stats] = await pool.query(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
       SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive,
       COUNT(DISTINCT strftime('%Y-%m', created_at)) as months_active
     FROM users`
  );
  return stats[0] || { total: 0, active: 0, inactive: 0, months_active: 0 };
}

async function getMonthlyUserRegistrations(months = 6) {
  const [data] = await pool.query(
    `SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count 
     FROM users 
     WHERE created_at >= datetime('now', '-' || ? || ' months')
     GROUP BY month 
     ORDER BY month ASC`,
    [months]
  );
  return data || [];
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  verifyUser,
  updateProfile,
  updateLanguage,
  updatePassword,
  requestPasswordReset,
  verifyResetToken,
  resetPasswordWithToken,
  getAllUsers,
  getUserWithRegistrations,
  toggleUserActive,
  getUserStats,
  getMonthlyUserRegistrations,
};
