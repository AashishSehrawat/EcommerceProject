import express from "express";
import {
  applyDiscount,
  createPaymentIntent,
  deleteCoupon,
  getAllCoupon,
  newCoupon,
} from "../controllers/paymentController.js";
import { adminOnly, verifyJWT } from "../middlewares/auth.middleware.js";

const app = express.Router();

// route - /api/v1/payment/create
app.post("/create", verifyJWT, createPaymentIntent);

// route - /api/v1/payment/coupon/new
app.post("/coupon/new", verifyJWT, adminOnly, newCoupon);

// route - /api/v1/payment/discount
app.get("/discount", verifyJWT, applyDiscount);

// route - /api/v1/payment/coupon/all
app.get("/coupon/all", verifyJWT, adminOnly, getAllCoupon);

app.get("/coupon/:_id", verifyJWT, adminOnly);

// route - /api/v1/payment/coupon/delete
app.delete("/coupon/:_id", verifyJWT, adminOnly, deleteCoupon);

export default app;
