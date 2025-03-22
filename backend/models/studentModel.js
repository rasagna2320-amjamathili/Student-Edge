import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  roll_no: { type: String, required: true, unique: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^[a-zA-Z0-9._%+-]+@cbit\.org\.in$/, "Only college emails are allowed"]
  },
  password: { type: String, required: true }, // Hashed before saving
  skills: { type: [String], default: [] },
  mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: false }, // ✅ Mentor is now required
  resume: { type: String, default: "" }, // Store file path or URL
  profile: {
    projects: { type: [String], default: [] },
    linkedin: { type: String, default: "" }
  }
}, { timestamps: true });  // Adds createdAt & updatedAt

export const Student = mongoose.model("Student", studentSchema);
