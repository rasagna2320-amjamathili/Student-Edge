import bcrypt from "bcrypt";
import {Student} from "../models/studentModel.js"; //named import
import { Mentor } from "../models/mentorModel.js"; // ✅ Import Mentor Model
import mongoose from 'mongoose';



//1.Creating a Profile(CDC)
export const createAStudent = async (req, res) => {
    try {
        const { name, roll_no, email, mentor_id } = req.body;

        // ✅ Validate required fields
        if (!name || !roll_no || !email || !mentor_id) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // ✅ Ensure email ends with @clg.ac.in
        if (!email.endsWith("@cbit.org.in")) {
            return res.status(400).json({ error: "Only college emails (@cbit.org.in) are allowed." });
        }
         // ✅ Check if student already exists (by roll_no)
         const existingStudent = await Student.findOne({ roll_no });
         if (existingStudent) {
             return res.status(400).json({ error: "Student already exists." });
             
         }
                 // ✅ Check if mentor exists
        const mentor = await Mentor.findOne({mentor_id});
        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found." });
        }

        // ✅ Generate default password as roll number + "P"
        const defaultPassword = roll_no + "P";

        // ✅ Hash the default password before saving
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // ✅ Create student with hashed password
        const student = new Student({ ...req.body, password: hashedPassword });
        await student.save();

          // ✅ Populate mentor details before sending response
          await student.populate("mentor_id", "name"); // Fetch only mentor's name

         // ✅ Exclude password from response for security
         const studentData = student.toObject();
         delete studentData.password;

        res.status(201).json({ message: "Student created successfully", student });
        }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//2. ✅ Search students by roll_no, name, or skills
export const searchStudents = async (req, res) => {
    try {
         // Get the search query from the URL's query parameter
         const searchQuery = req.query.search;
         console.log("My Received Query Param:", searchQuery);

        if (!searchQuery) {
            return res.status(400).json({ error: "Search query is required." });
        }

        // ✅ Define search conditions
        const searchConditions = [
            { roll_no: searchQuery }, // Exact match on roll number
            { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive name search
            { skills: { $regex: searchQuery, $options: "i" } }, // Search skills field
            { _id: new mongoose.Types.ObjectId(searchQuery) } // Search by _id if the search query is a valid ObjectId
        ];

        // ✅ Perform search
        const students = await Student.find({ $or: searchConditions });

        if (students.length > 0) {
            return res.json({ results: students });
        }

       /* // ✅ If no results, integrate GenAI for typo correction or fuzzy matching
        const correctedQuery = await getCorrectedQuery(searchQuery); // Implement AI logic separately
        const fuzzyResults = await Student.find({
            $or: [
                { name: { $regex: correctedQuery, $options: "i" } },
                { skills: { $regex: correctedQuery, $options: "i" } }
            ]
        });

        res.json({ correctedQuery, results: fuzzyResults });*/
        //Temporarily handlling the gen Ai part
        return res.json ({message:"The GEN AI will fetch results"});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


