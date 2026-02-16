import express from "express";
import {verifyToken} from "../middleware/VerifyToken.js"
import { addLike, createNews, deleteNews, getAllNews, getCatNews, getDetailNews, getLastNews, getLastRelatedNews, getNewsById, mostView, popularNews, updateNews } from "../controllers/newsController.js";

const router = express.Router();

router.get("/news/lastnews",getLastNews);
router.get("/news/detail/:id",getDetailNews);
router.get("/news/related/:id",getLastRelatedNews);
router.put("/news/like/:id",addLike)
router.get("/news/popular",popularNews);
router.get("/news/mostView",mostView)
router.get("/news/cat-news",getCatNews);


router.get("/news",verifyToken,getAllNews);
router.post("/create-news",verifyToken,createNews);
router.get("/news/:id",verifyToken,getNewsById);
router.put("/update-news/:id",verifyToken,updateNews);
router.delete("/delete-news/:id",verifyToken,deleteNews);
export default router;