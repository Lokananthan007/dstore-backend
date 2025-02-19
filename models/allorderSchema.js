const mongoose = require('mongoose');

const allOrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    date: { type: Date },
    contactNumber: { type: String },
    product: { type: String },
    price: { type: Number },
    photo: { type: String },
    taken: { type: String },
    designerName: { type: String },
    design: { type: String },
    payment: { type: String },
    print: { type: String },
    delivery: { type: String },
    remarks: { type: String },
}, { timestamps: true });

const allOrder = mongoose.model('AllOrder', allOrderSchema);

module.exports = allOrder;
