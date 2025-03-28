import express from "express";
import { 
  createAStudent,
  searchStudents,
  updateStudentProfile,
  createMultipleStudents,
  getAllStudents,
  getStudentProfile
} from "../Controllers/studentController.js";

import { loginUser, verifyToken } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// Student Routes
router.post("/create", createAStudent);
router.get("/search", searchStudents);
router.get("/all", getAllStudents);
router.post("/login", loginUser);  // Ensure this is correctly handled in controller
router.post("/createMultiple", createMultipleStudents);
router.patch("/update", verifyToken, updateStudentProfile);
router.get("/profile", verifyToken, getStudentProfile);

export default router;

 