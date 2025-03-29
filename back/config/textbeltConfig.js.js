import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const sendSMS = async (to, message) => {
  try {
    const response = await axios.post('https://textbelt.com/text', {
      phone: to,
      message: message,
      key: process.env.TEXTBELT_API_KEY,
    });
    return response.data;
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw error;
  }
};