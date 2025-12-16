import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

//signup logic
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Only allow valid roles from signup
    const allowedRoles = ["admin", "member", "public"];
    let finalRole = allowedRoles.includes(role) ? role : "public";

    // Auto-admin for testing/setup
    if (email === 'admin@gracechurch.com') {
      finalRole = 'admin';
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      phone,
    });

    // AUTO LOGIN: Create session
    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    // Send response AFTER session is written
    return res.status(201).json({
      message: "User registered & logged in",
      user: req.session.user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong during registration",
    });
  }
};
//login  logic
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all details." });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found, Please Sign Up." });
    }
    //password matching
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password." });
    }
    //Creating Session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    //Sending response after session is written
    return res.status(200).json({
      message: "User logged in successfully",
      user: req.session.user
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
}
//logout logic 
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed." });
    }
    res.clearCookie('connect.sid'); //deletes cookies in browser 
    return res.status(200).json({ message: "User logged out successfully" });
  });
}

// getMe

export const getMe = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  return res.status(200).json({
    message: "User authenticated",
    user: req.session.user
  });
};