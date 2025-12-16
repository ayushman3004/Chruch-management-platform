import ServicePlan from "../models/servicePlanModel.js";

// Create Service Plan
export const createServicePlan = async (req, res, next) => {
    try {
        const servicePlan = await ServicePlan.create(req.body);
        res.status(201).json({ success: true, servicePlan });
    } catch (error) {
        next(error);
    }
};

// Get All Service Plans
export const getServicePlans = async (req, res, next) => {
    try {
        const servicePlans = await ServicePlan.find().sort({ date: 1 });
        res.status(200).json({ success: true, servicePlans });
    } catch (error) {
        next(error);
    }
};

// Get Single Service Plan
export const getServicePlan = async (req, res, next) => {
    try {
        const servicePlan = await ServicePlan.findById(req.params.id)
            .populate("worshipLeader", "name")
            .populate("volunteers.user", "name");

        if (!servicePlan) {
            return res.status(404).json({ message: "Service Plan not found" });
        }

        res.status(200).json({ success: true, servicePlan });
    } catch (error) {
        next(error);
    }
};

// Update Service Plan
export const updateServicePlan = async (req, res, next) => {
    try {
        const servicePlan = await ServicePlan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!servicePlan) {
            return res.status(404).json({ message: "Service Plan not found" });
        }

        res.status(200).json({ success: true, servicePlan });
    } catch (error) {
        next(error);
    }
};

// Delete Service Plan
export const deleteServicePlan = async (req, res, next) => {
    try {
        const servicePlan = await ServicePlan.findById(req.params.id);

        if (!servicePlan) {
            return res.status(404).json({ message: "Service Plan not found" });
        }

        await servicePlan.deleteOne();

        res.status(200).json({ success: true, message: "Service Plan deleted" });
    } catch (error) {
        next(error);
    }
};
