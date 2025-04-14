import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
  }
}

const MONGODB_URI: string = process.env.MONGO_URI || 'mongodb://localhost/ecommerce';

mongoose.set('strictQuery', true);


export const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connect;
