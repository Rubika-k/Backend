// routes/contactRoutes.js
import express from 'express';
import Message from '../models/Contact.js';
import sendMail from '../utils/email.js'; // You’ll create this file

const router = express.Router();

// ✅ POST: user sends a message
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

// ✅ GET: admin gets all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// ✅ PATCH: admin replies & sends email notification
router.patch('/reply/:id', async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { reply, status: 'replied', repliedAt: Date.now() },
      { new: true }
    );

    // ⏩ OPTIONAL: Send email notification to user
    await sendMail({
      to: message.email,
      subject: 'Your Contact Message Has Been Replied!',
      html: `
        <p>Hi ${message.name},</p>
        <p>Thank you for contacting us! Here's our reply:</p>
        <blockquote>${reply}</blockquote>
        <p>Regards, Breeze Home Team</p>
      `
    });

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reply' });
  }
});
// ✅ DELETE: admin deletes a message
router.delete('/admin/messages/:id', async (req, res) => {
  try {
    console.log("Deleting ID:", req.params.id);
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ GET: user can view their own messages
router.get('/user/messages', async (req, res) => {
  try {
    // Assuming user ID is stored in req.user (from authentication middleware)
    const userId = req.user._id; // Adjust based on your auth setup
    const messages = await Message.find({ user: userId }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch your messages' });
  }
});
// ✅ GET: admin can filter messages by status
router.get('/admin/messages/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['new', 'replied', 'archived'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status filter' });
    }

    const messages = await Message.find({ status }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to filter messages' });
  }
});
// ✅ PATCH: admin can mark a message as replied
router.patch('/admin/messages/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'replied', 'archived'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { status, repliedAt: Date.now() },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(updatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update message status' });
  }
});
// ✅ PATCH: user replies to their own message
router.patch('/messages/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { reply, status: 'replied', repliedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Reply sent', data: updated });
  } catch (err) {
    console.error('Error replying:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});




export default router;
