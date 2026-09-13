import nodemailer from "nodemailer";
import  dotenv  from "dotenv";
dotenv.config()
const transporter = nodemailer.createTransport( {
    //service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

const sendEmail= async (to, subject, text) => {
     const info=await transporter.sendMail( {
        from : process.env.USER_EMAIL,
        to: to,
        subject: subject,
        text: text

     })
     console.log("email sent", info.messageId)
     console.log("To:", to)
     console.log("Accepted:", info.accepted)
     console.log("Rejected:", info.rejected)

     return info
}

export default sendEmail