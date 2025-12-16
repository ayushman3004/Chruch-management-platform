import User from "../models/userModel.js";
import Ministry from "../models/ministryModel.js";
import Event from "../models/eventModel.js";
import bcrypt from "bcryptjs";

// ========================
// GET LOGGED-IN USER
// ========================
export const getUserProfile = async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.newUser;

    if (!sessionUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(sessionUser.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching user profile" });
  }
};


// ========================
// UPDATE LOGGED-IN USER
// ========================
export const updateUserProfile = async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.newUser;

    if (!sessionUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = sessionUser.id;
    const {
      name,
      phone,
      gender,
      address,
      birthday,
      profileImage,
      oldPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {
      name,
      phone,
      gender,
      address,
      birthday,
      profileImage,
    };

    // If user is changing password
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({
          message: "Old password is required to change password.",
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect old password." });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    // Sync session with updated information
    req.session.user = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating user profile" });
  }
};

// ========================
// GET ALL USERS (ADMIN)
// ========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ========================
// DELETE USER (ADMIN)
// ========================
// ========================
// DELETE USER (ADMIN)
// ========================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all ministries owned by this user
    const ministries = await Ministry.find({ owner: user._id });

    // For each ministry, delete associated events
    for (const ministry of ministries) {
      await Event.deleteMany({ ministry: ministry._id });
    }

    // Delete the ministries
    await Ministry.deleteMany({ owner: user._id });

    // Delete the user
    await user.deleteOne();

    res.status(200).json({ success: true, message: "User and all associated ministries/events deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

// ========================
// GET PUBLIC USERS (NO AUTH)
// ========================
export const getPublicUsers = async (req, res) => {
  try {
    const publicUsers = await User.find({ role: "public" }).select("-password");
    res.status(200).json({ success: true, users: publicUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching public users" });
  }
};

// ========================
// UPGRADE TO MEMBERSHIP
// ========================
export const upgradeMembership = async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.newUser;

    if (!sessionUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(sessionUser.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already a member
    if (user.role !== "public") {
      return res.status(400).json({ message: "You are already a member" });
    }

    const { paymentAmount } = req.body;

    // Validate payment amount
    if (!paymentAmount || paymentAmount < 100) {
      return res.status(400).json({ message: "Invalid payment amount. Membership fee is $100." });
    }

    // In a real application, you would integrate with a payment gateway here
    // For now, we'll simulate successful payment

    // Update user role to member
    user.role = "member";
    await user.save();

    // Update session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      message: "Membership upgraded successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Membership upgrade error:", error);
    return res.status(500).json({ message: "Error upgrading membership" });
  }
};