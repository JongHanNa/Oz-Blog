const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * GET /api/comments/post/:postId
 * Get all comments for a post
 */
router.get('/post/:postId', commentController.getCommentsByPostId);

/**
 * POST /api/comments
 * Create new comment (requires authentication)
 */
router.post('/', authenticateToken, commentController.createComment);

/**
 * DELETE /api/comments/:id
 * Delete comment (requires authentication)
 */
router.delete('/:id', authenticateToken, commentController.deleteComment);

module.exports = router;
