const axios = require('axios');

async function analyzeJargon(text, subject = 'auto-detect') {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not set in .env');
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-opus-4-1',
        max_tokens: 9999,
        messages: [{
          role: 'user',
          content: `Analyze this text for jargon terms. Return ONLY JSON with: {jargon: [{term, subject, meaning, alternatives, why, exam_tip}], summary: "", key_points: []}. Text: "${text.substring(0, 1000)}"`
        }]
      },
      { headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }}
    );

    return JSON.parse(response.data.content[0].text);
  } catch (error) {
    throw new Error('Jargon analysis failed: ' + error.message);
  }
}

module.exports = { analyzeJargon };
