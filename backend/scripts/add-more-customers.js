import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const addMoreCustomers = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    let cleaningUri = uri;
    
    if (!uri.includes('/cleaning')) {
      cleaningUri = uri.replace(/\/([^\/\?]*)(\?|$)/, '/cleaning$2');
    }
    
    await mongoose.connect(cleaningUri);
    const db = mongoose.connection.db;
    const customersCollection = db.collection('customers');
    
    // Check existing customers
    const existingPhones = await customersCollection.find({}, { projection: { phone: 1 } }).toArray();
    const existingPhoneNumbers = existingPhones.map(c => c.phone);
    
    const customersData = [
      {
        name: 'أحمد محمد',
        phone: '0501111111',
        email: 'ahmed@example.com',
        address: 'حي النرجس، الرياض',
        city: 'riyadh',
        district: 'النرجس',
        totalOrders: 5,
        totalSpent: 750,
        rating: 4.8,
        lastOrderDate: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'فاطمة علي',
        phone: '0502222222',
        email: 'fatima@example.com',
        address: 'حي العليا، الرياض',
        city: 'riyadh',
        district: 'العليا',
        totalOrders: 3,
        totalSpent: 450,
        rating: 5.0,
        lastOrderDate: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'محمد خالد',
        phone: '0503333333',
        email: 'mohammed@example.com',
        address: 'حي الصفا، جدة',
        city: 'jeddah',
        district: 'الصفا',
        totalOrders: 8,
        totalSpent: 1200,
        rating: 4.9,
        lastOrderDate: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'سارة أحمد',
        phone: '0504444444',
        email: 'sara@example.com',
        address: 'حي الشاطئ، الدمام',
        city: 'dammam',
        district: 'الشاطئ',
        totalOrders: 2,
        totalSpent: 300,
        rating: 4.7,
        lastOrderDate: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'عبدالله سالم',
        phone: '0505555555',
        email: 'abdullah@example.com',
        address: 'حي الخليج، الخبر',
        city: 'khobar',
        district: 'الخليج',
        totalOrders: 6,
        totalSpent: 900,
        rating: 4.6,
        lastOrderDate: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    let added = 0;
    let skipped = 0;

    for (const customer of customersData) {
      if (existingPhoneNumbers.includes(customer.phone)) {
        skipped++;
        continue;
      }
      
      try {
        await customersCollection.insertOne(customer);
        added++;
        console.log(`✅ Added: ${customer.name}`);
      } catch (error) {
        if (error.code === 11000) {
          skipped++;
        } else {
          console.error(`❌ Error: ${customer.name} - ${error.message}`);
        }
      }
    }

    const total = await customersCollection.countDocuments();
    console.log(`\n✅ Added: ${added}, Skipped: ${skipped}, Total: ${total}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addMoreCustomers();

