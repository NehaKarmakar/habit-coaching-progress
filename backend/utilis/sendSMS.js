import twilio from "twilio";
import  dotenv  from "dotenv";

dotenv.config()

/*const client = twilio( 
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)

const sendSMS= async () => {
    const response = await client.messages.create( {
        body:"sms_account_alerts",
        from:process.env.TWILIO_PHONE_NUMBER,
        to:process.env.TWILIO_TO
    })
    return response
}
export default sendSMS
*/
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createMessage() {
  const message = await client.messages.create({
    body: "sms_event_notifications",
    from: "+17372508034",
    to: "+916203128633",
  });

  console.log(message.sid);
}

  export default createMessage();