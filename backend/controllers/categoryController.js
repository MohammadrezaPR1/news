import Category from "../models/categoryModel.js"


// تابع دربافت دسته بندی ها 
export const getCategory =async(req,res)=>{
    try {
        const categories = await Category.findAll({});
        res.json(categories)
    } catch (error) {
        console.log(`we have some error on getCategory function :
        ${error}`);
    }
}

//  تابع دریافت دسته بندی ها برای صفحه ی اصلی 
export const getCategoryForHomePage =async(req,res)=>{
    try {
        const categories = await Category.findAll({});
        res.json(categories)
    } catch (error) {
        console.log(`we have some error on getCategory function :
        ${error}`);
    }
}





// تابع ساخت دسته بندی جدید 
export const createCategory = async(req,res)=>{
    const name = req.body.name;
    try {
       await Category.create({
        name:name,
       });
       res.json({msg:'دسته بندی با موفقیت افزوده شد'})
    } catch (error) {
        console.log(`we have some error on createCategory function : 
        ${error}`);
    }
}

// تابع ویرایش دسته بندی
export const updateCategory = async(req,res)=>{
    const name = req.body.name;
    try {
        await Category.update({name:name},{
            where:{
                id:req.params.id,
            }
        })
        res.json({msg:"ویرایش دسته با موفقیت انجام شد"})

    } catch (error) {
        console.log(`we have some error on updateCategory function :
        ${error} `);
    }
}

// تابع حذف دسته بندی
export const deleteCategory = async(req,res)=>{
    try {
        await Category.destroy({
            where:{
                id:req.params.id,
            }
        })
        res.json({msg:"حذف دسته بندی با موفقیت انجام شد"})
    } catch (error) {
        console.log(`we have some error on deleteCategory function :
        ${error}`);
    }
}