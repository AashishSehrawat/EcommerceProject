import express from "express";
import { getSingleProduct, getAdminProduct, getAllCatogries, getLatestProduct, newProduct, updateProduct, deleteProduct, getProductBySearch } from "../controllers/productController.js";
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

// route - /api/v1/product/categories
app.get("/categories", getAllCatogries);

// route - /api/v1/product/search
app.get("/search-product", getProductBySearch);

// route - /api/v1/product/admin-products
app.get("/admin-products", verifyJWT, adminOnly, getAdminProduct);

// route - /api/v1/product/_id
app.get("/:_id", getSingleProduct);

// route - /api/v1/product/update-product
app.put("/:_id", verifyJWT, adminOnly, upload.fields([
    {
        name: "productPhoto",
        maxCount: 1,
    }
]), updateProduct)

// route - /api/v1/product/_id
app.delete("/:_id", verifyJWT, adminOnly, deleteProduct);

export default app;