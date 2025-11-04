const jwt = require('jsonwebtoken');
const Administrador = require('../models/administrador.model');

exports.verificarJWTAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Acceso denegado. Token no proporcionado.'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.tipo !== 'administrador') {
            return res.status(403).json({
                success: false,
                error: 'Acceso denegado. Rol no autorizado.'
            });
        }

        const administrador = await Administrador.findByPk(decoded.id);
        if (!administrador) {
            return res.status(401).json({
                success: false,
                error: 'Administrador no encontrado.'
            });
        }

        req.administrador = administrador;
        next();

    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, error: 'Token inválido.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: 'Token expirado.' });
        }
        return res.status(500).json({ success: false, error: 'Error del servidor.' });
    }
};