const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const pool = require('./src/db');
const initDb = require('./src/models/initDb');
const { setAdminLocals } = require('./src/middleware/auth');
const { localizationMiddleware } = require('./src/localization');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
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
    maxAge: 2 * 60 * 60 * 1000
  }
}));

app.use(setAdminLocals);
app.use(localizationMiddleware);

app.use((req, res, next) => {
  req.pool = pool;
  res.locals.canonicalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  res.locals.metaDescription = 'City Building Engineering Company Ltd offers professional software training in Revit, AutoCAD, ETABS, Lumion and more. Enroll in Kigali, Rwanda for career-ready engineering and design courses.';
  next();
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://citybuilding.rw/sitemap.xml\n');
});

app.get('/sitemap.xml', async (req, res, next) => {
  try {
    const [cats] = await pool.query('SELECT slug FROM categories');
    const [courses] = await pool.query('SELECT id FROM subcourses');
    let urls = '';
    const base = 'https://citybuilding.rw';
    const pages = ['', '/about', '/services', '/contact', '/certificate', '/career', '/login', '/signup'];
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
app.use('/api', require('./src/routes/api'));

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page not found', message: 'The page you are looking for does not exist.' });
});

app.use((err, req, res, next) => {
  if (err && Array.isArray(err.errors)) {
    console.error('AggregateError with inner errors:');
    err.errors.forEach((inner, i) => console.error(`#${i}:`, inner));
  } else {
    console.error(err);
  }
  if (process.env.NODE_ENV !== 'production') {
    const details = (err && Array.isArray(err.errors)) ? err.errors.map(e => e.stack || e.message).join('\n---\n') : (err.stack || err.message || String(err));
    res.status(500).send(`<h1>Server error</h1><pre>${details}</pre>`);
    return;
  }
  res.status(500).render('404', { title: 'Server error', message: 'Something unexpected happened. Please try again later.' });
});

const port = process.env.PORT || 3000;

console.log('Starting server...');
console.log('__dirname:', __dirname);
console.log('projectRoot (from initDb):', require('path').resolve(__dirname, 'src', 'models', '..', '..'));
initDb.init()
  .then(() => {
    app.listen(port, function() {
      console.log('Server listening on http://localhost:' + port);
    });
  })
  .catch(function(err) {
    console.error('Failed to initialize database, exiting.');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  });

module.exports = app;
