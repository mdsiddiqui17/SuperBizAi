const axios = require('axios');
const ContentProfile = require('../models/ContentProfile');
const fs = require('fs');
const path = require('path');

exports.generateContent = async (req, res) => {
  try {
    const { contentType, tone = 'neutral', colors = '', tags = '', numberOfPosts = 1, keywords = '' } = req.body;

    const ALLOWED_CONTENT_TYPES = [
      'blog_post',
      'social_media_update',
      'ad_copy',
      'email_newsletter',
      'product_description',
      'Image' // Assuming 'Image' is also a valid type based on existing logic
    ];

    if (!contentType || !ALLOWED_CONTENT_TYPES.includes(contentType)) {
      return res.status(400).json({
        message: `Invalid contentType provided. Please use one of the allowed types: ${ALLOWED_CONTENT_TYPES.join(', ')}`
      });
    }

    const profile = await ContentProfile.findOne({ user: req.user.userId });
    if (!profile) return res.status(404).json({ message: 'Content profile not found' });

    const prompt = `Create a ${contentType.toLowerCase()} for a business called "${profile.companyName}" that offers ${profile.services}.
Use a ${tone} tone.
Keywords: ${keywords}
Colors: ${colors}
Tags: ${tags}
Generate ${numberOfPosts} sample ${contentType.toLowerCase()}${numberOfPosts > 1 ? 's' : ''}.`;

    if (contentType === 'Image') {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
        {
          inputs: `${keywords}, ${profile.companyName}, ${profile.services}, ${tone}, colors: ${colors}`
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

    const textResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a marketing expert who writes clear, creative content for small businesses.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800
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

exports.saveContentProfile = async (req, res) => {
  try {
    const { companyName, services, brandColors } = req.body;

    const logoPath = req.files?.logo?.[0]?.path || null;
    const guidelinesPath = req.files?.guidelines?.[0]?.path || null;

    const updatedProfile = await ContentProfile.findOneAndUpdate(
      { user: req.user.userId },
      {
        companyName,
        services,
        brandColors: brandColors?.split(',').map(c => c.trim()),
        logo: logoPath,
        guidelines: guidelinesPath
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Content profile saved', profile: updatedProfile });
  } catch (err) {
    console.error('❌ Error saving content profile:', err.message);
    res.status(500).json({ message: 'Failed to save profile' });
  }
};
