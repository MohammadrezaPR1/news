import express from "express";
import { sendEmialMsg } from "../controllers/EmailMsgController.js";

const router = express.Router();

router.post("/send-email",sendEmialMsg)

export default router;