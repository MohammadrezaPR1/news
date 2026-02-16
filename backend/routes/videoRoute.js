import express from "express";
import {verifyToken} from "../middleware/VerifyToken.js"
import { createVideo, deleteVideo, getAllVideo, getSingleVideo, updateVideo } from "../controllers/videoController.js";

const router = express.Router();
router.post("/create-video",verifyToken,createVideo);
router.put('/edit-video/:id',verifyToken,updateVideo)
router.get("/get-video",verifyToken,getAllVideo);
router.get("/single-video",getSingleVideo);
router.delete("/delete-video/:id",verifyToken,deleteVideo);

export default router;