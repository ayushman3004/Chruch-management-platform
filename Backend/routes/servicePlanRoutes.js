import express from "express";
import {
    createServicePlan,
    getServicePlans,
    getServicePlan,
    updateServicePlan,
    deleteServicePlan,
} from "../controllers/servicePlanController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.route("/")
    .get(getServicePlans)
    .post(isAuthenticated, authorizeRoles("admin", "pastor", "staff"), createServicePlan);

router.route("/:id")
    .get(getServicePlan)
    .put(isAuthenticated, authorizeRoles("admin", "pastor", "staff"), updateServicePlan)
    .delete(isAuthenticated, authorizeRoles("admin", "pastor", "staff"), deleteServicePlan);

export default router;
