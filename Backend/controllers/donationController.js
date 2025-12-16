import Donation from "../models/donationModel.js";

// Create Donation
export const createDonation = async (req, res, next) => {
    try {
        req.body.donor = req.session.user.id;
        const donation = await Donation.create(req.body);
        res.status(201).json({ success: true, donation });
    } catch (error) {
        next(error);
    }
};

// Get All Donations (Admin/Pastor only)
export const getAllDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find().populate("donor", "name email");
        res.status(200).json({ success: true, donations });
    } catch (error) {
        next(error);
    }
};

// Get My Donations
export const getMyDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find({ donor: req.session.user.id });
        res.status(200).json({ success: true, donations });
    } catch (error) {
        next(error);
    }
};

// Get Single Donation
export const getDonation = async (req, res, next) => {
    try {
        const donation = await Donation.findById(req.params.id).populate("donor", "name email");

        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }

        // Only donor or admin/pastor can view
        if (
            donation.donor._id.toString() !== req.session.user.id &&
            !["admin", "pastor"].includes(req.session.user.role)
        ) {
            return res.status(403).json({ message: "Not authorized to view this donation" });
        }

        res.status(200).json({ success: true, donation });
    } catch (error) {
        next(error);
    }
};

// Get Donation Statistics
export const getDonationStats = async (req, res, next) => {
    try {
        console.log("Fetching donation stats...");

        // Get total count first to verify data existence
        const totalCount = await Donation.countDocuments();
        console.log(`Total donations found: ${totalCount}`);

        // Get total donation amount
        const totalResult = await Donation.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        console.log("Aggregation result:", totalResult);

        // Get unique donor count
        const uniqueDonors = await Donation.distinct("donor");

        // Get recent donations
        const recentDonations = await Donation.find()
            .populate("donor", "name")
            .sort({ createdAt: -1 })
            .limit(10);

        console.log(`Found ${recentDonations.length} recent donations`);

        const stats = {
            totalAmount: totalResult.length > 0 ? totalResult[0].totalAmount : 0,
            totalDonations: totalCount, // Use countDocuments for reliability
            totalDonors: uniqueDonors.length,
            recentDonations
        };

        res.status(200).json({ success: true, stats });
    } catch (error) {
        console.error("Error fetching stats:", error);
        next(error);
    }
};
// Get Member Donation Stats (Admin only)
export const getMemberDonations = async (req, res, next) => {
    try {
        const donationStats = await Donation.aggregate([
            {
                $group: {
                    _id: "$donor",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        await Donation.populate(donationStats, { path: "_id", select: "name email role" });

        const formattedStats = donationStats.map(stat => ({
            user: stat._id,
            totalAmount: stat.totalAmount,
            count: stat.count
        })).filter(stat => stat.user); // Filter out null users if any

        res.status(200).json({ success: true, memberDonations: formattedStats });
    } catch (error) {
        next(error);
    }
};
