import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Housemaid from '../models/Housemaid.js';

dotenv.config();

const seedHousemaids = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing housemaids (optional)
    const existingCount = await Housemaid.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing housemaids. Clearing...`);
      await Housemaid.deleteMany({});
      console.log('✅ Cleared existing housemaids\n');
    }

    // Sample housemaids data
    const housemaidsData = [
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

    console.log('📝 Creating housemaids...\n');

    const createdHousemaids = [];
    for (const data of housemaidsData) {
      try {
        const housemaid = await Housemaid.create(data);
        createdHousemaids.push(housemaid);
        console.log(`✅ Created: ${housemaid.arabicName} (${housemaid.contractType})`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⏭️  Skipped: ${data.arabicName} (phone already exists)`);
        } else {
          console.error(`❌ Error creating ${data.arabicName}:`, error.message);
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Summary:');
    console.log(`   ✅ Created: ${createdHousemaids.length} housemaids`);
    console.log(`   📁 Collection: housemaids`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verify
    const total = await Housemaid.countDocuments();
    console.log(`📊 Total housemaids in database: ${total}`);

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedHousemaids();

