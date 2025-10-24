// Back-End/controllers/chat.controller.js
const { GoogleGenAI } = require('@google/genai');
const { consultarStock } = require('../services/stockService'); 

// Inicializar el cliente de Gemini
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY); 
const model = 'gemini-2.5-flash';

// ----------------------------------------------------
// INSTRUCCIÓN DE SISTEMA MEJORADA PARA CONCISIÓN 🚨
// AÑADE UNA REGLA PARA NO INCLUIR DATOS ADICIONALES.
// ----------------------------------------------------
const SYSTEM_INSTRUCTION = `
Eres Michi-Bot, un asistente de ventas de un ecommerce. Debes ser muy preciso al responder basándote en la información de la base de datos.

REGLAS ESTRICTAS DE RESPUESTA:
1.  **Si la pregunta es SÓLO por un dato único** (ej: stock, precio, material), responde **SOLAMENTE** con ese dato.
    * **NO incluyas otros datos** (como la descripción, características o precio) que no hayan sido solicitados explícitamente.
    * Ejemplo: Pregunta: "¿Tienen stock de jabonera?". Respuesta: "Sí, tenemos 8 unidades en stock."
2.  **Si la pregunta es general** (ej: "¿Qué hay sobre la jabonera?" o "¿Dame características?"), utiliza todos los datos disponibles (precio, stock, material, etc.) para dar una respuesta detallada.
3.  Mantén un tono amable y profesional.
`;

const toolSchema = {
    functionDeclarations: [
        {
            name: 'consultarStock',
            description: 'Busca el stock, precio, material, capacidad, características especiales y cualquier detalle o especificación de un producto específico en la base de datos de la tienda de ecommerce. Úsala para cualquier pregunta sobre detalles, disponibilidad o costo.',
            parameters: {
                type: 'object',
                properties: {
                    nombreProducto: {
                        type: 'string',
                        description: 'El nombre base del producto, aunque el usuario lo escriba en plural, con tildes o con errores. EJEMPLO: Si el usuario dice "alfombras", la palabra a extraer debe ser "alfombra".'
                    }
                },
                required: ['nombreProducto']
            }
        }
    ]
};

async function handleChat(req, res) {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Falta el mensaje (prompt) del usuario.' });
    }

    try {
        const chat = ai.chats.create({ 
            model, 
            config: { 
                tools: [toolSchema],
                systemInstruction: SYSTEM_INSTRUCTION 
            } 
        });
        
        let response = await chat.sendMessage({ message: prompt });
        
        if (response.functionCalls && response.functionCalls.length > 0) {
            const call = response.functionCalls[0];
            const functionName = call.name;
            const args = call.args;

            if (functionName === 'consultarStock') {
                const functionResultString = await consultarStock(args.nombreProducto);
                
                response = await chat.sendMessage({
                    message: functionResultString,
                    role: 'function',
                    name: functionName
                });
            }
        }
        res.json({ response: response.text });

    } catch (error) {
        console.error('❌ Error en handleChat (controlador de la IA):', error);
        res.status(500).json({ error: 'Ocurrió un error interno al procesar la solicitud de la IA.' });
    }
}

module.exports = {
    handleChat
};