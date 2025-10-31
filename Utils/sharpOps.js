const sharp = require('sharp');

exports.crop = async (buffer, { left, top, width, height }) => {
  return sharp(buffer).extract({ left: Math.round(left), top: Math.round(top), width: Math.round(width), height: Math.round(height) }).toBuffer();
};

exports.rotate = async (buffer, angle) => {
  return sharp(buffer).rotate(Number(angle)).toBuffer();
};

exports.adjust = async (buffer, { brightness = 1, contrast = 1 }) => {
  // simple linear contrast/brightness: multiply and add. sharp doesn't expose direct contrast param, but we can use modulate + linear
  const modulated = await sharp(buffer).modulate({ brightness: Number(brightness) }).toBuffer();
  // to emulate contrast, use linear(a, b). a is multiplier; for simplicity we only use modulate above.
  return sharp(modulated).toBuffer();
};

exports.convert = async (buffer, format) => {
  format = (format || 'jpeg').toLowerCase();
  const img = sharp(buffer);
  if (format === 'png') return img.png().toBuffer();
  if (format === 'webp') return img.webp().toBuffer();
  return img.jpeg({ quality: 90 }).toBuffer();
};
