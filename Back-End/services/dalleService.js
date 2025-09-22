// src/services/dalleService.js
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateImage = async (promptText) => {
    try {
        const image = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Diseño de productos para amantes de gatos. Fotorrealista. Ilustración de alta calidad. Basado en: "${promptText}"`,
            n: 1,
            size: "1024x1024",
            quality: "standard"
        });
        return image.data[0].url;
    } catch (error) {
        console.error('Error generando imagen con DALL-E:', error);
        return null;
    }
};

module.exports = {
    generateImage
};