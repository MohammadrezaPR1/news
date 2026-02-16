//  برای ایجاد مسیر های برنامه 

import express from "express";
import { Login, Logout, Profile, Register, deleteUser, getAllUsers, getUsers, updateProfile, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

// مسیر های صفحه اصلی 
router.get("/get-users",getUsers)

// مسیر های ادمین 
router .get("/token",refreshToken)
router.get("/users",verifyToken,getAllUsers)
router.post("/users/register",Register)
router.post("/users/login",Login)
router.delete("/users/logout",verifyToken,Logout)
router.get("/users/profile",verifyToken,Profile)
router.put("/users/update-Profile/:id",verifyToken,updateProfile)
router.put("/users/update/:id",verifyToken,updateUser)
router.delete("/users/delete/:id",verifyToken,deleteUser)


export default router;



/*


methods => {
    1. get => دریافت چیزی برای صفحه وب 
    2.post => مثلا برای زمانی که فرمی رو ارسال می کنم  باید از متد post  استفاده کنم 
    3.put =>  برای آپدیت اطاعات از آن استفاده می شود 
    4. delete => برای حذف یا لاگ اون اتفاده می شود 

    }
*/