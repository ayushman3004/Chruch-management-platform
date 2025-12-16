import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: [true, "Please enter donation amount"],
        },
        type: {
            type: String,
            enum: ["tithe", "offering", "mission", "charity", "other"],
            default: "tithe",
        },
        date: {
            type: Date,
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card", "bank_transfer", "online"],
            default: "online",
        },
        notes: {
            type: String,
        },
        message: {
            type: String,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
