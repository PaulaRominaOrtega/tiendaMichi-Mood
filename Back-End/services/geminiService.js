const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY no está definida. La API de Gemini estará inactiva.");
}
const generateResponse = async (userMessage, intent, productData = null) => {
    
    if (!genAI) {
        return '¡Miau! Lo siento, el servicio de IA no está disponible en este momento. Por favor, revisa la configuración de la API. 😿';
    }

    try {
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let prompt = '';

        switch (intent) {
            case 'productos':
                if (productData && productData.length > 0) {
                    const productInfo = productData.map(p =>
                        `- ${p.nombre}: ${p.descripcion || 'Sin descripción'}. Precio: $${p.precio}. Stock: ${p.stock} unidades. Material: ${p.material || 'No especificado'}. Capacidad: ${p.capacidad || 'No especificada'}. ${p.caracteristicas_especiales ? 'Características: ' + p.caracteristicas_especiales : ''}`
                    ).join('\n');

                    prompt = `Eres un asistente virtual amigable de una tienda de productos para amantes de los gatos llamada Michi Mood.
El usuario preguntó: "${userMessage}"

Aquí están los productos que encontré en nuestra base de datos (Sé muy conciso y directo con la información del producto):
${productInfo}

Responde de forma amigable, concisa y útil sobre estos productos. Si el usuario pregunta por stock, capacidad o material, proporciona esa información específica. Mantén un tono alegre y temático de gatos (puedes usar "miau" ocasionalmente pero sin exagerar).`;
                } else {
                    prompt = `Eres un asistente virtual amigable de una tienda de productos para amantes de los gatos llamada Michi Mood.
El usuario preguntó: "${userMessage}"

No encontré productos específicos que coincidan con esa búsqueda en nuestra base de datos. Responde de forma amigable sugiriendo que el usuario puede explorar nuestras categorías o hacer una búsqueda más específica. Mantén un tono alegre y temático de gatos.`;
                }
                break;

            case 'envios':
                prompt = `Eres un asistente virtual amigable de una tienda de productos para gatos llamada Michi Mood.
El usuario preguntó sobre envíos: "${userMessage}"

Explica que realizamos envíos a todo el país, los tiempos de entrega son de 3-7 días hábiles, y ofrecemos envío gratis en compras superiores a $5000. Sé amigable y conciso.`;
                break;

            case 'medios_de_pago':
                prompt = `Eres un asistente virtual amigable de una tienda de productos para gatos llamada Michi Mood.
El usuario preguntó sobre medios de pago: "${userMessage}"

Explica que aceptamos tarjetas de crédito/débito, transferencias bancarias y Mercado Pago. Sé amigable y conciso.`;
                break;

            case 'personalizacion_producto':
                prompt = `Eres un asistente virtual amigable de una tienda de productos para gatos llamada Michi Mood.
El usuario quiere personalizar un producto: "${userMessage}"

Explica que ofrecemos personalización de productos y que estás procesando su solicitud. Sé entusiasta y amigable.`;
                break;

            case 'saludo':
                prompt = `Eres un asistente virtual amigable de una tienda de productos para gatos llamada Michi Mood.
El usuario te saludó: "${userMessage}"

Responde con un saludo cálido y pregunta en qué puedes ayudar. Menciona brevemente que puedes ayudar con productos, envíos, medios de pago o personalización.`;
                break;

            case 'otros':
            default:
                prompt = `Eres un asistente virtual amigable de una tienda de productos para gatos llamada Michi Mood.
El usuario preguntó: "${userMessage}"

Responde de forma útil y amigable. **IMPORTANTE:** Si no estás seguro de la respuesta, **sugiere que contacten al equipo de soporte o exploren la tienda** (como hiciste antes). No inventes información.`;
                break;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error en el servicio de Gemini:', error);
        
        return '¡Uy! Parece que mi cerebro de gatito está tomando una siesta. Intenta de nuevo más tarde, ¡miau! 😺';
    }
};

module.exports = {
    generateResponse,
};