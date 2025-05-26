import { CDC } from "../models/cdcModel.js"; 
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import {UserLoginCount} from '../models/visitorModel.js';


export const registerCDC = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Ensure all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if email is valid
        if (!email.endsWith("@cbit.org.in")) {
            return res.status(400).json({ error: "Only @cbit.org.in emails are allowed." });
        }

        // Check if CDC account already exists
        const existingCDC = await CDC.findOne({ email });
        if (existingCDC) {
            return res.status(400).json({ error: "CDC account already exists with this email." });
        }

        // Create and save CDC account
        const newCDC = new CDC({ name, email, password });
        await newCDC.save();

        res.status(201).json({ message: "CDC account created successfully", cdc: { name, email } });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// CDC User Login Middleware
 // Ensure you import the visitor model

export const loginCDC = async (req, res) => {
    try {
        const { email, password } = req.body;
  
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const cdcPattern = /^cdc[a-zA-Z0-9_.]*@cbit\.org(\.in)?$/;
      
        if (!cdcPattern.test(email)) {
          return res.status(400).json({ error: "Please enter a valid CDC email" });
        }
        // Check if CDC user exists
        const cdcUser = await CDC.findOne({ email });
        if (!cdcUser) {
            return res.status(400).json({ error: "User not found." });
        }
  
        // Check if password matches
        const isMatch = await bcrypt.compare(password, cdcUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password." });
        }
  
        // Generate JWT token
        const token = jwt.sign({ userId: cdcUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Increment visitor count after successful login
        await UserLoginCount.findOneAndUpdate(
            { _id: 'visitorCount' },
            { $inc: { count: 1 } },
            { new: true, upsert: true } // Create document if doesn't exist
        );
  
        // Return token in response
        res.status(200).json({
            success: true,
            token,
            message: "Login successful!",
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
