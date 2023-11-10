import mongoose from 'mongoose'

const cartItems = new mongoose.Schema({
    itemName: String,
    itemDescription: String,
    image: String,
    images: [
        {
            manyImages: String
        }
    ],
    brand: String,
    price: Number,
    Category: String,
    countInStock: Number,
    rating: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Names"
    }
})

export const Carts = mongoose.model("Carts", cartItems)