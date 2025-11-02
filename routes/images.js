const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerMemory');
const { protect } = require('../middleware/auth');
const imgCtrl = require('../controllers/imageController');

// upload (authenticated)
router.post('/upload', protect, upload.single('image'), imgCtrl.upload);

// crop, rotate, adjust, convert - authenticated
router.post('/crop', protect, upload.single('image'), imgCtrl.crop);
router.post('/rotate', protect, upload.single('image'), imgCtrl.rotate);
router.post('/adjust', protect, upload.single('image'), imgCtrl.adjust);
router.post('/convert', protect, upload.single('image'), imgCtrl.convert);

// ML work
router.post('/find-object', protect, upload.single('image'), imgCtrl.findObject);
router.post('/extract-text', protect, upload.single('image'), imgCtrl.textExtractor);
router.post('/magic-brush', protect, upload.single('image'), imgCtrl.magicBrush);

module.exports = router;
