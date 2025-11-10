const userService = require('../services/userService');

/**
 * GET /api/users/:id
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(parseInt(id));

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * PUT /api/users/profile
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, profile_image } = req.body;

    await userService.updateProfile(req.user.userId, {
      username,
      bio,
      profile_image,
    });

    res.json({
      success: true,
      message: '프로필이 수정되었습니다',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
