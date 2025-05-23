import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/Ecom',{

      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);

  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
export default connectDB;