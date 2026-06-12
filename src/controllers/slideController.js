const Slide = require('../models/Slide');
const Image = require('../models/Image');

module.exports = {
  async index(req, res) {
    try {
      const slides = await Slide.findAll();
      const images = await Image.findAll({ is_active: true, section: 'hero' });
      res.render('admin/slides/index', {
        title: 'Hero Slideshow',
        currentPage: 'hero-slides',
        slides,
        images
      });
    } catch (err) {
      console.error('Slide index error:', err);
      res.status(500).render('admin/slides/index', {
        title: 'Hero Slideshow', currentPage: 'hero-slides',
        slides: [], images: [],
        error: 'Failed to load slides.'
      });
    }
  },

  async create(req, res) {
    try {
      const data = {
        title: req.body.title || '',
        description: req.body.description || '',
        image_id: req.body.image_id || null,
        image_path: req.body.image_path || '',
        link_url: req.body.link_url || '',
        btn_text: req.body.btn_text || '',
        animation: req.body.animation || 'fade',
        display_order: parseInt(req.body.display_order) || 0,
        is_active: req.body.is_active !== undefined ? (req.body.is_active === '1' || req.body.is_active === true ? 1 : 0) : 1,
        auto_play: req.body.auto_play !== undefined ? (req.body.auto_play === '1' || req.body.auto_play === true ? 1 : 0) : 1,
        transition_speed: parseInt(req.body.transition_speed) || 5000
      };
      const slide = await Slide.create(data);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({ success: true, slide });
      }
      res.redirect('/admin/slides');
    } catch (err) {
      console.error('Slide create error:', err);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.status(500).json({ error: err.message });
      }
      res.redirect('/admin/slides?error=' + encodeURIComponent('Failed to create slide: ' + err.message));
    }
  },

  async update(req, res) {
    try {
      const slide = await Slide.findById(req.params.id);
      if (!slide) return res.status(404).json({ error: 'Slide not found' });
      const data = {};
      ['title', 'description', 'image_id', 'image_path', 'link_url', 'btn_text', 'animation'].forEach(f => {
        if (req.body[f] !== undefined) data[f] = req.body[f];
      });
      if (req.body.display_order !== undefined) data.display_order = parseInt(req.body.display_order);
      if (req.body.transition_speed !== undefined) data.transition_speed = parseInt(req.body.transition_speed);
      if (req.body.is_active !== undefined) data.is_active = (req.body.is_active === '1' || req.body.is_active === true) ? 1 : 0;
      if (req.body.auto_play !== undefined) data.auto_play = (req.body.auto_play === '1' || req.body.auto_play === true) ? 1 : 0;
      await Slide.update(slide.id, data);

      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({ success: true });
      }
      res.redirect('/admin/slides');
    } catch (err) {
      console.error('Slide update error:', err);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.status(500).json({ error: err.message });
      }
      res.redirect('/admin/slides?error=' + encodeURIComponent(err.message));
    }
  },

  async toggle(req, res) {
    try {
      const slide = await Slide.findById(req.params.id);
      if (!slide) return res.status(404).json({ error: 'Slide not found' });
      await Slide.update(slide.id, { is_active: slide.is_active ? 0 : 1 });
      res.json({ success: true, active: !slide.is_active });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const slide = await Slide.findById(req.params.id);
      if (!slide) return res.status(404).json({ error: 'Slide not found' });
      await Slide.delete(slide.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async reorder(req, res) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' });
      await Slide.reorder(ids);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
