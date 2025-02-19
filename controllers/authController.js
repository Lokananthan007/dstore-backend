// authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT with the user role
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "10h" });
        res.json({ token, role: user.role });  // Send role back to frontend
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { loginUser };

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create and save the new user
        const newUser = new User({ username, password, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all employee details
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username role _id'); // Include fields to return
        res.json(users);
    } catch (err) {
        console.error('Error fetching employees:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getTotalEmployees = async (req, res) => {
    try {
        const totalEmployees = await User.countDocuments({ role: 'employee' });
        res.json({ totalEmployees });
    } catch (err) {
        console.error('Error fetching total employees:', err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const getTotalAdmin = async (req, res) => {
    try {
        const totalAdmin = await User.countDocuments({ role: 'admin' });
        res.json({ totalAdmin }); // Use correct key
    } catch (err) {
        console.error('Error fetching total admin:', err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginUser, registerUser, getAllUsers, getTotalEmployees, getTotalAdmin, deleteUser};
