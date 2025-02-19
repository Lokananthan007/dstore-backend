// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const initializeAdminUser = require('./utils/initializeAdminUser');
const orderRoutes = require('./routes/orderRoutes');
const cron = require('node-cron');
const Order = require('./models/orderModel');
const allOrder = require('./models/allorderSchema');
const allorderRoutes = require('./routes/allorderRoutes');

dotenv.config();

const app = express();

// Enable CORS for all domains (You can configure it for specific origins too)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Connect to the database
connectDB().then(() => {
    initializeAdminUser(); // Initialize default admin
});

//auth Routes
app.use('/api/auth', authRoutes);

//orders Routes

app.use('/api/orders', orderRoutes);

// Schedule a task to run daily at 12:00 AM
cron.schedule('59 59 23 * * *', async () => {
    console.log('Running daily cleanup task...');
    try {
        const result = await Order.deleteMany({}); // Delete all orders
        console.log(`${result.deletedCount} orders deleted.`);
    } catch (error) {
        console.error('Error during cleanup task:', error);
    }
});

// allorderRoutes
app.use('/api/allorders', allorderRoutes);

// Schedule a task to run every Sunday at 12:00 AM
cron.schedule('0 0 * * 0', async () => {
    console.log('Running weekly cleanup task (every Sunday)...');
    try {
        const result = await allOrder.deleteMany({}); // Delete all orders
        console.log(`${result.deletedCount} orders deleted.`);
    } catch (error) {
        console.error('Error during weekly cleanup task:', error);
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

