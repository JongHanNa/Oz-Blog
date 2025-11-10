const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
exports.authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: '인증 토큰이 필요합니다',
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: '유효하지 않은 토큰입니다',
        });
      }

      // Attach user info to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: '인증 처리 중 오류가 발생했습니다',
    });
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user info if token exists, but doesn't require it
 */
exports.optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err) {
          req.user = decoded;
        }
      });
    }

    next();
  } catch (error) {
    next();
  }
};
