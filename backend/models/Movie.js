const mongoose = require('mongoose');

const trailerSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    url: { type: String, default: '' },
    description: { type: String, default: '' },
    duration: { type: String, default: '' },
  },
  { _id: false }
);

/**
 * Movie. Mirrors the shape the React frontend already uses
 * (see src/data/movieData.js and the admin dashboard):
 * numeric `id`, poster/backdrop, genre, status, trailers, gallery, etc.
 */
const movieSchema = new mongoose.Schema(
  {
    // Numeric id used by the frontend routes (/movies/:id)
    id: { type: Number, unique: true, index: true },

    title: { type: String, required: true, trim: true },
    poster: { type: String, default: '' },
    backdrop: { type: String, default: '' },
    rating: { type: mongoose.Schema.Types.Mixed, default: 0 }, // "8.5" or 4.8
    genre: { type: String, default: '' },
    duration: { type: String, default: '' },
    director: { type: String, default: '' },
    cast: { type: [String], default: [] },
    synopsis: { type: String, default: '' },
    description: { type: String, default: '' },
    releaseDate: { type: String, default: '' },
    language: { type: String, default: 'English' },

    // 'Now Showing' | 'Coming Soon' | 'active' | 'upcoming'
    status: { type: String, default: 'Now Showing', index: true },
    screenings: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },

    // Uploaded image / trailer (base64 data URL or a URL)
    imageUrl: { type: String, default: '' },
    trailerUrl: { type: String, default: '' },

    trailers: { type: [trailerSchema], default: [] },
    gallery: { type: [String], default: [] },
    relatedImages: { type: [String], default: [] },

    addedBy: { type: String, default: 'Admin' },
    dateAdded: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-assign the next numeric id when creating a new movie
movieSchema.pre('validate', async function (next) {
  if (this.isNew && (this.id === undefined || this.id === null)) {
    const last = await this.constructor.findOne().sort({ id: -1 }).select('id');
    this.id = last && typeof last.id === 'number' ? last.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Movie', movieSchema);
