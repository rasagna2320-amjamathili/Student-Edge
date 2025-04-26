import mongoose from 'mongoose';
import Student from './models/studentModel.js';
import dotenv from 'dotenv'; // Import the dotenv library

dotenv.config(); // Load environment variables from .env file (if it exists)

// Get the MongoDB URI from the environment variable
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI environment variable not found. Please set it.');
    process.exit(1); // Exit the process if the URI is not defined
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            const updateResult = await Student.updateMany(
                {},
                {
                    $set: {
                        motherName: null,
                        fatherName: null,
                        interStream: null,
                        schoolLocation: null,
                        interLocation: null,

                        
                        currentSemester: null,
                        currentYear: null,
                        personalPortfolio: null,
                        competitiveCodingProfiles: []

                    }
                }
            );

            console.log(`Successfully updated ${updateResult.modifiedCount} student records.`);
        } catch (error) {
            console.error('Error updating student records:', error);
        } finally {
            mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        }
    })
    .catch(err => console.error('Could not connect to MongoDB', err));