const categoryService = require('../services/categoryService');

/**
 * GET /api/categories
 * Get all categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
