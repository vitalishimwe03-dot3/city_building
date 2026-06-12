const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

const SECTIONS = [
  { value: 'hero', label: 'Homepage Hero Slider' },
  { value: 'about', label: 'About Background' },
  { value: 'services', label: 'Services' },
  { value: 'courses', label: 'Courses' },
  { value: 'internship', label: 'Internship' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'contact', label: 'Contact Background' },
  { value: 'footer', label: 'Footer Background' },
  { value: 'custom', label: 'Custom' }
];

module.exports = {
  async index(req, res) {
    try {
      const { section, search } = req.query;
      const images = await Image.findAll({ section, search });
      res.render('admin/images/index', {
        title: 'Site Images',
        currentPage: 'site-images',
        images,
        sections: SECTIONS,
        activeSection: section || '',
        search: search || ''
      });
    } catch (err) {
      console.error('Image index error:', err);
      res.status(500).render('admin/images/index', {
        title: 'Site Images', currentPage: 'site-images',
        images: [], sections: SECTIONS, activeSection: '', search: '',
        error: 'Failed to load images.'
      });
    }
  },

  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
      const { section, alt_text } = req.body;
      const image = await Image.create({
        section: section || 'custom',
        filename: req.file.filename,
        original_name: req.file.originalname,
        path: '/uploads/images/' + req.file.filename,
        alt_text: alt_text || '',
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        uploaded_by: req.session.adminUser?.id || null
      });
      res.json({ success: true, image });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Upload failed: ' + err.message });
    }
  },

  async uploadPage(req, res) {
    try {
      res.render('admin/images/upload', {
        title: 'Upload Image',
        currentPage: 'site-images',
        sections: SECTIONS,
        layout: false
      });
    } catch (err) {
      res.status(500).send('Error loading upload page');
    }
  },

  async toggle(req, res) {
    try {
      const image = await Image.findById(req.params.id);
      if (!image) return res.status(404).json({ error: 'Image not found' });
      await Image.update(image.id, { is_active: image.is_active ? 0 : 1 });
      res.json({ success: true, active: !image.is_active });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { alt_text, section } = req.body;
      await Image.update(req.params.id, { alt_text, section });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const image = await Image.findById(req.params.id);
      if (!image) return res.status(404).json({ error: 'Image not found' });
      const filePath = path.join(__dirname, '../../public', image.path);
      try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      await Image.delete(image.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
