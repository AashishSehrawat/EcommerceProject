import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";

// import user routes
import userRoute from './routes/userRoute.js';
import productRoute from "./routes/productRoutes.js";




const port = process.env.PORT || 3000;
const app = express();

app.use(express.json()); 
app.use(express.static("public"));
app.use(cookieParser());

// connect the database
connectDB();

// Using routes
app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)


app.get("/", (req, res) => {
    res.send("hello");
})

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
})