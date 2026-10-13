const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const { protect, adminOnly, signToken } = require('../middleware/auth');

const userPayload = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
});

// POST /api/admin/register
// Allowed freely only when NO admin exists yet (first-run bootstrap).
// Afterwards it requires header "x-setup-key" matching ADMIN_SETUP_KEY.
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const adminCount = await User.countDocuments({ isAdmin: true });
    if (adminCount > 0) {
      const key = req.headers['x-setup-key'];
      if (!process.env.ADMIN_SETUP_KEY || key !== process.env.ADMIN_SETUP_KEY) {
        return res.status(403).json({ message: 'Admin registration is closed' });
      }
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const admin = await User.create({
      name: name || 'Admin',
      email,
      password,
      isAdmin: true,
    });

    res.status(201).json({ token: signToken(admin), user: userPayload(admin) });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({
      email: (email || '').toLowerCase(),
      isAdmin: true,
    }).select('+password');

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid admin email or password' });
    }

    res.json({ token: signToken(admin), user: userPayload(admin) });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/me
router.get('/me', protect, adminOnly, async (req, res) => {
  res.json({ user: userPayload(req.user) });
});

// GET /api/admin/stats -> dashboard numbers
router.get('/stats', protect, adminOnly, async (req, res, next) => {
  try {
    const [totalMovies, activeMovies, totalUsers, totalBookings] = await Promise.all([
      Movie.countDocuments(),
      Movie.countDocuments({ status: { $in: ['active', 'Now Showing'] } }),
      User.countDocuments({ isAdmin: false }),
      Booking.countDocuments(),
    ]);

    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      totalMovies,
      activeMovies,
      totalUsers,
      totalBookings,
      revenue: revenueAgg[0] ? revenueAgg[0].total : 0,
    });
  } catch (err) {
    next(err);
  }
});

// ---- users ---------------------------------------------------------
router.get('/users', protect, adminOnly, async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post('/users', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const exists = await User.findOne({ email: (email || '').toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({
      name: name || 'User',
      email,
      password,
      isAdmin: !!isAdmin,
    });
    res.status(201).json(userPayload(user));
  } catch (err) {
    next(err);
  }
});

router.put('/users/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, email, isAdmin, password } = req.body;
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.toLowerCase();
    if (isAdmin !== undefined) user.isAdmin = !!isAdmin;
    if (password) user.password = password; // re-hashed by the pre-save hook

    await user.save();
    res.json(userPayload(user));
  } catch (err) {
    next(err);
  }
});

router.delete('/users/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User removed' });
  } catch (err) {
    next(err);
  }
});

// ---- bookings ------------------------------------------------------
router.get('/bookings', protect, adminOnly, async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// ---- contact messages ---------------------------------------------
router.get('/messages', protect, adminOnly, async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
