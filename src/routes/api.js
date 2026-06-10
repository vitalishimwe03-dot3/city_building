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

module.exports = router;
