import mongoose from 'mongoose'

const orderDetails = new mongoose.Schema({
    orderItems: [
        {
            type: String
        }
    ],
    shippingAddress1: String,
    shippingAddress2: String,
    city: String,
    zip: String,
    country: String,
    Phone: Number,
    Status: String,
    totalPrice: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Names'
    }
})

export const Orders = mongoose.model('Orders', orderDetails)
