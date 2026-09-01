const axios = require('axios');

async function analyzeJargon(text, subject = 'auto-detect') {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: `Analyze jargon in this text. Return ONLY JSON:
{"summary":"brief summary","key_points":["point1"],"jargon":[{"term":"word","meaning":"def","alternatives":"other","why":"reason","exam_tip":"tip"}]}

TEXT: ${text.substring(0, 500)}`
          }]
        }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    let content = response.data.candidates[0].content.parts[0].text;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(content);
    return parsed.jargon && parsed.jargon.length > 0 ? parsed : { summary: "Analysis complete", key_points: [], jargon: parsed.jargon || [] };
  } catch (error) {
    throw new Error('Analysis failed: ' + error.message);
  }
}

module.exports = { analyzeJargon };
