import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import NodeCache from "node-cache";


// import user routes
import userRoute from './routes/userRoute.js';
import productRoute from "./routes/productRoutes.js";
import orderRoutes from './routes/orderRoutes.js';




const port = process.env.PORT || 3000;
const app = express();

app.use(express.json()); 
app.use(express.static("public"));
app.use(cookieParser());

// connect the database
connectDB();

// using node cache
export const nodeCache = new NodeCache();

// Using routes
app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/order", orderRoutes);


app.get("/", (req, res) => {
    res.send("hello");
})

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
})