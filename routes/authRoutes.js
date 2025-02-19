// authRoutes.js
const express = require('express');
const { loginUser, registerUser, getAllUsers, getTotalEmployees, getTotalAdmin,deleteUser} = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser); // New route for registration
router.get('/users', getAllUsers);
router.get('/total-employees', getTotalEmployees);
router.get('/total-admin', getTotalAdmin);
router.delete('/delete/:id', deleteUser); // New route for deletion


module.exports = router;
