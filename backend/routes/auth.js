const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, signToken } = require('../middleware/auth');

const userPayload = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const fullName =
      name || [firstName, lastName].filter(Boolean).join(' ').trim() || 'User';

    const user = await User.create({
      name: fullName,
      email,
      password,
      isAdmin: false,
    });

    res.status(201).json({
      token: signToken(user),
      user: userPayload(user),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: signToken(user),
      user: userPayload(user),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: userPayload(req.user) });
});

module.exports = router;
