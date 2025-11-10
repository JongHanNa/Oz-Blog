const authService = require('../services/authService');

/**
 * POST /api/auth/signup
 * User signup
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validation
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        error: '이메일, 비밀번호, 사용자 이름을 모두 입력해주세요',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: '비밀번호는 6자 이상이어야 합니다',
      });
    }

    // Create user
    const result = await authService.signup(email, password, username);

    res.status(201).json({
      success: true,
      data: result,
      message: '회원가입이 완료되었습니다',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/auth/login
 * User login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: '이메일과 비밀번호를 입력해주세요',
      });
    }

    // Authenticate user
    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
      message: '로그인되었습니다',
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * GET /api/auth/me
 * Get current user info
 */
exports.getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.userId);

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
