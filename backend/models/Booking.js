const mongoose = require('mongoose');

/**
 * A ticket booking created from the frontend ticket page.
 */
const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
    customerName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },

    movieId: { type: Number, required: true, index: true },
    movieTitle: { type: String, default: '' },

    date: { type: String, default: '' },
    time: { type: String, default: '' },
    seats: { type: [String], default: [] },
    ticketCount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    status: { type: String, default: 'confirmed' }, // confirmed | cancelled
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
