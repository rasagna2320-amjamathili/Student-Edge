import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import cdcRoutes from "./routes/cdcRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on port 5000');
});
app.use(cors()); 




const PORT = process.env.PORT || 5000;   //Listen to .env port or by default take 5000



// Connect to MongoDB
connectDB();

app.get("/", (req, res) => res.send("API is running"));


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// Middlewares
app.use(express.json());  // for parsing application/json
app.use(express.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded


//using the routes
app.use("/api/students", studentRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/cdcs",cdcRoutes);
app.use("/api/mentors",mentorRoutes);
app.use("/api/cdc", cdcRoutes);