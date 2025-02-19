// orderController.js

const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: 'Order saved successfully!', order: newOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to save order.', error: err.message });
    }
};


const getWithSearch = async (req, res) => {
    try {
        const { orderId, date , contactNumber} = req.query;

        const query = {};

        if (orderId) {
            query.orderId = orderId; // Add orderId to the query if provided
        }
        if (contactNumber) {
            query.contactNumber = contactNumber; // Add orderId to the query if provided
        }

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.createdAt = { $gte: startOfDay, $lt: endOfDay }; // Filter by date range
        }

        const orders = await Order.find(query); // Query the database
        res.status(200).json(orders); // Send the fetched orders
    } catch (error) {
        console.error('Error fetching orders with search:', error);
        res.status(500).json({ message: 'Error fetching orders.', error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch orders.', error: err.message });
    }
};

module.exports = { createOrder, getOrders ,getWithSearch};
