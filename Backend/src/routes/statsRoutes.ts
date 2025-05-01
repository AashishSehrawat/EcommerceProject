import express from "express";
import { adminOnly, verifyJWT } from "../middlewares/auth.middleware.js";
import { getBarChart, getDashboardStats, getLineChart, getPieChart } from "../controllers/statsController.js";

const app = express.Router();

// route - /api/v1/dashboard/stats
app.get("/stats", verifyJWT, adminOnly, getDashboardStats );

// route - /api/v1/dashboard/pie
app.get("/pie",verifyJWT, adminOnly, getPieChart );

// route - /api/v1/dashboard/bar
app.get("/bar", verifyJWT, adminOnly, getBarChart);

// route - /api/v1/dashboard/line
app.get("/line", verifyJWT, adminOnly, getLineChart);

export default app;