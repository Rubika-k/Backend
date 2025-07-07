import express from 'express';
import { getAllUsers , updateUserRole} from '../controllers/userController.js';
import { authenticateAdmin , verifyToken , isAdmin  } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';
import Worker from '../models/worker.js';
import Booking from '../models/Booking.js';
import Service from '../models/Category.js';

const router = express.Router();


router.get('/users/count', authenticateAdmin, async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Error counting users' });
  }
});

// AdminRoutes.js
router.get('/workers/count', authenticateAdmin, async (req, res) => {
  try {
    const status = req.query.status;

    // Optional: default to 'active' if you want
    const query = status ? { status } : {};

    const count = await Worker.countDocuments(query);
    const workers = await Worker.find(query);

    res.json({ count, workers });
  } catch (err) {
    console.error("❌ Workers fetch error:", err);
    res.status(500).json({ message: 'Failed to fetch workers' });
  }
});



router.get('/bookings/count', authenticateAdmin, async (req, res) => {
  const { date } = req.query;
  let filter = {};
  if (date === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    filter = { createdAt: { $gte: today, $lt: tomorrow } };
  }
  const count = await Booking.countDocuments(filter);
  res.json({ count });
});


router.get('/services/count', authenticateAdmin, async (req, res) => {
  const count = await Service.countDocuments();
  res.json({ count });
});

router.get('/users', verifyToken, isAdmin, getAllUsers);
router.patch('/users/:id/role', verifyToken, isAdmin, updateUserRole);




export default router;