import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendEmail(to: string, content: string) {
    const from = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!from || !pass) {
        console.error('❌ Missing Gmail credentials in .env');
        return;
    }

    if (!to) {
        console.error('❌ Missing recipient address (to)');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: from,
                pass: pass,
            },
        });

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #2c7a7b; text-align: center;">🛒 Smartcart</h2>
                <p style="font-size: 16px; color: #333;">${content}</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #888; text-align: center;">
                    מייל זה נשלח אוטומטית מאתר Smartcart
                </p>
            </div>
        </div>
        `;

        const mailOptions = {
            from: from,
            to: to,
            subject: 'הודעה מאתר הקניות Smartcart',
            text: content, // fallback if HTML fails
            html: htmlContent, // המייל המעוצב
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.response);
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
}