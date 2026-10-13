const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact -> submit a contact message
router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: 'name, email and message are required' });
    }

    const saved = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message received', contact: saved });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
