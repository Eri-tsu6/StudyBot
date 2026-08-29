const { analyzeJargon } = require('../services/jargonAnalyzer');
const { extractTextFromPDF } = require('../services/pdfExtractor');

async function analyzeText(req, res) {
  try {
    const { text, subject } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await analyzeJargon(text, subject || 'auto-detect');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function uploadPDF(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const extracted = await extractTextFromPDF(req.file.buffer);
    const result = await analyzeJargon(extracted.text, 'auto-detect');
    
    res.json({
      file: req.file.originalname,
      pages: extracted.pages,
      analysis: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { analyzeText, uploadPDF };
