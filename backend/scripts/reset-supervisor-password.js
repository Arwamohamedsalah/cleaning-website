import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const resetSupervisorPassword = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get supervisor email from command line or use first supervisor
    const supervisorEmail = process.argv[2];
    const newPassword = process.argv[3] || 'supervisor123';

    // Find supervisor user
    let supervisor = null;
    
    // First try to find by email if provided
    if (supervisorEmail) {
      supervisor = await User.findOne({ 
        email: supervisorEmail.toLowerCase().trim(),
        role: 'supervisor'
      }).select('+password');
      
      if (!supervisor) {
        console.log(`❌ Supervisor with email "${supervisorEmail}" not found!`);
        console.log('\n💡 Available supervisors:');
        const allSupervisors = await User.find({ role: 'supervisor' }).select('email name');
        allSupervisors.forEach((s, i) => {
          console.log(`   ${i + 1}. ${s.email} (${s.name})`);
        });
        process.exit(1);
      }
    } else {
      // If no email provided, find first supervisor
      supervisor = await User.findOne({ role: 'supervisor' }).select('+password');
      
      if (!supervisor) {
        console.log('❌ No supervisor found in database!');
        console.log('💡 You can create a supervisor from: Dashboard → Settings → Users');
        process.exit(1);
      }
    }

    console.log(`🔐 Resetting password for supervisor:`);
    console.log(`   📧 Email: ${supervisor.email}`);
    console.log(`   👤 Name: ${supervisor.name}`);
    console.log(`   🔑 New password: ${newPassword}\n`);

    // Set new password (will be hashed by pre('save') hook)
    supervisor.password = newPassword;
    await supervisor.save();

    console.log('✅ Password reset successfully!');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Login Credentials:');
    console.log(`   📧 Email/Username: ${supervisor.email}`);
    console.log(`   👤 Name/Username: ${supervisor.name}`);
    console.log(`   🔑 Password: ${newPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 You can now login with these credentials.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetSupervisorPassword();

