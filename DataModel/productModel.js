import mongoose from 'mongoose'

const productDetails = new mongoose.Schema({
    itemName: String,
    itemDescription: String,
    longDescription: String,
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
    isFeatured: Boolean,
    dateCreated: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Names'
    }
})

export const Products = mongoose.model('Products', productDetails)