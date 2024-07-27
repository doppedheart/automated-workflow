import nodemailer from "nodemailer"
import { SMTP_ENDPOINT, SMTP_PASSWORD, SMTP_USERNAME } from "./config"



const transport = nodemailer.createTransport({
    service:SMTP_ENDPOINT,
    auth:{
        user:SMTP_USERNAME,
        pass:SMTP_PASSWORD
    }

})


export async function sendEmail(to:string, body:string){
    await transport.sendMail({
        from: 'anuragagarwal530@gmail.com', // sender address
        to: to, // list of receivers
        subject: body, // Subject line
        text: body, // plain text body
    });
}