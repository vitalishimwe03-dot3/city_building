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

const fallbackTestimonials = [
  { student_name: 'Jean-Pierre Habimana', student_title: 'Revit Architecture Graduate', content: 'City Building Engineering gave me the practical Revit skills I needed to start my career in architectural design. The hands-on approach and industry-focused curriculum made all the difference.', rating: 5 },
  { student_name: 'Alice Mukamana', student_title: 'ETABS & Structural Design Student', content: 'The structural engineering courses are top-notch. I went from knowing nothing about ETABS to confidently analyzing building structures. Highly recommend for any aspiring engineer.', rating: 5 },
  { student_name: 'David Niyonzima', student_title: 'AutoCAD & Civil 3D Trainee', content: 'I completed the AutoCAD and Civil 3D training and immediately got an internship. The instructors are knowledgeable and the projects are real-world relevant.', rating: 5 },
  { student_name: 'Grace Uwimana', student_title: 'Lumion & Rendering Graduate', content: 'The visualization courses completely transformed my portfolio. I can now create stunning architectural renders that impress clients. Thank you City Building!', rating: 4 },
  { student_name: 'Patrick Mugisha', student_title: 'Full Stack Engineering Student', content: 'From Revit to Lumion, every course I\'ve taken here has been practical and career-focused. The internship placement support is the cherry on top.', rating: 5 }
];

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
    let testimonials = [];
    try {
      [testimonials] = await pool.query("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC LIMIT 10");
    } catch (_) {}
    if (!testimonials || testimonials.length === 0) {
      testimonials = fallbackTestimonials;
    }
    res.render('index', { categories, testimonials, title: 'City Building Engineering - Professional Software Training in Kigali, Rwanda', metaDescription: 'Enroll in professional software training courses in Kigali, Rwanda. Learn Revit, AutoCAD, ETABS, Lumion and more at City Building Engineering Company Ltd.', dbError: null });
  } catch (err) {
    res.render('index', {
      categories: fallbackCategories,
      testimonials: fallbackTestimonials,
      title: 'City Building Engineering - Professional Software Training',
      metaDescription: 'Professional software training for architecture, engineering, design careers in Kigali, Rwanda.',
      dbError: null
    });
  }
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us',
    metaDescription: 'Learn about City Building Engineering Company Ltd in Kigali, Rwanda. Discover our mission to provide career-ready software training for building professionals.',
    breadcrumbs: [{ name: 'Home', url: `${req.protocol}://${req.get('host')}/` }, { name: 'About Us', url: `${req.protocol}://${req.get('host')}/about` }]
  });
});

router.get('/services', (req, res) => {
  res.render('services', {
    title: 'Services',
    metaDescription: 'Explore our professional training services in architecture, structural engineering, geotechnical engineering, visualization & rendering, civil engineering, and water engineering at City Building Engineering.',
    breadcrumbs: [{ name: 'Home', url: `${req.protocol}://${req.get('host')}/` }, { name: 'Services', url: `${req.protocol}://${req.get('host')}/services` }]
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    metaDescription: 'Contact City Building Engineering Company Ltd in Kigali, Rwanda. Enroll in courses, ask questions, or visit our training center. WhatsApp: +250 789 257 758.',
    breadcrumbs: [{ name: 'Home', url: `${req.protocol}://${req.get('host')}/` }, { name: 'Contact Us', url: `${req.protocol}://${req.get('host')}/contact` }]
  });
});

router.get('/certificate', (req, res) => {
  res.render('certificate', {
    title: 'Certificate Program',
    metaDescription: 'Earn a recognized certificate from City Building Engineering Company Ltd upon completing our professional software training courses in Kigali.',
    breadcrumbs: [{ name: 'Home', url: `${req.protocol}://${req.get('host')}/` }, { name: 'Certificate Program', url: `${req.protocol}://${req.get('host')}/certificate` }]
  });
});

router.get('/career', (req, res) => {
  res.render('career', {
    title: 'Career Opportunities',
    metaDescription: 'Kickstart your career with City Building Engineering. Internship placement, job-ready training, and career support for architecture and engineering graduates in Rwanda.',
    breadcrumbs: [{ name: 'Home', url: `${req.protocol}://${req.get('host')}/` }, { name: 'Career', url: `${req.protocol}://${req.get('host')}/career` }]
  });
});

router.get('/faq', (req, res) => {
  const faqs = [
    { question: 'What courses does City Building Engineering offer?', answer: 'We offer professional software training in Revit, AutoCAD, ArchiCAD, SketchUp, ETABS, ProtaStructure, Prokon, CSI Safe, CSI Detailer, CSI Bridge, Robot Structural Analysis, Plaxis 2D & 3D, Lumion, Twinmotion, Enscape, V-Ray, Civil 3D, ArcGIS, WaterCAD, and WaterGEMS. Courses cover architecture, structural engineering, geotechnical engineering, visualization, civil engineering, and water engineering.' },
    { question: 'Where are you located?', answer: 'We are based in Kigali, Rwanda. Our training center is located in Kigali city. You can contact us via WhatsApp at +250 789 257 758 or email at citybuildingengineeringcompany@gmail.com for the exact location.' },
    { question: 'Who can enroll in your courses?', answer: 'Anyone with an interest in building design, engineering, or construction can enroll. Our courses are suitable for students, recent graduates, professionals looking to upskill, and career changers. No prior software experience is required for beginner courses.' },
    { question: 'Do you offer certificates upon completion?', answer: 'Yes, we provide recognized certificates upon successful completion of our courses. Our certificate program confirms your proficiency in the software and practical skills you have gained.' },
    { question: 'How long are the courses?', answer: 'Course duration varies by program. Short courses typically run 4-8 weeks, while comprehensive training programs may last 3-6 months. We offer flexible scheduling including weekend and evening classes.' },
    { question: 'What is the fee structure?', answer: 'Fees vary by course and program length. Please contact us via WhatsApp at +250 789 257 758 or email citybuildingengineeringcompany@gmail.com for current pricing and any available discounts or payment plans.' },
    { question: 'Do you offer online or in-person training?', answer: 'We offer blended learning options. Our primary training is in-person at our Kigali center for hands-on practical experience. Some theoretical components may be available online. Contact us for details.' },
    { question: 'Do you help with job placement after training?', answer: 'Yes, we provide internship placement support and career guidance. Our training is designed to be career-ready, and we partner with firms in Rwanda\'s construction and engineering sector to help graduates find opportunities.' },
    { question: 'What is the May 2026 intake?', answer: 'The May 2026 intake is our upcoming training cohort starting in May 2026. You can enroll now to secure your spot. Early registration is recommended as class sizes are limited for personalized attention.' },
    { question: 'What languages are courses taught in?', answer: 'Courses are taught in English and French. Our instructors are also proficient in Kinyarwanda to assist students who need clarification in the local language.' },
    { question: 'Can I get a refund if I am not satisfied?', answer: 'We offer a satisfaction guarantee. Contact us within the first week of your course start date to discuss any concerns. Refund and cancellation policies are available upon request.' },
    { question: 'Do you offer corporate training?', answer: 'Yes, we provide corporate training programs for engineering and construction firms. We can customize training to your team\'s specific software needs and project requirements. Contact us for corporate pricing.' },
    { question: 'What software versions do you teach?', answer: 'We teach the latest industry-standard versions of each software. Our curriculum is regularly updated to reflect current industry practices and software updates.' },
    { question: 'How do I enroll?', answer: 'You can enroll by contacting us via WhatsApp at +250 789 257 758, emailing citybuildingengineeringcompany@gmail.com, visiting our training center in Kigali, or filling out the enquiry form on our website.' },
    { question: 'Do you have weekend classes?', answer: 'Yes, we offer weekend classes for working professionals who cannot attend weekday sessions. Contact us for the current schedule of weekend programs.' },
    { question: 'What is the student-to-instructor ratio?', answer: 'We maintain small class sizes with a typical ratio of 10-15 students per instructor to ensure personalized attention and hands-on guidance.' },
    { question: 'Do I need my own laptop?', answer: 'We have computer labs equipped with all necessary software. However, if you prefer to use your own laptop, we can provide guidance on software installation and system requirements.' },
    { question: 'What is the Academic Internship program?', answer: 'Our Academic Internship program provides practical engineering experience for students and recent graduates. It combines software training with real project work under professional supervision.' },
    { question: 'Do you offer courses for complete beginners?', answer: 'Absolutely. Our beginner courses start from the basics and gradually build up to advanced concepts. No prior experience is required for entry-level courses.' },
    { question: 'How do I contact support if I have more questions?', answer: 'You can reach us via WhatsApp at +250 789 257 758, email at citybuildingengineeringcompany@gmail.com, or through the contact form on our website. We typically respond within 24 hours.' },
    { question: 'What is BIM and why is it important?', answer: 'BIM (Building Information Modeling) is a digital representation of physical and functional characteristics of buildings. It is the industry standard for modern architectural and engineering design, enabling better collaboration, visualization, and project management.' },
    { question: 'Is your training recognized by employers?', answer: 'Yes, our training is designed in consultation with industry professionals and follows current market practices. Our certificates are recognized by employers in Rwanda\'s construction and engineering sector.' },
    { question: 'Can I switch courses after enrolling?', answer: 'Yes, you can discuss course changes with our enrollment team within the first week of your course start date. We will help find the best fit for your learning goals.' },
    { question: 'What areas of engineering do you cover?', answer: 'We cover architecture, structural engineering, geotechnical engineering, civil engineering, water engineering, and visualization and rendering. Our courses span the full range of building design and construction software.' },
    { question: 'Do you offer advanced courses for experienced professionals?', answer: 'Yes, we have advanced modules for experienced professionals looking to specialize or update their skills in specific software or workflows.' },
    { question: 'What is the application deadline?', answer: 'We accept rolling admissions throughout the year. For the May 2026 intake, we recommend applying at least 2-3 weeks before the start date to ensure your spot and complete any preparatory steps.' },
    { question: 'Can I visit the training center before enrolling?', answer: 'Yes, we welcome prospective students to visit our training center in Kigali. Contact us to schedule a visit and see our facilities, meet instructors, and learn more about our programs.' },
    { question: 'What payment methods do you accept?', answer: 'We accept mobile money, bank transfers, and cash payments. Contact us for specific payment details and any available installment plans.' },
    { question: 'Do you offer discounts for group enrollments?', answer: 'Yes, we offer special rates for group enrollments and corporate teams. Contact us for a customized quote based on your group size and training needs.' },
    { question: 'What makes City Building Engineering different from other training providers?', answer: 'We combine industry expertise with hands-on project-based learning, internship placement support, small class sizes, experienced instructors, and a curriculum that reflects real Rwandan and international building industry requirements.' }
  ];
  res.render('faq', {
    title: 'Frequently Asked Questions - City Building Engineering',
    metaDescription: 'Find answers to common questions about City Building Engineering courses, enrollment, fees, certificates, and training programs in Kigali, Rwanda.',
    faqs,
    faqSchema: faqs.map(f => ({ question: f.question.replace(/"/g, '\\"'), answer: f.answer.replace(/"/g, '\\"') })),
    breadcrumbs: [{ name: 'Home', url: `${req.protocol}://${req.get('host')}/` }, { name: 'FAQ', url: `${req.protocol}://${req.get('host')}/faq` }]
  });
});

router.get('/internship', (req, res) => {
  res.render('internship', {
    title: 'Academic Internship Program - City Building Engineering',
    metaDescription: 'Join City Building Engineering\'s Academic Internship Program in Kigali, Rwanda. Gain practical engineering experience with professional software training and real project work.',
    breadcrumbs: [{ name: 'Home', url: `${req.protocol}://${req.get('host')}/` }, { name: 'Internship', url: `${req.protocol}://${req.get('host')}/internship` }]
  });
});

router.get('/category/:slug', async (req, res, next) => {
  const slug = req.params.slug;
  const base = `${req.protocol}://${req.get('host')}`;
  try {
    const [[category]] = await pool.query('SELECT id,name,description FROM categories WHERE slug=? LIMIT 1', [slug]);
    if (!category) throw new Error('Category not found');
    const [subs] = await pool.query('SELECT * FROM subcourses WHERE category_id=?', [category.id]);
    res.render('category', { category, subcourses: subs, title: `${category.name} - City Building Engineering`, metaDescription: `Browse ${category.name} courses at City Building Engineering in Kigali. Professional software training for ${category.description?.toLowerCase() || 'building professionals'}.`, breadcrumbs: [{ name: 'Home', url: base + '/' }, { name: category.name, url: base + '/category/' + slug }] });
  } catch (err) {
    const category = findFallbackCategory(slug);
    if (!category) return res.status(404).render('404', { title: 'Not found', message: 'Category not found' });
    const subs = getFallbackSubcourses(slug);
    res.render('category', { category, subcourses: subs, title: `${category.name} - City Building Engineering`, metaDescription: `Explore ${category.name} training courses in Kigali, Rwanda.`, breadcrumbs: [{ name: 'Home', url: base + '/' }, { name: category.name, url: base + '/category/' + slug }] });
  }
});

router.get('/course/:id', async (req, res, next) => {
  const id = req.params.id;
  const base = `${req.protocol}://${req.get('host')}`;
  try {
    const [[course]] = await pool.query('SELECT s.*, c.name as category_name, c.slug as category_slug FROM subcourses s JOIN categories c ON s.category_id=c.id WHERE s.id=? LIMIT 1', [id]);
    if (course) {
      const courseSchema = { name: course.name, description: (course.description || 'Professional software training course').replace(/"/g, '\\"'), teaches: (course.sub_category || course.name).replace(/"/g, '\\"'), audience: (course.category_name || 'Building Professionals').replace(/"/g, '\\"') };
      return res.render('subcourse', { course, courseSchema, title: `${course.name} Course - City Building Engineering`, metaDescription: `Enroll in ${course.name} training in Kigali. ${course.description || 'Professional software course with hands-on training.'} City Building Engineering Company Ltd.`, breadcrumbs: [{ name: 'Home', url: base + '/' }, { name: course.category_name, url: base + '/category/' + course.category_slug }, { name: course.name + ' Course', url: base + '/course/' + course.id }] });
    }
    const fallback = findFallbackSubcourse(id);
    if (!fallback) return res.status(404).render('404', { title: 'Not found', message: 'Course not found' });
    const category = findFallbackCategory(fallback.category_slug);
    const fbCourse = { ...fallback, category_name: category?.name || fallback.category_name, category_slug: fallback.category_slug };
    const courseSchema = { name: fbCourse.name, description: (fbCourse.description || 'Professional software training course').replace(/"/g, '\\"'), teaches: (fbCourse.sub_category || fbCourse.name).replace(/"/g, '\\"'), audience: (fbCourse.category_name || 'Building Professionals').replace(/"/g, '\\"') };
    res.render('subcourse', {
      course: fbCourse,
      courseSchema,
      title: `${fallback.name} Course - City Building Engineering`,
      metaDescription: `Learn ${fallback.name} at City Building Engineering in Kigali, Rwanda. Professional training course.`,
      breadcrumbs: [{ name: 'Home', url: base + '/' }, { name: fbCourse.category_name, url: base + '/category/' + fbCourse.category_slug }, { name: fallback.name + ' Course', url: base + '/course/' + id }]
    });
  } catch (err) {
    const fallback = findFallbackSubcourse(id);
    if (!fallback) return res.status(404).render('404', { title: 'Not found', message: 'Course not found' });
    const category = findFallbackCategory(fallback.category_slug);
    const fbCourse = { ...fallback, category_name: category?.name || fallback.category_name, category_slug: fallback.category_slug };
    const courseSchema = { name: fbCourse.name, description: (fbCourse.description || 'Professional software training course').replace(/"/g, '\\"'), teaches: (fbCourse.sub_category || fbCourse.name).replace(/"/g, '\\"'), audience: (fbCourse.category_name || 'Building Professionals').replace(/"/g, '\\"') };
    res.render('subcourse', {
      course: fbCourse,
      courseSchema,
      title: `${fallback.name} Course - City Building Engineering`,
      metaDescription: `Enroll in ${fallback.name} training in Kigali, Rwanda.`,
      breadcrumbs: [{ name: 'Home', url: base + '/' }, { name: fbCourse.category_name, url: base + '/category/' + fbCourse.category_slug }, { name: fallback.name + ' Course', url: base + '/course/' + id }]
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
