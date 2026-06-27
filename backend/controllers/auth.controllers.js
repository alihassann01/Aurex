import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import TokenBlacklist from '../models/tokenBlacklist.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    
    // Generate token
    const token = generateToken(newUser._id);
    
    // Return token + user info
    res.status(201).json({ 
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return token + user info
    res.status(200).json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const token = authHeader.slice(7);

    // Decode token to get expiration (not verifying here because middleware already did on protected routes)
    const decoded = jwt.decode(token);
    const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Save token to blacklist so it can't be used again
    await TokenBlacklist.create({ token, expiresAt });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    // If token already exists in blacklist, treat as success
    if (error && error.code === 11000) {
      return res.status(200).json({ message: 'Logged out successfully' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};