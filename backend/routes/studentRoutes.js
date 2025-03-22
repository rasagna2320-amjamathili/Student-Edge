import express from "express";

import mongoose, { get } from "mongoose";
import {createAStudent,searchStudents, updateStudentProfile} from "../Controllers/studentController.js";
import { authenticateStudent } from "../middlewares/authMiddleware.js";  // Import the middleware

const router = express.Router();

// Apply the authentication middleware before updating profile
router.patch("/update", updateStudentProfile);

  

router.post("/create",createAStudent);
//router.get("/:idOrRollNo", getStudentProfile);
// ✅ Search students by roll number, name, or skills
router.get("/search", searchStudents);



export default router;
 