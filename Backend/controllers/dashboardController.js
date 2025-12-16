import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import Donation from "../models/donationModel.js";
import Ministry from "../models/ministryModel.js";

export const getDashboardStats = async (req, res, next) => {
    try {
        // 1. Total Members
        const totalMembers = await User.countDocuments({ role: "member" });

        // 1b. Total Public Users
        const totalPublicUsers = await User.countDocuments({ role: "public" });

        // 2. Total Ministries
        const totalMinistries = await Ministry.countDocuments();

        // 3. Upcoming Events (Next 30 days)
        const upcomingEvents = await Event.countDocuments({
            date: { $gte: new Date(), $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        });

        // 4. Total Donations (All time)
        const donationStats = await Donation.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
        ]);

        const totalDonations = donationStats.length > 0 ? donationStats[0].totalAmount : 0;

        // 5. Donations by Month (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyDonations = await Donation.aggregate([
            {
                $match: {
                    date: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalMembers,
                totalPublicUsers,
                totalMinistries,
                upcomingEvents,
                totalDonations,
                monthlyDonations,
            },
        });
    } catch (error) {
        next(error);
    }
};
