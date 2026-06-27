const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const passport = require('./src/config/passport');
const pool = require('./src/db');
const initDb = require('./src/models/initDb');
const { setAdminLocals } = require('./src/middleware/auth');
const { localizationMiddleware } = require('./src/localization');
const adConfig = require('./src/config/ads');
const logger = require('./src/logger');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://pagead2.googlesyndication.com', 'https://www.googletagmanager.com'],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'],
  fontSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://fonts.gstatic.com'],
  imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com', 'https://pagead2.googlesyndication.com'],
  connectSrc: ["'self'", 'https://pagead2.googlesyndication.com'],
  frameSrc: ["'self'", 'https://www.google.com'],
  objectSrc: ["'none'"]
};

app.use(helmet({
  contentSecurityPolicy: { directives: cspDirectives },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'city-building-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 4 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());

app.use(setAdminLocals);
app.use(localizationMiddleware);

app.use((req, res, next) => {
  req.pool = pool;
  const proto = req.protocol;
  const host = req.get('host');
  res.locals.canonicalUrl = `${proto}://${host}${req.originalUrl}`;
  res.locals.reqProtocol = proto;
  res.locals.reqHost = host;
  res.locals.metaDescription = 'City Building Engineering Company Ltd offers professional software training in Revit, AutoCAD, ETABS, Lumion and more. Enroll in Kigali, Rwanda for career-ready engineering and design courses.';
  res.locals.adConfig = adConfig;
  const gId = process.env.GOOGLE_CLIENT_ID;
  res.locals.googleAuthEnabled = !!(gId && gId !== 'your-google-client-id.apps.googleusercontent.com' && process.env.GOOGLE_CLIENT_SECRET);
  next();
});

app.get('/robots.txt', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
});

app.get('/sitemap.xml', async (req, res, next) => {
  try {
    const [cats] = await pool.query('SELECT slug FROM categories');
    const [courses] = await pool.query('SELECT id, slug FROM subcourses');
    let urls = '';
    const base = `${req.protocol}://${req.get('host')}`;
    const pages = ['', '/about', '/services', '/contact', '/certificate', '/career', '/faq', '/internship', '/login', '/signup'];
    pages.forEach(p => { urls += `<url><loc>${base}${p}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`; });
    (cats || []).forEach(c => { urls += `<url><loc>${base}/category/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`; });
    (courses || []).forEach(c => { urls += `<url><loc>${base}/course/${c.id}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>\n`; });
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  } catch (err) {
    next(err);
  }
});

app.use('/', require('./src/routes/public'));
app.use('/', require('./src/routes/auth'));
app.use('/admin', require('./src/routes/admin'));
app.use('/admin/images', require('./src/routes/admin-images'));
app.use('/admin/slides', require('./src/routes/admin-slides'));
app.use('/api', require('./src/routes/api'));
app.use('/api', require('./src/routes/api-images'));

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page not found', message: 'The page you are looking for does not exist.' });
});

app.use((err, req, res, next) => {
  if (err && Array.isArray(err.errors)) {
    logger.error({ err: { message: 'AggregateError', errors: err.errors.map(e => e.message) } }, 'Request failed with aggregate errors');
  } else {
    logger.error({ err }, 'Unhandled request error');
  }
  if (process.env.NODE_ENV !== 'production') {
    const details = (err && Array.isArray(err.errors)) ? err.errors.map(e => e.stack || e.message).join('\n---\n') : (err.stack || err.message || String(err));
    res.status(500).send(`<h1>Server error</h1><pre>${details}</pre>`);
    return;
  }
  res.status(500).render('404', { title: 'Server error', message: 'Something unexpected happened. Please try again later.' });
});

const port = process.env.PORT || 3000;

logger.info({ dir: __dirname }, 'Starting server...');
initDb.init()
  .then(() => {
    app.listen(port, function() {
      logger.info({ port }, 'Server listening');
    });
  })
  .catch(function(err) {
    logger.fatal({ err }, 'Failed to initialize database, exiting.');
    process.exit(1);
  });

module.exports = app;
