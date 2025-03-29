import { sanitizeUser } from '../utils/sanitizeData.js';  // Fixed import path with .js extension
import { User } from '../models/userModel.js';
import { sendEmail } from '../config/nodemailer.js';
import jwt from 'jsonwebtoken';

    
// Function to generate JWT
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// // **Signup**
export async function signup(req, res) {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({ name, email, password });

        const token = signToken(newUser._id);
        console.log("Sign up success");
        
        res.status(201).json({
            status: 'success',
            token,
            user: sanitizeUser(newUser)
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = 
            Object.values(err.errors)
            .map((er) => er.message);
            return res.status(400).json({ 
                status: 'fail', 
                message: messages 
            });
        }
        res.status(400).json({ 
            status: 'fail', 
            message: err.message 
        });
    }
}

// // **Login**
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("No email or password provided");
            return res.status(400).json({ 
                status: 'fail',
                message: 'Please provide email and password' 
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            console.log("Incorrect email or password");
            return res.status(401).json({ 
                status: 'fail',
                message: 'Incorrect email or password' 
            });
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            user: sanitizeUser(user)
        });
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error',
            error: err.message 
        });
    }
}



// **Logout**
export function logout(req, res) {
    res.cookie('jwt', '', { 
        expires: new Date(0), 
        httpOnly: true 
    });
    
    res.status(200).json({ 
        status: 'success', 
        message: 'Logged out successfully' 
    });
}


      // ** forget password Code **  //

  //  generate code and send code to email 
  import sendEmail from '../config/nodemailer.js';

  export async function forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide an email address'
        });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'No user found with that email'
        });
      }
  
      // Generate reset code
      const resetCode = user.generateCode(); 
      user.passwordResetCode = resetCode;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      await user.save();
    
      // const message = `
      //   <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      //     <h2>Hi ${user.name},</h2>
      //     <p>Your password reset code is:</p>
      //     <h1>${resetCode}</h1>
      //     <p>This code will expire in 10 minutes</p>
      //   </div>`;
  
      // await sendEmail({
      //   email: user.email,
      //   subject: 'Password Reset Code',
      //   html: message
      // });

    await sendEmail(email, 'resetPassword', resetCode);

  
      res.status(200).json({
        status: 'success',
        message: 'Reset code sent to email'
      });
  
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Error sending reset code'
      });
    }
  }
  
  // user.passwordResetVerified = true;
  export async function verifyCode(req, res) {
    try {
      const { code } = req.body;
      
      // Add validation
      if (!code) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide valid 6-digit reset code'
        });
      }
  
      // Find user with reset code
      const user = await User.findOne({
        passwordResetCode: code,
        passwordResetExpires: { $gt: Date.now() }
      }).select('+passwordResetCode +passwordResetExpires');

      if (!user) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid or expired reset code'
        });
      }
  
      user.passwordResetVerified = true;
      await user.save();

      res.status(200).json({
        status: 'success',
        message: 'Code verified successfully'
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Error verifying code'
      });
    }
  }

  export async function resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;

      // Validate inputs
      if (!email || !newPassword) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide email and new password'
        });
      }
  
      // Find specific user with verified reset code
      // يطابق كل الصفات   
      const user = await User.findOne({
        email,
        passwordResetVerified: true,
        passwordResetExpires: { $gt: Date.now() }//forgot
        // not = falst but {$gt:dDte.now()}
               // Time now > passwordREsetExpre 
      });      
        
      if (!user) {
        return res.status(400).json({
          status: 'fail',
          message: 'Reset code not verified or expired'
        });
      }
  
      // Update password and clear reset fields
      user.password = newPassword;  
      // numer/bolean /time 
      user.passwordResetCode = undefined; // forgot
      user.passwordResetExpires = undefined;// forgot
      user.passwordResetVerified = undefined; // forgot
      await user.save();

      // Generate new token
      const token = signToken(user._id);// forgot

      res.status(200).json({
        status: 'success',
        message: 'Password reset successful',
        token
      });
  
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  }

  // export const reset =  async  (req,res,next) => {
  //   const {email,newPassword} = req.body;
  //      if(!emial or  ){
  //        next(new ApiiError(333,"error32l3k"))
  //      }
  //      const user = User.findOne({
  //       emial,{verfued:treu,verExpired:false}
  //      })select("+password")  
      
  //     cont user.password= newPassword
  //      await user.save 
  //    }
 
  // reset Pass With CurrentPass
export async function changePassword(req, res) {
  try {
    const { email, currentPassword, newPassword } = req.body;
   
    // Input validation   user or with if and not !
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email, current password and new password'
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email })
    .select('+password'); // i forgot 
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that email'
      });
    }

    // Verify current password

      // Verify current password  
      // use comparePassword not if
  // he store if value in const and
  //  use it to make error  with !validPassword
  
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();  // i forgot 

    // Generate new token
    const token = signToken(user._id);  // i forgot 

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      token
    });

  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
}

import { sendSMS } from '../config/textbeltConfig.js'; // or fast2smsConfig.js or firebaseConfig.js

export async function forgotPasswordSms(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a phone number'
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that phone number'
      });
    }  

    // Generate reset code
    const resetCode = user.generateCode();
    user.passwordResetCode = resetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save();

    // Send SMS
    const message = `Your reset code is: ${resetCode}. Valid for 10 minutes.`;
    await sendSMS(user.phone, message);

    res.status(200).json({
      status: 'success',
      message: 'Reset code sent to your phone'
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error sending reset code'
    });
  }
}