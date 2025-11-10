const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken, optionalAuth } = require('../middlewares/authMiddleware');

/**
 * GET /api/posts
 * Get all posts (optional authentication for like/bookmark status)
 */
router.get('/', optionalAuth, postController.getAllPosts);

/**
 * GET /api/posts/:id
 * Get post by ID (optional authentication for like/bookmark status)
 */
router.get('/:id', optionalAuth, postController.getPostById);

/**
 * POST /api/posts
 * Create new post (requires authentication)
 */
router.post('/', authenticateToken, postController.createPost);

/**
 * PUT /api/posts/:id
 * Update post (requires authentication)
 */
router.put('/:id', authenticateToken, postController.updatePost);

/**
 * DELETE /api/posts/:id
 * Delete post (requires authentication)
 */
router.delete('/:id', authenticateToken, postController.deletePost);

module.exports = router;
