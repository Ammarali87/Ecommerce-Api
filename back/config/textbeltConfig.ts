import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
  }
}

const TEXTBELT_API_URL = 'https://textbelt.com/text';
const TEXTBELT_API_KEY: string | undefined = process.env.TEXTBELT_API_KEY;

if (!TEXTBELT_API_KEY) {
  throw new Error('Missing TEXTBELT_API_KEY in environment variables.');
}

interface SendSMSResponse {
  success: boolean;
  messageId: string;
  quotaRemaining: number;
}

export const sendSMS = async (phone: string, message: string): Promise<SendSMSResponse> => {
  try {
    console.log(`Attempting to send SMS to ${phone}`);

    const response = await axios.post(TEXTBELT_API_URL, {
      phone,
      message,
      key: TEXTBELT_API_KEY,
    });

    console.log('SMS API Response:', response.data);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to send SMS');
    }

    return {
      success: true,
      messageId: response.data.textId,
      quotaRemaining: response.data.quotaRemaining,
    };
  } catch (error: any) {
    console.error('SMS sending failed:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

interface CheckStatusResponse {
  success: boolean;
  status: string;
  [key: string]: any;
}

export const checkSMSStatus = async (textId: string): Promise<CheckStatusResponse> => {
  try {
    const response = await axios.get(`https://textbelt.com/status/${textId}`, {
      params: { key: TEXTBELT_API_KEY },
    });
    return response.data;
  } catch (error: any) {
    console.error('Status check failed:', error.message);
    throw new Error('Failed to check SMS status');
  }
};

export default sendSMS;
