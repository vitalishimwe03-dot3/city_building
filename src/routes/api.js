const express = require('express');
const router = express.Router();
const pool = require('../db');
const { isAdminAuthenticated } = require('../middleware/auth');
const { requireSiteUser } = require('../middleware/api-auth');

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

router.post('/course/:id/register', requireSiteUser, async (req, res, next) => {
  try {
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

router.get('/my-registrations', requireSiteUser, async (req, res, next) => {
  try {
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

router.get('/my-progress', requireSiteUser, async (req, res, next) => {
  try {
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

// ====== COURSE REVIEWS & RATINGS ======

router.post('/course/:id/review', requireSiteUser, async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const courseId = req.params.id;
    const userId = req.session.siteUser.id;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    const [[existing]] = await pool.query(
      'SELECT id FROM course_reviews WHERE user_id = ? AND subcourse_id = ?',
      [userId, courseId]
    );
    if (existing) {
      await pool.query(
        'UPDATE course_reviews SET rating = ?, review = ? WHERE user_id = ? AND subcourse_id = ?',
        [rating, review || '', userId, courseId]
      );
      return res.json({ success: true, message: 'Review updated!' });
    }
    await pool.query(
      'INSERT INTO course_reviews (user_id, subcourse_id, rating, review) VALUES (?, ?, ?, ?)',
      [userId, courseId, rating, review || '']
    );
    res.json({ success: true, message: 'Review submitted! Pending approval.' });
  } catch (err) {
    next(err);
  }
});

router.get('/course/:id/reviews', async (req, res, next) => {
  try {
    const [reviews] = await pool.query(
      `SELECT r.*, u.full_name as user_name FROM course_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.subcourse_id = ? AND r.is_approved = 1
       ORDER BY r.created_at DESC LIMIT 20`,
      [req.params.id]
    );
    const [statsRows] = await pool.query(
      'SELECT COUNT(*) as count, ROUND(AVG(rating), 1) as avg_rating FROM course_reviews WHERE subcourse_id = ? AND is_approved = 1',
      [req.params.id]
    );
    const stats = statsRows?.[0] || { count: 0, avg_rating: 0 };
    let myReview = null;
    if (req.session.siteUser) {
      const [rows] = await pool.query(
        'SELECT * FROM course_reviews WHERE user_id = ? AND subcourse_id = ?',
        [req.session.siteUser.id, req.params.id]
      );
      myReview = rows?.[0] || null;
    }
    res.json({ reviews: reviews || [], stats, myReview });
  } catch (err) {
    next(err);
  }
});

// ====== COURSE WISHLIST ======

router.get('/my-wishlist', requireSiteUser, async (req, res, next) => {
  try {
    const [items] = await pool.query(
      `SELECT w.*, s.name as course_name, s.slug as course_slug, s.description as course_desc, 
              c.name as category_name, c.slug as category_slug,
              (SELECT ROUND(AVG(rating), 1) FROM course_reviews WHERE subcourse_id = s.id AND is_approved = 1) as avg_rating
       FROM course_wishlist w
       JOIN subcourses s ON w.subcourse_id = s.id
       JOIN categories c ON s.category_id = c.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [req.session.siteUser.id]
    );
    res.json(items || []);
  } catch (err) {
    next(err);
  }
});

router.post('/course/:id/wishlist', requireSiteUser, async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.session.siteUser.id;
    const [[existing]] = await pool.query(
      'SELECT id FROM course_wishlist WHERE user_id = ? AND subcourse_id = ?',
      [userId, courseId]
    );
    if (existing) {
      await pool.query('DELETE FROM course_wishlist WHERE id = ?', [existing.id]);
      return res.json({ success: true, bookmarked: false, message: 'Removed from wishlist.' });
    }
    await pool.query(
      'INSERT INTO course_wishlist (user_id, subcourse_id) VALUES (?, ?)',
      [userId, courseId]
    );
    const [[course]] = await pool.query('SELECT name FROM subcourses WHERE id = ?', [courseId]);
    res.json({ success: true, bookmarked: true, message: `${course?.name || 'Course'} saved to wishlist!` });
  } catch (err) {
    next(err);
  }
});

router.get('/course/:id/wishlist-status', requireSiteUser, async (req, res, next) => {
  try {
    const [[item]] = await pool.query(
      'SELECT id FROM course_wishlist WHERE user_id = ? AND subcourse_id = ?',
      [req.session.siteUser.id, req.params.id]
    );
    res.json({ bookmarked: !!item });
  } catch (err) {
    next(err);
  }
});

// ====== CERTIFICATES ======

router.get('/course/:id/certificate', requireSiteUser, async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.session.siteUser.id;
    const [[course]] = await pool.query('SELECT s.name, c.name as category_name FROM subcourses s JOIN categories c ON s.category_id = c.id WHERE s.id = ?', [courseId]);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    const [[reg]] = await pool.query(
      'SELECT id, status FROM course_registrations WHERE user_id = ? AND subcourse_id = ?',
      [userId, courseId]
    );
    if (!reg) return res.status(400).json({ error: 'You are not registered for this course.' });
    const [[progress]] = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN cp.completed = 1 THEN 1 ELSE 0 END) as done FROM course_modules cm LEFT JOIN course_progress cp ON cp.module_id = cm.id AND cp.user_id = ? WHERE cm.subcourse_id = ?',
      [userId, courseId]
    );
    if (!progress || progress.total === 0) return res.status(400).json({ error: 'No modules found for this course.' });
    if (progress.done < progress.total) return res.status(400).json({ error: `Complete all ${progress.total} modules first. (${progress.done}/${progress.total})` });

    const [[completedDate]] = await pool.query(
      "SELECT MAX(cp.completed_at) as last_completed FROM course_progress cp JOIN course_modules cm ON cp.module_id = cm.id WHERE cm.subcourse_id = ? AND cp.user_id = ? AND cp.completed = 1",
      [courseId, userId]
    );

    const { generateCertificate } = require('../certificate');
    const pdfBuffer = await generateCertificate(
      req.session.siteUser.full_name,
      course.name,
      completedDate?.last_completed
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${course.name.replace(/\s+/g, '-').toLowerCase()}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

router.get('/course/:id/certificate-status', requireSiteUser, async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.session.siteUser.id;
    const [[progress]] = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN cp.completed = 1 THEN 1 ELSE 0 END) as done FROM course_modules cm LEFT JOIN course_progress cp ON cp.module_id = cm.id AND cp.user_id = ? WHERE cm.subcourse_id = ?',
      [userId, courseId]
    );
    const total = progress?.total || 0;
    const done = progress?.done || 0;
    res.json({ total, completed: done, canDownload: total > 0 && done >= total, pct: total > 0 ? Math.round((done / total) * 100) : 0 });
  } catch (err) {
    next(err);
  }
});

// ====== TESTIMONIALS ======

router.get('/testimonials', async (req, res, next) => {
  try {
    const [testimonials] = await pool.query(
      "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC LIMIT 10"
    );
    res.json(testimonials || []);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
