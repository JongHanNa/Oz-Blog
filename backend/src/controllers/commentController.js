const commentService = require('../services/commentService');

/**
 * GET /api/comments/post/:postId
 * Get all comments for a post
 */
exports.getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await commentService.getCommentsByPostId(parseInt(postId));

    res.json({
      success: true,
      data: { comments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/comments
 * Create new comment
 */
exports.createComment = async (req, res) => {
  try {
    const { content, post_id, parent_id } = req.body;

    if (!content || !post_id) {
      return res.status(400).json({
        success: false,
        error: '댓글 내용과 게시글 ID가 필요합니다',
      });
    }

    const commentId = await commentService.createComment(
      post_id,
      req.user.userId,
      content,
      parent_id || null
    );

    res.status(201).json({
      success: true,
      data: { commentId },
      message: '댓글이 작성되었습니다',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * DELETE /api/comments/:id
 * Delete comment
 */
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await commentService.deleteComment(parseInt(id), req.user.userId);

    res.json({
      success: true,
      message: '댓글이 삭제되었습니다',
    });
  } catch (error) {
    res.status(error.message === '권한이 없습니다' ? 403 : 500).json({
      success: false,
      error: error.message,
    });
  }
};
