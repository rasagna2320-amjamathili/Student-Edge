import { CDC } from "../models/cdcModel.js"; 

export const registerCDC = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Ensure all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if email is valid
        if (!email.endsWith("@cbit.org.in")) {
            return res.status(400).json({ error: "Only @cbit.org.in emails are allowed." });
        }

        // Check if CDC account already exists
        const existingCDC = await CDC.findOne({ email });
        if (existingCDC) {
            return res.status(400).json({ error: "CDC account already exists with this email." });
        }

        // Create and save CDC account
        const newCDC = new CDC({ name, email, password });
        await newCDC.save();

        res.status(201).json({ message: "CDC account created successfully", cdc: { name, email } });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
