import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config({ path: './packages/backend/.env' });
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);

export async function sendWhatsapp(to: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = 'whatsapp:+14155238886'; 

  if (!accountSid || !authToken) {
    console.error('❌ Missing Twilio credentials in .env');
    return;
  }

  if (!to) {
    console.error('❌ Missing recipient phone number (to)');
    return;
  }

  try {
    const client = twilio(accountSid, authToken);

    const msg = await client.messages.create({
      body: message,
      from: from,
      to: `whatsapp:${to}`,
    });

    console.log('✅ WhatsApp sent successfully, SID:', msg.sid);
  } catch (error) {
    console.error('❌ Failed to send WhatsApp:', error);
  }
}
