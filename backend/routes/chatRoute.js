// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { getChats, sendMessage } = require('../controllers/chatController');

// Get all messages for a specific problem
router.get('/:problemId', getChats);

// Send a new message to a problem discussion
router.post('/send', sendMessage);

module.exports = router;
