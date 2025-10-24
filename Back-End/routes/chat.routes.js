// Back-End/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// Definimos el endpoint POST para las peticiones de chat
router.post('/', chatController.handleChat); 

module.exports = router;