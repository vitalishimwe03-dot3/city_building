const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const imageController = require('../controllers/imageController');
const { isAdminAuthenticated } = require('../middleware/auth');

router.use(isAdminAuthenticated);

router.get('/', imageController.index);
router.post('/upload', upload.single('image'), imageController.upload);
router.get('/upload-page', imageController.uploadPage);
router.post('/:id/toggle', imageController.toggle);
router.post('/:id/update', imageController.update);
router.post('/:id/delete', imageController.delete);

module.exports = router;
