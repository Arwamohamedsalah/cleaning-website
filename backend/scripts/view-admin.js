import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const viewAdmin = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    const admins = await User.find({ role: 'admin' })
      .select('name email phone role isActive createdAt')
      .sort({ createdAt: -1 });

    if (admins.length === 0) {
      console.log('⚠️  No admin users found!');
      console.log('\n💡 Default credentials (if created):');
      console.log('   📧 Email: admin@cleaning.com');
      console.log('   🔑 Password: admin123');
      console.log('\n💡 To create admin, run: npm run create-admin');
      process.exit(0);
    }

    console.log(`📋 Found ${admins.length} admin user(s):\n`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. 👤 ${admin.name}`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   📞 Phone: ${admin.phone || 'غير محدد'}`);
      console.log(`   ✅ Status: ${admin.isActive ? 'نشط' : 'غير نشط'}`);
      console.log(`   📅 Created: ${admin.createdAt ? new Date(admin.createdAt).toLocaleString('ar-SA') : 'غير محدد'}`);
      console.log('');
    });

    console.log('💡 Login with: Email or Name');
    console.log('💡 Password: محفوظة بشكل مشفر (لا يمكن رؤيتها)');
    console.log('💡 If you forgot password, reset it from Dashboard > Settings > Users');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

viewAdmin();
