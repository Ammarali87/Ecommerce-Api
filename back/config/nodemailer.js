import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD // Gmail App Password
  }
});

// Email sending function
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Your Store'}" <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Error sending email');
  }
};

// Template for verification code email
export const sendVerificationEmail = async (email, code) => {
  await sendEmail({
    email,
    subject: 'Email Verification Code',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
        <div style="background-color: #f8f8f8; border-radius: 5px; padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #666;">Your verification code is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 2px; font-size: 32px; margin: 20px 0;">${code}</h1>
          <p style="color: #999; font-size: 14px;">This code will expire in 10 minutes</p>
        </div>
        <p style="color: #666; margin-top: 20px; text-align: center;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `
  });
};

// Template for password reset code email
export const sendPasswordResetCode = async (email, code) => {
  await sendEmail({
    email,
    subject: 'Password Reset Code',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <div style="background-color: #f8f8f8; border-radius: 5px; padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #666;">Your password reset code is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 2px; font-size: 32px; margin: 20px 0;">${code}</h1>
          <p style="color: #999; font-size: 14px;">This code will expire in 10 minutes</p>
        </div>
        <p style="color: #666; margin-top: 20px; text-align: center;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `
  });
};