const express = require('express');
const multer = require('multer');
const { analyzeText, uploadPDF } = require('../controllers/analysisController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze-text', analyzeText);
router.post('/upload-pdf', upload.single('pdf'), uploadPDF);
router.get('/health', (req, res) => res.json({ status: 'OK' }));

module.exports = router;
