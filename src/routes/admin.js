const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const pool = require('../db');
const User = require('../models/User');
const Admin = require('../models/Admin');
const SiteUser = require('../models/SiteUser');
const initDb = require('../models/initDb');
const { isAdminAuthenticated } = require('../middleware/auth');
const { sendAdminPasswordResetEmail } = require('../email');

// Account lockout tracking (in-memory)
const loginAttempts = {};
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 min

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection?.remoteAddress || req.ip;
}

function checkAccountLockout(username) {
  const key = username?.toLowerCase();
  const record = loginAttempts[key];
  if (!record) return false;
  if (record.count >= LOCKOUT_THRESHOLD) {
    if (Date.now() - record.firstAttempt < LOCKOUT_DURATION_MS) return true;
    delete loginAttempts[key];
  }
  return false;
}

function recordFailedAttempt(username, ip) {
  const key = username?.toLowerCase();
  if (!loginAttempts[key]) loginAttempts[key] = { count: 0, firstAttempt: Date.now(), ip };
  loginAttempts[key].count++;
  loginAttempts[key].ip = ip;
  loginAttempts[key].lastAttempt = Date.now();
}

function clearLoginAttempts(username) {
  delete loginAttempts[username?.toLowerCase()];
}

// CSRF token generation
function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Admin rate limiter (more strict)
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password strength validation
function validatePasswordStrength(password) {
  const errors = [];
  if (!password || password.length < 8) errors.push('at least 8 characters');
  if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
  if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
  if (!/\d/.test(password)) errors.push('one number');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('one special character');
  return errors;
}

function setAdminPage(req, res, next) {
  const parts = req.path.split('/');
  res.locals.currentPage = parts[2] || 'dashboard';
  res.locals.layout = 'admin-layout';
  pool.query("SELECT COUNT(*) as cnt FROM enquiries WHERE status='new'").then(function(r) {
    res.locals.newEnquiries = r[0]?.[0]?.cnt || 0;
    next();
  }).catch(function() { res.locals.newEnquiries = 0; next(); });
}

router.get('/', (req, res) => {
  if (req.session?.adminUser && ['admin', 'super_admin', 'superadmin'].includes(req.session.adminUser.role)) {
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/login', (req, res) => {
  if (req.session?.userId) {
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { title: 'Admin Login', layout: false, error: null });
  }
});

router.post('/login', adminLoginLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const clientIp = getClientIp(req);
    if (!username || !password) {
      return res.status(400).render('admin/login', { title: 'Admin Login', layout: false, error: 'Username and password are required.' });
    }
    // Account lockout check
    if (checkAccountLockout(username)) {
      console.warn(`Blocked locked-out admin login attempt for ${username} from IP ${clientIp}`);
      return res.status(429).render('admin/login', { title: 'Admin Login', layout: false, error: 'Account temporarily locked due to too many failed attempts. Try again in 15 minutes.' });
    }
    const user = await User.verifyUser(username, password);
    if (!user) {
      recordFailedAttempt(username, clientIp);
      console.warn(`Failed admin login attempt: invalid credentials for ${username} from IP ${clientIp}`);
      const remaining = LOCKOUT_THRESHOLD - (loginAttempts[username?.toLowerCase()]?.count || 0);
      const msg = remaining > 0 ? `Invalid username or password. ${remaining} attempt(s) remaining before lockout.` : 'Account locked due to too many failed attempts.';
      return res.status(401).render('admin/login', { title: 'Admin Login', layout: false, error: msg });
    }
    if (!user.is_active) {
      console.warn(`Disabled admin account login attempt: ${username}`);
      return res.status(403).render('admin/login', { title: 'Admin Login', layout: false, error: 'This account has been deactivated. Contact your system administrator.' });
    }
    if (!user.role || !['admin', 'super_admin', 'superadmin'].includes(user.role)) {
      console.warn(`Unauthorized admin login attempt: user ${username} has role ${user.role}`);
      return res.status(403).render('admin/login', { title: 'Admin Login', layout: false, error: 'Your account does not have admin privileges.' });
    }
    // Clear lockout on success
    clearLoginAttempts(username);
    // Session regeneration (prevents session fixation)
    req.session.regenerate(function(err) {
      if (err) return next(err);
      req.session.userId = user.id;
      req.session.adminUser = user;
      req.session.csrfToken = generateCsrfToken();
      req.session.createdAt = Date.now();
      console.log(`Admin login successful: ${username} from IP ${clientIp}`);
      Admin.logActivity(user.id, user.full_name || user.username, 'Logged in', 'auth', null, `IP: ${clientIp}`, clientIp).catch(function() {});
      res.redirect('/admin/dashboard');
    });
  } catch (err) {
    next(err);
  }
});

router.get('/logout', (req, res) => {
  const name = req.session?.adminUser?.full_name || req.session?.adminUser?.username || 'Unknown';
  const ip = getClientIp(req);
  Admin.logActivity(req.session?.adminUser?.id, name, 'Logged out', 'auth', null, `IP: ${ip}`, ip).catch(function() {});
  req.session.destroy(() => { res.redirect('/admin/login'); });
});

// CSRF validation middleware for all admin POST/PUT/DELETE requests
function csrfProtection(req, res, next) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const token = req.body._csrf || req.headers['x-csrf-token'];
    if (!token || token !== req.session?.csrfToken) {
      console.warn(`CSRF validation failed for ${req.method} ${req.path} from IP ${getClientIp(req)}`);
      return res.status(403).render('admin/login', { title: 'Security Error', layout: false, error: 'Security token validation failed. Please sign in again.' });
    }
  }
  next();
}

// Session timeout check (4 hours of inactivity)
function sessionTimeout(req, res, next) {
  if (req.session?.createdAt) {
    const elapsed = Date.now() - req.session.createdAt;
    if (elapsed > 4 * 60 * 60 * 1000) {
      req.session.destroy(() => { res.redirect('/admin/login'); });
      return;
    }
    req.session.createdAt = Date.now(); // refresh on each activity
  }
  next();
}

// Shared layout middleware for all authenticated pages
router.use(isAdminAuthenticated, csrfProtection, sessionTimeout, setAdminPage);

router.get('/dashboard', async (req, res, next) => {
  try {
    const admin = await User.getUserById(req.session.adminUser.id);
    const [enquiries] = await pool.query('SELECT COUNT(*) as total, SUM(CASE WHEN status="new" THEN 1 ELSE 0 END) as new FROM enquiries');
    const [categories] = await pool.query('SELECT COUNT(*) as total FROM categories');
    const [courses] = await pool.query('SELECT COUNT(*) as total FROM subcourses');
    const [users] = await pool.query('SELECT COUNT(*) as total FROM admin_users');
    const [regs] = await pool.query('SELECT COUNT(*) as total FROM course_registrations');
    const [siteUserStats] = await pool.query('SELECT COUNT(*) as total, SUM(CASE WHEN is_active=1 THEN 1 ELSE 0 END) as active FROM users');
    const [monthlyEnquiries] = await pool.query("SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count FROM enquiries GROUP BY month ORDER BY month DESC LIMIT 6");
    const [monthlyUsers] = await pool.query("SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count FROM users WHERE created_at >= datetime('now', '-6 months') GROUP BY month ORDER BY month ASC");
    const [pendingRegs] = await pool.query("SELECT COUNT(*) as count FROM course_registrations WHERE status='pending'");
    const recentActivity = await Admin.getRecentActivityLogs(7);
    const [recentEnquiries] = await pool.query('SELECT id, name, email, created_at FROM enquiries ORDER BY created_at DESC LIMIT 5');

    res.render('admin/dashboard', {
      title: 'Dashboard',
      admin,
      clientIp: req.ip || req.connection?.remoteAddress || 'unknown',
      sessionCreatedAt: req.session?.createdAt,
      stats: {
        enquiries: enquiries[0] || { total: 0, new: 0 },
        categories: categories[0] || { total: 0 },
        courses: courses[0] || { total: 0 },
        users: users[0] || { total: 0 },
        registrations: regs[0] || { total: 0 },
        siteUsers: siteUserStats[0] || { total: 0, active: 0 },
        pendingRegistrations: pendingRegs[0] || { count: 0 }
      },
      monthlyEnquiries: monthlyEnquiries || [],
      monthlyUsers: monthlyUsers || [],
      recentActivity: recentActivity || [],
      recentEnquiries: recentEnquiries || []
    });
  } catch (err) {
    next(err);
  }
});

// ========== SITE USERS (Students) MANAGEMENT ==========

router.get('/site-users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const result = await SiteUser.getAllUsers(page, 20, search);
    const stats = await SiteUser.getUserStats();
    res.render('admin/site-users/index', {
      title: 'Site Users',
      users: result.users,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      search,
      stats
    });
  } catch (err) {
    next(err);
  }
});

router.get('/site-users/:id', async (req, res, next) => {
  try {
    const user = await SiteUser.getUserWithRegistrations(req.params.id);
    if (!user) return res.status(404).render('404', { title: 'Not found', message: 'User not found' });
    res.render('admin/site-users/view', { title: 'View User - ' + user.full_name, user });
  } catch (err) {
    next(err);
  }
});

router.post('/site-users/:id/toggle-active', async (req, res, next) => {
  try {
    const result = await SiteUser.toggleUserActive(req.params.id);
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      result.is_active ? 'Activated site user' : 'Deactivated site user',
      'site_user', parseInt(req.params.id),
      `User ID ${req.params.id} ${result.is_active ? 'activated' : 'deactivated'}`,
      req.ip
    );
    res.redirect('/admin/site-users/' + req.params.id);
  } catch (err) {
    next(err);
  }
});

router.get('/site-users/export/csv', async (req, res, next) => {
  try {
    const { users } = await SiteUser.getAllUsers(1, 10000);
    const header = 'ID,Full Name,Email,Phone,Language,Active,Created\n';
    const rows = users.map(u =>
      `${u.id},"${u.full_name || ''}","${u.email || ''}","${u.phone || ''}",${u.language || 'en'},${u.is_active ? 'Yes' : 'No'},${u.created_at || ''}`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=site-users.csv');
    res.send(header + rows);
  } catch (err) {
    next(err);
  }
});

// ========== ADMIN USERS MANAGEMENT ==========

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.getAllUsers();
    const currentAdmin = await User.getUserById(req.session.adminUser.id);
    res.render('admin/users/index', { title: 'Admin Users', users, currentAdmin });
  } catch (err) {
    next(err);
  }
});

router.get('/users/create', (req, res) => {
  res.render('admin/users/form', { title: 'Create Admin User', user: null, isSuperAdmin: false, error: null });
});

router.post('/users', async (req, res, next) => {
  try {
    const { username, email, password, fullName, role } = req.body;
    if (!username || !email || !password || !fullName) {
      return res.status(400).render('admin/users/form', { title: 'Create Admin User', user: null, error: 'All fields are required.' });
    }
    await User.createUser(username, email, password, fullName, role || 'admin');
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      'Created admin user', 'admin_user', null,
      `Created user ${username} (${email})`,
      req.ip
    );
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

router.get('/users/:id/edit', async (req, res, next) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).render('404', { title: 'Not found', message: 'User not found' });
    const isSuperAdmin = await User.isSuperAdminAccount(req.params.id);
    res.render('admin/users/form', { title: 'Edit User', user, isSuperAdmin });
  } catch (err) {
    next(err);
  }
});

router.post('/users/:id', async (req, res, next) => {
  try {
    const { fullName, email, role, isActive } = req.body;
    await User.updateUser(req.params.id, { full_name: fullName, email, role, is_active: isActive === 'on' ? 1 : 0 });
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      'Updated admin user', 'admin_user', parseInt(req.params.id),
      `Updated user ID ${req.params.id}`,
      req.ip
    );
    res.redirect('/admin/users');
  } catch (err) {
    const user = await User.getUserById(req.params.id);
    const isSuperAdmin = user ? await User.isSuperAdminAccount(req.params.id) : false;
    res.status(400).render('admin/users/form', { title: 'Edit User', user, isSuperAdmin, error: err.message });
  }
});

router.post('/users/:id/delete', async (req, res, next) => {
  try {
    await User.deleteUser(req.params.id);
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      'Deleted admin user', 'admin_user', parseInt(req.params.id),
      `Deleted admin user ID ${req.params.id}`,
      req.ip
    );
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

// ========== ENQUIRIES ==========

router.get('/enquiries', async (req, res, next) => {
  try {
    const enquiries = await Admin.getAllEnquiries();
    res.render('admin/enquiries/index', { title: 'Enquiries', enquiries });
  } catch (err) {
    next(err);
  }
});

router.get('/enquiries/:id', async (req, res, next) => {
  try {
    const enquiry = await Admin.getEnquiryById(req.params.id);
    if (!enquiry) return res.status(404).render('404', { title: 'Not found', message: 'Enquiry not found' });
    res.render('admin/enquiries/view', { title: 'View Enquiry', enquiry });
  } catch (err) {
    next(err);
  }
});

router.post('/enquiries/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    await Admin.updateEnquiryStatus(req.params.id, status);
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      'Updated enquiry status', 'enquiry', parseInt(req.params.id),
      `Set enquiry #${req.params.id} to ${status}`,
      req.ip
    );
    res.redirect(`/admin/enquiries/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

router.post('/enquiries/:id/delete', async (req, res, next) => {
  try {
    await Admin.deleteEnquiry(req.params.id);
    res.redirect('/admin/enquiries');
  } catch (err) {
    next(err);
  }
});

// ========== CATEGORIES ==========

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Admin.getAllCategories();
    res.render('admin/categories/index', { title: 'Categories', categories });
  } catch (err) {
    next(err);
  }
});

router.get('/categories/create', (req, res) => {
  res.render('admin/categories/form', { title: 'Create Category', category: null, error: null });
});

router.post('/categories', async (req, res, next) => {
  try {
    const { name, description, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).render('admin/categories/form', { title: 'Create Category', category: null, error: 'Name and slug are required.' });
    }
    await Admin.createCategory(name, description || '', slug);
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      'Created category', 'category', null,
      `Created category "${name}"`,
      req.ip
    );
    res.redirect('/admin/categories');
  } catch (err) {
    next(err);
  }
});

router.get('/categories/:id/edit', async (req, res, next) => {
  try {
    const [[category]] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!category) return res.status(404).render('404', { title: 'Not found', message: 'Category not found' });
    res.render('admin/categories/form', { title: 'Edit Category', category });
  } catch (err) {
    next(err);
  }
});

router.post('/categories/:id', async (req, res, next) => {
  try {
    const { name, description, slug } = req.body;
    await Admin.updateCategory(req.params.id, name, description || '', slug);
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      'Updated category', 'category', parseInt(req.params.id),
      `Updated category #${req.params.id}`,
      req.ip
    );
    res.redirect('/admin/categories');
  } catch (err) {
    next(err);
  }
});

router.post('/categories/:id/delete', async (req, res, next) => {
  try {
    await Admin.deleteCategory(req.params.id);
    res.redirect('/admin/categories');
  } catch (err) {
    next(err);
  }
});

// ========== COURSES ==========

router.get('/courses', async (req, res, next) => {
  try {
    const courses = await Admin.getAllSubcourses();
    res.render('admin/courses/index', { title: 'Courses', courses });
  } catch (err) {
    next(err);
  }
});

router.get('/courses/create', async (req, res, next) => {
  try {
    const categories = await Admin.getAllCategories();
    res.render('admin/courses/form', { title: 'Create Course', course: null, categories, error: null });
  } catch (err) {
    next(err);
  }
});

router.post('/courses', async (req, res, next) => {
  try {
    const { categoryId, name, slug, description, image } = req.body;
    if (!categoryId || !name || !slug) {
      const categories = await Admin.getAllCategories();
      return res.status(400).render('admin/courses/form', { title: 'Create Course', course: null, categories, error: 'Category, name and slug are required.' });
    }
    await Admin.createSubcourse(categoryId, name, slug, description || '', image || '');
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      'Created course', 'course', null,
      `Created course "${name}"`,
      req.ip
    );
    res.redirect('/admin/courses');
  } catch (err) {
    next(err);
  }
});

router.get('/courses/:id/edit', async (req, res, next) => {
  try {
    const [[course]] = await pool.query('SELECT * FROM subcourses WHERE id = ?', [req.params.id]);
    const categories = await Admin.getAllCategories();
    if (!course) return res.status(404).render('404', { title: 'Not found', message: 'Course not found' });
    res.render('admin/courses/form', { title: 'Edit Course', course, categories });
  } catch (err) {
    next(err);
  }
});

router.post('/courses/:id', async (req, res, next) => {
  try {
    const { categoryId, name, slug, description, image } = req.body;
    await Admin.updateSubcourse(req.params.id, categoryId, name, slug, description || '', image || '');
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      'Updated course', 'course', parseInt(req.params.id),
      `Updated course #${req.params.id}`,
      req.ip
    );
    res.redirect('/admin/courses');
  } catch (err) {
    next(err);
  }
});

router.post('/courses/:id/delete', async (req, res, next) => {
  try {
    await Admin.deleteSubcourse(req.params.id);
    res.redirect('/admin/courses');
  } catch (err) {
    next(err);
  }
});

// ========== REGISTRATIONS ==========

router.get('/registrations', async (req, res, next) => {
  try {
    const [registrations] = await pool.query(
      `SELECT r.*, u.full_name as user_name, u.email as user_email, s.name as course_name, c.name as category_name
       FROM course_registrations r
       JOIN users u ON r.user_id = u.id
       JOIN subcourses s ON r.subcourse_id = s.id
       JOIN categories c ON s.category_id = c.id
       ORDER BY r.created_at DESC`
    );
    res.render('admin/registrations/index', { title: 'Registrations', registrations: registrations || [] });
  } catch (err) {
    next(err);
  }
});

router.post('/registrations/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE course_registrations SET status = ? WHERE id = ?', [status, req.params.id]);
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      'Updated registration status', 'registration', parseInt(req.params.id),
      `Set registration #${req.params.id} to ${status}`,
      req.ip
    );
    res.redirect('/admin/registrations');
  } catch (err) {
    next(err);
  }
});

// ========== ACTIVITY LOG ==========

router.get('/activity', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 30;
    const offset = (page - 1) * limit;
    const logs = await Admin.getActivityLogs(limit, offset);
    const stats = await Admin.getActivityStats();
    res.render('admin/activity/index', { title: 'Activity Log', logs, stats, page });
  } catch (err) {
    next(err);
  }
});

// ========== SETTINGS ==========

router.get('/settings', async (req, res, next) => {
  try {
    const user = await User.getUserById(req.session.adminUser.id);
    res.render('admin/settings', { title: 'Settings', user, error: null, success: null });
  } catch (err) {
    next(err);
  }
});

router.post('/settings/change-password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      const user = await User.getUserById(req.session.adminUser.id);
      return res.status(400).render('admin/settings', { title: 'Settings', user, error: 'Password mismatch or missing fields.', success: null });
    }
    // Password strength validation
    const strengthErrors = validatePasswordStrength(newPassword);
    if (strengthErrors.length > 0) {
      const user = await User.getUserById(req.session.adminUser.id);
      return res.status(400).render('admin/settings', { title: 'Settings', user, error: 'Password must include: ' + strengthErrors.join(', ') + '.', success: null });
    }
    const admin = await User.getUserById(req.session.adminUser.id);
    const verified = await User.verifyUser(admin.username, currentPassword);
    if (!verified) {
      const user = await User.getUserById(req.session.adminUser.id);
      return res.status(401).render('admin/settings', { title: 'Settings', user, error: 'Current password is incorrect.', success: null });
    }
    await User.updatePassword(req.session.adminUser.id, newPassword);
    // Force session re-login after password change
    req.session.destroy();
    await Admin.logActivity(
      req.session.adminUser.id, req.session.adminUser.full_name || req.session.adminUser.username,
      'Changed password', null, null,
      'Admin changed their password',
      req.ip
    );
    res.redirect('/admin/login');
  } catch (err) {
    next(err);
  }
});

// ========== FORGOT / RESET PASSWORD (no auth required) ==========

router.get('/forgot-password', (req, res) => {
  res.render('admin/forgot-password', { title: 'Admin Forgot Password', layout: false, error: null });
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).render('admin/forgot-password', { title: 'Admin Forgot Password', layout: false, error: 'Email address is required.' });
    }
    const resetData = await User.requestPasswordReset(email);
    if (!resetData) {
      return res.render('admin/forgot-password-sent', { title: 'Password Reset Sent', layout: false, email, message: 'If an admin account exists with this email, you will receive a password reset link.' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    sendAdminPasswordResetEmail(resetData.user, resetData.token, baseUrl).catch(e => {
      console.error('Failed to send admin password reset email:', e);
    });
    res.render('admin/forgot-password-sent', { title: 'Password Reset Sent', layout: false, email, message: 'If an admin account exists with this email, you will receive a password reset link.' });
  } catch (err) {
    next(err);
  }
});

router.get('/reset-password', (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).render('404', { title: 'Invalid Link', message: 'No password reset token provided.' });
  }
  res.render('admin/reset-password', { title: 'Reset Password', layout: false, token, error: null });
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || password !== confirmPassword) {
      return res.status(400).render('admin/reset-password', { title: 'Reset Password', layout: false, token, error: 'Password mismatch or token missing.' });
    }
    const user = await User.resetPasswordWithToken(token, password);
    if (!user) {
      return res.status(400).render('404', { title: 'Invalid or Expired Link', message: 'The password reset link is invalid or has expired.' });
    }
    res.render('admin/password-reset-success', { title: 'Password Reset Successful', layout: false, message: 'Your password has been reset successfully. You can now login with your new password.' });
  } catch (err) {
    next(err);
  }
});

router.get('/init-db', async (req, res, next) => {
  try {
    await initDb.init();
    res.send('DB init ran successfully.');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
