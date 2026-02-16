import express from "express";
import {verifyToken} from "../middleware/VerifyToken.js"
import { createCategory, deleteCategory, getCategory, getCategoryForHomePage, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();

// مسیر های صفحه اصلی 
router.get("/home/get-category",getCategoryForHomePage)

//  مسیر های پنل ادمین 
router.get("/get-category",verifyToken,getCategory)
router.post("/create-category",verifyToken,createCategory)
router.put("/update-category/:id",verifyToken,updateCategory)
router.delete("/delete-category/:id",verifyToken,deleteCategory)

export default router;