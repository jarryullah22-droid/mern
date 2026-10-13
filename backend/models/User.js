const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User / Admin account. `isAdmin` flags an admin account, so a single
 * collection can serve both the customer login and the admin panel.
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash the password before saving (only when it changed)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
