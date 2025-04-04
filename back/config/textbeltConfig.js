import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TEXTBELT_API_URL = 'https://textbelt.com/text';
const TEXTBELT_API_KEY = process.env.TEXTBELT_API_KEY;

export const sendSMS = async (phone, message) => {
  try {
    // Log the attempt
    console.log(`Attempting to send SMS to ${phone}`);

    // Make the API request
    const response = await axios.post(TEXTBELT_API_URL, {
      phone,
      message,
      key: TEXTBELT_API_KEY,
    });

    // Log the response
    console.log('SMS API Response:', response.data);

    // Check if the message was queued successfully
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to send SMS');
    }

    return {
      success: true,
      messageId: response.data.textId,
      quotaRemaining: response.data.quotaRemaining
    };

  } catch (error) {
    console.error('SMS sending failed:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

// Optional: Add a function to check message status
export const checkSMSStatus = async (textId) => {
  try {
    const response = await axios.get(
      `https://textbelt.com/status/${textId}`,
      {
        params: { key: TEXTBELT_API_KEY }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Status check failed:', error);
    throw new Error('Failed to check SMS status');
  }
};

export default sendSMS;