import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();

// import user routes
import userRoute from './routes/userRoute.js';



const port = process.env.PORT || 3000;
const app = express();

app.use(express.json()); 

// connect the database
connectDB();

// Using routes
app.use("/api/v1/user", userRoute)


app.get("/", (req, res) => {
    res.send("hello");
})

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
})