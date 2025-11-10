const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

/**
 * User Signup
 */
exports.signup = async (email, password, username) => {
  const connection = await pool.getConnection();

  try {
    // Check if email already exists
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      throw new Error('이미 사용 중인 이메일입니다');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user
    const [result] = await connection.query(
      'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
      [email, hashedPassword, username]
    );

    const userId = result.insertId;

    // Get created user (without password)
    const [users] = await connection.query(
      'SELECT id, email, username, bio, profile_image, created_at FROM users WHERE id = ?',
      [userId]
    );

    const user = users[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user };
  } finally {
    connection.release();
  }
};

/**
 * User Login
 */
exports.login = async (email, password) => {
  const connection = await pool.getConnection();

  try {
    // Find user by email
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // Remove password from user object
    delete user.password;

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user };
  } finally {
    connection.release();
  }
};

/**
 * Get current user info
 */
exports.getMe = async (userId) => {
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
