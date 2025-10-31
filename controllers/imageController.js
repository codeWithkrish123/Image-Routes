const cloudinary = require('../config/cloudinary');
const Image = require('../model/Image');
const sharpOps = require('../Utils/sharpOps');

// helper to upload buffer to cloudinary using upload_stream
const uploadBufferToCloudinary = (buffer, folder = 'fotofix') => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder },
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
  );
  stream.end(buffer);
});

exports.upload = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No file' });
    const result = await uploadBufferToCloudinary(req.file.buffer);
    const img = await Image.create({
      owner: req.user ? req.user._id : null,
      public_id: result.public_id,
      url: result.secure_url,
      original_filename: req.file.originalname,
      content_type: req.file.mimetype,
      width: result.width,
      height: result.height,
      meta: result
    });
    res.json({ image: img });
  } catch (err) { next(err); }
};

// crop
exports.crop = async (req, res, next) => {
  try {
    const { x, y, width, height } = req.body; // pixels
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No file' });
    const outBuffer = await sharpOps.crop(req.file.buffer, { left: x, top: y, width, height });
    const result = await uploadBufferToCloudinary(outBuffer);
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) { next(err); }
};

// rotate
exports.rotate = async (req, res, next) => {
  try {
    const { angle } = req.body; // degrees
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No file' });
    const outBuffer = await sharpOps.rotate(req.file.buffer, angle || 0);
    const result = await uploadBufferToCloudinary(outBuffer);
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) { next(err); }
};

// adjust brightness/contrast (simple exposure and contrast via linear)
exports.adjust = async (req, res, next) => {
  try {
    const { brightness = 1, contrast = 1 } = req.body; // brightness: multiplier, contrast: multiplier
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No file' });
    const outBuffer = await sharpOps.adjust(req.file.buffer, { brightness: Number(brightness), contrast: Number(contrast) });
    const result = await uploadBufferToCloudinary(outBuffer);
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) { next(err); }
};

// convert format
exports.convert = async (req, res, next) => {
  try {
    const { format } = req.body; // 'png', 'jpeg', 'webp'
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No file' });
    const outBuffer = await sharpOps.convert(req.file.buffer, format || 'jpeg');
    const result = await uploadBufferToCloudinary(outBuffer);
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) { next(err); }
};

// placeholders for find-object and text-extractor and magic-brush
exports.findObject = async (req, res) => {
  // placeholder: in future integrate object-detection model or service
  res.json({ message: 'findObject: placeholder - integrate model or external API' });
};

exports.textExtractor = async (req, res) => {
  // placeholder: integrate OCR like Tesseract or external OCR API
  res.json({ message: 'textExtractor: placeholder - integrate OCR service' });
};

exports.magicBrush = async (req, res) => {
  // placeholder for smart edit
  res.json({ message: 'magicBrush: placeholder - integrate editing AI in future' });
};
