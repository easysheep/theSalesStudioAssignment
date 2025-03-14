import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log('Mongo healthy');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectToMongo;
