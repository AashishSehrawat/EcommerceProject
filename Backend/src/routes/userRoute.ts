import express from "express";
import { getAllUser, newUser, getUser, deleteUser, loginUser } from "../controllers/userController.js";

const app = express.Router();

// route - /api/v1/user/new
app.post("/new", newUser);

// route - /api/v1/user/login
app.post("/login", loginUser);

// route - /api/v1/user/all
app.get("/all", getAllUser);

// route - api/v1/user/:_id
app.delete("/:_id", deleteUser);

// route - /api/v1/user/:_id
app.get("/:_id", getUser);


export default app;