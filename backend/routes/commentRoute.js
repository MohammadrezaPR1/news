import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { active, createComment, deleteComment, getAllComments, getComments, unActive, updateComment } from "../controllers/commentController.js";

const router = express.Router();


router.get("/comments/get/:newsId",getComments);
router.get("/comments",verifyToken,getAllComments);
router.post("/comments/create",createComment);
router.put("/comments/active/:id",verifyToken,active);
router.put("/comments/unactive/:id",verifyToken,unActive);
router.put("/comments/update/:id",verifyToken,updateComment);
router.delete("/comments/delete/:id",verifyToken,deleteComment);


export default router; 