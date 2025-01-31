import { create, findOne } from '../models/userModel';
import { sign } from 'jsonwebtoken';

// Function to generate JWT
const signToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// **Signup**
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    const newUser = await create({ name, email, password });

    const token = signToken(newUser._id);
    res.status(201).json({ status: 'success', token, user: { id: newUser._id, name, email } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
}

// **Login**
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = signToken(user._id);
    res.json({ status: 'success', token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// **Logout**
export function logout(req, res) {
  res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
}
