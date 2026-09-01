const axios = require('axios');

async function analyzeJargon(text, subject = 'auto-detect') {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set in .env');
    }

    const prompt = `You are a medical jargon expert. Analyze this text and respond ONLY with valid JSON (absolutely NO markdown, NO code blocks, NO extra text):

{
  "summary": "One sentence summary",
  "key_points": ["point 1", "point 2"],
  "jargon": [{"term": "word", "meaning": "def", "alternatives": "other", "why": "reason", "exam_tip": "tip"}]
}

TEXT: "${text.substring(0, 800)}"`;

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

    let content = response.data.candidates[0].content.parts[0].text;
    
    // Remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    content = content.trim();
    
    // Try to parse JSON
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (parseError) {
      console.error('Parse error. Raw content:', content);
      // Return the raw content so we can see what went wrong
      return {
        summary: content.substring(0, 200),
        key_points: [],
        jargon: [],
        raw_response: content,
        error: 'Could not parse JSON from Gemini'
      };
    }
  } catch (error) {
    throw new Error('Jargon analysis failed: ' + error.message);
  }
}

module.exports = { analyzeJargon };
