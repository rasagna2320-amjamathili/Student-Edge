import mongoose from "mongoose";

const cdcSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    // password: { type: String, required: true }, Store hashed
    jobsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
  }, { timestamps: true });

export const CDC = mongoose.model('CDC', cdcSchema);
  