import { Schema, model } from "mongoose";
//  bcrypt.compare
//  bcrypt.hash
//  userSchema.methods.compPassword
//  userSchema.pre

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Prevents returning password in queries
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export const User = model("User", userSchema);
