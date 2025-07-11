const axios = require('axios');
const ContentProfile = require('../models/ContentProfile');
const fs = require('fs');

// TEXT & IMAGE GENERATION
exports.generateContent = async (req, res) => {
  try {
    const { contentType, tone = 'neutral', colors = '', tags = '', numberOfPosts = 1, keywords = '' } = req.body;

    const profile = await ContentProfile.findOne({ user: req.user.userId });
    if (!profile) return res.status(404).json({ message: 'Content profile not found' });

    if (contentType === 'Image') {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/prompthero/openjourney',
        {
          inputs: `${keywords}, ${profile.companyName}, ${profile.services}, tone: ${tone}, colors: ${colors}`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
          },
          responseType: 'arraybuffer'
        }
      );

      const imageBase64 = Buffer.from(response.data).toString('base64');
      return res.json({ image: `data:image/png;base64,${imageBase64}` });
    }

    const prompt = `Create ${numberOfPosts} ${contentType.toLowerCase()}${numberOfPosts > 1 ? 's' : ''} for a business called "${profile.companyName}" offering ${profile.services}. Tone: ${tone}. Keywords: ${keywords}. Colors: ${colors}. Tags: ${tags}`;

    const textResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a marketing expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = textResponse.data.choices[0].message.content;
    return res.json({ content });
  } catch (err) {
    console.error('❌ Error generating content:', err?.response?.data || err.message);
    res.status(500).json({ message: 'Error generating content' });
  }
};

// MARKETING PLANNER
exports.generateMarketingPlan = async (req, res) => {
  try {
    const { month, year, focus } = req.body;

    const profile = await ContentProfile.findOne({ user: req.user.userId });
    if (!profile) return res.status(404).json({ message: 'Content profile not found' });

    const prompt = `Create a monthly marketing plan for "${profile.companyName}" offering ${profile.services}. Month: ${month} ${year}. Focus: ${focus || 'general engagement'}.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a marketing strategist.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    return res.json({ content });
  } catch (err) {
    console.error('❌ Error generating marketing plan:', err?.response?.data || err.message);
    res.status(500).json({ message: 'Error generating plan' });
  }
};

// STRATEGY ASSISTANT
exports.generateStrategy = async (req, res) => {
  try {
    const { platform, industry, from, to } = req.body;

    const profile = await ContentProfile.findOne({ user: req.user.userId });
    if (!profile) return res.status(404).json({ message: 'Content profile not found' });

    const prompt = `Analyze social media trends and competitor content for "${industry}" businesses on ${platform}, from ${from} to ${to}. Generate a strategy and content calendar for "${profile.companyName}".`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a social media strategist and trend analyst.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1200
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const strategy = response.data.choices[0].message.content;
    return res.json({ strategy });
  } catch (err) {
    console.error('❌ Error generating strategy:', err?.response?.data || err.message);
    res.status(500).json({ message: 'Error generating strategy' });
  }
};

// PROFILE SETUP
exports.saveContentProfile = async (req, res) => {
  try {
    const { companyName, services, brandColors, brandNotes } = req.body;
    const logoPath = req.files?.logo?.[0]?.path || null;
    const guidelinesPath = req.files?.guidelines?.[0]?.path || null;
    const products = req.body.products ? JSON.parse(req.body.products) : [];

    const updatedProfile = await ContentProfile.findOneAndUpdate(
      { user: req.user.userId },
      {
        companyName,
        services,
        brandColors: brandColors?.split(',').map(c => c.trim()),
        brandNotes,
        logo: logoPath,
        guidelines: guidelinesPath,
        products
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Content profile saved', profile: updatedProfile });
  } catch (err) {
    console.error('❌ Error saving content profile:', err.message);
    res.status(500).json({ message: 'Failed to save profile' });
  }
};

exports.getContentProfile = async (req, res) => {
  try {
    const profile = await ContentProfile.findOne({ user: req.user.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error('❌ Error fetching profile:', err.message);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};
