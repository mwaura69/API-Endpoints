import mongoose from 'mongoose'


const MarketPlaceData = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    street: String,
    apartment: String,
    city: String,
    zip: String,
    country: String,
    phone: Number,
    isAdmin: Boolean
});
export const Users = mongoose.model('Names', MarketPlaceData)