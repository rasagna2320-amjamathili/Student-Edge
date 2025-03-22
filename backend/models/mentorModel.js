import mongoose from "mongoose";
const mentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ID: { type: String, required: true, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Store hashed
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Assigned students
  }, { timestamps: true });
  
export const Mentor = mongoose.model('Mentor', mentorSchema);
  
  