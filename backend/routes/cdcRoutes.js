import express from "express";
import {CDC} from "../models/cdcModel.js";
import { registerCDC } from "../controllers/cdcController.js";

const router = express.Router();

router.post("/register", registerCDC);

export default router;