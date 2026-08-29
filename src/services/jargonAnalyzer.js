const axios = require('axios');

async function analyzeJargon(text, subject = 'auto-detect') {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set in .env');
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: `Analyze this text for jargon terms. Return ONLY valid JSON with: {jargon: [{term, subject, meaning, alternatives, why, exam_tip}], summary: "", key_points: []}. Text: "${text.substring(0, 1000)}"`
          }]
        }]
      },
      { headers: { 'Content-Type': 'application/json' }}
    );

    const content = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(content);
  } catch (error) {
    throw new Error('Jargon analysis failed: ' + error.message);
  }
}

module.exports = { analyzeJargon };
