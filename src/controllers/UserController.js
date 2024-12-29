const bcrypt = require('bcrypt');
const User = require('../models/User/UserSchema'); 
const jwt = require('jsonwebtoken');
const {generateAccessToken,generateRefreshToken}=require("../utils/TokenGeneration");

// List of allowed admin contacts (email or phone)
const allowedAdmins = [
  'ak8954727769@gmail.com',
  '6006026830',
  'nitsrg2001@gmail.com',
];

const UserController = {
  // Register a new user
  async register(req, res) {
    try {
      const { username, contact, password, role } = req.body;

      // Check for duplicate contact
      const existingUser = await User.findOne({ contact });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Ensure only authorized users can set the admin role
      let newRole = 'user';
      if (role === 'admin') {
        if (!allowedAdmins.includes(contact)) {
          return res.status(403).json({ message: 'Unauthorized to register as admin' });
        }
        newRole = 'admin';
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        username,
        contact,
        password: hashedPassword,
        role: newRole,
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  },
  async login (req, res){
    const { contact, password } = req.body;
  
    // Validate the input
    if (!contact) {
      return res.status(400).json({ message: 'Contact is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
  
    try {
      // Find the user by email or phone
      const user = await User.findOne({ contact });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      user.refreshToken=refreshToken;
      const updatedUser=await user.save();
      
      
  
      // Send response with token
      res.json({
        message: 'Login successful',
        token:accessToken,
        refreshToken:refreshToken,
        role:user.role,
        username:user.username
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
  },

  // Get a user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
  },

  // Update a user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Prevent updating the role to admin unless explicitly authorized
      if (updates.role === 'admin') {
        return res.status(403).json({ message: 'Unauthorized to update role to admin' });
      }

      const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  },

  // Delete a user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  },
};

module.exports = UserController;
