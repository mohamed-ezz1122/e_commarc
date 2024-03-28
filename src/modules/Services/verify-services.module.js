

//import nodemailer

import nodemailer from 'nodemailer'

//email config
const sendEmailService=async(
    {
        to='',
        subject='no-replay',
        message='<h2>no-msg</h2>',
        attachments = []
    }
)=>{
    //email configration
    const transport=nodemailer.createTransport({
        host:'localhost',
        service:"gmail",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    // {console.log(process.env.EMAIL);}
    const info=await transport.sendMail({
        from: `"Fred Foo 👻" <${process.env.EMAIL}>`, 
        to, 
        subject, 
        html: message, 
        attachments
    })
    return info.accepted.length ? true : false
}


export default sendEmailService