const axios = require('axios');

exports.generateImage = async (req, res) => {
  const { prompt } = req.body;
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const base64Image = Buffer.from(response.data).toString('base64');
    res.json({ image: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error('❌ Error generating image:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Image generation failed' });
  }
};
