import mongoose from "mongoose";

const servicePlanSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: [true, "Please enter service date"],
        },
        title: {
            type: String,
            default: "Sunday Service",
        },
        speaker: {
            type: String, // Can be a guest speaker name or linked to a User
            required: true,
        },
        worshipLeader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        songs: [
            {
                title: String,
                artist: String,
                key: String,
            },
        ],
        volunteers: [
            {
                role: String, // e.g., "Usher", "Sound", "Media"
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            },
        ],
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ServicePlan", servicePlanSchema);
