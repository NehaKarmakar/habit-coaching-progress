/*import nodemailer from "nodemailer";
import  dotenv  from "dotenv";
dotenv.config()
const transporter = nodemailer.createTransport( {
    service: "gmail",
    
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
*/
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
    const { data, error } = await resend.emails.send({
        from: "Habit Coaching <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        text: text
    });

    if (error) {
        console.log("Email failed:", error);
        throw new Error(error.message);
    }

    console.log("Email sent:", data.id);
    console.log("To:", to);

    return data;
};

export default sendEmail;