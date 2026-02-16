// password gmail : nlzl eqne efsr lbtc

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"bagheri.mb81@gmail.com",
        pass:"nlzleqneefsrlbtc"
    }
});


export const sendEmialMsg = async(req,res)=>{
    const {subject,message,email} = req.body;
    const user = `شما پیامی از ${email} دارید . موضوع پیام ${subject}`;

    try {
        let details = {
            from:email,
            to: "bomb.electro10@gmail.com",
            subject:user,
            text:message
        };
        await transporter.sendMail(details)
        res.json({msg:"ایمیل با  موفقیت ارسال شد "})
    } catch (error) {
        console.log(`we have some error on sendEmailMsg function :
        ${error}`);
    }
}