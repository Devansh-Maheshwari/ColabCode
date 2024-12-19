// controllers/chatController.js
const Chat = require('../models/chat');

const getChats = async (req, res) => {
  try {
    const { problemId } = req.params;
    const chats = await Chat.find({ problemId }).populate('userId', 'username');
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { problemId, userId, message } = req.body;

    const newMessage = new Chat({ problemId, userId, message });
    await newMessage.save();
    const populatedMessage = await newMessage.populate('userId', 'username');

    // Emit new message to all clients
    req.io.emit('new_message', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

module.exports = { getChats, sendMessage };
