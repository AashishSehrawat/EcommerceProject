import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import NodeCache from "node-cache";
import Stripe from "stripe";
import cors from "cors";
import morgan from "morgan";


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
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "https://ecommerceproject-1-4t03.onrender.com", // Allow requests from the frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan("dev")); // logging middleware

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