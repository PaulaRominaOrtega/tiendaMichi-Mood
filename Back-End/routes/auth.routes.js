const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/register - Registrar un nuevo usuario
router.post('/register', authController.register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// POST /api/auth/refresh-token - Refrescar el token de acceso
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
