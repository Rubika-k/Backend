import express from 'express';
import { 
  getUserById, 
  deleteUser, 
  updateUserRole,
  getAllUsers,
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
// import upload from '../middlewares/upload.js'; // Only need the default export

const router = express.Router();

// Admin routes
router.get('/api/users', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.patch('/users/:id/role', verifyToken, isAdmin, updateUserRole);
router.delete('/:id', verifyToken, isAdmin, deleteUser);


export default router;