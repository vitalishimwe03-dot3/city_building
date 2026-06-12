const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [[user]] = await pool.query('SELECT id, full_name, email, phone, avatar, language, is_active, is_verified FROM users WHERE id = ?', [id]);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;
      const avatar = profile.photos?.[0]?.value;

      if (!email) {
        return done(new Error('No email returned from Google'), null);
      }

      const [[existingUser]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

      if (existingUser) {
        if (!existingUser.google_id) {
          await pool.query('UPDATE users SET google_id = ?, avatar = COALESCE(?, avatar), is_verified = 1 WHERE id = ?', [googleId, avatar, existingUser.id]);
        }
        if (!existingUser.is_active) {
          return done(null, false, { message: 'Account deactivated.' });
        }
        const [[updated]] = await pool.query('SELECT id, full_name, email, phone, avatar, language, is_active, is_verified FROM users WHERE id = ?', [existingUser.id]);
        return done(null, updated);
      }

      const crypto = require('crypto');
      const passwordHash = crypto.randomBytes(32).toString('hex');
      const [result] = await pool.query(
        'INSERT INTO users (full_name, email, google_id, avatar, password_hash, is_verified, is_active) VALUES (?, ?, ?, ?, ?, 1, 1)',
        [name, email, googleId, avatar || '', passwordHash]
      );
      const insertId = result?.insertId;
      const [[newUser]] = await pool.query('SELECT id, full_name, email, phone, avatar, language, is_active, is_verified FROM users WHERE id = ?', [insertId]);
      done(null, newUser);
    } catch (err) {
      done(err, null);
    }
  }));

  console.log('Google OAuth strategy configured.');
} else {
  console.log('Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
}

module.exports = passport;
