import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    console.log('🔗 Testing MongoDB Connection...\n');
    console.log('Connection String (masked):');
    console.log(uri.replace(/:[^:@]+@/, ':****@'));
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log('✅ Connection Successful!');
    console.log(`📊 Database: ${dbName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`🔌 Port: ${mongoose.connection.port || 'Default (27017)'}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:');
    collections.forEach(col => {
      console.log(`   ✅ ${col.name}`);
    });

    // Check housemaids
    const housemaidsCollection = db.collection('housemaids');
    const count = await housemaidsCollection.countDocuments();
    console.log(`\n📊 housemaids collection: ${count} documents`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Connection is working!');
    console.log('💡 You can use this connection string in MongoDB Compass:');
    console.log('\n' + uri);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed!');
    console.error('Error:', error.message);
    console.log('\n💡 Possible solutions:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify IP address is whitelisted in MongoDB Atlas');
    console.log('   3. Check MongoDB Atlas cluster is running');
    console.log('   4. Verify connection string in .env file');
    process.exit(1);
  }
};

testConnection();

