const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Handle the case where token is the literal string "undefined"
  if (token === 'undefined') {
    token = null;
  }

  if (!token) {
    return res.status(401).json({
      error: 'No token, authorization denied'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message, "Token value:", token);
    return res.status(400).json({
      error: 'Token is not valid'
    });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin resource. Access denied.' });
    }
    next();
  });
};

module.exports = { auth, adminAuth };
