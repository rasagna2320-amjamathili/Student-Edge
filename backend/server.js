import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js'; 
import studentRoutes from './routes/studentRoutes.js'; 
import cdcRoutes from './routes/cdcRoutes.js';
import { UserLoginCount } from './models/visitorModel.js'; // Import visitor model

// Load environment variables
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is missing in .env file");
}

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => res.send("API is running"));
app.use("/api/students", studentRoutes);
app.use("/api/cdcs", cdcRoutes);



// Route to get the visitor count
app.get('/visitor-count', async (req, res) => {
    try {
      const visitorCount = await UserLoginCount.findOne({ _id: 'visitorCount' });
  
      if (!visitorCount) {
        return res.status(200).json({ count: 0 }); // Explicit status code
      }
  
      return res.status(200).json({ count: visitorCount.count }); // Explicit status code
    } catch (error) {
      console.error('Error fetching visitor count:', error); // Log the error
      return res.status(500).json({ success: false, message: 'Internal server error' }); // More user friendly message
    }
  });

// Start the server
app.listen(PORT, () => console.log(`Server is running`));