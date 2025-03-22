import bcrypt from "bcrypt";
import {Student} from "../models/studentModel.js"; //named import
import { Mentor } from "../models/mentorModel.js"; // ✅ Import Mentor Model
import mongoose from 'mongoose';



// 1. Creating a Profile (CDC)
export const createAStudent = async (req, res) => {
    try {
        const { name, roll_no, email /*, mentor_id*/ } = req.body;

        // ✅ Validate required fields
        if (!name || !roll_no || !email || !mentor_id) {   //AFTER ADDING MENTOR
            return res.status(400).json({ error: "All fields are required." });
        }

        // Ensure email ends with @clg.ac.in
        if (!email.endsWith("@cbit.org.in")) {
            return res.status(400).json({ error: "Only college emails (@cbit.org.in) are allowed." });
        }

        // ✅ Check if student already exists (by roll_no)
        const existingStudent = await Student.findOne({ roll_no });
        if (existingStudent) {
            return res.status(400).json({ error: "Student already exists." });
        }

        // ✅ Check if mentor exists   //AFTER ADDING MENTOR
        /* const mentor = await Mentor.findOne({ mentor_id });  
         // Check if student already exists (by roll_no)
         const existingStudent = await Student.findOne({ roll_no });
         if (existingStudent) {
             return res.status(400).json({ error: "Student already exists." });
             
         }
                 // Check if mentor exists
        const mentor = await Mentor.findOne({mentor_id});
        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found." });  
        } */

        // Generate default password as roll number + "P"
        const defaultPassword = roll_no + "P";

        // Hash the default password before saving
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        //  Create student with hashed password
        const student = new Student({ ...req.body, password: hashedPassword });
        await student.save();

        // ✅ Populate mentor details before sending response      //AFTER ADDING MENTOR
        // await student.populate("mentor_id", "name"); // Fetch only mentor's name
          // Populate mentor details before sending response
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

// 2. ✅ Search students by roll_no, name, or skills
//2.  Search students by roll_no, name, or skills
export const searchStudents = async (req, res) => {
    try {
        // Get the search query from the URL's query parameter
        const searchQuery = req.query.search;
        console.log("My Received Query Param:", searchQuery);

        // Check if it is a valid ObjectId
        const isValidObjectId = (searchQuery) => {
            return mongoose.Types.ObjectId.isValid(searchQuery);
        };

        if (!searchQuery) {
            return res.status(400).json({ error: "Search query is required." });
        }

        let students;

        if (isValidObjectId(searchQuery)) {
            // Search by ObjectId
            students = await Student.findById(searchQuery);
            if (students) {
                return res.json({ results: [students] });
            }
        } else {
            // Define search conditions other than ID
            const searchConditions = [
                { roll_no: searchQuery }, // Exact match on roll number
                { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive name search
                { skills: { $regex: searchQuery, $options: "i" } }, // Search skills field
            ];
            console.log(searchConditions);
            // Perform search
            students = await Student.find({ $or: searchConditions });

        //  Perform search
        const students = await Student.find({ $or: searchConditions });

            if (students.length > 0) {
                return res.json({ results: students });
            }
        }

        // Temporarily handling the Gen AI part
        return res.json({ message: "The GEN AI will fetch results" });
        if (students.length > 0) {
            return res.json({ results: students });
        }

       /* //  If no results, integrate GenAI for typo correction or fuzzy matching
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

// 3. Update student profile
export const updateStudentProfile = async (req, res) => {
    try {
        // Simulating the student from the request (In real case, fetch from DB using student ID or session)
        const studentId = req.studentId || "146146"; // Replace this with actual authentication mechanism
        const student = await Student.findOne({ "roll_no": studentId });

        if (!student) {
            return res.status(400).json({ error: "Student not found. Please log in." });
        }

        // Extract the fields from the request body
        const { skills, tech_participations, other_field } = req.body;

        // Check if any valid fields are provided
        const updatesToApply = {};

        if (skills) updatesToApply.skills = skills;
        if (tech_participations) updatesToApply.tech_participations = tech_participations;
        if (other_field) updatesToApply.other_field = other_field;

        // If no updates are provided, return the same profile (with no changes)
        if (Object.keys(updatesToApply).length === 0) {
            const updatedStudent = student.toObject(); // Convert to plain object
            delete updatedStudent.password; // Don't send password back
            return res.status(200).json({
                message: "No changes were made. Profile remains the same.",
                student: updatedStudent,
            });
        }

        // Apply the updates to the student object
        Object.assign(student, updatesToApply);

        // Save the updated profile to the database
        await student.save();

        // Convert the updated student to plain object and remove password before sending
        const updatedStudent = student.toObject();
        delete updatedStudent.password;

        return res.status(200).json({
            message: "Profile updated successfully",
            student: updatedStudent,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
