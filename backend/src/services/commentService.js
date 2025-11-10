const { pool } = require('../config/db');

/**
 * Get comments for a post (with nested structure)
 */
exports.getCommentsByPostId = async (postId) => {
  const connection = await pool.getConnection();

  try {
    // Get all comments for the post
    const [comments] = await connection.query(
      `SELECT c.*, u.username, u.profile_image
       FROM comments c
       INNER JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [postId]
    );

    // Build nested structure
    const commentMap = {};
    const topLevelComments = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;

      if (comment.parent_id === null) {
        topLevelComments.push(comment);
      } else if (commentMap[comment.parent_id]) {
        commentMap[comment.parent_id].replies.push(comment);
      }
    });

    return topLevelComments;
  } finally {
    connection.release();
  }
};

/**
 * Create new comment
 */
exports.createComment = async (postId, userId, content, parentId = null) => {
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query(
      'INSERT INTO comments (content, post_id, user_id, parent_id) VALUES (?, ?, ?, ?)',
      [content, postId, userId, parentId]
    );

    return result.insertId;
  } finally {
    connection.release();
  }
};

/**
 * Delete comment
 */
exports.deleteComment = async (commentId, userId) => {
  const connection = await pool.getConnection();

  try {
    // Check if user is the author
    const [comments] = await connection.query(
      'SELECT user_id FROM comments WHERE id = ?',
      [commentId]
    );

    if (comments.length === 0) {
      throw new Error('댓글을 찾을 수 없습니다');
    }

    if (comments[0].user_id !== userId) {
      throw new Error('권한이 없습니다');
    }

    // Delete comment (CASCADE will delete replies)
    await connection.query('DELETE FROM comments WHERE id = ?', [commentId]);

    return true;
  } finally {
    connection.release();
  }
};
