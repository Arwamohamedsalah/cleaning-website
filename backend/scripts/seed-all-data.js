import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const seedAllData = async () => {
  try {
    // Force connection to cleaning database
    const uri = process.env.MONGODB_URI;
    let cleaningUri = uri;
    
    if (!uri.includes('/cleaning')) {
      cleaningUri = uri.replace(/\/([^\/\?]*)(\?|$)/, '/cleaning$2');
    }
    
    console.log('🔗 Connecting to "cleaning" database...\n');
    await mongoose.connect(cleaningUri);
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log(`✅ Connected to: ${dbName}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 1. Seed Customers
    console.log('📝 1. Seeding Customers...\n');
    const customersCollection = db.collection('customers');
    const customersCount = await customersCollection.countDocuments();
    
    if (customersCount === 0) {
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

      const customersResult = await customersCollection.insertMany(customersData);
      console.log(`✅ Added ${customersResult.insertedCount} customers\n`);
    } else {
      console.log(`✅ Customers already exist (${customersCount} documents)\n`);
    }

    // Get customer IDs for orders
    const customers = await customersCollection.find({}).toArray();
    const customerIds = customers.map(c => c._id);

    // 2. Seed Orders
    console.log('📝 2. Seeding Orders...\n');
    const ordersCollection = db.collection('orders');
    const ordersCount = await ordersCollection.countDocuments();
    
    if (ordersCount === 0 && customerIds.length > 0) {
      const ordersData = [
        {
          orderNumber: 'ORD-2024-001',
          customer: customerIds[0],
          fullName: 'أحمد محمد',
          phone: '0501111111',
          email: 'ahmed@example.com',
          serviceType: 'comprehensive',
          rooms: 4,
          workers: 2,
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // بعد يومين
          time: '10:00',
          address: 'حي النرجس، الرياض',
          city: 'riyadh',
          district: 'النرجس',
          amount: 300,
          status: 'pending',
          paymentStatus: 'pending',
          notes: 'يرجى التنظيف العميق للمطبخ',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          orderNumber: 'ORD-2024-002',
          customer: customerIds[1],
          fullName: 'فاطمة علي',
          phone: '0502222222',
          email: 'fatima@example.com',
          serviceType: 'normal',
          rooms: 3,
          workers: 1,
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // بعد 3 أيام
          time: '14:00',
          address: 'حي العليا، الرياض',
          city: 'riyadh',
          district: 'العليا',
          amount: 150,
          status: 'confirmed',
          paymentStatus: 'paid',
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          orderNumber: 'ORD-2024-003',
          customer: customerIds[2],
          fullName: 'محمد خالد',
          phone: '0503333333',
          email: 'mohammed@example.com',
          serviceType: 'quick',
          rooms: 2,
          workers: 1,
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // بعد يوم
          time: '09:00',
          address: 'حي الصفا، جدة',
          city: 'jeddah',
          district: 'الصفا',
          amount: 100,
          status: 'completed',
          paymentStatus: 'paid',
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          orderNumber: 'ORD-2024-004',
          customer: customerIds[3],
          fullName: 'سارة أحمد',
          phone: '0504444444',
          email: 'sara@example.com',
          serviceType: 'deep',
          rooms: 5,
          workers: 2,
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // بعد 5 أيام
          time: '11:00',
          address: 'حي الشاطئ، الدمام',
          city: 'dammam',
          district: 'الشاطئ',
          amount: 400,
          status: 'pending',
          paymentStatus: 'pending',
          notes: 'تنظيف شامل للمنزل',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          orderNumber: 'ORD-2024-005',
          customer: customerIds[4],
          fullName: 'عبدالله سالم',
          phone: '0505555555',
          email: 'abdullah@example.com',
          serviceType: 'normal',
          rooms: 3,
          workers: 1,
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // بعد 4 أيام
          time: '15:00',
          address: 'حي الخليج، الخبر',
          city: 'khobar',
          district: 'الخليج',
          amount: 150,
          status: 'confirmed',
          paymentStatus: 'paid',
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          orderNumber: 'ORD-2024-006',
          customer: customerIds[0],
          fullName: 'أحمد محمد',
          phone: '0501111111',
          email: 'ahmed@example.com',
          serviceType: 'comprehensive',
          rooms: 4,
          workers: 2,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // قبل يومين (مكتمل)
          time: '10:00',
          address: 'حي النرجس، الرياض',
          city: 'riyadh',
          district: 'النرجس',
          amount: 300,
          status: 'completed',
          paymentStatus: 'paid',
          notes: '',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      ];

      const ordersResult = await ordersCollection.insertMany(ordersData);
      console.log(`✅ Added ${ordersResult.insertedCount} orders\n`);
    } else {
      console.log(`✅ Orders already exist (${ordersCount} documents)\n`);
    }

    // Get order IDs for notifications
    const orders = await ordersCollection.find({}).limit(3).toArray();
    const orderIds = orders.map(o => o._id);

    // 3. Seed Messages
    console.log('📝 3. Seeding Messages...\n');
    const messagesCollection = db.collection('messages');
    const messagesCount = await messagesCollection.countDocuments();
    
    if (messagesCount === 0) {
      const messagesData = [
        {
          name: 'محمد أحمد',
          email: 'mohammed.ahmed@example.com',
          phone: '0506666666',
          subject: 'inquiry',
          message: 'أريد الاستفسار عن خدمات التنظيف الشامل، ما هي الأسعار؟',
          read: false,
          replied: false,
          archived: false,
          replyMessage: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'فاطمة خالد',
          email: 'fatima.khalid@example.com',
          phone: '0507777777',
          subject: 'suggestion',
          message: 'اقتراح: إضافة خدمة تنظيف السجاد',
          read: true,
          replied: true,
          archived: false,
          replyMessage: 'شكراً لاقتراحك، سنأخذ ذلك في الاعتبار',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
        {
          name: 'سارة علي',
          email: 'sara.ali@example.com',
          phone: '0508888888',
          subject: 'complaint',
          message: 'شكوى: تأخر العاملات في الوصول',
          read: true,
          replied: false,
          archived: false,
          replyMessage: '',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
        {
          name: 'عبدالله محمد',
          email: 'abdullah.mohammed@example.com',
          phone: '0509999999',
          subject: 'general',
          message: 'شكراً لكم على الخدمة الممتازة',
          read: false,
          replied: false,
          archived: false,
          replyMessage: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'نورا سالم',
          email: 'nora.salem@example.com',
          phone: '0501010101',
          subject: 'inquiry',
          message: 'هل تقدمون خدمة تنظيف المكاتب؟',
          read: false,
          replied: false,
          archived: false,
          replyMessage: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const messagesResult = await messagesCollection.insertMany(messagesData);
      console.log(`✅ Added ${messagesResult.insertedCount} messages\n`);
    } else {
      console.log(`✅ Messages already exist (${messagesCount} documents)\n`);
    }

    // 4. Seed Notifications
    console.log('📝 4. Seeding Notifications...\n');
    const notificationsCollection = db.collection('notifications');
    const notificationsCount = await notificationsCollection.countDocuments();
    
    if (notificationsCount === 0) {
      const notificationsData = [
        {
          type: 'new-order',
          title: 'طلب جديد',
          message: 'تم استلام طلب جديد من أحمد محمد',
          link: '/dashboard/orders',
          read: false,
          userId: null,
          relatedId: orderIds[0] || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: 'order-status',
          title: 'تحديث حالة الطلب',
          message: 'تم تأكيد طلب فاطمة علي',
          link: '/dashboard/orders',
          read: false,
          userId: null,
          relatedId: orderIds[1] || null,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
        {
          type: 'new-message',
          title: 'رسالة جديدة',
          message: 'رسالة جديدة من محمد أحمد',
          link: '/dashboard/messages',
          read: true,
          userId: null,
          relatedId: null,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
        {
          type: 'new-application',
          title: 'طلب توظيف جديد',
          message: 'تم استلام طلب توظيف جديد',
          link: '/dashboard/applications',
          read: false,
          userId: null,
          relatedId: null,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
        {
          type: 'system',
          title: 'تحديث النظام',
          message: 'تم تحديث النظام بنجاح',
          link: '',
          read: false,
          userId: null,
          relatedId: null,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
        {
          type: 'order-status',
          title: 'اكتمال الطلب',
          message: 'تم إكمال طلب محمد خالد',
          link: '/dashboard/orders',
          read: true,
          userId: null,
          relatedId: orderIds[2] || null,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      ];

      const notificationsResult = await notificationsCollection.insertMany(notificationsData);
      console.log(`✅ Added ${notificationsResult.insertedCount} notifications\n`);
    } else {
      console.log(`✅ Notifications already exist (${notificationsCount} documents)\n`);
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Summary:');
    console.log(`   Database: ${dbName}`);
    console.log(`   Customers: ${await customersCollection.countDocuments()}`);
    console.log(`   Orders: ${await ordersCollection.countDocuments()}`);
    console.log(`   Messages: ${await messagesCollection.countDocuments()}`);
    console.log(`   Notifications: ${await notificationsCollection.countDocuments()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('✅ Done! All data seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

seedAllData();

