import News from "../models/newsModel.js";
import path from "path";
import fs from "fs";
import Category from "../models/categoryModel.js";
import Users from "../models/userModel.js";
import { Op } from "sequelize";
import { error } from "console";

// تابع دریافت همه ی خبر ها
export const getAllNews = async (req, res) => {
  try {
    const news = await News.findAll({
      include: [Users],
    });
    res.json(news);
  } catch (error) {
    console.log(`we have some error on getAllNews function :
        ${error}`);
  }
};

// تابع ساخت خبر جدید
export const createNews = async (req, res) => {
  try {
    if (req.files == null) return res.json({ msg: "عکسی انتخاب نکردید" });
    const {
      title,
      description,
      subTitle1,
      subDescription1,
      subTitle2,
      subDescription2,
      subTitle3,
      subDescription3,
      subTitle4,
      subDescription4,
      catId,
      userId,
    } = req.body;

    // Handle Main Image (the original field)
    const file = req.files.file;
    if (!file) return res.json({ msg: "عکس اصلی انتخاب نشده است" });
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const dateNow = Math.round(Date.now());
    const fileName = dateNow + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];
    if (!allowedType.includes(ext.toLowerCase())) {
      return res.json({
        msg: "فرمت عکس نامعتبر است. فرمت‌های مجاز: png, jpg, jpeg",
      });
    }
    if (fileSize > 5000000) {
      return res.json({ error: "حجم عکس نباید بیشتر از 5 مگابایت باشد" });
    }

    // Handle Multiple Images
    let imagesNames = [];
    let imagesUrls = [];
    if (req.files.images) {
      const imagesFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const img of imagesFiles) {
        const imgExt = path.extname(img.name);
        const imgFileName = Math.round(Date.now() + Math.random() * 1000) + imgExt;
        const imgUrl = `${req.protocol}://${req.get("host")}/images/${imgFileName}`;
        await img.mv(`./public/images/${imgFileName}`);
        imagesNames.push(imgFileName);
        imagesUrls.push(imgUrl);
      }
    }

    // Handle Video
    let videoFileName = null;
    let videoUrl = null;
    if (req.files.video) {
      const videoFile = req.files.video;
      const vidExt = path.extname(videoFile.name).toLowerCase();
      const allowedVidType = [".mp4", ".mkv", ".avi"];
      if (!allowedVidType.includes(vidExt)) {
        return res.json({ msg: "فرمت ویدیو نامعتبر است" });
      }
      videoFileName = Math.round(Date.now() + Math.random() * 1000) + vidExt;
      videoUrl = `${req.protocol}://${req.get("host")}/videos/${videoFileName}`;
      await videoFile.mv(`./public/videos/${videoFileName}`);
    }

    await file.mv(`./public/images/${fileName}`);

    try {
      await News.create({
        title: title,
        description: description,
        subTitle1: subTitle1,
        subDescription1: subDescription1,
        subTitle2: subTitle2,
        subDescription2: subDescription2,
        subTitle3: subTitle3,
        subDescription3: subDescription3,
        subTitle4: subTitle4,
        subDescription4: subDescription4,
        catId: catId,
        userId: userId,
        image: fileName,
        url: url,
        images: JSON.stringify(imagesNames),
        imagesUrl: JSON.stringify(imagesUrls),
        video: videoFileName,
        videoUrl: videoUrl,
      });
      res.json({ msg: "خبر با موفقیت آپلود شد" });
    } catch (error) {
      console.log(`we have some error : 
            ${error}`);
      res.status(500).json({ msg: "خطا در سرور" });
    }
  } catch (error) {
    console.log(`we have some error on createNews function : 
        ${error}`);
    res.status(500).json({ msg: "خطا در سرور" });
  }
};

// تابع دریافت یک خبر بر اساس آیدی
export const getNewsById = async (req, res) => {
  try {
    const response = await News.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(`we have some error on getNewsById function :
        ${error} `);
  }
};

// تابع ویرایش خبر
export const updateNews = async (req, res) => {
  const news = await News.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!news) return res.json({ msg: "خبری یافت نشد" });

  let fileName = news.image;
  let url = news.url;
  let imagesNames = news.images ? JSON.parse(news.images) : [];
  let imagesUrls = news.imagesUrl ? JSON.parse(news.imagesUrl) : [];
  let videoFileName = news.video;
  let videoUrl = news.videoUrl;

  if (req.files) {
    // Update Main Image
    if (req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const dateNow = Math.round(Date.now());
      fileName = dateNow + ext;
      const allowedType = [".png", ".jpg", ".jpeg"];
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.json({ error: "فرمت عکس نامعتبر است" });
      }
      if (fileSize > 5000000) {
        return res.json({ error: "حجم عکس نباید بیشتر از 5 مگابایت باشد" });
      }

      // Delete old image
      const oldFilePath = `./public/images/${news.image}`;
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

      await file.mv(`./public/images/${fileName}`);
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }

    // Update Multiple Images
    if (req.files.images) {
      // Delete old images
      if (news.images) {
        const oldImages = JSON.parse(news.images);
        oldImages.forEach((img) => {
          const oldPath = `./public/images/${img}`;
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        });
      }

      imagesNames = [];
      imagesUrls = [];
      const imagesFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const img of imagesFiles) {
        const imgExt = path.extname(img.name);
        const imgFileName = Math.round(Date.now() + Math.random() * 1000) + imgExt;
        const imgUrl = `${req.protocol}://${req.get("host")}/images/${imgFileName}`;
        await img.mv(`./public/images/${imgFileName}`);
        imagesNames.push(imgFileName);
        imagesUrls.push(imgUrl);
      }
    }

    // Update Video
    if (req.files.video) {
      // Delete old video
      if (news.video) {
        const oldVidPath = `./public/videos/${news.video}`;
        if (fs.existsSync(oldVidPath)) fs.unlinkSync(oldVidPath);
      }

      const videoFile = req.files.video;
      const vidExt = path.extname(videoFile.name).toLowerCase();
      videoFileName = Math.round(Date.now() + Math.random() * 1000) + vidExt;
      videoUrl = `${req.protocol}://${req.get("host")}/videos/${videoFileName}`;
      await videoFile.mv(`./public/videos/${videoFileName}`);
    }
  }

  const {
    title,
    description,
    subTitle1,
    subDescription1,
    subTitle2,
    subDescription2,
    subTitle3,
    subDescription3,
    subTitle4,
    subDescription4,
    catId,
    userId,
  } = req.body;

  try {
    await News.update(
      {
        title: title,
        description: description,
        subTitle1: subTitle1,
        subDescription1: subDescription1,
        subTitle2: subTitle2,
        subDescription2: subDescription2,
        subTitle3: subTitle3,
        subDescription3: subDescription3,
        subTitle4: subTitle4,
        subDescription4: subDescription4,
        catId: catId,
        userId: userId,
        image: fileName,
        url: url,
        images: JSON.stringify(imagesNames),
        imagesUrl: JSON.stringify(imagesUrls),
        video: videoFileName,
        videoUrl: videoUrl,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.json({ msg: "ویرایش خبر با موفقیت انجام شد" });
  } catch (error) {
    console.log(`we have some error on updateNews function : ${error}`);
    res.status(500).json({ msg: "خطا در ویرایش خبر" });
  }
};

// تابع حذف یک خبر
export const deleteNews = async (req, res) => {
  const news = await News.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!news) return res.json({ msg: "این خبر یافت نشد" });
  try {
    // Delete Main Image
    const filePath = `./public/images/${news.image}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Delete Multiple Images
    if (news.images) {
      const images = JSON.parse(news.images);
      images.forEach((img) => {
        const imgPath = `./public/images/${img}`;
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });
    }

    // Delete Video
    if (news.video) {
      const videoPath = `./public/videos/${news.video}`;
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }

    await News.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ msg: "خبر با موفقیت حذف شد" });
  } catch (error) {
    console.log(`we have some error on deleteNews function : ${error}`);
    res.status(500).json({ msg: "خطا در حذف خبر" });
  }
};

// تابع دریافت دو خبر آخر
export const getLastNews = async (req, res) => {
  try {
    const news = await News.findAll({
      limit: 4,
      order: [["id", "DESC"]],
      include: [{ model: Category }, { model: Users }],
    });
    res.json(news);
  } catch (error) {
    console.log(`we have some error on getLastNews function :
    ${error}`);
  }
};

// تابعی برای دریافت جزئیات یک خبر
export const getDetailNews = async (req, res) => {
  try {
    const response = await News.findOne({
      where: {
        id: req.params.id,
      },
    });
    const numView = response.numViews + 1;
    await News.update(
      { numViews: numView },
      {
        where: { id: req.params.id },
      }
    );
    res.json(response);
  } catch (error) {
    console.log(`we have some error on getDtailNews function :
    ${error}`);
  }
};

export const addLike = async (req, res) => {
  try {
    const news = await News.findOne({
      where: {
        id: req.params.id,
      },
    });
    const numLike = news.numLike + 1;
    await News.update(
      { numLike: numLike },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.json({ msg: "خبر با موفقیت لایک شد" });
  } catch (error) {
    console.log(error);
  }
};

// تابع دریافت اخبار مرتبط بر اساس دسته‌بندی
export const getLastRelatedNews = async (req, res) => {
  try {
    // گرفتن آیدی خبر از پارامتر
    const newsId = req.params.id;

    // پیدا کردن خبر فعلی برای گرفتن catId
    const currentNews = await News.findOne({
      where: { id: newsId },
    });

    // اگر خبری پیدا نشد
    if (!currentNews) {
      return res.status(404).json({ error: "خبر یافت نشد" });
    }

    // گرفتن اخبار مرتبط با همان دسته‌بندی به جز خبر فعلی
    const relatedNews = await News.findAll({
      where: {
        catId: currentNews.catId,
        id: { [Op.ne]: newsId }, // خبر فعلی حذف شود
      },
      include: [{ model: Category }, { model: Users }],
      order: [["id", "DESC"]],
      limit: 6, // تعداد خبرهای مرتبط
    });

    res.json(relatedNews);
  } catch (error) {
    console.log(`we have some error on getLastRelatedNews function : ${error}`);
    res.status(500).json({ msg: "خطا در دریافت اخبار مرتبط" });
  }
};

//  تابع دریافت محبوت ترین خبر ها
export const popularNews = async (req, res) => {
  try {
    const news = await News.findAll({
      limit: 6,
      order: [["numLike", "DESC"]],
      include: [
        {
          model: Users,
          attributes: ["id", "name", "email", "url"], // فیلدهای موردنیاز از جدول Users
        },
        {
          model: Category,
          attributes: ["id", "name"], // اینجا اسم دسته‌بندی رو هم می‌گیری
        },
      ],
    });

    res.json(news);
  } catch (error) {
    console.log(`we have some error on popularNews function : ${error}`);
  }
};

//  تابع دریافت محبوت ترین خبر ها
export const mostView = async (req, res) => {
  try {
    const news = await News.findAll({
      limit: 6,
      order: [["numViews", "DESC"]],
      include: [
        {
          model: Users,
          attributes: ["id", "name", "email", "url"], // فیلدهای موردنیاز از جدول Users
        },
        {
          model: Category,
          attributes: ["id", "name"], // اینجا اسم دسته‌بندی رو هم می‌گیری
        },
      ],
    });

    res.json(news);
  } catch (error) {
    console.log(`we have some error on popularNews function : ${error}`);
  }
};

// تابع دریافت اخبار با دسته بندی اتخاب شده
export const getCatNews = async (req, res) => {
  try {
    const hasCategory = req.query.cat;
    const news = hasCategory
      ? await News.findAll({
        where: {
          catId: hasCategory,
        },
        include: [{ model: Category }, { model: Users }],
        order: [["id", "DESC"]],
      })
      : await News.findAll({
        order: [["id", "DESC"]],
        include: [{ model: Category }, { model: Users }],
      });
    res.json(news);
  } catch (error) {
    console.log(`we have some error on getCatNews function : 
    ${error}`);
  }
};
