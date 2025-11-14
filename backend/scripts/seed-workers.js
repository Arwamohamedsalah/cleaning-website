import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const seedWorkers = async () => {
  try {
    // Force connection to cleaning database
    const uri = process.env.MONGODB_URI;
    let cleaningUri = uri;
    
    if (!uri.includes('/cleaning')) {
      cleaningUri = uri.replace(/\/([^\/\?]*)(\?|$)/, '/cleaning$2');
    }
    
    console.log('🔗 Connecting to "cleaning" database...\n');
    await mongoose.connect(cleaningUri);
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log(`✅ Connected to: ${dbName}\n`);

    // Get workers collection
    const workersCollection = db.collection('workers');
    
    // Check existing count
    const existingCount = await workersCollection.countDocuments();
    console.log(`📊 Current workers count: ${existingCount}\n`);

    if (existingCount === 0) {
      // Sample workers data (hourly/daily contracts only)
      const workersData = [
        {
          arabicName: 'سارة محمد',
          englishName: 'Sara Mohammed',
          nationality: 'فلبينية',
          age: 28,
          phone: '0501234567',
          experience: 5,
          skills: ['تنظيف عادي', 'كوي', 'تنظيف المطبخ'],
          languages: ['عربي', 'إنجليزي', 'فلبيني'],
          contractType: 'hourly',
          status: 'available',
          rating: 4.5,
          totalOrders: 45,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          arabicName: 'فاطمة أحمد',
          englishName: 'Fatima Ahmed',
          nationality: 'إندونيسية',
          age: 30,
          phone: '0502345678',
          experience: 6,
          skills: ['تنظيف عادي', 'تنظيف سريع', 'ترتيب'],
          languages: ['عربي', 'إنجليزي'],
          contractType: 'daily',
          status: 'available',
          rating: 4.6,
          totalOrders: 52,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          arabicName: 'مريم علي',
          englishName: 'Mariam Ali',
          nationality: 'فلبينية',
          age: 27,
          phone: '0503456789',
          experience: 4,
          skills: ['تنظيف عادي', 'تنظيف الحمامات', 'كوي'],
          languages: ['عربي', 'فلبيني'],
          contractType: 'hourly',
          status: 'busy',
          rating: 4.4,
          totalOrders: 38,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          arabicName: 'عائشة حسن',
          englishName: 'Aisha Hassan',
          nationality: 'سريلانكية',
          age: 29,
          phone: '0504567890',
          experience: 7,
          skills: ['تنظيف عادي', 'تنظيف متقدم', 'ترتيب'],
          languages: ['عربي', 'إنجليزي'],
          contractType: 'daily',
          status: 'available',
          rating: 4.7,
          totalOrders: 61,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          arabicName: 'زينب محمود',
          englishName: 'Zeinab Mahmoud',
          nationality: 'فلبينية',
          age: 26,
          phone: '0505678901',
          experience: 3,
          skills: ['تنظيف عادي', 'تنظيف سريع'],
          languages: ['عربي', 'إنجليزي', 'فلبيني'],
          contractType: 'hourly',
          status: 'available',
          rating: 4.3,
          totalOrders: 28,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          arabicName: 'نورا سالم',
          englishName: 'Nora Salem',
          nationality: 'إندونيسية',
          age: 31,
          phone: '0506789012',
          experience: 8,
          skills: ['تنظيف عادي', 'تنظيف متقدم', 'كوي', 'ترتيب'],
          languages: ['عربي', 'إنجليزي'],
          contractType: 'daily',
          status: 'available',
          rating: 4.8,
          totalOrders: 75,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      console.log('📝 Adding 6 workers...\n');
      const result = await workersCollection.insertMany(workersData);
      
      console.log(`✅ Successfully inserted ${result.insertedCount} workers\n`);
      
      // Verify
      const finalCount = await workersCollection.countDocuments();
      const allWorkers = await workersCollection.find({}).toArray();
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📊 Verification:`);
      console.log(`   Database: ${dbName}`);
      console.log(`   Collection: workers`);
      console.log(`   Total Documents: ${finalCount}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      console.log('✅ All Workers:');
      allWorkers.forEach((w, i) => {
        console.log(`   ${i + 1}. ${w.arabicName} - ${w.phone} - ${w.contractType}`);
      });
    } else {
      console.log(`✅ Workers already exist (${existingCount} documents)`);
      const allWorkers = await workersCollection.find({}).limit(10).toArray();
      console.log('\n📝 Sample Workers:');
      allWorkers.forEach((w, i) => {
        console.log(`   ${i + 1}. ${w.arabicName || w.name} - ${w.phone} - ${w.contractType || 'N/A'}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedWorkers();

