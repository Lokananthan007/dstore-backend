// orderRoutes.js

const express = require('express');
const { createOrder, getOrders ,getWithSearch} = require('../controllers/orderController');
const router = express.Router();

router.post('/save', createOrder);
router.get('/get', getOrders);
router.get('/search', getWithSearch);

module.exports = router;
