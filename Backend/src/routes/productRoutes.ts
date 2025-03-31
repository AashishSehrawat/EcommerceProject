import express from "express";
import { newProduct } from "../controllers/productController.js";
import { adminOnly, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const app = express.Router();

// route /api/v1/product/new
app.post("/new", verifyJWT, adminOnly, upload.single("productImage"), newProduct);

export default app;