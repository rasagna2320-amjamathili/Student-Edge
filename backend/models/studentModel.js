import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll_no: {
    type: String,
    required: true,
    unique: true,
    //match: [/^1601(2[3-6])7(37|33)\d{3}$/, "Invalid roll number format"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    //match: [/^ugs\d{5}_(it|cse)\.[a-z]+@cbit\.org\.in$/, 'Invalid college email format']
  },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  cgpa: { type: Number },

  // Personal Details
  dob: { type: Date },
  contact: { type: String },
  address: { type: String },
  schoolName: { type: String },
  schoolBoard: { type: String },
  schoolPercentage: { type: Number },
  interCollegeName: { type: String },
  interBoard: { type: String },
  interPercentage: { type: Number },
  achievements: { type: [String], default: [] },

  // Professional Details
  linkedinProfile: { type: String },
  githubProfile: { type: String },
  skills: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  participatedTechEvents: { type: [String], default: [] },
  extraCurricularActivities: { type: [String], default: [] },
  coCurricularActivities: { type: [String], default: [] },
  additionalFields: { type: [String], default: [] },


  motherName: String, 
  interLocation: String,
  interStream: String,        
  fatherName: String,     
  currentSemester: String, 
  currentYear: String,     
  personalPortfolio: String, 
  schoolLocation: String,
  competitiveCodingProfiles: [String],
  
});

const Student = mongoose.model("Student", studentSchema);
export default Student;