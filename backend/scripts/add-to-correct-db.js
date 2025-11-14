import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const addToCorrectDB = async () => {
  try {
    const baseUri = process.env.MONGODB_URI.split('/').slice(0, 3).join('/');
    
    // Try different database names
    const dbNames = [
      'cleaning website',
      'cleaning-website',
      'cleaning_website',
      'cleaningwebsite'
    ];

    for (const dbName of dbNames) {
      try {
        const uri = `${baseUri}/${encodeURIComponent(dbName)}`;
        console.log(`🔗 Trying: ${dbName}...`);
        
        await mongoose.connect(uri);
        const db = mongoose.connection.db;
        const actualDbName = db.databaseName;
        
        console.log(`✅ Connected to: ${actualDbName}\n`);
        
        // Check for housemaids collection
        const collections = await db.listCollections().toArray();
        const hasHousemaids = collections.some(c => c.name === 'housemaids');
        
        if (hasHousemaids) {
          const housemaidsCollection = db.collection('housemaids');
          const count = await housemaidsCollection.countDocuments();
          
          console.log(`📊 Found housemaids collection with ${count} documents\n`);
          
          if (count === 0) {
            // Add data
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

            console.log('📝 Adding data...\n');
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
            console.log(`✅ Data already exists (${count} documents)`);
          }
        } else {
          console.log('⚠️  housemaids collection not found in this database');
        }
        
        await mongoose.connection.close();
        break;
      } catch (error) {
        console.log(`❌ Failed: ${error.message}\n`);
        if (mongoose.connection.readyState === 1) {
          await mongoose.connection.close();
        }
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addToCorrectDB();

