import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD // Use app-specific password
  }
});

// Email sending function
export const sendEmail = async (options) => {
  try {
    // Create email options
    const mailOptions = {
      from: '"Your Store" <your@email.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html // Optional HTML version
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Error sending email');
  }
};

// Example usage for password reset

export const sendPasswordResetEmail = async (user, resetToken) => {
    try {
      const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message: `Reset your password at: ${resetURL}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; text-align: center;">Password Reset</h1>
            <p>Hi ${user.name},</p>
            <p>Please click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a 
                href="${resetURL}"
                style="background: #4CAF50; color: white; padding: 12px 30px; 
                       text-decoration: none; border-radius: 5px; display: inline-block;"
              >
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              If you didn't request this, please ignore this email.
              This link will expire in 1 hour.
            </p>
          </div>
        `
      });
    } catch (error) {
      throw new Error('Error sending password reset email');
    }
  };