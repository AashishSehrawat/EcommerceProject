import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    coupon: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    }
}, {timestamps: true})

export const Coupon = mongoose.model("Coupon", couponSchema);