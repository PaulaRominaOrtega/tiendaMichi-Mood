// routes/chat.routes.js
const express = require('express');
const { handleMessage } = require('../controllers/chat.controller');

const router = express.Router();

router.post('/chat', handleMessage);

module.exports = router;