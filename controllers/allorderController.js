// allorderController.js

const allOrder = require('../models/allorderSchema');

// Save or update a single order
const saveSingleOrder = async (req, res) => {
    try {
        const { order } = req.body;

        await allOrder.updateOne(
            { orderId: order.orderId },
            { $set: order },
            { upsert: true }
        );

        res.status(200).json({ message: 'Order saved successfully!' });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ message: 'Error saving order.', error: error.message });
    }
};

// Get all saved orders
const getAllSavedOrders = async (req, res) => {
    try {
        const orders = await allOrder.find(); // Fetch all orders from the database
        res.status(200).json(orders); // Return the list of saved orders
    } catch (error) {
        console.error('Error fetching saved orders:', error);
        res.status(500).json({ message: 'Error fetching saved orders.', error: error.message });
    }
};

// Fetch orders for the today day
const getOrdersByTodayDate = async (req, res) => { 
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await allOrder.find({
            createdAt: { $gte: startOfDay, $lt: endOfDay },
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching today's orders:", error);
        res.status(500).json({ message: 'Error fetching today\'s orders.', error: error.message });
    }
};


// Update an order by orderId
const updateOrderByOrderId = async (req, res) => {
    try {
        const { orderId, updatedOrder } = req.body;

        const result = await allOrder.updateOne(
            { orderId: orderId }, // Find order by orderId
            { $set: updatedOrder } // Update with new data
        );

        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Order updated successfully!' });
        } else {
            res.status(404).json({ message: 'Order not found.' });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order.', error: error.message });
    }
};

const getOrdersWithSearch = async (req, res) => {
    try {
        const { orderId, date , designerName ,contactNumber} = req.query;

        const query = {};

        if (orderId) {
            query.orderId = orderId; // Add orderId to the query if provided
        }

        if (designerName) {
            query.designerName = designerName; // Add orderId to the query if provided
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

        const orders = await allOrder.find(query); // Query the database
        res.status(200).json(orders); // Send the fetched orders
    } catch (error) {
        console.error('Error fetching orders with search:', error);
        res.status(500).json({ message: 'Error fetching orders.', error: error.message });
    }
};

const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await allOrder.countDocuments(); // Count all orders
        const deliveredOrders = await allOrder.countDocuments({ delivery: "Delivered" }); // Count delivered orders

        // Calculate total payments and pending payments
        const totalPayments = await allOrder.aggregate([
            { $group: { _id: null, total: { $sum: "$price" } } },
        ]);
        const pendingPayments = await allOrder.aggregate([
            { $match: { payment: "Pending" } }, // Match pending payments
            { $group: { _id: null, total: { $sum: "$price" } } },
        ]);

        res.status(200).json({
            totalOrders,
            deliveredOrders,
            totalPayments: totalPayments[0]?.total || 0,
            pendingPayments: pendingPayments[0]?.total || 0,
        });
    } catch (error) {
        console.error("Error fetching order stats:", error);
        res.status(500).json({ message: "Error fetching order stats.", error: error.message });
    }
};

const getOrdersWithTakenNo = async (req, res) => {
    try {
        // Get the current date and set time to midnight
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Start of the day

        // Set the end of the day
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // End of the day

        // Query for today's orders with `taken` as 'No', null, or not existing
        const orders = await allOrder.find({
            $and: [
                {
                    $or: [
                        { taken: 'No' },
                        { taken: { $exists: false } },
                        { taken: null },
                    ],
                },
                {
                    date: { $gte: startOfDay, $lte: endOfDay }, // Orders created today
                },
            ],
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching today\'s orders.', error: error.message });
    }
};


const getTakenYes = async (req, res) => {
    try {
        // Get the current date and set time to midnight
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Start of the day

        // Set the end of the day
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // End of the day

        // Query orders where "taken" is "Yes" and the date is within today
        const orders = await allOrder.find({
            $and: [
                { taken: 'Yes' },
                { date: { $gte: startOfDay, $lte: endOfDay } },
            ],
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching today\'s orders.', error: error.message });
    }
};

// Delete an order by orderId
const deleteOrderByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await allOrder.deleteOne({ orderId });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Order deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Order not found.' });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order.', error: error.message });
    }
};

module.exports = { saveSingleOrder, getAllSavedOrders, getOrdersByTodayDate , updateOrderByOrderId , getOrdersWithSearch ,getOrderStats ,getOrdersWithTakenNo ,getTakenYes ,deleteOrderByOrderId};


