const express = require('express');
const router = express.Router();
const pool = require('../db');
const initDb = require('../models/initDb');
const { sendEnquiryNotification } = require('../email');

const fallbackCategories = [
  { id: 'architecture', name: 'Architecture', description: 'Architectural design and documentation software training', slug: 'architecture' },
  { id: 'structural-engineering', name: 'Structural Engineering', description: 'Structural analysis and design software training', slug: 'structural-engineering' },
  { id: 'geotechnical-engineering', name: 'Geotechnical Engineering', description: 'Soil analysis and geotechnical software training', slug: 'geotechnical-engineering' },
  { id: 'visualization-rendering', name: 'Visualization & Rendering', description: '3D visualization and rendering software training', slug: 'visualization-rendering' },
  { id: 'civil-engineering', name: 'Civil Engineering', description: 'Road design and GIS mapping software training', slug: 'civil-engineering' },
  { id: 'water-engineering', name: 'Water Engineering', description: 'Water distribution and hydraulic modeling software training', slug: 'water-engineering' },
  { id: 'training-services', name: 'Training Services', description: 'Professional training and internship programs', slug: 'training-services' },
  { id: 'career-development', name: 'Career Development', description: 'Career pathways for building professionals', slug: 'career-development' }
];

const fallbackSubcourses = [
  { id: 'revit', category_slug: 'architecture', category_name: 'Architecture', name: 'Revit', slug: 'revit', image: 'revit-logo.svg', description: 'Building Information Modeling (BIM) and architectural design', sub_category: 'Architectural Design' },
  { id: 'archicad', category_slug: 'architecture', category_name: 'Architecture', name: 'ArchiCAD', slug: 'archicad', image: 'archicad-logo.svg', description: 'Building design and documentation', sub_category: 'Architectural Design' },
  { id: 'sketchup', category_slug: 'architecture', category_name: 'Architecture', name: 'SketchUp', slug: 'sketchup', image: 'sketchup-logo.svg', description: '3D modeling and conceptual design', sub_category: 'Architectural Design' },
  { id: 'autocad', category_slug: 'architecture', category_name: 'Architecture', name: 'AutoCAD', slug: 'autocad', image: 'autocad-logo.svg', description: 'Technical drafting and drawing', sub_category: 'Architectural Design' },
  { id: 'prostructure', category_slug: 'structural-engineering', category_name: 'Structural Engineering', name: 'ProtaStructure', slug: 'prostructure', image: 'prostructure-logo.png', description: 'Structural design and analysis', sub_category: 'Structural Analysis' },
  { id: 'etabs', category_slug: 'structural-engineering', category_name: 'Structural Engineering', name: 'CSI ETABS', slug: 'etabs', image: 'csi-logo.svg', description: 'Analysis and design of buildings', sub_category: 'Structural Analysis' },
  { id: 'prokon', category_slug: 'structural-engineering', category_name: 'Structural Engineering', name: 'Prokon', slug: 'prokon', image: 'prokon-logo.png', description: 'Structural calculations and design', sub_category: 'Structural Analysis' },
  { id: 'robot-structure', category_slug: 'structural-engineering', category_name: 'Structural Engineering', name: 'Robot Structural Analysis', slug: 'robot-structure', image: 'robot-structure-logo.svg', description: 'Structural modeling and analysis', sub_category: 'Structural Analysis' },
  { id: 'csisafe', category_slug: 'structural-engineering', category_name: 'Structural Engineering', name: 'CSI Safe', slug: 'csisafe', image: 'csi-logo.svg', description: 'Foundation and slab design', sub_category: 'Foundation Design' },
  { id: 'csidetailer', category_slug: 'structural-engineering', category_name: 'Structural Engineering', name: 'CSI Detailer', slug: 'csidetailer', image: 'csi-logo.svg', description: 'Reinforcement detailing', sub_category: 'Detailing' },
  { id: 'csibridge', category_slug: 'structural-engineering', category_name: 'Structural Engineering', name: 'CSI Bridge', slug: 'csibridge', image: 'csi-logo.svg', description: 'Bridge analysis and design', sub_category: 'Bridge Design' },
  { id: 'plaxis-2d', category_slug: 'geotechnical-engineering', category_name: 'Geotechnical Engineering', name: 'Plaxis 2D', slug: 'plaxis-2d', image: 'plaxis-logo.png', description: 'Soil and foundation analysis', sub_category: 'Soil Analysis' },
  { id: 'plaxis-3d', category_slug: 'geotechnical-engineering', category_name: 'Geotechnical Engineering', name: 'Plaxis 3D', slug: 'plaxis-3d', image: 'plaxis-logo.png', description: 'Soil and foundation analysis', sub_category: 'Soil Analysis' },
  { id: 'lumion', category_slug: 'visualization-rendering', category_name: 'Visualization & Rendering', name: 'Lumion', slug: 'lumion', image: 'lumion-logo.svg', description: 'Realistic rendering and animations', sub_category: 'Architectural Visualization' },
  { id: 'twinmotion', category_slug: 'visualization-rendering', category_name: 'Visualization & Rendering', name: 'Twinmotion', slug: 'twinmotion', image: 'twinmotion-logo.svg', description: 'Real-time visualization', sub_category: 'Architectural Visualization' },
  { id: 'enscape', category_slug: 'visualization-rendering', category_name: 'Visualization & Rendering', name: 'Enscape', slug: 'enscape', image: 'enscape-logo.svg', description: 'Interactive rendering', sub_category: 'Architectural Visualization' },
  { id: 'vray', category_slug: 'visualization-rendering', category_name: 'Visualization & Rendering', name: 'V-Ray', slug: 'vray', image: 'vray-logo.svg', description: 'High-quality rendering', sub_category: 'Architectural Visualization' },
  { id: 'civil3d', category_slug: 'civil-engineering', category_name: 'Civil Engineering', name: 'Civil 3D', slug: 'civil3d', image: 'civil3d-logo.svg', description: 'Road and infrastructure design', sub_category: 'Road Design' },
  { id: 'arcgis', category_slug: 'civil-engineering', category_name: 'Civil Engineering', name: 'ArcGIS', slug: 'arcgis', image: 'arcgis-logo.svg', description: 'Geographic Information Systems (GIS)', sub_category: 'GIS Mapping' },
  { id: 'watercad', category_slug: 'water-engineering', category_name: 'Water Engineering', name: 'WaterCAD', slug: 'watercad', image: 'watercad-logo.svg', description: 'Water network design', sub_category: 'Water Distribution' },
  { id: 'watergem', category_slug: 'water-engineering', category_name: 'Water Engineering', name: 'WaterGEMS', slug: 'watergem', image: 'watergem-logo.svg', description: 'Water system modeling and management', sub_category: 'Water Distribution' },
  { id: 'short-courses', category_slug: 'training-services', category_name: 'Training Services', name: 'Short Courses', slug: 'short-courses', image: 'training-icon.svg', description: 'Engineering software training', sub_category: 'Professional Training' },
  { id: 'academic-internship', category_slug: 'training-services', category_name: 'Training Services', name: 'Academic Internship', slug: 'academic-internship', image: 'internship-icon.svg', description: 'Practical engineering experience', sub_category: 'Internship Program' },
  { id: 'architects', category_slug: 'career-development', category_name: 'Career Development', name: 'Architects', slug: 'architects', image: 'architect-icon.svg', description: 'Architecture profession', sub_category: 'Career Pathways' },
  { id: 'engineers', category_slug: 'career-development', category_name: 'Career Development', name: 'Engineers', slug: 'engineers', image: 'engineer-icon.svg', description: 'Engineering profession', sub_category: 'Career Pathways' },
  { id: 'designers', category_slug: 'career-development', category_name: 'Career Development', name: 'Designers', slug: 'designers', image: 'designer-icon.svg', description: 'Design profession', sub_category: 'Career Pathways' },
  { id: 'surveyors', category_slug: 'career-development', category_name: 'Career Development', name: 'Surveyors', slug: 'surveyors', image: 'surveyor-icon.svg', description: 'Surveying profession', sub_category: 'Career Pathways' }
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
  res.render('services', { title: 'Services', metaDescription: 'Explore our professional training services in architecture, structural engineering, geotechnical engineering, visualization & rendering, civil engineering, and water engineering at City Building Engineering.' });
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
