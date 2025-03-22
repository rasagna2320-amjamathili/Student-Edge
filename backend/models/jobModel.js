import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }], // Array of skills needed
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "CDC" }, // CDC reference
  createdAt: { type: Date, default: Date.now },
});

export const Job = mongoose.model("Job", jobSchema);
