const multer = require('multer');

// store in memory to feed sharp / cloudinary upload stream
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

module.exports = upload;