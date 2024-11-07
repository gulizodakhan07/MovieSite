import * as nodemailer from 'nodemailer';

export async function sendMail(options) {
  try {
    console.log('Email options:', options); // Debugging line to check 'to' field

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      // host: process.env.MAIL_HOST,
      // port: parseInt(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    if (!options.to) {
      throw new Error("Recipient email address is missing in the 'to' field.");
    }

    const result = await transporter.sendMail(options);
    console.log('Message sent with ID:', result.messageId);
    return result;
  } catch (error) {
    console.log('Error on email:', error);
    return null;
  }
}
