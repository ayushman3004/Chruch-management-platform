import express from "express";
import {
    createMinistry,
    getMyMinistries,
    getMinistry,
    updateMinistry,
    deleteMinistry,
    getAllMinistries,
} from "../controllers/ministryController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.route("/admin/all")
    .get(isAuthenticated, authorizeRoles("admin"), getAllMinistries);

router.route("/")
    .get(isAuthenticated, authorizeRoles("member"), getMyMinistries)
    .post(isAuthenticated, authorizeRoles("member"), createMinistry);

router.route("/:id")
    .get(isAuthenticated, authorizeRoles("member"), getMinistry)
    .put(isAuthenticated, authorizeRoles("member"), updateMinistry)
    .delete(isAuthenticated, authorizeRoles("member"), deleteMinistry);

export default router;
