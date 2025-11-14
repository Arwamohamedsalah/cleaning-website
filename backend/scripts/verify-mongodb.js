import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Housemaid from '../models/Housemaid.js';

dotenv.config();

const verifyMongoDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('📝 Connection String:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@') : 'NOT SET');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log(`\n✅ Connected to MongoDB`);
    console.log(`📊 Database Name: ${dbName}`);
    console.log(`📁 Collection Name: housemaids`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 All Collections in database:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');

    // Check housemaids collection
    const housemaidsCount = await Housemaid.countDocuments();
    const housemaids = await Housemaid.find({}).limit(3);

    console.log(`📊 Housemaids Collection:`);
    console.log(`   Count: ${housemaidsCount}`);
    console.log(`   Collection Name: housemaids`);
    console.log(`   Database: ${dbName}`);
    console.log('');

    if (housemaidsCount > 0) {
      console.log('✅ Sample Data (first 3):');
      housemaids.forEach((h, i) => {
        console.log(`   ${i + 1}. ${h.arabicName} - ${h.phone} - ${h.contractType}`);
      });
      console.log('\n💡 البيانات موجودة في:');
      console.log(`   Database: ${dbName}`);
      console.log(`   Collection: housemaids`);
      console.log(`   Total Documents: ${housemaidsCount}`);
    } else {
      console.log('⚠️  لا توجد بيانات في collection "housemaids"');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyMongoDB();

