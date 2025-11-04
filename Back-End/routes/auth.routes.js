const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { generateTokens } = require('../utils/authUtils');

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Registrar un nuevo cliente
router.post('/register', authController.register);

// Iniciar sesión
router.post('/login', authController.login);

// Refrescar token
router.post('/refresh-token', authController.refreshToken);

// Iniciar proceso de autenticación con Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

// Callback después de autenticarse con Google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/login`,
    session: false, 
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/login?error=NoUser`);
    }

    // Generamos los tokens JWT
    const tokens = generateTokens(req.user, 'cliente');

    // Redirigimos al Front con los tokens y datos
    const redirectUrl =
      `${FRONTEND_URL}/login-success?` +
      `accessToken=${tokens.accessToken}` +
      `&refreshToken=${tokens.refreshToken}` +
      `&clienteId=${req.user.id}` +
      `&email=${encodeURIComponent(req.user.email)}`;

    console.log("Google login exitoso. Redirigiendo a:", redirectUrl);

    res.redirect(redirectUrl);
  }
);

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(`${FRONTEND_URL}/`);
  });
});

module.exports = router;
