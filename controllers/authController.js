import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeyUCtJokvXZwjks4xPyrEIHbTscMVqNhq9';

// ========== SIGNUP ==========
export const signup = async (req, res) => {
  const { fullName, email, phone, password, address, role } = req.body;

  try {


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      phone: phone || '',
      address: address || {},
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user'
    });

    await newUser.save();

    res.status(201).json({
      message: `${newUser.role} registered successfully`,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// ========== LOGIN ==========

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //  Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    //  Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    //  Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    //  Send response INCLUDING role!
    res.status(200).json({
      message: `${user.role} login successful`,
      token,
      userId: user._id,
      role: user.role 
    });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
 //============= LOGOUT ==========
export const logout = (req, res) => {
  //  Clear the token on the client side
  res.status(200).json({ message: 'Logout successful' });
}