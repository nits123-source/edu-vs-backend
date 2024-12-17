const express = require('express');
const UserController = require('../controllers/UserController'); // Adjust the path if needed

const router = express.Router();

// Define user-related routes

// Register a new user
router.post('/register', UserController.register);
router.post('/login',UserController.login);

// Get all users
router.get('/', UserController.getAllUsers);

// Get a user by ID
router.get('/:id', UserController.getUserById);

// Update a user
router.put('/:id', UserController.updateUser);

// Delete a user
router.delete('/:id', UserController.deleteUser);

module.exports = router;
