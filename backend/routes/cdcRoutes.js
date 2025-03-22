import express from "express";
import {CDC} from "../models/cdcModel.js";
const router = express.Router();
import {updateCDCRecord,getAllCDCRecords, createCDCRecord} from "../controllers/cdcController.js"


router.patch("/:id",updateCDCRecord);
router.get("/",getAllCDCRecords);
router.post("/",createCDCRecord);

export default router;