import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_APP_PASSWORD
    },
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });
};

export const verifyConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP Connection Error:', error);
    throw new Error(`SMTP verification failed: ${error.message}`);
  }
};

export const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_APP_PASSWORD) {
      throw new Error('Email credentials not configured');
    }

    if (!options.email || !options.subject || !options.html) {
      throw new Error('Missing required email fields: email, subject, or html content');
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Your Store'}" <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High'
      }
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
verifyConnection().catch(error => {
  console.error('Initial SMTP verification failed:', error);
});

export default createTransporter;










// Test file
try {
  await sendEmail({
    email: 'recipient@example.com',
    subject: 'Test Email',
    html: '<h1>Test Email</h1><p>This is a test email from the system.</p>'
  });
} catch (error) {
  console.error('Test email failed:', error);
}


