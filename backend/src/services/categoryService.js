const { pool } = require('../config/db');

/**
 * Get all categories
 */
exports.getAllCategories = async () => {
  const connection = await pool.getConnection();

  try {
    const [categories] = await connection.query(
      'SELECT * FROM categories ORDER BY name'
    );

    return categories;
  } finally {
    connection.release();
  }
};
