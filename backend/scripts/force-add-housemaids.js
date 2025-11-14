import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const forceAddHousemaids = async () => {
  let client;
  try {
    const uri = process.env.MONGODB_URI;
    const baseUri = uri.split('/').slice(0, 3).join('/');
    
    // Connect to cleaning database
    const connectionUri = `${baseUri}/cleaning?retryWrites=true&w=majority`;
    
    console.log('🔗 Connecting to "cleaning" database...\n');
    
    client = new MongoClient(connectionUri);
    await client.connect();
    
    const db = client.db('cleaning');
    console.log(`✅ Connected to: ${db.databaseName}\n`);

    // Get housemaids collection
    const housemaidsCollection = db.collection('housemaids');
    
    // Delete all existing documents first
    const existingCount = await housemaidsCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`🗑️  Deleting ${existingCount} existing documents...`);
      await housemaidsCollection.deleteMany({});
      console.log('✅ Deleted\n');
    }

    // Add fresh data
    const sampleData = [
      {
        arabicName: 'خديجة سالم',
        englishName: 'Khadija Salem',
        nationality: 'فلبينية',
        age: 35,
        phone: '0505678901',
        experience: 10,
        skills: ['تنظيف شامل', 'طبخ', 'كوي', 'أطفال', 'تنظيف متقدم'],
        languages: ['عربي', 'إنجليزي', 'فلبيني'],
        contractType: 'monthly',
        status: 'available',
        rating: 4.9,
        totalOrders: 120,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        arabicName: 'نورا عبدالله',
        englishName: 'Nora Abdullah',
        nationality: 'إندونيسية',
        age: 33,
        phone: '0506789012',
        experience: 8,
        skills: ['تنظيف شامل', 'طبخ', 'ترتيب', 'تنظيف عميق'],
        languages: ['عربي', 'إنجليزي'],
        contractType: 'yearly',
        status: 'available',
        rating: 5.0,
        totalOrders: 95,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        arabicName: 'ليلى أحمد',
        englishName: 'Layla Ahmed',
        nationality: 'سريلانكية',
        age: 29,
        phone: '0507890123',
        experience: 6,
        skills: ['تنظيف شامل', 'كوي', 'أطفال', 'تنظيف المطبخ'],
        languages: ['عربي', 'إنجليزي'],
        contractType: 'monthly',
        status: 'available',
        rating: 4.8,
        totalOrders: 78,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        arabicName: 'زينب محمود',
        englishName: 'Zeinab Mahmoud',
        nationality: 'فلبينية',
        age: 31,
        phone: '0508901234',
        experience: 7,
        skills: ['تنظيف شامل', 'طبخ', 'أطفال', 'تنظيف الحمامات'],
        languages: ['عربي', 'إنجليزي', 'فلبيني'],
        contractType: 'monthly',
        status: 'busy',
        rating: 4.7,
        totalOrders: 65,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        arabicName: 'فاطمة علي',
        englishName: 'Fatima Ali',
        nationality: 'إندونيسية',
        age: 28,
        phone: '0509012345',
        experience: 5,
        skills: ['تنظيف شامل', 'ترتيب', 'تنظيف سريع'],
        languages: ['عربي', 'إنجليزي'],
        contractType: 'yearly',
        status: 'available',
        rating: 4.6,
        totalOrders: 52,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        arabicName: 'مريم حسن',
        englishName: 'Mariam Hassan',
        nationality: 'فلبينية',
        age: 32,
        phone: '0500123456',
        experience: 9,
        skills: ['تنظيف شامل', 'طبخ', 'كوي', 'أطفال', 'تنظيف متقدم', 'ترتيب'],
        languages: ['عربي', 'إنجليزي', 'فلبيني'],
        contractType: 'monthly',
        status: 'available',
        rating: 4.9,
        totalOrders: 110,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log('📝 Inserting 6 housemaids...\n');
    const result = await housemaidsCollection.insertMany(sampleData);
    
    console.log(`✅ Successfully inserted ${result.insertedCount} documents\n`);
    
    // Verify
    const finalCount = await housemaidsCollection.countDocuments();
    const allHousemaids = await housemaidsCollection.find({}).toArray();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Verification:`);
    console.log(`   Database: cleaning`);
    console.log(`   Collection: housemaids`);
    console.log(`   Total Documents: ${finalCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('✅ All Housemaids:');
    allHousemaids.forEach((h, i) => {
      console.log(`   ${i + 1}. ${h.arabicName} - ${h.phone} - ${h.contractType}`);
    });
    
    console.log('\n💡 Instructions for MongoDB Compass:');
    console.log('   1. Close and reopen MongoDB Compass');
    console.log('   2. Connect to: mongodb+srv://ardalbaraka2_db_user:hN0l4mg1AL8DYg3J@cluster0.rb2r5bk.mongodb.net/cleaning');
    console.log('   3. Open Database: cleaning');
    console.log('   4. Open Collection: housemaids');
    console.log('   5. Click "Find" button');
    console.log('   6. You should see 6 documents');

    await client.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    if (client) await client.close();
    process.exit(1);
  }
};

forceAddHousemaids();

