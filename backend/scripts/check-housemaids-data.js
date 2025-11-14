import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Housemaid from '../models/Housemaid.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Count housemaids
    const housemaidsCount = await Housemaid.countDocuments();
    const allHousemaids = await Housemaid.find({});

    console.log('📊 البيانات في قاعدة البيانات:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📁 Collection: housemaids`);
    console.log(`👔 المساعدات (monthly/yearly): ${housemaidsCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (housemaidsCount > 0) {
      console.log('📝 بيانات المساعدات:');
      allHousemaids.forEach((h, i) => {
        console.log(`\n${i + 1}. ${h.arabicName || h.name}`);
        console.log(`   - الجنسية: ${h.nationality}`);
        console.log(`   - العمر: ${h.age}`);
        console.log(`   - الهاتف: ${h.phone}`);
        console.log(`   - نوع العقد: ${h.contractType}`);
        console.log(`   - الحالة: ${h.status}`);
        console.log(`   - ID: ${h._id}`);
      });
    } else {
      console.log('⚠️  لا توجد بيانات مسجلة بعد في collection "housemaids"');
      console.log('\n💡 نصيحة:');
      console.log('   - أضف مساعدة جديدة من Dashboard → المساعدات → ➕ إضافة مساعد جديد');
      console.log('   - أو قم بنقل البيانات القديمة من collection "workers" إذا كانت موجودة');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkData();

