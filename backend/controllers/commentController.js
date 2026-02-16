import Comments from "../models/commentModel.js";



//  تابع  دریافت نظرات 
export const getAllComments = async(req,res)=>{
    try {
        const comments = await Comments.findAll({})
        res.json(comments)
    } catch (error) {
        console.log(`we  have some error on getAllComments function :
        ${error}`);
    }
}

// تابع ساخت نظر 
export const createComment = async(req,res)=>{
    const {newsId,description,name,email,subject} = req.body;
    try {
       await Comments.create({
        newsId,
        description,
        name,
        email,
        subject
       });
        res.json({msg:"نظر شما ارسال شد و بعد از تایید مدیریت به نمایش در می آید"})
    } catch (error) {
        console.log(`we have some error on createComment function : 
        ${error}`);
    }
}

//  تابع ویرایش نظر 
export const updateComment = async(req,res)=>{
    const {name,subject,description} = req.body ;
    try {
        await Comments.update({
            name,
            description,
            subject
        },{
            where:{
                id:req.params.id,
            }
        });
        res.json({msg:"نظر با موفقیت ویرایش شد"})
    } catch (error) {
        console.log(`we have some error on updateComment function :
        ${error}`);
    }
}

// تابع حذف نظر 
export const deleteComment = async(req,res)=>{
    try {
        await Comments.destroy({
            where:{
                id : req.params.id,
            }
        });
        res.json({msg:"نظر با موفقیت حذف شد "})
    } catch (error) {
        console.log(`we have some error on deleteComment function :
        ${error}`);
    }
}

// تابع فعال کردن نظرات 
export const active = async(req,res)=>{
    const {isActive} = req.body;
    try {
        await Comments.update({isActive:isActive},{
            where:{
                id:req.params.id,
            }
        })
        res.json({msg:"نظر فعال شد"})
    } catch (error) {
        console.log(`we have som error on active function :
        ${error}`);
    }
}

// تابع غبر فعال کردن نظرات
export const unActive = async(req,res)=>{
    const {isActive} = req.body;
    try {
        await Comments.update({isActive:isActive},{
            where:{
                id:req.params.id,
            }
        })
        res.json({msg:"نظر غیر فعال شد "})
    } catch (error) {
        console.log(`we have som error on active function :
        ${error}`);
    }
}

// تابع دریافت نظرات مربوط به هر کاربر 
export const getComments = async(req,res)=>{
    try {
        const newsId = req.params.newsId;
        const comments = await Comments.findAll({
            where:{
                newsId : newsId,
            }
        })
        res.json(comments)
    } catch (error) {
        console.log(`we have some error on getCommet function :
        ${error}`);
    }
}