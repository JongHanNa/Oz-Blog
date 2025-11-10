const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', userController.getUserById);

/**
 * PUT /api/users/profile
 * Update user profile (requires authentication)
 */
router.put('/profile', authenticateToken, userController.updateProfile);

module.exports = router;
