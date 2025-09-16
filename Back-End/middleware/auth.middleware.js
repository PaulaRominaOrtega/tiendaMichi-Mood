const jwt = require('jsonwebtoken');
const Cliente = require('../models/cliente.model');
const Administrador = require('../models/administrador.model');

/**
 * Generar JWT
 */
const generarToken = (usuario, tipo) => {
  return jwt.sign(
    { id: usuario.id, tipo },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

/**
 * Middleware para proteger rutas
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let usuario;

      if (decoded.tipo === 'cliente') {
        usuario = await Cliente.findByPk(decoded.id, { attributes: { exclude: ['contrasena'] } });
      } else if (decoded.tipo === 'administrador') {
        usuario = await Administrador.findByPk(decoded.id, { attributes: { exclude: ['contrasena'] } });
      }

      if (!usuario) {
        return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
      }

      req.usuario = usuario;
      req.usuario.tipo = decoded.tipo;

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expirado' });
      }
      console.error(error);
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
  } else {
    res.status(401).json({ success: false, message: 'No autorizado, no hay token' });
  }
};

/**
 * Middleware de autorización
 */
const authorize = (...tiposPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !tiposPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
};

module.exports = { generarToken, protect, authorize };