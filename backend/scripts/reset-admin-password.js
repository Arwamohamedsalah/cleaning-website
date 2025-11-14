import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const resetAdminPassword = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get admin email from command line or use default
    const adminEmail = process.argv[2] || 'admin@cleaning.com';
    const newPassword = process.argv[3] || 'admin123';

    console.log(`🔐 Resetting password for: ${adminEmail}`);
    console.log(`🔑 New password: ${newPassword}\n`);

    // Find admin user
    let admin = null;
    
    // First try to find by email
    if (adminEmail && adminEmail !== 'admin@cleaning.com') {
      admin = await User.findOne({ email: adminEmail.toLowerCase().trim() }).select('+password');
    }
    
    // If not found, find first admin
    if (!admin) {
      admin = await User.findOne({ role: 'admin' }).select('+password');
    }

    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('💡 Available admins:');
      const allAdmins = await User.find({ role: 'admin' }).select('email name');
      allAdmins.forEach((a, i) => {
        console.log(`   ${i + 1}. ${a.email} (${a.name})`);
      });
      process.exit(1);
    }

    console.log(`✅ Found admin: ${admin.name} (${admin.email})`);

    // Set new password (will be hashed by pre('save') hook)
    admin.password = newPassword;
    await admin.save();

    console.log('\n✅ Password reset successfully!');
    console.log(`\n📧 Email: ${admin.email}`);
    console.log(`👤 Name: ${admin.name}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log('\n💡 You can now login with these credentials.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();

