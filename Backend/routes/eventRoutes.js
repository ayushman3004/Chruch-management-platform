import express from "express";
import {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    rsvpEvent,
    getAdminEvents
} from "../controllers/eventController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.route("/admin/all").get(isAuthenticated, authorizeRoles("admin"), getAdminEvents);

router.route("/")
    .get(getEvents)
    .post(isAuthenticated, authorizeRoles("admin", "member"), createEvent);

router.route("/:id")
    .get(getEvent)
    .put(isAuthenticated, authorizeRoles("admin", "member"), updateEvent)
    .delete(isAuthenticated, authorizeRoles("admin", "member"), deleteEvent);

router.route("/:id/rsvp").put(isAuthenticated, rsvpEvent);

export default router;
