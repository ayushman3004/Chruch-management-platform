import mongoose from "mongoose";

const ministrySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter ministry name"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please enter ministry description"],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Ministry is a private workspace, so no 'members' array needed for now
    },
    { timestamps: true }
);

export default mongoose.model("Ministry", ministrySchema);
