import express from "express";
import {
  allAdminOrders,
  myOrders,
  registerOrder,
  singleOrder,
  deleteOrder,
  processOrder,
} from "../controllers/orderController.js";
import { adminOnly, verifyJWT } from "../middlewares/auth.middleware.js";

const app = express.Router();

// route - /api/v1/order/new
app.post("/new", verifyJWT, registerOrder);

// route - /api/v1/order/myOrder
app.get("/myOrder", verifyJWT, myOrders);

// route - /api/v1/order/allAdmin
app.get("/allAdmin", verifyJWT, adminOnly, allAdminOrders);

// route - /api/v1/order/_id
app.get("/:_id", singleOrder);

// route - /api/v1/order/_id
app.put("/:_id", verifyJWT, adminOnly, processOrder);

// route - /api/v1/order/_id
app.delete("/:_id", verifyJWT, adminOnly, deleteOrder);

export default app;
