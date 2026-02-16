import path from "path";
import Video from "../models/videoModel.js";
import fs from "fs";

// تابع دریافت ویدیو ها 
export  const getAllVideo = async(req,res)=>{
    try {
        const video = await Video.findAll({});
        res.json(video)
    } catch (error) {
        console.log(`we have some error on getAllVideo function :
        ${error}`);
    }
}
//   تابع ساخت ویدیو جدید 
export const createVideo = async(req,res)=>{
    const {title,description} = req.body
   if(req.files == null) return res.json({error:"هنوز ویدیویی انتخاب نشده"});
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const dateNow = Math.round(Date.now());   
    const fileName = dateNow+ext;
    const url = `${req.protocol}://${req.get("host")}/videos/${fileName}`
    const allowedType = [".mp4",".mkv"];
    if(!allowedType.includes(ext.toLowerCase())){
        return res.json({error:": فرمت ویدیو نامعتبر است"})
      };
    if(fileSize>300000000){
        return res.json({error:"حجم ویدیو نباید بیشتر از 300 مگابایت باشد"})
    };  
    file.mv(`./public/videos/${fileName}`,async(err)=>{
        if(err) return res.json({msg:err.message})
        try {
            await Video.create({title:title,description:description,video:fileName,url:url})
            res.json({msg:"ویدیو با موفقیت افزوده شد "})
        } catch (error) {
            console.log(`we have some error on createVideo function :
            ${error}`);
        }
    })

}
//  تابع دریافت آخرین ویدیو برای صفحه اصلی
export const getSingleVideo = async(req,res)=>{
    try {
        const video = await Video.findAll({
          limit:2,
          order:[["createdAt","DESC"]]})
        res.json(video)
    } catch (error) {
        console.log(`we have some error on getSingleVideo:
        ${error}`);
    }
}

export const updateVideo = async (req, res) => {
  const video = await Video.findOne({
    where: {
      id: req.params.id,
    }
  });

  if (!video) return res.json({ msg: "ویدیویی یافت نشد" });

  let fileName = "";
  if (req.files == null) {
    fileName = video.video;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const dateNow = Math.round(Date.now());
    fileName = dateNow + ext;

    const allowedType = [".mp4", ".mkv"];
    if (!allowedType.includes(ext.toLowerCase())) {
      return res.json({ error: ": فرمت ویدیو نامعتبر است" });
    }
    if (fileSize > 30000000) {
      return res.json({ error: "حجم ویدیو نباید بیشتر از 30 مگابایت باشد" });
    }

    const filePath = `./public/videos/${video.video}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/videos/${fileName}`, async (err) => {
      if (err) return res.json({ msg: err.message });
    });
  }

  const { title, description } = req.body;
  const url = `${req.protocol}://${req.get("host")}/videos/${fileName}`;

  try {
    await Video.update({
      title: title,
      description: description,
      video: fileName,
      url: url,
    }, {
      where: {
        id: req.params.id,
      }
    });
    res.json({ msg: "ویرایش ویدیو با موفقیت انجام شد" });
  } catch (error) {
    console.log(`we have some error on updateVideo function :
    ${error}`);
  }
}



// تابع حذف ویدیو
export const deleteVideo = async(req,res)=>{
    const video = await Video.findOne({
        where:{
            id:req.params.id,
        }
    });
    if(!video) return res.json({error:"ویدیو یافت نشد"});
    try {
        const filePath = `./public/videos/${video.video}`;
        fs.unlinkSync(filePath);
        await Video.destroy({
            where:{
                id:req.params.id,
            }
        });
        res.json({msg:"ویدیو با موفقیت حذف شد"})
    } catch (error) {
        console.log(`we have some error on deleteVideo function :
        ${error}`);
    }
}