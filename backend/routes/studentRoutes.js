import express from "express";

import mongoose, { get } from "mongoose";
import {createAStudent,searchStudents} from "../Controllers/studentController.js";


const router = express.Router();  

router.post("/",createAStudent);
//router.get("/:idOrRollNo", getStudentProfile);
// ✅ Search students by roll number, name, or skills
router.get("/search", searchStudents);



export default router;
 