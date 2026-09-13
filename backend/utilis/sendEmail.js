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
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// 1. Initialize the official Google OAuth2 handler
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://google.com"
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

// 2. Instantiate the Gmail REST Web API instance
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

const sendEmail = async (to, subject, text) => {
    try {
        // 3. Format email text into standard MIME format for Web APIs
        const emailContent = [
            `From: ${process.env.USER_EMAIL}`,
            `To: ${to}`,
            `Subject: ${subject}`,
            `Content-Type: text/plain; charset=utf-8`,
            `MIME-Version: 1.0`,
            "",
            text
        ].join("\n");

        // Convert the string into a web-safe base64 string
        const encodedMessage = Buffer.from(emailContent)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        // 4. Send the request via HTTPS over Port 443 (Allowed by Render!)
        const response = await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage
            }
        });

        console.log("Email sent successfully via Web API:", response.data.id);
        
        // Return a mock object mimicking your old info structure to keep the rest of your app happy
        return { messageId: response.data.id, data: response.data };

    } catch (error) {
        console.error("Gmail Web API Error:", error.message);
        throw error;
    }
};

export default sendEmail;
