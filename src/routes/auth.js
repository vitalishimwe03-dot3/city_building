const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const pool = require('../db');
const SiteUser = require('../models/SiteUser');
const User = require('../models/User');
const { sendNewStudentNotification, sendUserPasswordResetEmail, sendAdminPasswordResetEmail, sendOtpEmail } = require('../email');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many signup attempts, please try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const accountDashboardNews = [
  { title: 'New course launch', summary: 'Explore our latest Structural and Rendering courses now available.', date: 'June 1, 2026' },
  { title: 'Internship program open', summary: 'Applications are open for the July internship cohort. Submit your profile today.', date: 'May 25, 2026' },
  { title: 'Security tip', summary: 'Always update your password regularly and keep your contact details current.', date: 'May 20, 2026' }
];

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign up' });
});

router.post('/signup', signupLimiter, async (req, res, next) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;
    if (!fullName || !email || !password || password !== confirmPassword) {
      return res.status(400).render('signup', { title: 'Sign up', error: 'Please provide valid details and matching passwords.' });
    }
    const exists = await SiteUser.getUserByEmail(email);
    if (exists) return res.status(400).render('signup', { title: 'Sign up', error: 'Email already registered.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query('DELETE FROM user_otps WHERE email = ?', [email]);
    await pool.query("INSERT INTO user_otps (email, otp, expires_at) VALUES (?, ?, datetime('now', '+10 minutes'))", [email, otp]);

    req.session.pendingSignup = { fullName, email, phone, password };

    sendOtpEmail(email, otp).catch(e => {
      console.error('Failed to send OTP email:', e);
    });

    res.redirect('/verify-otp?email=' + encodeURIComponent(email));
  } catch (err) {
    return res.status(503).render('signup', { title: 'Sign up', error: 'Signup service is temporarily unavailable. Please try again later.' });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).render('login', { title: 'Login', error: 'Email and password required.' });
    const user = await SiteUser.verifyUser(email, password);
    if (!user) return res.status(401).render('login', { title: 'Login', error: 'Invalid credentials.' });
    req.session.siteUser = { id: user.id, email: user.email, full_name: user.full_name };
    req.session.userLanguage = user.language || 'en';
    res.redirect('/');
  } catch (err) {
    return res.status(503).render('login', { title: 'Login', error: 'Login service is temporarily unavailable. Please try again later.' });
  }
});

router.get('/logout', (req, res) => {
  if (req.session) req.session.siteUser = null;
  res.redirect('/');
});

router.get('/account', async (req, res) => {
  if (!req.session.siteUser) return res.redirect('/login');
  const user = await SiteUser.getUserById(req.session.siteUser.id);
  res.render('account', { title: 'Account Settings', user, error: null, success: null, dashboardNews: accountDashboardNews });
});

router.post('/account/profile', async (req, res, next) => {
  try {
    if (!req.session.siteUser) return res.redirect('/login');
    const { fullName, phone } = req.body;
    await SiteUser.updateProfile(req.session.siteUser.id, fullName, phone);
    req.session.siteUser.full_name = fullName;
    const user = await SiteUser.getUserById(req.session.siteUser.id);
    res.render('account', { title: 'Account Settings', user, error: null, success: 'Profile updated successfully!', dashboardNews: accountDashboardNews });
  } catch (err) {
    next(err);
  }
});

router.post('/account/language', async (req, res, next) => {
  try {
    if (!req.session.siteUser) return res.redirect('/login');
    const { language } = req.body;
    await SiteUser.updateLanguage(req.session.siteUser.id, language);
    req.session.userLanguage = language;
    const user = await SiteUser.getUserById(req.session.siteUser.id);
    res.render('account', { title: 'Account Settings', user, error: null, success: 'Language updated successfully!', dashboardNews: accountDashboardNews });
  } catch (err) {
    next(err);
  }
});

router.post('/account/change-password', async (req, res, next) => {
  try {
    if (!req.session.siteUser) return res.redirect('/login');
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      const user = await SiteUser.getUserById(req.session.siteUser.id);
      return res.status(400).render('account', { title: 'Account Settings', user, error: 'Password mismatch or missing fields.', success: null, dashboardNews: accountDashboardNews });
    }
    const fullUser = await SiteUser.getUserByEmail(req.session.siteUser.email);
    if (!fullUser) {
      const user = await SiteUser.getUserById(req.session.siteUser.id);
      return res.status(404).render('account', { title: 'Account Settings', user, error: 'User not found.', success: null, dashboardNews: accountDashboardNews });
    }
    const verified = await SiteUser.verifyUser(fullUser.email, currentPassword);
    if (!verified) {
      const user = await SiteUser.getUserById(req.session.siteUser.id);
      return res.status(401).render('account', { title: 'Account Settings', user, error: 'Current password is incorrect.', success: null, dashboardNews: accountDashboardNews });
    }
    await SiteUser.updatePassword(req.session.siteUser.id, newPassword);
    const user = await SiteUser.getUserById(req.session.siteUser.id);
    res.render('account', { title: 'Account Settings', user, error: null, success: 'Password changed successfully!', dashboardNews: accountDashboardNews });
  } catch (err) {
    next(err);
  }
});

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { title: 'Forgot Password', error: null });
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).render('forgot-password', { title: 'Forgot Password', error: 'Email address is required.' });
    }
    const resetData = await SiteUser.requestPasswordReset(email);
    if (!resetData) {
      return res.render('forgot-password-sent', { title: 'Password Reset Sent', email, message: 'If an account exists with this email, you will receive a password reset link.' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    sendUserPasswordResetEmail(resetData.user, resetData.token, baseUrl).catch(e => {
      console.error('Failed to send password reset email:', e);
    });
    res.render('forgot-password-sent', { title: 'Password Reset Sent', email, message: 'If an account exists with this email, you will receive a password reset link.' });
  } catch (err) {
    next(err);
  }
});

router.get('/reset-password', (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).render('404', { title: 'Invalid Link', message: 'No password reset token provided.' });
  }
  res.render('reset-password', { title: 'Reset Password', token, error: null });
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || password !== confirmPassword) {
      return res.status(400).render('reset-password', { title: 'Reset Password', token, error: 'Password mismatch or token missing.' });
    }
    const user = await SiteUser.resetPasswordWithToken(token, password);
    if (!user) {
      return res.status(400).render('404', { title: 'Invalid or Expired Link', message: 'The password reset link is invalid or has expired.' });
    }
    res.render('password-reset-success', { title: 'Password Reset Successful', message: 'Your password has been reset successfully. You can now login with your new password.' });
  } catch (err) {
    next(err);
  }
});

router.get('/verify-otp', (req, res) => {
  const email = req.query.email;
  if (!email || !req.session.pendingSignup || req.session.pendingSignup.email !== email) {
    return res.redirect('/signup');
  }
  res.render('verify-otp', { title: 'Verify Email', email, error: null });
});

router.post('/verify-otp', async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp || !req.session.pendingSignup || req.session.pendingSignup.email !== email) {
      return res.redirect('/signup');
    }

    const [[stored]] = await pool.query(
      "SELECT * FROM user_otps WHERE email = ? AND otp = ? AND expires_at > datetime('now')",
      [email, otp]
    );

    if (!stored) {
      return res.render('verify-otp', { title: 'Verify Email', email, error: 'Invalid or expired verification code. Please request a new one.' });
    }

    const { fullName, phone, password } = req.session.pendingSignup;
    await SiteUser.createUser(fullName, email, phone, password);

    await pool.query('DELETE FROM user_otps WHERE email = ?', [email]);
    delete req.session.pendingSignup;

    sendNewStudentNotification({ fullName, email, phone }).catch(e => {
      console.error('Failed to send new-student notification:', e);
    });

    res.render('thankyou', {
      title: 'Welcome',
      name: fullName,
      message: 'Your email has been verified and your student account created successfully. You can now log in and explore courses.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
