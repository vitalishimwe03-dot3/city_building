const express = require('express');
const router = express.Router();
const pool = require('../db');
const { isAdminAuthenticated } = require('../middleware/auth');

router.get('/categories', async (req, res, next) => {
  try {
    const [cats] = await pool.query('SELECT id,name,slug,description FROM categories');
    res.json(cats);
  } catch (err) {
    next(err);
  }
});

router.get('/category/:slug/subcourses', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const [[category]] = await pool.query('SELECT id FROM categories WHERE slug=?', [slug]);
    if (!category) return res.json([]);
    const [subs] = await pool.query('SELECT * FROM subcourses WHERE category_id=?', [category.id]);
    res.json(subs);
  } catch (err) {
    next(err);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json([]);
    const term = `%${q.trim()}%`;
    const [courses] = await pool.query(
      `SELECT s.*, c.name as category_name, c.slug as category_slug
       FROM subcourses s JOIN categories c ON s.category_id = c.id
       WHERE s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?
       LIMIT 20`,
      [term, term, term]
    );
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

router.get('/dashboard/chart-data', isAdminAuthenticated, async (req, res, next) => {
  try {
    const [monthlyEnquiries] = await pool.query(
      "SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count FROM enquiries GROUP BY month ORDER BY month ASC LIMIT 12"
    );
    const [monthlyRegistrations] = await pool.query(
      "SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count FROM course_registrations GROUP BY month ORDER BY month ASC LIMIT 12"
    );
    res.json({ enquiries: monthlyEnquiries || [], registrations: monthlyRegistrations || [] });
  } catch (err) {
    next(err);
  }
});

router.post('/course/:id/register', async (req, res, next) => {
  try {
    if (!req.session.siteUser) {
      return res.status(401).json({ error: 'Please log in to register for a course.' });
    }
    const courseId = req.params.id;
    const userId = req.session.siteUser.id;
    const [[existing]] = await pool.query(
      'SELECT id FROM course_registrations WHERE user_id = ? AND subcourse_id = ?',
      [userId, courseId]
    );
    if (existing) {
      return res.status(409).json({ error: 'You are already registered for this course.' });
    }
    await pool.query(
      'INSERT INTO course_registrations (user_id, subcourse_id, status) VALUES (?, ?, ?)',
      [userId, courseId, 'pending']
    );
    const [[course]] = await pool.query('SELECT name FROM subcourses WHERE id = ?', [courseId]);
    res.json({ success: true, message: `Successfully registered for ${course?.name || 'course'}!` });
  } catch (err) {
    next(err);
  }
});

router.get('/my-registrations', async (req, res, next) => {
  try {
    if (!req.session.siteUser) return res.json([]);
    const [registrations] = await pool.query(
      `SELECT r.*, s.name as course_name, s.slug as course_slug, c.name as category_name
       FROM course_registrations r
       JOIN subcourses s ON r.subcourse_id = s.id
       JOIN categories c ON s.category_id = c.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.session.siteUser.id]
    );
    res.json(registrations || []);
  } catch (err) {
    next(err);
  }
});

router.get('/chat/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json({ courses: [], category: null });
    const term = `%${q.trim()}%`;
    const [courses] = await pool.query(
      `SELECT s.id, s.name, s.description, c.name as category_name
       FROM subcourses s JOIN categories c ON s.category_id = c.id
       WHERE s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?
       LIMIT 10`,
      [term, term, term]
    );
    let category = null;
    const catTerm = `%${q.trim()}%`;
    const [[cat]] = await pool.query(
      'SELECT name, description FROM categories WHERE name LIKE ? OR description LIKE ? LIMIT 1',
      [catTerm, catTerm]
    );
    category = cat;
    res.json({ courses: courses || [], category });
  } catch (err) {
    next(err);
  }
});

// ====== COURSE PROGRESS TRACKING ======

router.get('/my-progress', async (req, res, next) => {
  try {
    if (!req.session.siteUser) return res.json([]);
    const [progress] = await pool.query(
      `SELECT r.id as registration_id, r.subcourse_id, r.status as reg_status,
              s.name as course_name, s.slug as course_slug, c.name as category_name,
              (SELECT COUNT(*) FROM course_modules WHERE subcourse_id = r.subcourse_id) as total_modules,
              (SELECT COUNT(*) FROM course_progress cp JOIN course_modules cm ON cp.module_id = cm.id WHERE cm.subcourse_id = r.subcourse_id AND cp.user_id = r.user_id AND cp.completed = 1) as completed_modules
       FROM course_registrations r
       JOIN subcourses s ON r.subcourse_id = s.id
       JOIN categories c ON s.category_id = c.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.session.siteUser.id]
    );
    res.json(progress || []);
  } catch (err) {
    next(err);
  }
});

router.get('/course/:id/modules', async (req, res, next) => {
  try {
    const [modules] = await pool.query(
      'SELECT cm.*, COALESCE(cp.completed, 0) as completed, cp.completed_at FROM course_modules cm LEFT JOIN course_progress cp ON cp.module_id = cm.id AND cp.user_id = ? WHERE cm.subcourse_id = ? ORDER BY cm.order_index ASC',
      [req.session.siteUser?.id || 0, req.params.id]
    );
    res.json(modules || []);
  } catch (err) {
    next(err);
  }
});

router.post('/course/:id/module/:moduleId/complete', async (req, res, next) => {
  try {
    if (!req.session.siteUser) return res.status(401).json({ error: 'Please log in.' });
    const userId = req.session.siteUser.id;
    const moduleId = req.params.moduleId;
    const [[existing]] = await pool.query('SELECT id FROM course_progress WHERE user_id = ? AND module_id = ?', [userId, moduleId]);
    if (existing) {
      return res.json({ success: true, message: 'Already completed.' });
    }
    await pool.query(
      "INSERT INTO course_progress (user_id, module_id, completed, completed_at) VALUES (?, ?, 1, datetime('now'))",
      [userId, moduleId]
    );
    res.json({ success: true, message: 'Module marked as complete!' });
  } catch (err) {
    next(err);
  }
});

router.post('/course/:id/module/:moduleId/uncomplete', async (req, res, next) => {
  try {
    if (!req.session.siteUser) return res.status(401).json({ error: 'Please log in.' });
    await pool.query('DELETE FROM course_progress WHERE user_id = ? AND module_id = ?', [req.session.siteUser.id, req.params.moduleId]);
    res.json({ success: true, message: 'Module unmarked.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
