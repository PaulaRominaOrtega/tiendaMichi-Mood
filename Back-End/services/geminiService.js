// src/services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Asegúrate de que la clave se carga correctamente
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY no está definida. Por favor, revisa tu archivo .env");
    process.exit(1); // Detiene el proceso si la clave no está presente
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

const generateResponse = async (userMessage, productData, intent) => {
    try {
        const prompt = `Hola. Responde con un simple "¡Miau!" para confirmar que funcionas correctamente.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error en el servicio de Gemini:', error);
        return '¡Uy! Parece que mi cerebro de gatito está tomando una siesta. Intenta de nuevo más tarde, ¡miau!';
    }
};

module.exports = {
    generateResponse,
};