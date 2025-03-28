import express from "express";
import {CDC} from "../models/cdcModel.js";
import { loginCDC,registerCDC } from "../controllers/cdcController.js";

const router = express.Router();

router.post("/loginCDC",loginCDC);
router.post("/register", registerCDC);

export default router;