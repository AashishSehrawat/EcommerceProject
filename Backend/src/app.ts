import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import NodeCache from "node-cache";
import Stripe from "stripe";

// import user routes
import userRoute from './routes/userRoute.js';
import productRoute from "./routes/productRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from "./routes/paymentRoute.js";
import statsRoutes from "./routes/statsRoutes.js";




const port = process.env.PORT || 3000;
const stripeKey = process.env.STRIPE_KEY || "";
const app = express();

app.use(express.json()); 
app.use(express.static("public"));
app.use(cookieParser());

// connect the database
connectDB();

// payment gateway using stripe
export const stripe = new Stripe(stripeKey);

// using node cache
export const nodeCache = new NodeCache();

// Using routes
app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dashboard", statsRoutes);


app.get("/", (req, res) => {
    res.send("hello");
})

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
})