const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  public_id: { type: String, required: true },
  url: { type: String, required: true },
  original_filename: { type: String },
  content_type: { type: String },
  width: Number,
  height: Number,
  meta: Object
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);