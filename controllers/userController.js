// controllers/userController.js
import mongoose from 'mongoose';
import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').skip(skip).limit(limit),
      User.countDocuments()
    ]);

    res.json({ users, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};


export const getUserById = async (req, res) => {
  try {
    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Error fetching user',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = req.body.role || user.role;
    await user.save();

    res.json({ message: 'Role updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user role', error: err.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (err) {
    console.error('Error in getUserProfile:', err);
      res.status(500).json({ 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };
