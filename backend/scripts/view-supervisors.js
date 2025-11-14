import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const viewSupervisors = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log(`✅ Connected to: ${dbName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Find all supervisors
    const supervisors = await User.find({ role: 'supervisor' })
      .select('name email phone role isActive createdAt')
      .sort({ createdAt: -1 });

    console.log(`📊 المشرفين في الداتا بيز: ${supervisors.length}\n`);

    if (supervisors.length === 0) {
      console.log('⚠️  لا يوجد مشرفين في الداتا بيز');
      console.log('💡 يمكنك إنشاء مشرف من خلال: Dashboard → Settings → صلاحيات المشرفين');
    } else {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      supervisors.forEach((supervisor, index) => {
        console.log(`\n${index + 1}. المشرف:`);
        console.log(`   📧 Email (Username): ${supervisor.email}`);
        console.log(`   👤 Name: ${supervisor.name}`);
        console.log(`   📞 Phone: ${supervisor.phone || 'غير محدد'}`);
        console.log(`   🔐 Role: ${supervisor.role}`);
        console.log(`   ✅ Status: ${supervisor.isActive ? 'نشط' : 'معطل'}`);
        console.log(`   📅 Created: ${supervisor.createdAt}`);
        console.log(`   🆔 ID: ${supervisor._id}`);
      });
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n💡 ملاحظات:');
      console.log('   - Username للتسجيل: يمكن استخدام Email أو Name');
      console.log('   - Password: محفوظة بشكل مشفر في حقل "password"');
      console.log('   - لا يمكن رؤية Password المشفرة (لأسباب أمنية)');
      console.log('   - إذا نسيت Password، يجب إعادة تعيينها من Dashboard');
    }

    // Also show all users for reference
    const allUsers = await User.find({})
      .select('name email role isActive')
      .sort({ createdAt: -1 });
    
    console.log(`\n📊 جميع المستخدمين: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ تم بنجاح!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

viewSupervisors();

