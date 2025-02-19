// allorderRoutes.js
const express = require('express');
const router = express.Router();
const { saveSingleOrder , getAllSavedOrders, getOrdersByTodayDate ,updateOrderByOrderId ,getOrdersWithSearch,getOrderStats,getOrdersWithTakenNo,getTakenYes , deleteOrderByOrderId} = require('../controllers/allorderController');

router.post('/save-one', saveSingleOrder); // Save a single order
// Get all saved orders
router.get('/get', getAllSavedOrders);

router.get('/get-today', getOrdersByTodayDate); // Fetch orders for the current date

router.put('/update', updateOrderByOrderId); // Update an order by orderId

router.get('/search', getOrdersWithSearch);

router.get('/stats', getOrderStats); // Route to get order stats

router.get('/takenNo', getOrdersWithTakenNo);

router.get('/takenYes', getTakenYes);

router.delete('/delete/:orderId', deleteOrderByOrderId); // Add this route for deleting an order


module.exports = router;
