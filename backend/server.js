import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import cdcRoutes from "./routes/cdcRoutes.js";
import { loginUser } from "./middlewares/authMiddleware.js";
import bcrypt from 'bcrypt'; // Import bcrypt
import 'dotenv/config';

console.log("Loaded SECRET_KEY:", process.env.SECRET_KEY);


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));  // Adjust frontend port if needed

const PORT = process.env.PORT || 5000;   //Listen to .env port or by default take 5000

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => res.send("API is running"));


// Using the routes

app.use("/api/students", studentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/cdcs", cdcRoutes);
app.use("/api/mentors", mentorRoutes);

// Start the server only once
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
