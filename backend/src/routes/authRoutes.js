const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * POST /api/auth/signup
 * User signup
 */
router.post('/signup', authController.signup);

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', authController.login);

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
