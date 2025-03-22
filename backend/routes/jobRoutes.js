import express from "express";
import {Job} from "../models/jobModel.js";

const router = express.Router();

//  Create a job  
router.post("/", async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//  Get all jobs  
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;