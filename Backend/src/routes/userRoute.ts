import express from "express";
import { getAllUser, newUser, getUser, deleteUser, loginUser, logoutUser } from "../controllers/userController.js";
import { adminOnly, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const app = express.Router();

// route - /api/v1/user/new
app.post("/new",upload.fields([
    {
        name: "photo",
        maxCount: 1,
    },
]) ,newUser);

// route - /api/v1/user/login
app.post("/login", loginUser);

// route - /api/v1/user/logout
app.post("/logout", verifyJWT, logoutUser);

// route - /api/v1/user/all
app.get("/all", verifyJWT, adminOnly, getAllUser);

// route - api/v1/user/:_id
app.delete("/:_id", verifyJWT, adminOnly, deleteUser);

// route - /api/v1/user/:_id
app.get("/:_id", verifyJWT, adminOnly, getUser);


export default app;