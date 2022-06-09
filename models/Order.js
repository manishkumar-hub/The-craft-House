import Order from '../pages/order';

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentInfo: { type: String, default: "" },
    products: { type: Object, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    transactionId: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, default: 'Initiated', required: true },
    deliveryStatus: { type: String, default: 'unshift', required: true }
}, { timestamps: true });
mongoose.models = {}
export default mongoose.model("Order", OrderSchema)
