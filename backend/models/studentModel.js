import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll_no: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^1601(2[3-6])7(37|33)\d{3}$/, "Invalid roll number format"]
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^ugs\d{2}_\d{3}_(it|cse)\.[a-z]+@cbit\.org\.in$/, "Invalid college email format"]
  },
  password: { type: String, required: true },
  
  // New fields added
  skills: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  participatedTechEvents: { type: [String], default: [] },
  extraCurricularActivities: { type: [String], default: [] },
  coCurricularActivities: { type: [String], default: [] },
  additionalFields: { type: [String], default: [] }
});

const Student = mongoose.model("Student", studentSchema);
export default Student;