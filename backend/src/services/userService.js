const { pool } = require('../config/db');

/**
 * Get user by ID
 */
exports.getUserById = async (userId) => {
  const connection = await pool.getConnection();

  try {
    const [users] = await connection.query(
      'SELECT id, email, username, bio, profile_image, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      throw new Error('사용자를 찾을 수 없습니다');
    }

    return users[0];
  } finally {
    connection.release();
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (userId, profileData) => {
  const connection = await pool.getConnection();

  try {
    const updates = [];
    const params = [];

    if (profileData.username) {
      updates.push('username = ?');
      params.push(profileData.username);
    }

    if (profileData.bio !== undefined) {
      updates.push('bio = ?');
      params.push(profileData.bio);
    }

    if (profileData.profile_image !== undefined) {
      updates.push('profile_image = ?');
      params.push(profileData.profile_image);
    }

    if (updates.length === 0) {
      throw new Error('업데이트할 정보가 없습니다');
    }

    params.push(userId);

    await connection.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    return true;
  } finally {
    connection.release();
  }
};
