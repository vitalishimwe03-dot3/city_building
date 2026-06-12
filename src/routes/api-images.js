const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const Slide = require('../models/Slide');

router.get('/images/:section', async (req, res) => {
  try {
    const images = await Image.findAll({ section: req.params.section, is_active: true });
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/slides', async (req, res) => {
  try {
    const slides = await Slide.findAll({ is_active: true });
    const result = slides.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      image: s.image_path || s.image_path_resolved || '',
      image_alt: s.image_alt || s.title || '',
      link_url: s.link_url,
      btn_text: s.btn_text,
      animation: s.animation,
      display_order: s.display_order,
      auto_play: s.auto_play,
      transition_speed: s.transition_speed
    }));
    res.json({ success: true, slides: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
