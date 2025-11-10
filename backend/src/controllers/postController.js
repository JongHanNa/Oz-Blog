const postService = require('../services/postService');

/**
 * GET /api/posts
 * Get all posts with filters
 */
exports.getAllPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      search,
    } = req.query;

    const userId = req.user?.userId || null;

    const result = await postService.getAllPosts(
      parseInt(page),
      parseInt(limit),
      category,
      tag,
      search,
      userId
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * GET /api/posts/:id
 * Get post by ID
 */
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || null;

    const post = await postService.getPostById(parseInt(id), userId);

    res.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/posts
 * Create new post
 */
exports.createPost = async (req, res) => {
  try {
    const { title, content, thumbnail, category_id, tags } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: '제목과 내용을 입력해주세요',
      });
    }

    const postId = await postService.createPost(
      { title, content, thumbnail, category_id, tags },
      req.user.userId
    );

    res.status(201).json({
      success: true,
      data: { postId },
      message: '게시글이 작성되었습니다',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * PUT /api/posts/:id
 * Update post
 */
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, thumbnail, category_id, tags } = req.body;

    await postService.updatePost(
      parseInt(id),
      { title, content, thumbnail, category_id, tags },
      req.user.userId
    );

    res.json({
      success: true,
      message: '게시글이 수정되었습니다',
    });
  } catch (error) {
    res.status(error.message === '권한이 없습니다' ? 403 : 500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * DELETE /api/posts/:id
 * Delete post
 */
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await postService.deletePost(parseInt(id), req.user.userId);

    res.json({
      success: true,
      message: '게시글이 삭제되었습니다',
    });
  } catch (error) {
    res.status(error.message === '권한이 없습니다' ? 403 : 500).json({
      success: false,
      error: error.message,
    });
  }
};
