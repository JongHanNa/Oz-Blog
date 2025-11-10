const interactionService = require('../services/interactionService');

/**
 * POST /api/interactions/like/:postId
 * Toggle like on post
 */
exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await interactionService.toggleLike(
      parseInt(postId),
      req.user.userId
    );

    res.json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/interactions/bookmark/:postId
 * Toggle bookmark on post
 */
exports.toggleBookmark = async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await interactionService.toggleBookmark(
      parseInt(postId),
      req.user.userId
    );

    res.json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
