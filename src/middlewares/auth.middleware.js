const jwt = require('jsonwebtoken');

// Xác thực JWT
exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.locals.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
exports.authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded;

      console.log("🔐 [Authenticate] Token OK");
      console.log("👤 [Authenticate] user:", res.locals.user);
    } else {
      req.user = null;
      res.locals.user = null;
    }

  } catch (err) {
    console.error("❌ Token invalid:", err.message);
    req.user = null;
    res.locals.user = null;
  }

  next();
};

// Kiểm tra vai trò
exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
  };
};
