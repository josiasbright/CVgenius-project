const express = require('express');
const router = express.Router();
const CvController = require('../controllers/cvController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', requireAuth, CvController.getAll);
router.get('/:id', requireAuth, CvController.getOne);
router.post('/', requireAuth, CvController.create);
router.put('/:id', requireAuth, CvController.update);
router.delete('/:id', requireAuth, CvController.delete);
router.post('/:id/share', requireAuth, CvController.share);
router.post('/:id/private', requireAuth, CvController.makePrivate);

module.exports = router;