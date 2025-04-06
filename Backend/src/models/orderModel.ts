import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingOrderInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    shippingCharges: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true, 
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Proccessing", "Shipped", "Delivered"],
      default: "Proccessing",
    },
    orderItems: [
        {
            title: String,
            photo: String,
            price: Number,
            quantity: Number,
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        },
    ]
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
