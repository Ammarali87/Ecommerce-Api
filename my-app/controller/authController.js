import {User} from '../models/userModel.js';
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
    const newUser = await User.create({ name, email, password });

    const token = signToken(newUser._id);
    res.status(201).json({ status: 'success', token, user: { id: newUser._id, name, email } });
  } catch (err) {  
    if (err.name === 'ValidationError') {
      // Object.valuesExtract all error messages: 
      // If multiple fields are invalid, it returns an array
      const messages = Object.values(err.errors).map((er) => er.message);
      return res.status(400).json({ status: 'fail', message: messages });
    }
    res.status(400).json({ status: 'fail', message: err.message });
  }
}

// alert(error.response?.data?.message.join('\n') || 'Something went wrong');
// in front  error .join('\n')?
// Improves readability:multiple messages in string
//  instead of a comma-separated list.





// **Login**
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await findOne({ email }).select('+password');
    if (!user ||  
      // use !( await)
      // bad  await User.crypt.comparePawword(enterPAssword)
      !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
      // warning  if he put const toke first
      // the user will login this Bad 
      // if to prevent login  if any error 
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
