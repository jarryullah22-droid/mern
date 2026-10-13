const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify a JWT from the "Authorization: Bearer <token>" header and
 * attach the matching user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;
    const header = req.headers.authorization || '';

    if (header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * Allow only admins (must be used after `protect`).
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  return res.status(403).json({ message: 'Admin access required' });
};

/**
 * Sign a JWT for a user document.
 */
const signToken = (user) =>
  jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = { protect, adminOnly, signToken };
