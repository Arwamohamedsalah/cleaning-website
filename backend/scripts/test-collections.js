// Test script to verify all collections in cleaning database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Application from '../models/Application.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

dotenv.config();

const testCollections = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('📊 Database: cleaning');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in .env file');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}\n`);

    // Test all models
    console.log('📋 Testing Collections...\n');
    
    const db = conn.connection.db;
    const collections = [
      { name: 'users', model: User },
      { name: 'workers', model: Worker },
      { name: 'applications', model: Application },
      { name: 'customers', model: Customer },
      { name: 'orders', model: Order },
      { name: 'messages', model: Message },
      { name: 'notifications', model: Notification },
    ];

    for (const collection of collections) {
      try {
        // Try to get collection info
        const collectionsList = await db.listCollections({ name: collection.name }).toArray();
        
        if (collectionsList.length > 0) {
          const count = await collection.model.countDocuments();
          console.log(`✅ ${collection.name.padEnd(15)} - Exists (${count} documents)`);
        } else {
          // Collection doesn't exist yet, but model is ready
          console.log(`⚠️  ${collection.name.padEnd(15)} - Will be created on first use`);
        }
      } catch (error) {
        console.log(`❌ ${collection.name.padEnd(15)} - Error: ${error.message}`);
      }
    }

    console.log('\n📊 All Collections Status:');
    const allCollections = await db.listCollections().toArray();
    console.log(`   Total Collections: ${allCollections.length}`);
    allCollections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully!');
    console.log('💡 Collections will be created automatically when you use them in the application.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:');
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
};

testCollections();

