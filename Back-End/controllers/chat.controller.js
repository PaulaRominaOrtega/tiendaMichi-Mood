const classifierService = require('../services/classifierService');
const geminiService = require('../services/geminiService');
const dalleService = require('../services/dalleService');
const productService = require('../services/productService'); 

const handleProductsQuery = async (message) => {
    //Llama al nuevo servicio para buscar productos en la base de datos
    const productData = await productService.getProductDetails(message);

    //Llama a Gemini, pasándole los datos de los productos
    const botResponse = await geminiService.generateResponse(message, 'productos', productData);
    
    return { message: botResponse };
};

const handleShippingQuery = async (message) => {
    const botResponse = await geminiService.generateResponse(message, 'envios');
    return { message: botResponse };
};

const handlePaymentQuery = async (message) => {
    const botResponse = await geminiService.generateResponse(message, 'medios_de_pago');
    return { message: botResponse };
};

const handleCustomizationQuery = async (message) => {
    const botResponse = await geminiService.generateResponse(message, 'personalizacion_producto');
    const imageUrl = await dalleService.generateImage(message);
    return { message: botResponse, imageUrl };
};

const handleGreeting = async () => {
    return { message: '¡Hola! Soy un asistente virtual para amantes de los michis. ¿En qué puedo ayudarte hoy? Puedes preguntar sobre nuestros productos, envíos o medios de pago.' };
};

const handleOtherQuery = async (message) => {
    const botResponse = await geminiService.generateResponse(message, 'otros');
    return { message: botResponse };
};

const handleMessage = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ success: false, message: 'El mensaje es requerido.' });
    }

    try {
        const { category, confidence } = await classifierService.classifyMessage(message);

        console.log(`Mensaje: "${message}" -> Categoría: "${category}" (Confianza: ${confidence})`);

        let response;
        let imageUrl = null;

        switch (category) {
            case 'productos':
                response = await handleProductsQuery(message);
                break;
            case 'envios':
                response = await handleShippingQuery(message);
                break;
            case 'medios_de_pago':
                response = await handlePaymentQuery(message);
                break;
            case 'personalizacion_producto':
                response = await handleCustomizationQuery(message);
                imageUrl = response.imageUrl;
                break;
            case 'saludo':
                response = await handleGreeting();
                break;
            case 'otros':
            default:
                response = await handleOtherQuery(message);
                break;
        }

        res.status(200).json({
            success: true,
            message: response.message,
            category: category,
            imageGenerated: !!imageUrl,
            imageData: imageUrl ? { imageUrl } : null
        });

    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
        res.status(500).json({
            success: false,
            message: 'Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.',
            error: error.message
        });
    }
};

module.exports = {
    handleMessage
};