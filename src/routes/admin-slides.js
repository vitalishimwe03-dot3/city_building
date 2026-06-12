const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController');
const { isAdminAuthenticated } = require('../middleware/auth');

router.use(isAdminAuthenticated);

router.get('/', slideController.index);
router.post('/', slideController.create);
router.post('/reorder', slideController.reorder);
router.post('/:id', slideController.update);
router.post('/:id/toggle', slideController.toggle);
router.post('/:id/delete', slideController.delete);

module.exports = router;
