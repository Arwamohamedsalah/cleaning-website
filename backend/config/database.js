import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI is not defined in .env file');
      console.error('📝 Please add your MongoDB Atlas connection string to backend/.env');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📁 Collections will be created in database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.error('💡 Tip: Check your MongoDB Atlas connection string in backend/.env');
      console.error('💡 Make sure the connection string is correct and your IP is whitelisted in MongoDB Atlas');
    }
    process.exit(1);
  }
};

export default connectDB;

