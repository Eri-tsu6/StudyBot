const axios = require('axios');

async function analyzeJargon(text, subject = 'auto-detect') {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set in .env');
    }

    const prompt = `Analyze this text for jargon terms. You MUST respond with ONLY valid JSON (no markdown, no code blocks):
{
  "summary": "Brief summary of the text in 1-2 sentences",
  "key_points": ["point1", "point2", "point3"],
  "jargon": [
    {
      "term": "word",
      "meaning": "definition",
      "alternatives": "other words",
      "why": "why this word is used",
      "exam_tip": "exam advice"
    }
  ]
}

TEXT: "${text.substring(0, 1000)}"`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      { headers: { 'Content-Type': 'application/json' }}
    );

    const content = response.data.candidates[0].content.parts[0].text;
    
    // Try to parse the JSON response
    try {
      return JSON.parse(content);
    } catch (parseError) {
      // If parsing fails, return the raw content for debugging
      return {
        summary: content.substring(0, 200),
        key_points: [],
        jargon: [],
        raw_response: content
      };
    }
  } catch (error) {
    throw new Error('Jargon analysis failed: ' + error.message);
  }
}

module.exports = { analyzeJargon };
