import express from 'express';
import mongoose from 'mongoose'; // Add this import
import Contact from '../models/Contact.js';

const router = express.Router();

// Remove the top-level await connection - connections should be in server.js
// Keep only route handlers here

router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;