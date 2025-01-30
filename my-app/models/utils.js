import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age:{
    type: Number,
    required: [true, 'Age is required'],
  }
  ,
  // email: {
  //   type: String,
  //   required: [true, 'Email is required'],
  //   unique: true,
  //   trim: true,
  //   lowercase: true,
  //   validate: {
  //     validator: function(v) {
  //       return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
  //     },
  //     message: 'Please enter a valid email'
  //   }
  // }
  // ... other user fields
});

export const User = model('User', userSchema);