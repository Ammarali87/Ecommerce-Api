import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter with more secure settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Explicit host instead of 'service'
  port: 587, // TLS port
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD // Gmail app password
  },
  tls: {
    minVersion: 'TLSv1.2'
  }
});

// Verify connection configuration
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('Ready to send emails');
    return true;
  } catch (error) {
    console.error('SMTP Connection Error:', error);
    return false;
  }
};

// Enhanced error handling for sendEmail
export const sendEmail = async (options) => {
  try {
    // Validate required fields
    if (!options.email || !options.subject || !options.html) {
      throw new Error('Missing required email fields');
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Your Store'}" <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Verify connection on startup
verifyConnection();

export default transporter;