import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const moveToCleaningDB = async () => {
  try {
    // Connect to current database (test)
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const currentDb = mongoose.connection.db;
    const currentDbName = currentDb.databaseName;
    console.log(`📊 Current Database: ${currentDbName}`);

    // Get housemaids from current database
    const housemaidsCollection = currentDb.collection('housemaids');
    const housemaids = await housemaidsCollection.find({}).toArray();
    
    console.log(`📝 Found ${housemaids.length} housemaids in '${currentDbName}' database\n`);

    if (housemaids.length === 0) {
      console.log('⚠️  No housemaids to move');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Connect to cleaning database
    const cleaningUri = process.env.MONGODB_URI.replace(/\/[^\/]*(\?|$)/, '/cleaning$1');
    console.log(`🔗 Connecting to 'cleaning' database...`);
    
    await mongoose.connection.close();
    await mongoose.connect(cleaningUri);
    
    const cleaningDb = mongoose.connection.db;
    const cleaningDbName = cleaningDb.databaseName;
    console.log(`✅ Connected to Database: ${cleaningDbName}\n`);

    // Insert housemaids into cleaning database
    const cleaningHousemaidsCollection = cleaningDb.collection('housemaids');
    
    // Clear existing data (optional)
    const existingCount = await cleaningHousemaidsCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing housemaids in 'cleaning' database`);
      console.log('🗑️  Clearing existing data...');
      await cleaningHousemaidsCollection.deleteMany({});
    }

    // Insert housemaids
    console.log('📝 Inserting housemaids...\n');
    for (const housemaid of housemaids) {
      // Remove _id to let MongoDB create new one
      const { _id, ...housemaidData } = housemaid;
      await cleaningHousemaidsCollection.insertOne(housemaidData);
      console.log(`✅ Inserted: ${housemaid.arabicName || housemaid.name}`);
    }

    // Verify
    const finalCount = await cleaningHousemaidsCollection.countDocuments();
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Summary:');
    console.log(`   ✅ Moved: ${housemaids.length} housemaids`);
    console.log(`   📁 From: ${currentDbName}.housemaids`);
    console.log(`   📁 To: ${cleaningDbName}.housemaids`);
    console.log(`   📊 Total in cleaning: ${finalCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

moveToCleaningDB();

