import express from "express";
import { registerOrder } from "../controllers/orderController.js";

const app = express.Router();

// route - /api/v1/order/new
app.post("/new", registerOrder);

export default app;