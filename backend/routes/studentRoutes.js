import express from "express";
import multer from "multer"; // Don't forget to import multer
import path from "path"; // Import path for file extension handling
import { 
  createAStudent,
  searchStudents,
  createMultipleStudents,
  getAllStudents,
  getStudentProfile,
  getPersonalDetails,
  getProfessionalDetails,
  updatePersonalDetails,
  updateProfessionalDetails
  
  
} from "../controllers/studentController.js";
import { loginUser, verifyToken,changePassword, forgotPasswordRequest, resetPassword } from "../middlewares/authMiddleware.js"; 

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
router.get("/personal-details", verifyToken, getPersonalDetails);
router.put("/personal-details", verifyToken,upload.none(), updatePersonalDetails);

router.get("/professional-details", verifyToken, getProfessionalDetails);
router.put("/professional-details", verifyToken,upload.none(), updateProfessionalDetails);

router.get('/profile', verifyToken, getStudentProfile);
router.get('/me', verifyToken, getStudentProfile);
router.post('/changePassword', verifyToken, changePassword);
router.post('/logout', verifyToken);
router.post('/forgot-password', forgotPasswordRequest); 
router.post('/reset-password/:userId/:token', resetPassword);



export default router;


 