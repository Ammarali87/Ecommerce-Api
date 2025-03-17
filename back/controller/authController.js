import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { sanitizeUser } from '../utils/sanitizeData.js';  // Fixed import path with .js extension
import crypto from 'crypto';


// Function to generate JWT
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// **Signup**
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
            const messages = Object.values(err.errors).map((er) => er.message);
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

// **Login**
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



 // forget password Code /  the poor user forgot password 
// Request verification email
export async function requestVerification(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that email'
      });
    }

    if (user.verified) {
      return res.status(400).json({
        status: 'fail',
        message: 'User is already verified'
      });
    }

    const verificationToken = user.createToken('verification');
    await user.save({ validateBeforeSave: false });

    // TODO: Send verification email with token
    // For now, just return the token in response
    res.status(200).json({
      status: 'success',
      message: 'Verification token sent to email',
      token: verificationToken // Remove this in production
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error sending verification email'
    });
  }
}

// Verify email
export async function verifyEmail(req, res) {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error verifying email'
    });
  }
}

// Request password reset

import { sendPasswordResetEmail } from '../config/nodemailer.js';


//  with node mieler
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ 
        status: 'fail',
        message: 'No user found with that email address' 
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user, resetToken);
      
      res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to email'
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        status: 'error',
        message: 'Error sending email. Please try again.'
      });
    }
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

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

// Reset password


export async function resetPassword(req, res) {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error resetting password'
    });
  }
}




//  in front
// Example frontend reset password form
const resetPassword = async (token, newPassword) => {
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