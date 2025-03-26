import bcrypt from "bcrypt";
import Student from "../models/studentModel.js"; //named import
import { Mentor } from "../models/mentorModel.js"; //  Import Mentor Model
import mongoose from 'mongoose';


const saltRounds = 10; // Define saltRounds

export const createAStudent = async (req, res) => {
    try {
        console.log("Received Data:", req.body); // Debugging
        const { name, roll_no, email, skills, certifications, techEvents, extraCurricular, coCurricular } = req.body;

        if (!name || !roll_no || !email) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Generate password by concatenating roll number with 'P'
        const password = roll_no + 'P';

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Generated Password:", password);
        console.log("Hashed Password:", hashedPassword);

        const newStudent = new Student({
            name,
            roll_no,
            email,
            password: hashedPassword,
            skills: skills || [], // Default to an empty array if not provided
            certifications: certifications || [],
            techEvents: techEvents || [],
            extraCurricular: extraCurricular || [],
            coCurricular: coCurricular || []
        });

        await newStudent.save();
        return res.status(201).json({ message: "Student created successfully." });

    } catch (error) {
        console.error("Error creating student:", error.message);
        return res.status(500).json({ error: error.message });
    }
};



  export const createMultipleStudents = async (studentsData) => {
    try {
      // Loop through the students data and generate a hashed password for each
      const studentsWithHashedPasswords = await Promise.all(
        studentsData.map(async (studentData) => {
          const { name, roll_no, email } = studentData;
  
          // Generate password by concatenating roll number with 'P'
          const password = roll_no + 'P'; 
          
  
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          
  
          return {
            name,
            roll_no,
            email,
            password: hashedPassword
          };
        })
      );
  
      // Insert the students into the database
      await Student.insertMany(studentsWithHashedPasswords);
      console.log('Students inserted successfully');
    } catch (error) {
      console.error('Error inserting students:', error.message);
    }
  };

//Search students by roll_no, name, skills
export const searchStudents = async (req, res) => {
    try {
        const searchQuery = req.query.search;
        if (!searchQuery) {
            return res.status(400).json({ error: "Search query is required." });
        }

        const isValidObjectId = (query) => mongoose.Types.ObjectId.isValid(query);

        let students; // Declare once

        if (isValidObjectId(searchQuery)) {
            students = await Student.findById(searchQuery);
            if (students) return res.json({ results: [students] });
        } else {
            const searchConditions = [
                { roll_no: searchQuery },
                { name: { $regex: searchQuery, $options: "i" } },
                { skills: { $regex: searchQuery, $options: "i" } }
            ];

            students = await Student.find({ $or: searchConditions });

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
        }

        return res.json({ message: "The GEN AI will fetch results" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select("-password");

        if (!students || students.length === 0) {
            return res.status(404).json({ error: "No students found." });
        }

        res.status(200).json({ students });
    } catch (error) {
        console.error("Error fetching students:", error);  // Debugging log
        res.status(500).json({ error: "Failed to retrieve students." });
    }
};
//Update Student Profiles
export const updateStudentProfile = async (req, res) => {
    try {
        const studentId = req.user.id; // Extract from token
        const updateData = req.body;

        // Prevent editing of non-editable fields
        const nonEditableFields = ["name", "roll_no", "email", "password"];
        nonEditableFields.forEach(field => delete updateData[field]);

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found." });
        }

        res.status(200).json({ message: "Profile updated successfully", student: updatedStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

