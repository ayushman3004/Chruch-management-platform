import express from "express";
import isAuthenticated from "../middlewares/authMiddleware.js";
import { getUserProfile, updateUserProfile, getAllUsers, deleteUser, getPublicUsers, upgradeMembership } from "../controllers/userController.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateUserProfile);

// Membership upgrade
router.post("/upgrade-membership", isAuthenticated, upgradeMembership);

// Public Routes
router.get("/public", getPublicUsers);

// Admin Routes
router.get("/", isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteUser);

export default router;