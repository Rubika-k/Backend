import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', (req, res) => {
  // Clear the token on the client side
  res.status(200).json({ message: 'Logout successful' });
}); 



export default router;
