import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Worker from '../models/Worker.js';
import Housemaid from '../models/Housemaid.js';

dotenv.config();

const checkAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check workers collection
    const allWorkers = await Worker.find({});
    const workersOnly = allWorkers.filter(w => w.contractType === 'hourly' || w.contractType === 'daily');
    const assistantsInWorkers = allWorkers.filter(w => w.contractType === 'monthly' || w.contractType === 'yearly');

    // Check housemaids collection
    const allHousemaids = await Housemaid.find({});

    console.log('📊 البيانات في قاعدة البيانات:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📁 Collection: workers`);
    console.log(`   👷 العاملات (hourly/daily): ${workersOnly.length}`);
    console.log(`   👔 المساعدات القديمة (monthly/yearly): ${assistantsInWorkers.length}`);
    console.log(`   📊 إجمالي: ${allWorkers.length}`);
    console.log('');
    console.log(`📁 Collection: housemaids`);
    console.log(`   👔 المساعدات الجديدة: ${allHousemaids.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (assistantsInWorkers.length > 0) {
      console.log('⚠️  يوجد بيانات قديمة للمساعدات في collection "workers":');
      assistantsInWorkers.forEach((a, i) => {
        console.log(`   ${i + 1}. ${a.arabicName || a.name} - ${a.contractType}`);
      });
      console.log('\n💡 يمكنك نقل هذه البيانات باستخدام:');
      console.log('   node backend/scripts/migrate-housemaids.js');
    }

    if (allHousemaids.length === 0 && assistantsInWorkers.length === 0) {
      console.log('💡 لا توجد بيانات قديمة. يمكنك إضافة مساعدة جديدة من Dashboard.');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkAllData();

