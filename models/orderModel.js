// orderModel.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    company:{ type: String , required :true},
    contactNumber: { type: String, required: true },
    product: { type: String, required: true },
    price: { type: String, required: true },
    photo: { type: String, required: true },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
