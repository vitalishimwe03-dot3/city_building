const express = require('express');
const router = express.Router();
const pool = require('../db');
const initDb = require('../models/initDb');
const { sendEnquiryNotification } = require('../email');

const fallbackCategories = [
  { id: 'architectural', name: 'Architectural Software', description: 'Architectural software courses', slug: 'architectural' },
  { id: 'structural', name: 'Structural Software', description: 'Structural analysis & design software', slug: 'structural' },
  { id: 'geotechnical', name: 'Geotechnical Software', description: 'Geotechnical analysis tools', slug: 'geotechnical' },
  { id: 'rendering', name: 'Rendering Software', description: 'Visualization and rendering tools', slug: 'rendering' },
  { id: 'water-road', name: 'Water & Road Design Software', description: 'Water and road design tools', slug: 'water-road' }
];

const fallbackSubcourses = [
  { id: 'revit', category_slug: 'architectural', category_name: 'Architectural Software', name: 'Revit', slug: 'revit', image: 'https://images.seeklogo.com/logo-png/48/1/autodesk-revit-logo-png_seeklogo-482393.png', description: 'Autodesk Revit course' },
  { id: 'archicad', category_slug: 'architectural', category_name: 'Architectural Software', name: 'ArchiCAD', slug: 'archicad', image: 'https://static.food4rhino.com/cdn/farfuture/xyrPqO3quW2MDpWtN1q77PWdS56JQF_RFkkPgqfqj0o/mtime:1680615355/sites/default/files/public/users-files/graphisoft/app/archicadlogo.jpg', description: 'ArchiCAD BIM modelling course' },
  { id: 'sketchup', category_slug: 'architectural', category_name: 'Architectural Software', name: 'SketchUp', slug: 'sketchup', image: 'https://images.pexels.com/photos/33021967/pexels-photo-33021967.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'SketchUp fundamentals' },
  { id: 'autocad', category_slug: 'architectural', category_name: 'Architectural Software', name: 'AutoCAD', slug: 'autocad', image: 'https://images.pexels.com/photos/716661/pexels-photo-716661.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'AutoCAD drafting course' },
  { id: 'prostructure', category_slug: 'structural', category_name: 'Structural Software', name: 'Prostructure', slug: 'prostructure', image: 'https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'Prostructure structural modelling' },
  { id: 'etabs', category_slug: 'structural', category_name: 'Structural Software', name: 'CSI Etabs', slug: 'etabs', image: 'https://images.pexels.com/photos/11157438/pexels-photo-11157438.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'Etabs analysis' },
  { id: 'prokon', category_slug: 'structural', category_name: 'Structural Software', name: 'Prokon', slug: 'prokon', image: 'https://images.pexels.com/photos/3862377/pexels-photo-3862377.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'Prokon structural tools' },
  { id: 'robot-structure', category_slug: 'structural', category_name: 'Structural Software', name: 'Robot Structure', slug: 'robot-structure', image: 'https://images.pexels.com/photos/7564864/pexels-photo-7564864.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'Autodesk Robot Structural Analysis' },
  { id: 'csisafe', category_slug: 'structural', category_name: 'Structural Software', name: 'CSI Safe', slug: 'csisafe', image: 'https://images.pexels.com/photos/7859760/pexels-photo-7859760.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'CSI Safe design' },
  { id: 'csidetailer', category_slug: 'structural', category_name: 'Structural Software', name: 'CSI Detailer', slug: 'csidetailer', image: 'https://images.pexels.com/photos/1113839/pexels-photo-1113839.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'CSI Detailer workflows' },
  { id: 'csibridge', category_slug: 'structural', category_name: 'Structural Software', name: 'CSI Bridge', slug: 'csibridge', image: 'https://images.pexels.com/photos/28370582/pexels-photo-28370582.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'CSI Bridge for bridges' },
  { id: 'plaxis-2d', category_slug: 'geotechnical', category_name: 'Geotechnical Software', name: 'Plaxis 2D', slug: 'plaxis-2d', image: 'https://images.pexels.com/photos/18812422/pexels-photo-18812422.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'Plaxis 2D geotech modelling' },
  { id: 'plaxis-3d', category_slug: 'geotechnical', category_name: 'Geotechnical Software', name: 'Plaxis 3D', slug: 'plaxis-3d', image: 'https://images.pexels.com/photos/14466335/pexels-photo-14466335.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'Plaxis 3D geotechnical analysis' },
  { id: 'lumion', category_slug: 'rendering', category_name: 'Rendering Software', name: 'Lumion', slug: 'lumion', image: 'https://images.pexels.com/photos/13203180/pexels-photo-13203180.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'Lumion rendering workflows' },
  { id: 'twinmotion', category_slug: 'rendering', category_name: 'Rendering Software', name: 'Twin Motion', slug: 'twinmotion', image: 'https://images.pexels.com/photos/16037755/pexels-photo-16037755.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'Twinmotion visualization' },
  { id: 'enscape', category_slug: 'rendering', category_name: 'Rendering Software', name: 'Enscape', slug: 'enscape', image: 'https://images.pexels.com/photos/10813067/pexels-photo-10813067.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'Enscape realtime rendering' },
  { id: 'vray', category_slug: 'rendering', category_name: 'Rendering Software', name: 'V-Ray', slug: 'vray', image: 'https://images.pexels.com/photos/5265286/pexels-photo-5265286.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'V-Ray photoreal rendering' },
  { id: 'arcgis', category_slug: 'water-road', category_name: 'Water & Road Design Software', name: 'ArcGIS', slug: 'arcgis', image: 'https://images.pexels.com/photos/8472920/pexels-photo-8472920.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'ArcGIS for infrastructure' },
  { id: 'civil3d', category_slug: 'water-road', category_name: 'Water & Road Design Software', name: 'Civil 3D', slug: 'civil3d', image: 'https://images.pexels.com/photos/34338597/pexels-photo-34338597.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'Civil 3D road design' },
  { id: 'watercad', category_slug: 'water-road', category_name: 'Water & Road Design Software', name: 'WaterCAD', slug: 'watercad', image: 'https://images.pexels.com/photos/31326225/pexels-photo-31326225.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'WaterCAD distribution modelling' },
  { id: 'watergem', category_slug: 'water-road', category_name: 'Water & Road Design Software', name: 'WaterGEM', slug: 'watergem', image: 'https://images.pexels.com/photos/31326225/pexels-photo-31326225.jpeg?auto=compress&cs=tinysrgb&w=1200', description: 'WaterGEM hydraulic modelling' }
];

function findFallbackCategory(slug) {
  return fallbackCategories.find(category => category.slug === slug);
}

function getFallbackSubcourses(slug) {
  return fallbackSubcourses.filter(sub => sub.category_slug === slug);
}

function findFallbackSubcourse(id) {
  return fallbackSubcourses.find(sub => String(sub.id) === String(id) || sub.slug === String(id));
}

router.get('/', async (req, res, next) => {
  try {
    let [categories] = await pool.query('SELECT id,name,slug,description FROM categories');
    if (categories.length === 0) {
      await initDb.init();
      [categories] = await pool.query('SELECT id,name,slug,description FROM categories');
    }
    if (categories.length === 0) {
      categories = fallbackCategories;
    }
    res.render('index', { categories, title: 'City Building Engineering - Professional Software Training in Kigali, Rwanda', metaDescription: 'Enroll in professional software training courses in Kigali, Rwanda. Learn Revit, AutoCAD, ETABS, Lumion and more at City Building Engineering Company Ltd.', dbError: null });
  } catch (err) {
    res.render('index', {
      categories: fallbackCategories,
      title: 'City Building Engineering - Professional Software Training',
      metaDescription: 'Professional software training for architecture, engineering, design careers in Kigali, Rwanda.',
      dbError: null
    });
  }
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us', metaDescription: 'Learn about City Building Engineering Company Ltd in Kigali, Rwanda. Discover our mission to provide career-ready software training for building professionals.' });
});

router.get('/services', (req, res) => {
  res.render('services', { title: 'Services', metaDescription: 'Explore our professional training services in architectural, structural, geotechnical, rendering, and water & road design software at City Building Engineering.' });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us', metaDescription: 'Contact City Building Engineering Company Ltd in Kigali, Rwanda. Enroll in courses, ask questions, or visit our training center. WhatsApp: +250 789 257 758.' });
});

router.get('/certificate', (req, res) => {
  res.render('certificate', { title: 'Certificate Program', metaDescription: 'Earn a recognized certificate from City Building Engineering Company Ltd upon completing our professional software training courses in Kigali.' });
});

router.get('/career', (req, res) => {
  res.render('career', { title: 'Career Opportunities', metaDescription: 'Kickstart your career with City Building Engineering. Internship placement, job-ready training, and career support for architecture and engineering graduates in Rwanda.' });
});

router.get('/category/:slug', async (req, res, next) => {
  const slug = req.params.slug;
  try {
    const [[category]] = await pool.query('SELECT id,name,description FROM categories WHERE slug=? LIMIT 1', [slug]);
    if (!category) throw new Error('Category not found');
    const [subs] = await pool.query('SELECT * FROM subcourses WHERE category_id=?', [category.id]);
    res.render('category', { category, subcourses: subs, title: `${category.name} - City Building Engineering`, metaDescription: `Browse ${category.name} courses at City Building Engineering in Kigali. Professional software training for ${category.description?.toLowerCase() || 'building professionals'}.` });
  } catch (err) {
    const category = findFallbackCategory(slug);
    if (!category) return res.status(404).render('404', { title: 'Not found', message: 'Category not found' });
    const subs = getFallbackSubcourses(slug);
    res.render('category', { category, subcourses: subs, title: `${category.name} - City Building Engineering`, metaDescription: `Explore ${category.name} training courses in Kigali, Rwanda.` });
  }
});

router.get('/course/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const [[course]] = await pool.query('SELECT s.*, c.name as category_name, c.slug as category_slug FROM subcourses s JOIN categories c ON s.category_id=c.id WHERE s.id=? LIMIT 1', [id]);
    if (course) return res.render('subcourse', { course, title: `${course.name} Course - City Building Engineering`, metaDescription: `Enroll in ${course.name} training in Kigali. ${course.description || 'Professional software course with hands-on training.'} City Building Engineering Company Ltd.` });
    const fallback = findFallbackSubcourse(id);
    if (!fallback) return res.status(404).render('404', { title: 'Not found', message: 'Course not found' });
    const category = findFallbackCategory(fallback.category_slug);
    res.render('subcourse', {
      course: { ...fallback, category_name: category?.name || fallback.category_name, category_slug: fallback.category_slug },
      title: `${fallback.name} Course - City Building Engineering`,
      metaDescription: `Learn ${fallback.name} at City Building Engineering in Kigali, Rwanda. Professional training course.`
    });
  } catch (err) {
    const fallback = findFallbackSubcourse(id);
    if (!fallback) return res.status(404).render('404', { title: 'Not found', message: 'Course not found' });
    const category = findFallbackCategory(fallback.category_slug);
    res.render('subcourse', {
      course: { ...fallback, category_name: category?.name || fallback.category_name, category_slug: fallback.category_slug },
      title: `${fallback.name} Course - City Building Engineering`,
      metaDescription: `Enroll in ${fallback.name} training in Kigali, Rwanda.`
    });
  }
});

router.post('/enquire', async (req, res, next) => {
  try {
    const { name, email, phone, message, course } = req.body;
    if (!name || !email) {
      return res.status(400).render('404', { title: 'Validation failed', message: 'Name and email are required.' });
    }
    await pool.query('INSERT INTO enquiries (name,email,phone,message) VALUES (?, ?, ?, ?)', [name, email, phone || '', message || '']);
    sendEnquiryNotification({ name, email, phone, message, course }).catch(e => {
      console.error('Failed to send enquiry notification:', e);
    });
    res.render('thankyou', { title: 'Thank you', name });
  } catch (err) {
    next(err);
  }
});

router.post('/certificate/contact', async (req, res, next) => {
  try {
    const { name, email, message, course } = req.body;
    if (!name || !email || !message) {
      return res.status(400).render('404', { title: 'Validation failed', message: 'Name, email and message are required.' });
    }
    await pool.query('INSERT INTO enquiries (name,email,phone,message) VALUES (?, ?, ?, ?)', [name, email, '', message || '']);
    sendEnquiryNotification({ name, email, phone: '', message, course: course || 'Certificate Request' }).catch(e => {
      console.error('Failed to send certificate request notification:', e);
    });
    res.render('thankyou', { title: 'Thank you', name });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
