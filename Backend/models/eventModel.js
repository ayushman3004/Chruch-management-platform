import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please enter event title"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please enter event description"],
        },
        date: {
            type: Date,
            required: [true, "Please enter event date"],
        },
        location: {
            type: String,
            required: [true, "Please enter event location"],
        },
        // Optional category if needed, but keeping it simple for now
        category: {
            type: String,
            default: 'worship'
        },
        banner: {
            type: String, // URL to image
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ministry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ministry",
            required: false,
        },
        rsvp: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                status: {
                    type: String,
                    enum: ["accepted", "declined", "maybe"],
                    default: "maybe",
                },
            },
        ],
        // Removed attendance as per "There is no attendance tracking in the system" requirement
    },
    { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
