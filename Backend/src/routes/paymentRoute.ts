import express from "express";
import { applyDiscount, deleteCoupon, getAllCoupon, newCoupon } from "../controllers/paymentController.js";
import { adminOnly, verifyJWT } from "../middlewares/auth.middleware.js";

const app = express.Router();

// route - /api/v1/payment/coupon/new
app.post("/coupon/new", verifyJWT, adminOnly, newCoupon);

// route - /api/v1/payment/discount
app.get("/discount", verifyJWT, applyDiscount);

// route - /api/v1/payment/coupon/all
app.get("/coupon/all", verifyJWT, adminOnly, getAllCoupon);

// route - /api/v1/payment/coupon/delete
app.delete("/coupon/:_id", verifyJWT, adminOnly, deleteCoupon);


export default app;