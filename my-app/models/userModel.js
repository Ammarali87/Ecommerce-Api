import { Schema, model } from "mongoose";
//  bcrypt.compare
//  bcrypt.hash
//  userSchema.methods.compPassword
//  userSchema.pre

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  slug:{ 
    type:String , 
    lowercase:true, 
    trim:true
  }, 
   email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  }
} ,{timestamps:true} );


// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// !this.isModified prevent reHash when update email and name
// remember async function in-schema
// Compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};     

export const User = model('User', userSchema);