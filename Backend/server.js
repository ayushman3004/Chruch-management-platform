import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/dbConfig.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import ministryRoutes from "./routes/ministryRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import servicePlanRoutes from "./routes/servicePlanRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

// JSON Parsing
app.use(express.json());

// CORS for frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:5178",
      "http://localhost:5179",
      "http://localhost:5180",
      "http://localhost:5181"
    ],
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: false, // change to true when using HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    },
  })
);

// Database connection
dbConnect();

// Trigger restart
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/ministries", ministryRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/service-plans", servicePlanRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});