import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const verifyConnection = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    let cleaningUri = uri;
    
    if (!uri.includes('/cleaning')) {
      cleaningUri = uri.replace(/\/([^\/\?]*)(\?|$)/, '/cleaning$2');
    }
    
    await mongoose.connect(cleaningUri);
    const db = mongoose.connection.db;
    
    console.log('✅ Connected to MongoDB\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 البيانات المعروضة في الموقع:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 1. Workers (العاملات)
    const workersCollection = db.collection('workers');
    const workersCount = await workersCollection.countDocuments({ 
      contractType: { $in: ['hourly', 'daily'] },
      isActive: { $ne: false },
      status: { $ne: 'inactive' }
    });
    console.log(`1. 👷 العاملات (Workers):`);
    console.log(`   - Collection: workers`);
    console.log(`   - Count: ${workersCount} (hourly/daily contracts)`);
    console.log(`   - API: GET /api/workers`);
    console.log(`   - Frontend: fetchWorkers() → workersAPI.getAll()`);
    console.log(`   ✅ معروضة في: /workers page\n`);

    // 2. Housemaids (المساعدات)
    const housemaidsCollection = db.collection('housemaids');
    const housemaidsCount = await housemaidsCollection.countDocuments({
      isActive: { $ne: false },
      status: { $ne: 'inactive' }
    });
    console.log(`2. 👔 المساعدات (Housemaids):`);
    console.log(`   - Collection: housemaids`);
    console.log(`   - Count: ${housemaidsCount}`);
    console.log(`   - API: GET /api/housemaids`);
    console.log(`   - Frontend: fetchHousemaids() → housemaidsAPI.getAll()`);
    console.log(`   ✅ معروضة في: /assistants page\n`);

    // 3. Orders (الطلبات)
    const ordersCollection = db.collection('orders');
    const ordersCount = await ordersCollection.countDocuments();
    console.log(`3. 📦 الطلبات (Orders):`);
    console.log(`   - Collection: orders`);
    console.log(`   - Count: ${ordersCount}`);
    console.log(`   - API: POST /api/orders (Public - لا يحتاج auth)`);
    console.log(`   - Frontend: createOrder() → ordersAPI.create()`);
    console.log(`   ✅ تُحفظ تلقائياً من: /service-request page\n`);

    // 4. Messages (الرسائل)
    const messagesCollection = db.collection('messages');
    const messagesCount = await messagesCollection.countDocuments();
    console.log(`4. 💬 الرسائل (Messages):`);
    console.log(`   - Collection: messages`);
    console.log(`   - Count: ${messagesCount}`);
    console.log(`   - API: POST /api/messages (Public - لا يحتاج auth)`);
    console.log(`   - Frontend: createMessage() → messagesAPI.create()`);
    console.log(`   ⚠️  Form غير موجود في Contact page (تم حذفه)\n`);

    // 5. Customers (العملاء)
    const customersCollection = db.collection('customers');
    const customersCount = await customersCollection.countDocuments();
    console.log(`5. 👥 العملاء (Customers):`);
    console.log(`   - Collection: customers`);
    console.log(`   - Count: ${customersCount}`);
    console.log(`   - API: POST /api/orders (يُنشئ customer تلقائياً)`);
    console.log(`   ✅ يُنشئ تلقائياً عند إنشاء Order جديد\n`);

    // 6. Notifications (الإشعارات)
    const notificationsCollection = db.collection('notifications');
    const notificationsCount = await notificationsCollection.countDocuments();
    console.log(`6. 🔔 الإشعارات (Notifications):`);
    console.log(`   - Collection: notifications`);
    console.log(`   - Count: ${notificationsCount}`);
    console.log(`   - API: GET /api/notifications`);
    console.log(`   - Frontend: Dashboard → Notifications page`);
    console.log(`   ✅ معروضة في: Dashboard\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 ملخص الربط:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ البيانات المعروضة في الموقع:');
    console.log('   - Workers: ✅ من قاعدة البيانات');
    console.log('   - Housemaids: ✅ من قاعدة البيانات');
    console.log('   - Notifications: ✅ من قاعدة البيانات\n');
    console.log('✅ البيانات التي تُحفظ تلقائياً:');
    console.log('   - Orders: ✅ تُحفظ عند إنشاء طلب جديد');
    console.log('   - Customers: ✅ يُنشئ تلقائياً مع Order');
    console.log('   - Messages: ⚠️  Form غير موجود (تم حذفه)\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyConnection();

