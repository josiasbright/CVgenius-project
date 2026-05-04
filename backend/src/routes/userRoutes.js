const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
router.get('/profile', requireAuth, UserController.getProfile);
router.post('/avatar', requireAuth, upload.single('photo'), UserController.uploadAvatar);

module.exports = router;