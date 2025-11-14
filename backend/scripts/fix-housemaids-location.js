import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixHousemaidsLocation = async () => {
  try {
    console.log('🔍 Checking all databases...\n');

    // Connect to MongoDB (without specifying database)
    const baseUri = process.env.MONGODB_URI.split('/').slice(0, 3).join('/');
    await mongoose.connect(baseUri);
    
    const adminDb = mongoose.connection.db.admin();
    const { databases } = await adminDb.listDatabases();
    
    console.log('📊 Available Databases:');
    databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    console.log('');

    // Check each database for housemaids
    for (const dbInfo of databases) {
      const dbName = dbInfo.name;
      if (dbName === 'admin' || dbName === 'local' || dbName === 'config') continue;

      await mongoose.connection.close();
      await mongoose.connect(`${baseUri}/${dbName}`);
      
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      const housemaidsCollection = collections.find(c => c.name === 'housemaids');
      
      if (housemaidsCollection) {
        const count = await db.collection('housemaids').countDocuments();
        console.log(`📁 Database: ${dbName}`);
        console.log(`   Collection: housemaids`);
        console.log(`   Count: ${count} documents`);
        
        if (count > 0) {
          const sample = await db.collection('housemaids').find({}).limit(3).toArray();
          console.log(`   Sample:`);
          sample.forEach((h, i) => {
            console.log(`      ${i + 1}. ${h.arabicName || h.name} - ${h.phone}`);
          });
        }
        console.log('');
      }
    }

    // Now ensure data is in 'cleaning' database
    await mongoose.connection.close();
    const cleaningUri = `${baseUri}/cleaning`;
    await mongoose.connect(cleaningUri);
    
    const cleaningDb = mongoose.connection.db;
    const housemaidsCollection = cleaningDb.collection('housemaids');
    const count = await housemaidsCollection.countDocuments();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Final Status - Database: cleaning`);
    console.log(`   Collection: housemaids`);
    console.log(`   Count: ${count} documents`);
    
    if (count === 0) {
      console.log('\n⚠️  No data in cleaning.housemaids');
      console.log('💡 Need to add data...');
      
      // Add sample data
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

      console.log('\n📝 Adding sample data...');
      for (const data of sampleData) {
        try {
          await housemaidsCollection.insertOne(data);
          console.log(`✅ Added: ${data.arabicName}`);
        } catch (error) {
          if (error.code === 11000) {
            console.log(`⏭️  Skipped: ${data.arabicName} (already exists)`);
          } else {
            console.error(`❌ Error: ${data.arabicName} - ${error.message}`);
          }
        }
      }
      
      const finalCount = await housemaidsCollection.countDocuments();
      console.log(`\n✅ Total documents: ${finalCount}`);
    } else {
      console.log('\n✅ Data already exists!');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixHousemaidsLocation();

