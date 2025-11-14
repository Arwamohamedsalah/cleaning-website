import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Worker from '../models/Worker.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Count workers (hourly/daily)
    const workersCount = await Worker.countDocuments({
      contractType: { $in: ['hourly', 'daily'] }
    });

    // Count assistants (monthly/yearly)
    const assistantsCount = await Worker.countDocuments({
      contractType: { $in: ['monthly', 'yearly'] }
    });

    // Get all workers
    const allWorkers = await Worker.find({});
    const totalCount = allWorkers.length;

    console.log('📊 البيانات في قاعدة البيانات:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📁 Collection: workers`);
    console.log(`👷 العاملات (hourly/daily): ${workersCount}`);
    console.log(`👔 المساعدات (monthly/yearly): ${assistantsCount}`);
    console.log(`📊 إجمالي: ${totalCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (totalCount > 0) {
      console.log('📝 أمثلة على البيانات:');
      console.log('\n👷 العاملات:');
      const workers = await Worker.find({ contractType: { $in: ['hourly', 'daily'] } }).limit(3);
      workers.forEach((w, i) => {
        console.log(`  ${i + 1}. ${w.arabicName || w.name} - ${w.contractType} - ${w.phone}`);
      });

      console.log('\n👔 المساعدات:');
      const assistants = await Worker.find({ contractType: { $in: ['monthly', 'yearly'] } }).limit(3);
      assistants.forEach((a, i) => {
        console.log(`  ${i + 1}. ${a.arabicName || a.name} - ${a.contractType} - ${a.phone}`);
      });
    } else {
      console.log('⚠️  لا توجد بيانات مسجلة بعد');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkData();

