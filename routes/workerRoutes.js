import express from 'express';
import {
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkersByCategory
} from '../controllers/workerController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ✅ Public: get workers by category
router.get('/category', getWorkersByCategory); // public

// ✅ Admin-only routes: fetch all workers, etc.
router.get('/admin', verifyToken, isAdmin, getAllWorkers);
router.get('/:id', verifyToken, isAdmin, getWorkerById);
router.post('/', verifyToken, isAdmin, createWorker);
router.put('/:id', verifyToken, isAdmin, updateWorker);
router.delete('/:id', verifyToken, isAdmin, deleteWorker);


export default router;