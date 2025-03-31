import mongoose from "mongoose";

// interface IProduct {
//     name: string,
//     category: string,
//     photo: string,
//     price: number,
//     stock: number,
//     description: string,
// }

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    productPhoto: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    stock: {
        type: Number,
        required: true,
        trim: true,
        min: 0,
    },
    category: {
        type: String,
        enum: ["Shoes", "Laptop", "Mobile", "Clothes", "Accessories", "Tablets"],
        default: "None",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})

export const Product = mongoose.model("Product", productSchema);