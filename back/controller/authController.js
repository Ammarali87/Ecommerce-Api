import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Function to generate JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}; // ✅ تم إغلاق الدالة بشكل صحيح

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
      user: { id: newUser._id, name, email },
    });
  } catch (err) {
    if (err.name === 'ValidationError') { // ✅ إصلاح الخطأ في err.name
      // استخراج جميع رسائل الخطأ
      const messages = Object.values(err.errors).map((er) => er.message);
     // const messes = Objec.valus(errObj.errorsArr).map((er)=> err.mesage
      return res.status(400).json({ status: 'fail', message: messages });
    }
    res.status(400).json({ status: 'fail', message: err.message });
  }
}

// **Login**
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("No email or password provided");
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      console.log("Incorrect email or password");
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// **Logout**
export function logout(req, res) {
  res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
}
