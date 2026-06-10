const pool = require('../db');

// Get all enquiries
async function getAllEnquiries() {
  const [enquiries] = await pool.query(
    'SELECT id, name, email, phone, message, status, created_at FROM enquiries ORDER BY created_at DESC'
  );
  return enquiries;
}

// Get enquiry by ID
async function getEnquiryById(id) {
  const [[enquiry]] = await pool.query('SELECT * FROM enquiries WHERE id = ?', [id]);
  return enquiry;
}

// Update enquiry status
async function updateEnquiryStatus(id, status) {
  await pool.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
  return await getEnquiryById(id);
}

// Delete enquiry
async function deleteEnquiry(id) {
  await pool.query('DELETE FROM enquiries WHERE id = ?', [id]);
}

// Get all categories
async function getAllCategories() {
  const [categories] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  return categories;
}

// Create category
async function createCategory(name, description, slug) {
  const [result] = await pool.query(
    'INSERT INTO categories (name, description, slug) VALUES (?, ?, ?)',
    [name, description, slug]
  );
  return result;
}

// Update category
async function updateCategory(id, name, description, slug) {
  await pool.query(
    'UPDATE categories SET name = ?, description = ?, slug = ? WHERE id = ?',
    [name, description, slug, id]
  );
  const [[category]] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return category;
}

// Delete category
async function deleteCategory(id) {
  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
}

// Get all subcourses
async function getAllSubcourses() {
  const [subcourses] = await pool.query(
    'SELECT s.*, c.name as category_name FROM subcourses s JOIN categories c ON s.category_id = c.id ORDER BY c.name, s.name ASC'
  );
  return subcourses;
}

// Create subcourse
async function createSubcourse(categoryId, name, slug, description, image) {
  const [result] = await pool.query(
    'INSERT INTO subcourses (category_id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)',
    [categoryId, name, slug, description, image]
  );
  return result;
}

// Update subcourse
async function updateSubcourse(id, categoryId, name, slug, description, image) {
  await pool.query(
    'UPDATE subcourses SET category_id = ?, name = ?, slug = ?, description = ?, image = ? WHERE id = ?',
    [categoryId, name, slug, description, image, id]
  );
  const [[subcourse]] = await pool.query('SELECT * FROM subcourses WHERE id = ?', [id]);
  return subcourse;
}

// Delete subcourse
async function deleteSubcourse(id) {
  await pool.query('DELETE FROM subcourses WHERE id = ?', [id]);
}

// ====== ACTIVITY LOGS ======

async function logActivity(adminId, adminName, action, entityType, entityId, details, ipAddress) {
  await pool.query(
    `INSERT INTO activity_logs (admin_id, admin_name, action, entity_type, entity_id, details, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [adminId, adminName, action, entityType || null, entityId || null, details || null, ipAddress || null]
  );
}

async function getActivityLogs(limit = 50, offset = 0) {
  const [logs] = await pool.query(
    'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return logs;
}

async function getRecentActivityLogs(days = 7) {
  const [logs] = await pool.query(
    "SELECT * FROM activity_logs WHERE created_at >= datetime('now', '-' || ? || ' days') ORDER BY created_at DESC LIMIT 20",
    [days]
  );
  return logs;
}

async function getActivityStats() {
  const [stats] = await pool.query(
    `SELECT 
       action,
       COUNT(*) as count,
       COUNT(DISTINCT admin_id) as unique_admins
     FROM activity_logs 
     WHERE created_at >= datetime('now', '-30 days')
     GROUP BY action 
     ORDER BY count DESC`
  );
  return stats;
}

module.exports = {
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllSubcourses,
  createSubcourse,
  updateSubcourse,
  deleteSubcourse,
  logActivity,
  getActivityLogs,
  getRecentActivityLogs,
  getActivityStats,
};
