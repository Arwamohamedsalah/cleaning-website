import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Housemaid from '../models/Housemaid.js';

dotenv.config();

const verifyCleaningDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database Name: ${dbName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections in database:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');

    // Check housemaids
    const housemaidsCount = await Housemaid.countDocuments();
    const housemaids = await Housemaid.find({});

    console.log(`📊 Housemaids Collection:`);
    console.log(`   Count: ${housemaidsCount}`);
    console.log('');

    if (housemaidsCount > 0) {
      console.log('✅ All Housemaids:');
      housemaids.forEach((h, i) => {
        console.log(`   ${i + 1}. ${h.arabicName} - ${h.phone} - ${h.contractType}`);
      });
      console.log('\n💡 البيانات موجودة في MongoDB Atlas:');
      console.log(`   Database: ${dbName}`);
      console.log(`   Collection: housemaids`);
      console.log(`   Total: ${housemaidsCount} housemaids`);
      console.log('\n✅ يمكنك رؤيتها في MongoDB Atlas Dashboard');
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

verifyCleaningDB();

