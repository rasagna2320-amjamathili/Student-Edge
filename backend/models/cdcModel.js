import mongoose from "mongoose";
import bcrypt from "bcrypt";

const cdcSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        unique: true, 
        required: true, 
        match: [/^[a-zA-Z0-9._%+-]+@cbit\.org\.in$/, "Only @cbit.org.in emails allowed"] 
    },
    password: { type: String, required: true }, // Store hashed password
    jobsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, { timestamps: true });

// Hash password before saving
cdcSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const CDC = mongoose.model("CDC", cdcSchema);

  

