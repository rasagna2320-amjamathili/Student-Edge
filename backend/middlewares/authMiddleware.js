import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/studentModel.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

console.log("Loaded SECRET_KEY:", process.env.JWT_SECRET);
const SECRET_KEY = process.env.JWT_SECRET; 

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in .env file");
}

// User Login Middleware
export const loginUser = async (req, res) => {
    try { 
        console.log("➡️ Received login request");
        console.log("📩 Raw Request Body:", req.body); // Debugging

        const { rollNo, password } = req.body;

        if (!rollNo || !password) {
            console.log("❌ Missing fields");
            return res.status(400).json({ error: "All fields are required." });
        }

        console.log("🔎 Searching for user with rollNo:", rollNo);
        const user = await Student.findOne({
            $or: [{ rollNo: rollNo }, { roll_no: rollNo }]
        });
        

        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({ error: "Invalid roll number or password." });
        }

        console.log("✅ User Found:", user);

        if (!user.password) {
            console.log("❌ User password is missing in the database");
            return res.status(500).json({ error: "User password is missing in the database." });
        }

        console.log("🔑 Comparing passwords...");
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("✅ Password Match:", isMatch);

        if (!isMatch) {
            console.log("❌ Incorrect password");
            return res.status(401).json({ error: "Invalid roll number or password." });
        }

        console.log("🔐 Generating JWT Token...");
        const token = jwt.sign({ id: user._id, rollNo: user.rollNo }, SECRET_KEY, { expiresIn: "1h" });

        console.log("✅ Token Generated:", token);
        console.log("🚀 Sending Response...");

        res.json({ token, user });

        console.log("✅ Response Sent Successfully");
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ 
            error: "Server error", 
            details: error.message, 
            stack: error.stack 
        });
    }
};

// Verify JWT Token Middleware
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    // Log the token received in the header for debugging
    console.log("Token received: ", token);

    // Ensure the token starts with "Bearer "
    if (!token.startsWith('Bearer ')) {
        return res.status(403).json({ error: "Token must be in the format: Bearer <token>" });
    }

    // Extract the token without the "Bearer " part
    const extractedToken = token.split(' ')[1];

    if (!extractedToken) {
        return res.status(403).json({ error: "Token is missing after Bearer." });
    }

    try {
        const decoded = jwt.verify(extractedToken, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("JWT Verification failed:", error);
        res.status(401).json({ error: "Invalid token." });
    }
};



