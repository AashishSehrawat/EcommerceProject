import express from "express";
import { newUser } from "../controllers/userController.js";

const app = express.Router();

// route - /api/v1/user/new
app.post("/new", newUser);

export default app;