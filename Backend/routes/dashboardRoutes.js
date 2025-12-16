import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/stats", isAuthenticated, authorizeRoles("admin", "pastor"), getDashboardStats);

export default router;
