// User model for authentication and password reset

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 days)
  this.resetPasswordExpire = Date.now() + 10 * 24 * 60 * 60 * 1000;

  return resetToken;
};

// Hash password before saving to database
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  next();
});

module.exports = mongoose.model('User', UserSchema);
