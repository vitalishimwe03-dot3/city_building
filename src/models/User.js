const bcrypt = require('bcrypt');
const pool = require('../db');
const crypto = require('crypto');

// Hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Compare passwords
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generate password reset token
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Create new user
async function createUser(username, email, password, fullName, role = 'admin') {
  const passwordHash = await hashPassword(password);
  const [result] = await pool.query(
    'INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)',
    [username, email, passwordHash, fullName, role]
  );
  return result;
}

// Get user by ID
async function getUserById(id) {
  const [[user]] = await pool.query('SELECT * FROM admin_users WHERE id = ?', [id]);
  return user;
}

// Get user by username
async function getUserByUsername(username) {
  const [[user]] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);
  return user;
}

// Get user by email
async function getUserByEmail(email) {
  const [[user]] = await pool.query('SELECT * FROM admin_users WHERE email = ?', [email]);
  return user;
}

// Get all users
async function getAllUsers() {
  const [users] = await pool.query('SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM admin_users');
  return users;
}

// Protect super admin account (CityB) from modification
async function isSuperAdminAccount(id) {
  const user = await getUserById(id);
  return user && (user.username === 'CityB' || user.email === 'mugishapatrick3000@gmail.com');
}

// Update user (with super admin protection)
async function updateUser(id, updates) {
  const isSuperAdmin = await isSuperAdminAccount(id);
  if (isSuperAdmin) {
    delete updates.is_active;
    delete updates.role;
  }

  const allowedFields = ['full_name', 'email', 'role', 'is_active'];
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `UPDATE admin_users SET ${fields.join(', ')} WHERE id = ?`;
  await pool.query(query, values);
  return await getUserById(id);
}

// Update password
async function updatePassword(id, newPassword) {
  const passwordHash = await hashPassword(newPassword);
  const [result] = await pool.query(
    'UPDATE admin_users SET password_hash = ? WHERE id = ?',
    [passwordHash, id]
  );
  return result;
}

// Delete user (with super admin protection)
async function deleteUser(id) {
  const isSuperAdmin = await isSuperAdminAccount(id);
  if (isSuperAdmin) {
    throw new Error('The super admin account (CityB) cannot be deleted.');
  }
  await pool.query('DELETE FROM admin_users WHERE id = ?', [id]);
}

// Verify user login
async function verifyUser(identifier, password) {
  let user = await getUserByUsername(identifier);
  if (!user) {
    user = await getUserByEmail(identifier);
  }
  if (!user) return null;
  
  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) return null;
  
  await pool.query("UPDATE admin_users SET last_login = datetime('now') WHERE id = ?", [user.id]);
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Request password reset
async function requestPasswordReset(email) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const resetToken = generateResetToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await pool.query(
    'INSERT INTO admin_password_resets (admin_user_id, reset_token, expires_at) VALUES (?, ?, ?)',
    [user.id, resetToken, expiresAt]
  );

  return { token: resetToken, user };
}

// Verify reset token
async function verifyResetToken(token) {
  const [[reset]] = await pool.query(
    "SELECT * FROM admin_password_resets WHERE reset_token = ? AND expires_at > datetime('now') AND is_used = false",
    [token]
  );
  if (!reset) return null;

  const user = await getUserById(reset.admin_user_id);
  return { reset, user };
}

// Reset password with token
async function resetPasswordWithToken(token, newPassword) {
  const resetData = await verifyResetToken(token);
  if (!resetData) return null;

  const { reset, user } = resetData;
  
  // Update password
  await updatePassword(user.id, newPassword);
  
  // Mark token as used
  await pool.query(
    'UPDATE admin_password_resets SET is_used = true WHERE id = ?',
    [reset.id]
  );

  return user;
}

module.exports = {
  hashPassword,
  comparePassword,
  generateResetToken,
  createUser,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  getAllUsers,
  updateUser,
  updatePassword,
  deleteUser,
  verifyUser,
  requestPasswordReset,
  verifyResetToken,
  resetPasswordWithToken,
  isSuperAdminAccount,
};
