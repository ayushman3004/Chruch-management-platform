import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Required for Signup
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // Prevent password from showing in user fetch
    },

    // Role for permission system
    role: {
      type: String,
      enum: ["admin", "member", "public"],
      default: "public"
    },

    // Editable Profile Fields
    phone: {
      type: String,
      default: ""
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
      default: "prefer_not_to_say"
    },

    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" }
    },

    birthday: {
      type: Date,
      default: null
    },

    profileImage: {
      type: String, // Cloudinary or static URL
      default: null
    },

    // Church-related optional info
    ministries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ministry"
      }
    ],

    joinDate: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);