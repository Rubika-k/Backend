import mongoose from 'mongoose';
import Worker from '../models/worker.js';
import Category from '../models/Category.js';


// ✅ Public: Get workers by category (for Customers)




export const getWorkersByCategory = async (req, res) => {
  const { category } = req.query;

  try {
    if (!category) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Case-insensitive search for the category
    const categoryDoc = await Category.findById(category)
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const workers = await Worker.find({ category: categoryDoc._id }).populate('category');

    if (workers.length === 0) {
      return res.status(404).json({ message: 'No workers found for this category' });
    }

    res.status(200).json(workers);
  } catch (error) {
    console.error('Error in getWorkersByCategory:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Admin: Get all workers (no filter)
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get all workers" });
  }
};

// ✅ Admin: Get single worker by ID
export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select('-password');
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching worker', error });
  }
};

// ✅ Admin: Create new worker
// export const createWorker = async (req, res) => {
//   try {
//     const {
//       fullName, email, phone, profilePicture, address, experience,
//       category, isVerified, registrationFeePaid, isAvailable, nextAvailableTime
//     } = req.body;

//     const newWorker = new Worker({
//       fullName,
//       email,
//       phone,
//       profilePicture,
//       address,
//       experience,
//       category,
//       isVerified,
//       registrationFeePaid,
//       isAvailable,
//       nextAvailableTime
//     });

//     await newWorker.save();
//     res.status(201).json(newWorker);
//   } catch (err) {
//     res.status(400).json({ error: err.message, errors: err.errors });
//   }
// };

export const createWorker = async (req, res) => {
  try {
    const {
      fullName, email, phone, profilePicture, address, experience,
      category, isVerified, registrationFeePaid, isAvailable, nextAvailableTime
    } = req.body;

    console.log("Received category ID:", category);

    if (!mongoose.Types.ObjectId.isValid(category)) {
      console.log("Category ID invalid");
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const categoryDoc = await Category.findById(category);
    console.log("Category document found:", categoryDoc);

    if (!categoryDoc) {
      return res.status(400).json({ message: `Category not found` });
    }

    const newWorker = new Worker({
      fullName,
      email,
      phone,
      profilePicture,
      address,
      experience,
      category: categoryDoc._id,
      isVerified,
      registrationFeePaid,
      isAvailable,
      nextAvailableTime
    });

    await newWorker.save();
    res.status(201).json(newWorker);

  } catch (err) {
    console.error("Error creating worker:", err);
    res.status(400).json({ error: err.message, errors: err.errors });
  }
};




export const updateWorker = async (req, res) => {
  try {
    const updated = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    return res.json(updated);
  } catch (err) {
    console.error("⚠️ [updateWorker] error:", err);
    console.error("Payload:", req.body);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: Delete worker
export const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.status(200).json({ message: 'Worker deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting worker', error });
  }
};
