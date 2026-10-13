const mongoose = require('mongoose');

/**
 * A message submitted from the Contact page.
 */
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    handled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
