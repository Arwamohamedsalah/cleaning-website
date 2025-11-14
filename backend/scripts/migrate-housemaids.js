import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Worker from '../models/Worker.js';
import Housemaid from '../models/Housemaid.js';

dotenv.config();

const migrateHousemaids = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all workers with monthly or yearly contracts
    const assistants = await Worker.find({
      contractType: { $in: ['monthly', 'yearly'] }
    });

    console.log(`📊 Found ${assistants.length} assistants in 'workers' collection`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (assistants.length === 0) {
      console.log('⚠️  No assistants found to migrate');
      await mongoose.connection.close();
      process.exit(0);
    }

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const assistant of assistants) {
      try {
        // Check if housemaid already exists (by phone)
        const existing = await Housemaid.findOne({ phone: assistant.phone });
        
        if (existing) {
          console.log(`⏭️  Skipped: ${assistant.arabicName || assistant.name} (already exists)`);
          skipped++;
          continue;
        }

        // Create new housemaid document
        const housemaidData = {
          arabicName: assistant.arabicName || assistant.name,
          englishName: assistant.englishName,
          nationality: assistant.nationality,
          age: assistant.age,
          phone: assistant.phone,
          idNumber: assistant.idNumber,
          birthDate: assistant.birthDate,
          experience: assistant.experience,
          skills: assistant.skills || [],
          languages: assistant.languages || [],
          maritalStatus: assistant.maritalStatus,
          contractType: assistant.contractType,
          status: assistant.status,
          rating: assistant.rating || 0,
          totalOrders: assistant.totalOrders || assistant.orders || 0,
          photos: assistant.photos || [],
          idPhoto: assistant.idPhoto,
          joinDate: assistant.joinDate || assistant.createdAt,
          adminNotes: assistant.adminNotes,
          isActive: assistant.isActive !== false,
        };

        const housemaid = await Housemaid.create(housemaidData);
        console.log(`✅ Migrated: ${housemaid.arabicName} (${housemaid.contractType})`);
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating ${assistant.arabicName || assistant.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Count final housemaids
    const totalHousemaids = await Housemaid.countDocuments();
    console.log(`📊 Total housemaids in 'housemaids' collection: ${totalHousemaids}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration Error:', error.message);
    process.exit(1);
  }
};

migrateHousemaids();

