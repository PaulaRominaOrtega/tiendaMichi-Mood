const jwt = require('jsonwebtoken');

// 🚨 Asegúrate de que estas variables estén definidas en tu .env del Back-End 🚨
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'clave_acceso_default';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'clave_refresco_default';


/**
 * @function generateAccessToken
 * Crea un token de acceso JWT de corta duración.
 * @param {object} payload - Datos del usuario a incluir (id, email, rol, etc.)
 * @returns {string} Token de acceso JWT
 */
const generateAccessToken = (payload) => {
    // Expira en 15 minutos (un tiempo estándar)
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); 
};

/**
 * @function generateRefreshToken
 * Crea un token de refresco JWT de larga duración.
 * @param {object} payload - Datos del usuario (generalmente solo el ID)
 * @returns {string} Token de refresco JWT
 */
const generateRefreshToken = (payload) => {
    // Expira en 7 días (un tiempo estándar)
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); 
};

/**
 * @function generateTokens
 * Genera tanto el token de acceso como el de refresco.
 * @param {object} user - Objeto del usuario (Cliente o Admin)
 * @param {string} role - El rol del usuario ('cliente' o 'admin')
 * @returns {{accessToken: string, refreshToken: string}} Objeto con ambos tokens
 */
const generateTokens = (user, role) => {
    // 1. Payload para el Access Token (incluye información para el Front-End)
    const accessPayload = {
        id: user.id,
        email: user.email,
        role: role, 
    };

    // 2. Payload para el Refresh Token (debe ser mínimo, solo el ID)
    const refreshPayload = {
        id: user.id,
        role: role, 
    };

    const accessToken = generateAccessToken(accessPayload);
    const refreshToken = generateRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
};

/**
 * @function verifyToken
 * Verifica la validez de un token JWT.
 * @param {string} token - El token JWT a verificar
 * @param {string} type - Tipo de secreto a usar ('access' o 'refresh')
 * @returns {object|null} El payload decodificado o null si la verificación falla
 */
const verifyToken = (token, type) => {
    const secret = type === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null; // Token expirado, inválido, etc.
    }
};


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    verifyToken,
};