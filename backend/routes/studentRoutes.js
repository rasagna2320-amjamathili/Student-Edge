import express from "express";
import multer from "multer"; // Don't forget to import multer
import path from "path"; // Import path for file extension handling
import { 
  createAStudent,
  searchStudents,
  updateStudentProfile,
  createMultipleStudents,
  getAllStudents,
  getStudentProfile
} from "../controllers/studentController.js";
import { loginUser, verifyToken } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// Set up multer storage and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Where you want to store the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Generates unique filename based on timestamp
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage });

// Student Routes
router.post("/create", createAStudent);
router.get("/search", searchStudents);
router.get("/all", getAllStudents);
router.post("/login", loginUser);  
router.post("/createMultiple", createMultipleStudents);
router.get("/profile", verifyToken, getStudentProfile);
router.get('/me', verifyToken, getStudentProfile);
router.patch('/update', verifyToken, upload.single('profilePicture'), updateStudentProfile);



export default router;


 