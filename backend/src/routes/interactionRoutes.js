const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * POST /api/interactions/like/:postId
 * Toggle like on post (requires authentication)
 */
router.post('/like/:postId', authenticateToken, interactionController.toggleLike);

/**
 * POST /api/interactions/bookmark/:postId
 * Toggle bookmark on post (requires authentication)
 */
router.post('/bookmark/:postId', authenticateToken, interactionController.toggleBookmark);

module.exports = router;
