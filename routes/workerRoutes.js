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
router.get('/workers', getWorkersByCategory); // public

// ✅ Admin-only routes: fetch all workers, etc.
router.get('/admin', verifyToken, isAdmin, getAllWorkers);
router.get('/:id', verifyToken, isAdmin, getWorkerById);
router.post('/', verifyToken, isAdmin, createWorker);
router.put('/:id', verifyToken, isAdmin, updateWorker);
router.delete('/:id', verifyToken, isAdmin, deleteWorker);
router.get('/', (req, res) => {
  const { category } = req.query;
  console.log('Category:', category);
  // Example data
  const workers = [
    { id: 1, name: 'Kannan', category: 'Electrical Services' },
    { id: 2, name: 'Aathavan', category: 'Plumbing Services' },
  ];

  const filtered = workers.filter(w => w.category === category);

  res.json(filtered);
});

export default router;