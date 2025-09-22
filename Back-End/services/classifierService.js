const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define las palabras clave para las categorías de tu tienda de gatos
const categoryKeywords = {
  productos: [
    'taza', 'tazas', 'lapicera', 'lapiceras', 'pantufla', 'pantuflas', 'producto', 
    'productos', 'accesorios', 'juguetes', 'ropa', 'artículos', 'precio', 'precios'
  ],
  envios: [
    'envío', 'envíos', 'entrega', 'delivery', 'enviar', 'costo', 'costos', 'cuánto tarda', 
    'demora', 'transporte', 'domicilio', 'zona'
  ],
  medios_de_pago: [
    'pagar', 'pago', 'pagos', 'tarjeta', 'efectivo', 'transferencia', 'cuotas', 
    'métodos', 'formas de pago', 'factura'
  ],
  personalizacion_producto: [
    'personalizado', 'diseñar', 'crear', 'especial', 'a medida', 'custom', 'personalizar'
  ]
};

// Patrones para ignorar mensajes de saludo o muy cortos
const invalidPatterns = [
  /^(hola|hi|hello|hey)$/i,
  /^(adiós|bye|chao)$/i,
  /^(gracias|thanks)$/i,
  /^\w{1,2}$/i, // Palabras muy cortas
];

// Función para calcular la puntuación basada en palabras clave
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
    // Normalizamos la puntuación para obtener un valor entre 0 y 1
    scores[category] = score / categoryKeywords[category].length;
  });

  return scores;
};

// Función para clasificar usando IA (Gemini)
const classifyWithAI = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Clasifica el siguiente mensaje de usuario en UNA de estas categorías exactas:
    - productos: preguntas sobre tazas, lapiceras, pantuflas o precios de productos
    - envios: preguntas sobre entregas, zonas o costos de envío
    - medios_de_pago: preguntas sobre formas de pago o facturación
    - personalizacion_producto: solicitudes para diseñar productos personalizados
    - otros: mensajes poco claros, saludos, o no relacionados con la tienda

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
    console.error('Error en clasificación con IA:', error);
    return {
      category: 'otros',
      confidence: 0.4,
      reason: 'Error en clasificación con IA'
    };
  }
};

// Función principal de clasificación
const classifyMessage = async (message) => {
  const cleanMessage = message.toLowerCase().trim();
  
  // Paso 1: Clasificación rápida por palabras clave
  const isInvalid = invalidPatterns.some(pattern => pattern.test(cleanMessage));
  if (isInvalid) {
    return { category: 'saludo', confidence: 0.9 };
  }
  
  const scores = calculateKeywordScores(cleanMessage);
  const bestMatch = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  const [bestCategory, bestScore] = bestMatch;

  if (bestScore > 0.3) { // Umbral de confianza
    return { category: bestCategory, confidence: bestScore };
  }

  // Paso 2: Si la confianza es baja, recurre a la IA
  return await classifyWithAI(message);
};

module.exports = {
  classifyMessage,
};