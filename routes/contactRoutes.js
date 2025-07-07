import express from 'express';
import Message from '../models/Contact.js';

const router = express.Router();

// POST /api/contact/send
router.post('/send', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const newMessage = await Message.create({ name, email, message });

    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// GET /api/contact/all - for Admin dashboard
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// PATCH /api/contact/reply/:id
router.patch('/reply/:id', async (req, res) => {
  try {
    const { reply } = req.body;
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { reply, status: 'replied' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reply' });
  }
});

export default router;
