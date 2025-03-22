import jwt from 'jsonwebtoken';
import { Student } from '../models/studentModel.js';  // Adjust the path based on your project structure

export const authenticateStudent = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: "Authentication required." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const student = await Student.findById(decoded.id); // Find the student by ID decoded from the token

        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        req.student = student;  // Attach the student object to the request
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};
