import { stripe } from "../app.js";
import { Coupon } from "../models/couponModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPaymentIntent = asyncHandler(async(req , res) => {
    const { amount } = req.body;

    if(!amount) {
        throw new ApiError(404, "Please enter amount")
    };

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100, 
        currency: "inr"
    })
    if(!paymentIntent) {
        throw new ApiError(404, "Error creating payment Intent")
    }

    const clientSecret = paymentIntent.client_secret;
    if(!clientSecret) {
        throw new ApiError(404, "Client secret is not found"); 
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Payment successfull", clientSecret));  
})

const newCoupon = asyncHandler(async(req , res) => {
    const { coupon, amount } = req.body;
    if([coupon, amount].some(i => i?.trim === "")) {
        throw new ApiError(404, "All fields are required");
    }

    const generatedCoupon = await Coupon.create({coupon, amount});
    if(!generatedCoupon) {  
        throw new ApiError(404, "Coupon generation failed");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Coupon generated successfully", generatedCoupon));
})
 

const applyDiscount = asyncHandler(async(req , res) => {
    const {coupon} = req.query;

    const discount = await Coupon.findOne({coupon});
    if(!discount) {
        throw new ApiError(404, "Invalid coupon code");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Discount is provide successfully", discount.amount));
})


const getAllCoupon = asyncHandler(async(req , res) => {
    const coupons = await Coupon.find({});
    if(!coupons) {
        throw new ApiError(404, "No coupon is found as no coupon is generated");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "All coupon is feched successfully", coupons));
})


const deleteCoupon = asyncHandler(async(req , res) => {
    const {_id} = req.params;

    const coupon = await Coupon.findByIdAndDelete(_id);
    if(!coupon) {
        throw new ApiError(404, "Coupon is found as Id is invalid");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Coupon deleted successfully", coupon));

})

export { newCoupon, applyDiscount, getAllCoupon, deleteCoupon, createPaymentIntent }