import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const showCleaningDBData = async () => {
  try {
    // Force connection to cleaning database
    const uri = process.env.MONGODB_URI;
    let cleaningUri = uri;
    
    // Ensure /cleaning is in the URI
    if (!uri.includes('/cleaning')) {
      cleaningUri = uri.replace(/\/([^\/\?]*)(\?|$)/, '/cleaning$2');
    }
    
    console.log('🔗 Connecting to "cleaning" database...\n');
    await mongoose.connect(cleaningUri);
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log(`✅ Connected to: ${dbName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 All Collections:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');

    // Check housemaids collection
    const housemaidsCollection = db.collection('housemaids');
    const count = await housemaidsCollection.countDocuments();
    const housemaids = await housemaidsCollection.find({}).toArray();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Collection: housemaids`);
    console.log(`   Count: ${count} documents`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (count > 0) {
      console.log('✅ All Housemaids Data:');
      housemaids.forEach((h, i) => {
        console.log(`\n${i + 1}. ${h.arabicName || h.name}`);
        console.log(`   - Phone: ${h.phone}`);
        console.log(`   - Nationality: ${h.nationality}`);
        console.log(`   - Age: ${h.age}`);
        console.log(`   - Contract: ${h.contractType}`);
        console.log(`   - Status: ${h.status}`);
        console.log(`   - Rating: ${h.rating || 0}/5`);
        console.log(`   - ID: ${h._id}`);
      });
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ البيانات موجودة في:');
      console.log(`   Database: ${dbName}`);
      console.log(`   Collection: housemaids`);
      console.log(`   Total: ${count} housemaids`);
      console.log('\n💡 في MongoDB Compass:');
      console.log('   1. افتحي Database: cleaning');
      console.log('   2. افتحي Collection: housemaids');
      console.log('   3. اضغطي "Find" أو Refresh');
      console.log('   4. ستجدين الـ 6 مساعدات');
    } else {
      console.log('⚠️  لا توجد بيانات في collection "housemaids"');
      console.log('\n💡 سأضيف البيانات الآن...\n');
      
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

      const result = await housemaidsCollection.insertMany(sampleData);
      console.log(`✅ Added ${result.insertedCount} housemaids\n`);
      
      const finalCount = await housemaidsCollection.countDocuments();
      console.log(`📊 Total: ${finalCount} housemaids`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

showCleaningDBData();

