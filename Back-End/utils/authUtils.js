const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'clave_acceso_default';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'clave_refresco_default';


/**
 * @function generateAccessToken
 * @param {object} payload 
 * @returns {string} 
 */
const generateAccessToken = (payload) => {
    // Expira en 15 minutos 
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); 
};

/**
 * @function generateRefreshToken
 * @param {object} payload 
 * @returns {string} 
 */
const generateRefreshToken = (payload) => {
    // Expira en 7 días 
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); 
};

/**
 * @function generateTokens
 * @param {object} user
 * @param {string} role 
 * @returns {{accessToken: string, refreshToken: string}}
 */
const generateTokens = (user, role) => {
   
    const accessPayload = {
        id: user.id,
        email: user.email,
        role: role, 
    };

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
 * @param {string} token 
 * @param {string} type 
 * @returns {object|null} 
 */
const verifyToken = (token, type) => {
    const secret = type === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null; 
    }
};


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    verifyToken,
};