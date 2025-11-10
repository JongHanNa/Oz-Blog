const { pool } = require('../config/db');

/**
 * Toggle like on post
 */
exports.toggleLike = async (postId, userId) => {
  const connection = await pool.getConnection();

  try {
    // Check if already liked
    const [existing] = await connection.query(
      'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existing.length > 0) {
      // Unlike
      await connection.query(
        'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );

      return { liked: false, message: '좋아요를 취소했습니다' };
    } else {
      // Like
      await connection.query(
        'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );

      return { liked: true, message: '좋아요를 눌렀습니다' };
    }
  } finally {
    connection.release();
  }
};

/**
 * Toggle bookmark on post
 */
exports.toggleBookmark = async (postId, userId) => {
  const connection = await pool.getConnection();

  try {
    // Check if already bookmarked
    const [existing] = await connection.query(
      'SELECT * FROM bookmarks WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existing.length > 0) {
      // Remove bookmark
      await connection.query(
        'DELETE FROM bookmarks WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );

      return { bookmarked: false, message: '북마크를 취소했습니다' };
    } else {
      // Add bookmark
      await connection.query(
        'INSERT INTO bookmarks (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );

      return { bookmarked: true, message: '북마크에 추가했습니다' };
    }
  } finally {
    connection.release();
  }
};
