//  برای نوشتن منطق های  برنامه

import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { error, log } from "console";
import { json } from "sequelize";

//  این تابع همه ی کاربران رو از جدول یوزرز میگیره و نمایش میده
export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({});
    res.json(users);
  } catch (error) {
    console.log(`we have som error :  
        ${error}`);
  }
};


// برای صفحه تماس با ما 
export const getUsers = async(req,res)=>{
  try {
    const users = await Users.findAll({});
    res.json(users)
  } catch (error) {
    console.log(error);
  }
}



// تابع رجیستر
export const Register = async (req, res) => {
  try {
    const { name, email, password, confPassword, isAdmin } = req.body;
    if (password !== confPassword) {
      res.json({ error: "پسورد و تکرار آن همخوانی ندارند. مجددا تلاش کنید" });
    } else {
      // هش کردن پسورد
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      //  بررسی تکراری نبودن ایمیل ثبت نام
      const found = await Users.findOne({
        where: { email: req.body.email },
      });
      if (found) {
        return res.json({ error: "ایمیل قبلا ثبت نام کرده است" });
      }
      // ثبت نام کاربر و درج آندر بانک اطلاعاتی
      try {
        await Users.create({
          name: name,
          email: email,
          password: hashPassword,
          isAdmin: isAdmin,
        });
        res.json({ msg: "ثبت نام موفقیت آمیز بود" });
      } catch (error) {
        console.log(`we have some errer : 
                ${error}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// تابع ورود کاربر با ایمیل و پسورد
export const Login = async (req, res) => {
  try {
    // پیدا کردن یک کاربر با ایمیل وارد شده
    const user = await Users.findAll({
      where: { email: req.body.email },
    });
    // مقایسه پسورد وارد شده توسط کاربر و پسورد ثبت شده در بانک اطلاعاتی
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      return res.json({ error: "پسورد وارد شده نادرست است" });
    }

    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const isAdmin = user[0].isAdmin;
    const profileImage = user[0].url;
    // user[0] => یعنی یکی از کاربران

    // CREATE ACCESS_TOKEN
    const accsessToken = jwt.sign(
      { userId, name, email, isAdmin },
      process.env.ACCSESS_TOKEN_SECRET,
      { expiresIn: "45S" }
    );

    // CREATE REFRESH_TOKEN
    const refreshToken = jwt.sign(
      { userId, name, email, isAdmin },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //  قرار دادن رفرش توکن داخل دیتابیس کاربر
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    //  قرار دادن رفرش توکن داخل کوکی مرورگر کاربر
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      accsessToken,
      userId,
      name,
      email,
      isAdmin,
      profileImage,
      msg: "شما با موفقیت وارد شدید ",
    });
  } catch (error) {
    res.json({ error: "! کاربری یافت نشد  " });
  }
};

// تابع خروج کاربر .پاک کردن کوکی ایجاد شده از مرورگر و رفرش توکن ذخیره شده در پایگاه
export const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.json("توکن پیدا نشد");
    const user = await Users.findOne({
      where: { refresh_token: refreshToken },
    });
    // res.json(user)
    if (!user) return res.json({error:"کاربری یافت نشد "});
    const clr = null;
    await Users.update(
      { refresh_token: clr },
      {
        where: { id: user.id },
      }
    );
    res.clearCookie("refreshToken");
    res.json({ msg: "خروج موفقیت آمیز بود" });
  } catch (error) {
    console.log(`we have som error on Logout function :
    ${error}`);
  }
};

// تابع حذف کاربر
export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.json({ error: "کاربر یافت نشد" });
  try {
    await Users.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({msg:"کاربر با موفقیت حذف شد"});
  } catch (error) {
    console.log(`we have some error : 
    ${error}`);
  }
};

// تابع ویرایش کاربر توسط مدیر
export const updateUser = async (req, res) => {
  const { name, email, password, confPassword, isAdmin } = req.body;
  if (password !== confPassword) {
    return res.json({ error: "پسورد و تکرار آن باهم برابر نیستند " });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        isAdmin: isAdmin,
      },
      {
        where: {
          id: req.params.id, // => req.body.id
        },
      }
    );
    res.json({ msg: "تغییرات با موفقیت اعمال شدند" });
  } catch (error) {
    console.log(`we have some error : 
    ${error}`);
  }
};

// تابع ویرایش پروفایل کاربر توسط خود کاربر
export const updateProfile = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) {
    return res.status(404).json("کاربری یافت نشد");
  }
  let fileName = "";
  if (req.files == null) {
    fileName = user.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name); // دریافت پسوند عکس
    const dateNow = Math.round(Date.now());
    fileName = dateNow + ext;
    // تعیین کردن تایپ های مجاز نصویر
    const allowedType = [".png",".jpg",".jpeg",".webp"];
    // ولیدیشن تایپ تصویر آپلود شده
    if (!allowedType.includes(ext.toLowerCase())) {
      return res.json({ error: ":فرمت عکس نا معتبر است" });
    }
    // ولیدیشن حجم عکس آپلود شده
    if (fileSize > 1000000) {
      return res.json({error:"حجم عکس نباید بیشتر از یک مگابایت باشد "});
    }

    // حذف عکس قبلی از بانک اطلاعاتی
    if(user.image){
      const filePath = `./public/images/${user.image}`;
      fs.unlinkSync(filePath); // عکس من رو از سیستم پاک میکنه
    }
    // انتقال تصویر آپلود شده به پروژه
    file.mv(`./public/images/${fileName}`, async(err) => {
      if(err) return res.json({error:err.message})
    });
  }

  const { name, password, confPassword } = req.body;

  if (password !== confPassword) {
    return res.json({error:"پسورد و تکرار آن باهم برابر نیستند"});
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  // url ذخیره مسیر عکس در متغیر
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  try {
    await Users.update(
      { name: name, password: hashPassword, image:fileName, url: url },
      {
        where: {
          id: req.params.id,
        }
      }
    );
    res.json({ msg: "کاربر با موفقیت ویرایش شد" });
  } catch (error) {
    console.log(`we have some error : 
    ${error}`);
  }
};

// نمایش اطلاعات پروفایل کاربر به کاربر
export const Profile = async (req, res) => {
  try {
    const id = req.userId;
    const user = await Users.findByPk(id);
    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        url: user.url,
      });
    } else {
      res.json({ error: "کاربری یافت نشد" });
    }
  } catch (error) {
    console.log(`we have some error : 
    ${error}`);
  }
};







