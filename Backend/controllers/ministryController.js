import Ministry from "../models/ministryModel.js";
import Event from "../models/eventModel.js";

// Create Ministry
export const createMinistry = async (req, res, next) => {
    try {
        // Automatically assign logged-in user as owner
        req.body.owner = req.session.user.id;

        const ministry = await Ministry.create(req.body);
        res.status(201).json({ success: true, ministry });
    } catch (error) {
        next(error);
    }
};

// Get My Ministries (Private Workspace)
export const getMyMinistries = async (req, res, next) => {
    try {
        // Only fetch ministries owned by the logged-in member
        const ministries = await Ministry.find({ owner: req.session.user.id });
        res.status(200).json({ success: true, ministries });
    } catch (error) {
        next(error);
    }
};

// Get Single Ministry (Private Workspace)
export const getMinistry = async (req, res, next) => {
    try {
        const ministry = await Ministry.findOne({
            _id: req.params.id,
            owner: req.session.user.id
        });

        if (!ministry) {
            return res.status(404).json({ message: "Ministry not found or access denied" });
        }

        res.status(200).json({ success: true, ministry });
    } catch (error) {
        next(error);
    }
};

// Update Ministry
export const updateMinistry = async (req, res, next) => {
    try {
        const ministry = await Ministry.findOneAndUpdate(
            { _id: req.params.id, owner: req.session.user.id },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!ministry) {
            return res.status(404).json({ message: "Ministry not found or access denied" });
        }

        res.status(200).json({ success: true, ministry });
    } catch (error) {
        next(error);
    }
};

// Delete Ministry
export const deleteMinistry = async (req, res, next) => {
    try {
        const ministry = await Ministry.findOne({
            _id: req.params.id,
            owner: req.session.user.id
        });

        if (!ministry) {
            return res.status(404).json({ message: "Ministry not found or access denied" });
        }

        // Delete all events under this ministry
        await Event.deleteMany({ ministry: ministry._id });

        await ministry.deleteOne();

        res.status(200).json({ success: true, message: "Ministry and associated events deleted" });
    } catch (error) {
        next(error);
    }
};
// Get All Ministries (Admin)
export const getAllMinistries = async (req, res, next) => {
    try {
        const ministries = await Ministry.find().populate("owner", "name email");
        res.status(200).json({ success: true, ministries });
    } catch (error) {
        next(error);
    }
};
