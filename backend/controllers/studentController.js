import bcrypt from "bcrypt";
import Student from "../models/studentModel.js";
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const saltRounds = 10; // Define saltRounds


export const createAStudent = async (req, res) => {
    try {
        const { name, roll_no, email, skills, certifications, techEvents, extraCurricular, coCurricular } = req.body;

        if (!name || !roll_no || !email) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const existingUser = await Student.findOne({ roll_no });
        if (existingUser) {
          return res.status(400).send("Roll number already registered.");
        }
        // Validate format
        if (!/^\d+$/.test(roll_no)) {
            return res.status(400).send("Roll number must be numeric.");
        }

        if (!roll_no.startsWith("1601")) {
            return res.status(400).send("Roll number must start with 1601.");
        }

        if (roll_no.length !== 12) {
            return res.status(400).send("Roll number must be 12 digits.");
        }

        const year = roll_no.substring(4, 6);
        const last3 = roll_no.slice(-3);
        const branchCode = roll_no.substring(6, 9);

        const branchCodeMap = {
            '732': 'civil',
            '733': 'cse',
            '729': 'aiml',
            '734': 'eee',
            '737': 'it',
            '735': 'ece',
            '736': 'mech',
            '771': 'aids',
            '802': 'chemical',
            '805': 'biotech'

        };

        if (!branchCodeMap[branchCode]) {
            return res.status(400).send("Invalid branch code in roll number.");
        }

        const dept = branchCodeMap[branchCode];
        if (!dept) return res.status(400).send("Invalid branch code.");

        const pattern = new RegExp(`^ugs${year}${last3}_[a-zA-Z]+\\.${dept}@cbit\\.org(\.in)?$/`);

        if (!pattern.test(email)) {
            return res.status(400).send("Email Invalid!");
        }
        // Generate password by concatenating roll number with 'P'
        const password = roll_no + 'P';

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
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

export const getStudentProfile = async (req, res) => {
    try {

        const studentId = req.user.id;

        if (!studentId) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Error fetching student profile data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


// Function to get professional details
export const getProfessionalDetails = async (req, res) => {
    try {
        const studentId = req.user.id;

        if (!studentId) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const student = await Student.findById(studentId).select('roll_no branch currentYear currentSemester CGPA skills certifications participatedTechEvents extraCurricularActivities coCurricularActivities personalPortfolio competitiveCodingProfiles githubProfile linkedinProfile profilePicture additionalFields -_id');

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Error fetching professional details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Function to get personal details
export const getPersonalDetails = async (req, res) => {
    try {
        const studentId = req.user.id;

        if (!studentId) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const student = await Student.findById(studentId).select('name dob contact address motherName fatherName schoolName schoolLocation schoolPercentage schoolBoard interCollegeName interLocation interStream interPercentage interBoard achievements profilePicture -_id');

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Error fetching personal details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Function to update personal details
export const updatePersonalDetails = async (req, res) => {
    try {

        const studentId = req.user.id;
        const updateData = { ...req.body };


        const allowedPersonalFields = [
            "dob",
            "contact",
            "address",
            "motherName",
            "fatherName",
            "schoolName",
            "schoolLocation",
            "schoolPercentage",
            "schoolBoard",
            "interCollegeName",
            "interLocation",
            "interStream",
            "interPercentage",
            "interBoard",
            "achievements",
            "profilePicture"
        ];

        const filteredUpdateData = {};
        allowedPersonalFields.forEach((field) => {
            if (updateData.hasOwnProperty(field)) {
                filteredUpdateData[field] = updateData[field];
            }
        });

        // Ensure array fields are handled correctly (if sent as strings)
        if (filteredUpdateData.achievements && typeof filteredUpdateData.achievements === "string") {
            filteredUpdateData.achievements = filteredUpdateData.achievements.split(",").map((item) => item.trim());
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { $set: filteredUpdateData },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found." });
        }

        res.status(200).json({
            message: "Personal details updated successfully",
            student: updatedStudent.toObject(),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to update professional details
export const updateProfessionalDetails = async (req, res) => {
    try {
        const studentId = req.user.id;
        const updateData = { ...req.body };
        console.log("Update Data:", updateData); // Debugging log

        const allowedProfessionalFields = [
            "currentYear",
            "currentSemester",
            "CGPA",
            "skills",
            "certifications",
            "participatedTechEvents",
            "extraCurricularActivities",
            "coCurricularActivities",
            "personalPortfolio",
            "competitiveCodingProfiles",
            "githubProfile",
            "linkedinProfile",
            "additionalFields",
            "profilePicture"
        ];

        const filteredUpdateData = {};
        allowedProfessionalFields.forEach((field) => {
            if (updateData.hasOwnProperty(field)) {
                filteredUpdateData[field] = updateData[field];
            }
        });

        // Ensure array fields are handled correctly (if sent as strings)
        ["skills", "certifications", "participatedTechEvents", "extraCurricularActivities", "coCurricularActivities", "competitiveCodingProfiles", "additionalFields"].forEach(field => {
            if (filteredUpdateData[field] && typeof filteredUpdateData[field] === "string") {
                filteredUpdateData[field] = filteredUpdateData[field].split(",").map(item => item.trim());
            }
        });

        // Handle profile picture update
        if (req.file) {
            // If a new file is uploaded, update the profilePicture field with the URL
            const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`; // Assuming your server is running on localhost:5000
            filteredUpdateData.profilePicture = imageUrl;
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { $set: filteredUpdateData },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found." });
        }

        res.status(200).json({
            message: "Details updated successfully",
            student: updatedStudent.toObject(),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const visitorCount= async (req, res) => {
    try {
      const count = await Visitor.countDocuments();
      res.json({ count });
    } catch (error) {
      console.error('Error fetching visitor count:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
