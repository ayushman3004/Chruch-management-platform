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

/* =========================================================
   TRUST PROXY (REQUIRED for Render behind HTTPS)
========================================================= */
app.set("trust proxy", 1);

/* =========================================================
   CORS CONFIG (WORKS FOR ALL VERCEL DOMAINS)
========================================================= */
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith("http://localhost")) return callback(null, true);
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* =========================================================
   BODY PARSERS
========================================================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   SESSION CONFIG (CROSS-DOMAIN SAFE)
========================================================= */
app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: true,       // REQUIRED for HTTPS
      sameSite: "none",   // REQUIRED for cross-site cookies
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

/* =========================================================
   DATABASE CONNECTION
========================================================= */
dbConnect();

/* =========================================================
   ROUTES
========================================================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/ministries", ministryRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/service-plans", servicePlanRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* =========================================================
   ERROR HANDLER
========================================================= */
app.use(errorMiddleware);

/* =========================================================
   START SERVER
========================================================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});