const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const categoryKeywords = {
  productos: [
    'taza', 'tazas', 'lapicera', 'lapiceras', 'pantufla', 'pantuflas', 'producto',
    'productos', 'accesorios', 'juguetes', 'ropa', 'artículos', 'precio', 'precios',
    'stock', 'disponible', 'disponibilidad', 'hay', 'tienen', 'cuántos', 'cantidad',
    'material', 'materiales', 'hecho', 'fabricado', 'cerámica', 'plástico', 'tela',
    'capacidad', 'tamaño', 'ml', 'litro', 'litros', 'medida', 'medidas',
    'mochila', 'mochilas', 'llavero', 'llaveros', 'medias', 'cuaderno', 'cuadernos',
    'portallave', 'portallaves', 'pin', 'pines', 'lampara', 'lámparas'
  ],
  envios: [
    'envío', 'envíos', 'entrega', 'delivery', 'enviar', 'costo', 'costos', 'cuánto tarda',
    'demora', 'transporte', 'domicilio', 'zona', 'gratis', 'gratuito'
  ],
  medios_de_pago: [
    'pagar', 'pago', 'pagos', 'tarjeta', 'efectivo', 'transferencia', 'cuotas',
    'métodos', 'formas de pago', 'factura', 'mercado pago'
  ],
  personalizacion_producto: [
    'personalizado', 'diseñar', 'crear', 'especial', 'a medida', 'custom', 'personalizar'
  ]
};

const invalidPatterns = [
  /^(hola|hi|hello|hey)$/i,
  /^(adiós|bye|chao)$/i,
  /^(gracias|thanks)$/i,
  /^\w{1,2}$/i, 
];

const calculateKeywordScores = (message) => {
  const scores = {};
  const cleanMessage = message.toLowerCase().trim();

  Object.keys(categoryKeywords).forEach(category => {
    let score = 0;
    categoryKeywords[category].forEach(keyword => {
      if (cleanMessage.includes(keyword)) {
        score += 1;
      }
    });

    scores[category] = score / categoryKeywords[category].length;
  });

  return scores;
};

const classifyWithAI = async (message) => {
  if (!genAI) {
    return {
      category: 'otros',
      confidence: 0.4,
      reason: 'Gemini no configurado'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' 
    });

    const prompt = `Clasifica el siguiente mensaje de usuario en UNA de estas categorías exactas:
    - productos: preguntas sobre productos (tazas, mochilas, etc), stock, disponibilidad, materiales, capacidad, tamaño, precio
    - envios: preguntas sobre entregas, zonas o costos de envío
    - medios_de_pago: preguntas sobre formas de pago o facturación
    - personalizacion_producto: solicitudes para diseñar productos personalizados
    - saludo: saludos iniciales, despedidas
    - otros: mensajes poco claros o no relacionados con la tienda

    Mensaje: "${message}"

    Responde SOLO con el nombre de la categoría, sin explicaciones adicionales.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const aiCategory = responseText.toLowerCase().trim();

    return {
      category: aiCategory,
      confidence: 0.7,
      reason: 'Clasificación con IA'
    };
  } catch (error) {
    console.warn('⚠️ Gemini no disponible, usando fallback:', error?.statusText || error.message);
    return {
      category: 'otros',
      confidence: 0.4,
      reason: 'Error en clasificación con IA'
    };
  }
};

const classifyMessage = async (message) => {
  const cleanMessage = message.toLowerCase().trim();
  
  const isInvalid = invalidPatterns.some(pattern => pattern.test(cleanMessage));
  if (isInvalid) {
    return { category: 'saludo', confidence: 0.9, reason: 'Mensaje corto o saludo' };
  }
  
  const scores = calculateKeywordScores(cleanMessage);
  const bestMatch = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  const [bestCategory, bestScore] = bestMatch;

  if (bestScore > 0.2) { 
    return { category: bestCategory, confidence: bestScore, reason: 'Clasificación por keywords' };
  }

  return await classifyWithAI(message);
};

module.exports = {
  classifyMessage,
};
