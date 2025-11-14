import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const createHousemaidsInCompassDB = async () => {
  let client;
  try {
    const uri = process.env.MONGODB_URI;
    const baseUri = uri.split('/').slice(0, 3).join('/');
    
    // Connect to "cleaning website" database (as shown in Compass)
    const dbName = 'cleaning website';
    const connectionUri = `${baseUri}/${encodeURIComponent(dbName)}?retryWrites=true&w=majority`;
    
    console.log('🔗 Connecting to "cleaning website" database...\n');
    
    client = new MongoClient(connectionUri);
    await client.connect();
    
    const db = client.db();
    console.log(`✅ Connected to: ${db.databaseName}\n`);

    // Get or create housemaids collection
    const housemaidsCollection = db.collection('housemaids');
    
    // Check existing count
    const existingCount = await housemaidsCollection.countDocuments();
    console.log(`📊 Current count: ${existingCount}\n`);

    if (existingCount === 0) {
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
        },
      ];

      console.log('📝 Adding 6 housemaids...\n');
      const result = await housemaidsCollection.insertMany(sampleData);
      console.log(`✅ Inserted ${result.insertedCount} documents\n`);
      
      const finalCount = await housemaidsCollection.countDocuments();
      console.log(`📊 Total documents: ${finalCount}`);
      console.log('\n✅ Done! Refresh MongoDB Compass to see the data.');
    } else {
      console.log(`✅ Data already exists (${existingCount} documents)`);
      console.log('\n💡 If you don\'t see data in Compass, try:');
      console.log('   1. Refresh the collection (click refresh icon)');
      console.log('   2. Check if you\'re in the correct database');
      console.log('   3. Try clicking on "housemaids" collection again');
    }

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (client) await client.close();
    process.exit(1);
  }
};

createHousemaidsInCompassDB();

