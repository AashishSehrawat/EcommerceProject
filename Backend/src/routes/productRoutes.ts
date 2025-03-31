import express from "express";
import { getLatestProduct, newProduct } from "../controllers/productController.js";
import { adminOnly, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const app = express.Router();

// route - /api/v1/product/new
app.post("/new", verifyJWT, adminOnly, upload.fields([
    {
        name: "productPhoto",
        maxCount: 1,
    },
]), newProduct);

// route - /api/v1/product/latest
app.get("/latest", getLatestProduct)

export default app;