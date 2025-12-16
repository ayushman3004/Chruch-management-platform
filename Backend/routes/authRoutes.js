import isAuthenticated from "../middlewares/authMiddleware.js";
import { registerUser, loginUser, logoutUser, getMe } from "../controllers/authController.js";
import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/me", isAuthenticated, getMe);

export default router;
