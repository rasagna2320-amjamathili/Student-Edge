import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from "./config/db.js"; 
import studentRoutes from "./routes/studentRoutes.js"; 
import jobRoutes from "./routes/jobRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import cdcRoutes from "./routes/cdcRoutes.js";

// Load environment variables
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;
console.log("Loaded SECRET_KEY:", SECRET_KEY);

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is missing in .env file");
}

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => res.send("API is running"));

// Using routes
app.use("/api/students", studentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/cdcs", cdcRoutes);
app.use("/api/mentors", mentorRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
