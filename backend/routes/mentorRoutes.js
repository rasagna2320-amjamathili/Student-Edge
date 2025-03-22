import express from "express";
import {Mentor} from "../models/mentorModel.js";
const router = express.Router();
//Create a new mentor
router.post("/", async (req, res) => {
    try {
        const mentor = new Mentor(req.body);
        await mentor.save();
        res.status(201).json(mentor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//  Get all mentors  
router.get("/", async (req, res) => {
    try {
        const mentors = await Mentor.find();
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;