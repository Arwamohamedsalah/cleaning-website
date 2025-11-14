import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkCleaningDirect = async () => {
  try {
    // Force connection to cleaning database
    const uri = process.env.MONGODB_URI;
    console.log('🔗 Connection String (masked):', uri.replace(/:[^:@]+@/, ':****@'));
    
    // Ensure /cleaning is in the URI
    let cleaningUri = uri;
    if (!uri.includes('/cleaning')) {
      cleaningUri = uri.replace(/\/([^\/\?]*)(\?|$)/, '/cleaning$2');
      console.log('⚠️  Updated URI to include /cleaning');
    }
    
    await mongoose.connect(cleaningUri);
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log(`\n✅ Connected to MongoDB`);
    console.log(`📊 Database Name: ${dbName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');

    // Check housemaids collection directly
    const housemaidsCollection = db.collection('housemaids');
    const count = await housemaidsCollection.countDocuments();
    const housemaids = await housemaidsCollection.find({}).limit(10).toArray();

    console.log(`📊 Housemaids Collection:`);
    console.log(`   Count: ${count}`);
    console.log('');

    if (count > 0) {
      console.log('✅ Housemaids Data:');
      housemaids.forEach((h, i) => {
        console.log(`   ${i + 1}. ${h.arabicName || h.name} - ${h.phone} - ${h.contractType}`);
      });
      console.log('\n💡 البيانات موجودة في:');
      console.log(`   Database: ${dbName}`);
      console.log(`   Collection: housemaids`);
      console.log(`   Total: ${count} housemaids`);
      console.log('\n✅ يمكنك رؤيتها في MongoDB Atlas:');
      console.log(`   Database: ${dbName}`);
      console.log(`   Collection: housemaids`);
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

checkCleaningDirect();

