import {CDC} from "../models/cdcModel.js";
//Create a new cdc record
export const createCDCRecord= async (req, res) => {
    try {
        const cdc = new CDC(req.body);
        await cdc.save();
        res.status(201).json(cdc);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//  Get all cdc records
export const getAllCDCRecords =  async (req, res) => {
    try {
        const cdcRecords = await CDC.find();
        res.json(cdcRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//updateCDCRecord
export const updateCDCRecord = async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: "ID is required" });

        const updatedRecord = await CDC.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRecord) return res.status(404).json({ success: false, message: "Record not found" });

        res.status(200).json({ success: true, data: updatedRecord });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



