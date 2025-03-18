import { sanitizeUser } from '../utils/sanitizeData.js';  // Fixed import path with .js extension
import { User } from '../models/userModel.js';
import { sendEmail } from '../config/nodemailer.js';
import jwt from 'jsonwebtoken';


// Function to generate JWT
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// // **Signup**
// export async function signup(req, res) {
//     try {
//         const { name, email, password } = req.body;
//         const newUser = await User.create({ name, email, password });

//         const token = signToken(newUser._id);
//         console.log("Sign up success");
        
//         res.status(201).json({
//             status: 'success',
//             token,
//             user: sanitizeUser(newUser)
//         });
//     } catch (err) {
//         if (err.name === 'ValidationError') {
//             const messages = Object.values(err.errors).map((er) => er.message);
//             return res.status(400).json({ 
//                 status: 'fail', 
//                 message: messages 
//             });
//         }
//         res.status(400).json({ 
//             status: 'fail', 
//             message: err.message 
//         });
//     }
// }

// // **Login**
// export async function login(req, res) {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             console.log("No email or password provided");
//             return res.status(400).json({ 
//                 status: 'fail',
//                 message: 'Please provide email and password' 
//             });
//         }

//         const user = await User.findOne({ email }).select('+password');

//         if (!user || !(await user.comparePassword(password))) {
//             console.log("Incorrect email or password");
//             return res.status(401).json({ 
//                 status: 'fail',
//                 message: 'Incorrect email or password' 
//             });
//         }

//         const token = signToken(user._id);

//         res.status(200).json({
//             status: 'success',
//             token,
//             user: sanitizeUser(user)
//         });
//     } catch (err) {
//         console.error("Server error:", err);
//         res.status(500).json({ 
//             status: 'error',
//             message: 'Server error',
//             error: err.message 
//         });
//     }
// }



// Login with verification check
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            });
        }

        // Check if user is verified
        if (!user.verified) {
            return res.status(401).json({
                status: 'fail',
                message: 'Please verify your email first'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            status: 'success',
            token,
            user: sanitizeUser(user)
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
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

// Signup with email verification
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already registered'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      verified: false
    });

    // Generate verification code
    const verificationCode = user.generateCode();
    user.verificationCode = {
      code: verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    await user.save();

    // Send verification email
    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      html: `
        <div style="text-align: center;">
          <h2>Verify Your Email</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 2px;">${verificationCode}</h1>
          <p>This code will expire in 10 minutes</p>
        </div>
      `
    });

    res.status(201).json({
      status: 'success',
      message: 'Verification code sent to email'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',  
      message: err.message
    });
  }
}



/// get   


export async function getAllUsers(req, res) {
  try {
      const users = await User.find().select('-password');
      
      res.status(200).json({
          status: 'success',
          results: users.length,
          data: users.map(user => sanitizeUser(user))
      });
  } catch (err) {
    res.status(500).json({
          status: 'error',
          message: 'Error fetching users'
        });
      }
    }
    
    // Get one user
    export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).select('-password');
      
    if (!user) {
      return res.status(404).json({
              status: 'fail',
              message: 'User not found'
          });
        }
        
        res.status(200).json({
          status: 'success',
          data: sanitizeUser(user)
      });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user'
      });
    }
  }



  
// // Add rate limiting for login attempts
// export async function login(req, res) {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Please provide email and password'
//       });
//     }

//     const user = await User.findOne({ email }).select('+password');

//     // Check login attempts
//     if (user && user.loginAttempts.count >= 5 && 
//         user.loginAttempts.lastAttempt > Date.now() - 15 * 60 * 1000) {
//       return res.status(429).json({
//         status: 'fail',
//         message: 'Too many login attempts. Please try again in 15 minutes'
//       });
//     }

//     if (!user || !(await user.comparePassword(password))) {
//       if (user) {
//         user.loginAttempts.count += 1;
//         user.loginAttempts.lastAttempt = Date.now();
//         await user.save();
//       }
//       return res.status(401).json({
//         status: 'fail',
//         message: 'Incorrect email or password'
//       });
//     }

//     // Reset login attempts on successful login
//     user.loginAttempts.count = 0;
//     user.lastLogin = Date.now();
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     res.status(200).json({
//       status: 'success',
//       token,
//       user: sanitizeUser(user)
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Server error'
//     });
//   }
// }
  


  // forget password Code
  1// generate code and send code to email 
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that email'
      });
    }

    const resetCode = user.generateCode();
    user.resetPasswordCode = {
      code: resetCode,
      expiresAt: Date.now() + 10 * 60 * 1000
    };    
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Code',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Reset Your Password</h2>
          <div style="background-color: #f8f8f8; border-radius: 5px; padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #666;">Your password reset code is:</p>
            <h1 style="color: #4CAF50; letter-spacing: 2px; font-size: 32px; margin: 20px 0;">${resetCode}</h1>
            <p style="color: #999; font-size: 14px;">This code will expire in 10 minutes</p>
          </div>
          <p style="color: #666; margin-top: 20px; text-align: center;">
            If you didn't request a password reset, please ignore this email.
          </p>
        </div>
      `
    });

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



// Verify email with code
export async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      'verificationCode.code': code,
      'verificationCode.expiresAt': { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired verification code'
      });
    }

    user.verified = true;
    user.verificationCode = undefined;
    await user.save();

    // Generate token after verification
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      token
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
}



// Reset password with code
export async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body;
    
    const user = await User.findOne({
      email,
      'resetPasswordCode.code': code,
      'resetPasswordCode.expiresAt': { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired reset code'
      });
    }

    user.password = newPassword;
    user.resetPasswordCode = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
}





//  in front
// Example frontend reset password form
const resetOldPassword = async (token, newPassword) => {
  try {
    const response = await axios.patch(`/api/v1/auth/password/reset/${token}`, {
      password: newPassword
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


// Request password reset
// Check email delivery
// Click reset link
// Set new password
// Try logging in with new password
// Remember to:

// Enable "Less secure app access" in Gmail or use app-specific password
// Check spam folder during testing
// Use proper error handling on frontend
// Implement rate limiting for password reset requests
// Add logging for debugging















  


// import { User } from '../models/userModel.js';
// import jwt from 'jsonwebtoken';
// import { sanitizeUser } from '../utils/sanitizeData.js';  // Fixed import path with .js extension
// import crypto from 'crypto';


// // Function to generate JWT
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// // **Signup**
// export async function signup(req, res) {
//     try {
//         const { name, email, password } = req.body;
//         const newUser = await User.create({ name, email, password });

//         const token = signToken(newUser._id);
//         console.log("Sign up success");
        
//         res.status(201).json({
//             status: 'success',
//             token,
//             user: sanitizeUser(newUser)
//         });
//     } catch (err) {
//         if (err.name === 'ValidationError') {
//             const messages = Object.values(err.errors).map((er) => er.message);
//             return res.status(400).json({ 
//                 status: 'fail', 
//                 message: messages 
//             });
//         }
//         res.status(400).json({ 
//             status: 'fail', 
//             message: err.message 
//         });
//     }
// }

// // **Login**
// export async function login(req, res) {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             console.log("No email or password provided");
//             return res.status(400).json({ 
//                 status: 'fail',
//                 message: 'Please provide email and password' 
//             });
//         }

//         const user = await User.findOne({ email }).select('+password');

//         if (!user || !(await user.comparePassword(password))) {
//             console.log("Incorrect email or password");
//             return res.status(401).json({ 
//                 status: 'fail',
//                 message: 'Incorrect email or password' 
//             });
//         }

//         const token = signToken(user._id);

//         res.status(200).json({
//             status: 'success',
//             token,
//             user: sanitizeUser(user)
//         });
//     } catch (err) {
//         console.error("Server error:", err);
//         res.status(500).json({ 
//             status: 'error',
//             message: 'Server error',
//             error: err.message 
//         });
//     }
// }

// // **Logout**
// export function logout(req, res) {
//     res.cookie('jwt', '', { 
//         expires: new Date(0), 
//         httpOnly: true 
//     });
    
//     res.status(200).json({ 
//         status: 'success', 
//         message: 'Logged out successfully' 
//     });
// }



// /// get   


// export async function getAllUsers(req, res) {
//   try {
//       const users = await User.find().select('-password');
      
//       res.status(200).json({
//           status: 'success',
//           results: users.length,
//           data: users.map(user => sanitizeUser(user))
//       });
//   } catch (err) {
//       res.status(500).json({
//           status: 'error',
//           message: 'Error fetching users'
//       });
//   }
// }

// // Get one user
// export async function getUser(req, res) {
//   try {
//       const user = await User.findById(req.params.id).select('-password');
      
//       if (!user) {
//           return res.status(404).json({
//               status: 'fail',
//               message: 'User not found'
//           });
//       }

//       res.status(200).json({
//           status: 'success',
//           data: sanitizeUser(user)
//       });
//   } catch (err) {
//       res.status(500).json({
//           status: 'error',
//           message: 'Error fetching user'
//       });
//   }
// }



//  // forget password Code /  the poor user forgot password 

 


// // Request verification email
// export async function requestVerification(req, res) {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'No user found with that email'
//       });
//     }

//     if (user.verified) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'User is already verified'
//       });
//     }

//     const verificationToken = user.createToken('verification');
//     await user.save({ validateBeforeSave: false });

//     // TODO: Send verification email with token
//     // For now, just return the token in response
//     res.status(200).json({
//       status: 'success',
//       message: 'Verification token sent to email',
//       token: verificationToken // Remove this in production
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Error sending verification email'
//     });
//   }
// }

// // Verify email
// export async function verifyEmail(req, res) {
//   try {
//     const hashedToken = crypto
//       .createHash('sha256')
//       .update(req.params.token)
//       .digest('hex');

//     const user = await User.findOne({
//       verificationToken: hashedToken,
//       verificationTokenExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Token is invalid or has expired'
//       });
//     }

//     user.verified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     res.status(200).json({
//       status: 'success',
//       message: 'Email verified successfully'
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Error verifying email'
//     });
//   }
// }

// // Request password reset
// export async function forgotPassword(req, res) {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'No user found with that email'
//       });
//     }

//     const resetToken = user.createToken('reset');
//     await user.save({ validateBeforeSave: false });

//     // TODO: Send password reset email with token
//     // For now, just return the token in response
//     res.status(200).json({
//       status: 'success',
//       message: 'Reset token sent to email',
//       token: resetToken // Remove this in production
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Error sending reset email'
//     });
//   }
// }

// // Reset password
// export async function resetPassword(req, res) {
//   try {
//     const hashedToken = crypto
//       .createHash('sha256')
//       .update(req.params.token)
//       .digest('hex');

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Token is invalid or has expired'
//       });
//     }

//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     const token = signToken(user._id);

//     res.status(200).json({
//       status: 'success',
//       token,
//       user: sanitizeUser(user)
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Error resetting password'
//     });
//   }
// }