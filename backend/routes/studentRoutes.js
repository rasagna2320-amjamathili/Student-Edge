import express from "express";
import mongoose, { get } from "mongoose";
import {createAStudent,searchStudents, updateStudentProfile, createMultipleStudents, getAllStudents } from "../Controllers/studentController.js";
import {loginUser,verifyToken} from "../middlewares/authMiddleware.js";  // Import the middleware

const router = express.Router();


router.post("/create",createAStudent);
router.get("/search", searchStudents);
router.get("/all",getAllStudents);
router.post("/login", loginUser);
router.post("/createMultiple",createMultipleStudents);
router.patch("/update", verifyToken, updateStudentProfile);

export default router;
 