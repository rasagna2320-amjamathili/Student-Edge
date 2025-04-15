import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/studentModel.js";
import dotenv from "dotenv";
import {UserLoginCount} from '../models/visitorModel.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
dotenv.config(); // Load environment variables
// Nodemailer setup 
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const SECRET_KEY = process.env.JWT_SECRET; 

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in .env file");
}

// User Login Middleware

export const loginUser = async (req, res) => {
    try { 
        const { rollNo, password } = req.body;

        if (!rollNo || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const user = await Student.findOne({
            $or: [{ rollNo: rollNo }, { roll_no: rollNo }]
        });
        

        if (!user) {
            console.log(" User not found");
            return res.status(401).json({ error: "Invalid roll number or password." });
        }


        if (!user.password) {
            console.log(" User password is missing in the database");
            return res.status(500).json({ error: "User password is missing in the database." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(" Incorrect password");
            return res.status(401).json({ error: "Invalid roll number or password." });
        }

        console.log(" Generating JWT Token...");
        const token = jwt.sign({ id: user._id, rollNo: user.rollNo }, SECRET_KEY, { expiresIn: "1h" }); 
        // Increment visitor count after successful login
        await UserLoginCount.findOneAndUpdate(
            { _id: 'visitorCount' },
            { $inc: { count: 1 } },
            { new: true, upsert: true } // Create document if doesn't exist
        );

        console.log(" Sending Response...");
        res.json({ token, user });

        console.log(" Response Sent Successfully");
    } catch (error) {
        console.error("Login Error:", error);
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
// Function to check password strength
const isPasswordSecure = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = 8;
  
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
    );
  };
//Change Password
export const changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const studentId = req.user.id;
  
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide both current and new passwords.' });
      }
  
      if (!isPasswordSecure(newPassword)) {
        return res.status(400).json({
          message:
            'New password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.',
        });
      }
  
      if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'New password cannot be the same as the current password.' });
      }
      
  
      const student = await Student.findById(studentId).select('+password');
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found.' });
      }
  
      const isPasswordMatch = await bcrypt.compare(currentPassword, student.password);
  
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Incorrect current password.' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      student.password = hashedPassword;
      await student.save();
  
      res.status(200).json({ message: 'Password updated successfully.' });
  
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Something went wrong while changing the password.' });
    }
  };

  const generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

export const forgotPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({ message: 'Student with this email not found.' });
        }

        const resetToken = generateResetToken();
        const tokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

        student.resetPasswordToken = resetToken;
        student.resetPasswordExpires = tokenExpiry;
        await student.save();

        const resetLink = `http://yourfrontenddomain.com/reset-password/${student._id}/${resetToken}`; // Replace with your actual frontend reset password page URL

        const mailOptions = {
            from: 'your_email@example.com',
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You have requested a password reset. Click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a><p>This link will expire in 1 hour.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Failed to send reset email.' });
            }
            
            res.status(200).json({ message: 'Password reset link sent to your email address.' });
        });

    } catch (error) {
        console.error('Forgot password request error:', error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { userId, token } = req.params;
        const { newPassword } = req.body;

        const student = await Student.findById(userId);

        if (!student || student.resetPasswordToken !== token || student.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        student.password = hashedPassword;
        student.resetPasswordToken = undefined;
        student.resetPasswordExpires = undefined;
        await student.save();

        res.status(200).json({ message: 'Password reset successfully. You can now log in with your new password.' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};
