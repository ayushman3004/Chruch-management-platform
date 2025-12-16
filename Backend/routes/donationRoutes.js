import express from "express";
import {
    createDonation,
    getAllDonations,
    getMyDonations,
    getDonation,
    getDonationStats,
    getMemberDonations,
} from "../controllers/donationController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.route("/stats").get(getDonationStats);
router.route("/members-stats").get(isAuthenticated, authorizeRoles("admin", "pastor"), getMemberDonations);

router.route("/")
    .post(isAuthenticated, createDonation)
    .get(isAuthenticated, authorizeRoles("admin", "pastor"), getAllDonations);

router.route("/my").get(isAuthenticated, getMyDonations);


router.route("/:id").get(isAuthenticated, getDonation);


export default router;
