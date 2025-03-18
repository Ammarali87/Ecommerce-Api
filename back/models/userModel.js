import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide a name'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Please provide an email'],
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  verificationCode: {
    code: String,
    expiresAt: Date
  },
  resetPasswordCode: {
    code: String,
    expiresAt: Date
  },
  lastLogin: Date,
  loginAttempts: {
    count: { type: Number, default: 0 },
    lastAttempt: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate random 6-digit code
userSchema.methods.generateCode = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const User = mongoose.model('User', userSchema);





// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import crypto from 'crypto';

// const userSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: [true, 'Please provide a name'],
//     trim: true 
//   },
//   email: { 
//     type: String, 
//     required: [true, 'Please provide an email'],
//     unique: true, 
//     lowercase: true,
//     trim: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
//   },
//   password: { 
//     type: String, 
//     required: [true, 'Please provide a password'],
//     minlength: [6, 'Password must be at least 6 characters'],
//     select: false 
//   },
//   verified: { 
//     type: Boolean, 
//     default: false 
//   },
//   verificationToken: String,
//   verificationTokenExpires: Date,
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Generate verification/reset token
// userSchema.methods.createToken = function(type) {
//   // Generate token
//   const token = crypto.randomBytes(32).toString('hex');
  
//   // Hash token and set expiry
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(token)
//     .digest('hex');

//   if (type === 'verification') {
//     this.verificationToken = hashedToken;
//     this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//   } else if (type === 'reset') {
//     this.resetPasswordToken = hashedToken;
//     this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
//   }

//   return token;
// };

// export const User = mongoose.model('User', userSchema);




// // import mongoose from 'mongoose';
// // import bcrypt from 'bcryptjs';
// // import crypto from 'crypto'; // Built-in Node.js module

// // const userSchema = new mongoose.Schema({
// //   name: { type: String, required: true, trim: true },
// //   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
// //   password: { type: String, required: true, minlength: 6, select: false },
// //   verified: { type: Boolean, default: false },
// //   verificationToken: String,
// //   verificationTokenExpires: Date,
// //   resetPasswordToken: String,
// //   resetPasswordExpires: Date
// // }); 

// // // Generate verification/reset tokens
// // userSchema.methods.createToken = function(type) {
// //   const token = crypto.randomBytes(32).toString('hex');
  
// //   if (type === 'verification') {
// //     this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
// //     this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
// //   } else if (type === 'reset') {
// //     this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
// //     this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
// //   }
  
// //   return token;
// // };


// // // ✅ Hash password before saving
// // userSchema.pre('save', async function (next) {
// //   if (!this.isModified('password')) return next();
// //   this.password = await bcrypt.hash(this.password, 12);
// //   next();
// // });

// // // ✅ Method to compare password
// // userSchema.methods.comparePassword = async function (enteredPassword) {
// //   return await bcrypt.compare(enteredPassword, this.password);
// // };

// // export const User = mongoose.model('User', userSchema);
