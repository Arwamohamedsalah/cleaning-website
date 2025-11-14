import Order from '../models/Order.js';
import Worker from '../models/Worker.js';
import Customer from '../models/Customer.js';

// @desc    Get orders report data
// @route   GET /api/reports/orders
// @access  Private
export const getOrdersReport = async (req, res) => {
  try {
    console.log('📊 Fetching orders report data...');

    // Get all orders
    const allOrders = await Order.find().select('createdAt status serviceType amount');

    // Group orders by month
    const monthlyMap = new Map();
    const statusMap = new Map();
    const serviceMap = new Map();

    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    allOrders.forEach(order => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const monthIndex = orderDate.getMonth();
      const monthName = monthNames[monthIndex];
      const year = orderDate.getFullYear();
      const monthKey = `${year}-${monthIndex}`;

      // Monthly data
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          name: monthName,
          orders: 0,
          completed: 0,
          cancelled: 0,
          pending: 0,
          inProgress: 0,
        });
      }
      const monthData = monthlyMap.get(monthKey);
      monthData.orders++;
      if (order.status === 'done' || order.status === 'completed') {
        monthData.completed++;
      } else if (order.status === 'cancelled') {
        monthData.cancelled++;
      } else if (order.status === 'in-progress') {
        monthData.inProgress++;
      } else {
        monthData.pending++;
      }

      // Status data
      const statusKey = order.status || 'pending';
      statusMap.set(statusKey, (statusMap.get(statusKey) || 0) + 1);

      // Service data
      const serviceType = order.serviceType || 'تنظيف اليوم';
      serviceMap.set(serviceType, (serviceMap.get(serviceType) || 0) + 1);
    });

    // Convert maps to arrays
    const monthlyData = Array.from(monthlyMap.values()).sort((a, b) => {
      const aIndex = monthNames.indexOf(a.name);
      const bIndex = monthNames.indexOf(b.name);
      return aIndex - bIndex;
    });

    const statusLabels = {
      'done': 'مكتملة',
      'completed': 'مكتملة',
      'in-progress': 'قيد التنفيذ',
      'confirmed': 'مؤكدة',
      'cancelled': 'ملغاة',
      'pending': 'معلقة',
    };

    const statusData = Array.from(statusMap.entries()).map(([status, value]) => ({
      name: statusLabels[status] || status,
      value: value,
    }));

    const serviceData = Array.from(serviceMap.entries()).map(([name, value]) => ({
      name: name,
      value: value,
    }));

    const totalOrders = allOrders.length;
    const completedOrders = allOrders.filter(o => o.status === 'done' || o.status === 'completed').length;
    const completionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0;

    console.log('✅ Orders report data fetched successfully');

    res.json({
      success: true,
      data: {
        monthlyData,
        statusData,
        serviceData,
        totalOrders,
        completedOrders,
        completionRate,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching orders report:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب بيانات تقرير الطلبات',
      error: error.message,
    });
  }
};

// @desc    Get revenue report data
// @route   GET /api/reports/revenue
// @access  Private
export const getRevenueReport = async (req, res) => {
  try {
    console.log('💰 Fetching revenue report data...');

    // Get all orders with amounts
    const allOrders = await Order.find().select('createdAt amount status');

    // Group revenue by month
    const monthlyMap = new Map();
    const serviceRevenueMap = new Map();

    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    allOrders.forEach(order => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const monthIndex = orderDate.getMonth();
      const monthName = monthNames[monthIndex];
      const year = orderDate.getFullYear();
      const monthKey = `${year}-${monthIndex}`;

      const amount = order.amount || 0;
      const profit = amount * 0.5; // Assuming 50% profit margin

      // Monthly revenue
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          name: monthName,
          revenue: 0,
          profit: 0,
        });
      }
      const monthData = monthlyMap.get(monthKey);
      monthData.revenue += amount;
      monthData.profit += profit;

      // Service revenue
      const serviceType = order.serviceType || 'تنظيف اليوم';
      if (!serviceRevenueMap.has(serviceType)) {
        serviceRevenueMap.set(serviceType, 0);
      }
      serviceRevenueMap.set(serviceType, serviceRevenueMap.get(serviceType) + amount);
    });

    // Convert maps to arrays
    const monthlyData = Array.from(monthlyMap.values()).sort((a, b) => {
      const aIndex = monthNames.indexOf(a.name);
      const bIndex = monthNames.indexOf(b.name);
      return aIndex - bIndex;
    });

    const serviceData = Array.from(serviceRevenueMap.entries()).map(([name, value]) => ({
      name: name,
      value: value,
    }));

    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const totalProfit = totalRevenue * 0.5;
    const averageMonthly = monthlyData.length > 0 ? (totalRevenue / monthlyData.length).toFixed(0) : 0;

    console.log('✅ Revenue report data fetched successfully');

    res.json({
      success: true,
      data: {
        monthlyData,
        serviceData,
        totalRevenue,
        totalProfit,
        averageMonthly,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching revenue report:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب بيانات تقرير الإيرادات',
      error: error.message,
    });
  }
};

// @desc    Get workers performance report data
// @route   GET /api/reports/workers
// @access  Private
export const getWorkersReport = async (req, res) => {
  try {
    console.log('👷‍♀ Fetching workers report data...');

    // Get all workers
    const allWorkers = await Worker.find({ isActive: true }).select('name experience skills');

    // Get orders per worker
    const ordersByWorker = await Order.aggregate([
      {
        $group: {
          _id: '$selectedWorker',
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);

    // Create worker performance data
    const workerPerformance = allWorkers.map(worker => {
      const workerOrders = ordersByWorker.find(o => o._id && o._id.toString() === worker._id.toString());
      return {
        name: worker.name,
        orders: workerOrders ? workerOrders.orderCount : 0,
        revenue: workerOrders ? workerOrders.totalRevenue : 0,
      };
    });

    // Group skills
    const skillsMap = new Map();
    allWorkers.forEach(worker => {
      if (worker.skills && Array.isArray(worker.skills)) {
        worker.skills.forEach(skill => {
          skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
        });
      }
    });

    const skillsData = Array.from(skillsMap.entries()).map(([name, value]) => ({
      name: name,
      value: value,
    }));

    const totalWorkers = allWorkers.length;
    const totalOrders = workerPerformance.reduce((sum, w) => sum + w.orders, 0);

    console.log('✅ Workers report data fetched successfully');

    res.json({
      success: true,
      data: {
        workerPerformance,
        skillsData,
        totalWorkers,
        totalOrders,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching workers report:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب بيانات تقرير العاملات',
      error: error.message,
    });
  }
};

// @desc    Get customer satisfaction report data
// @route   GET /api/reports/satisfaction
// @access  Private
export const getSatisfactionReport = async (req, res) => {
  try {
    console.log('⭐ Fetching satisfaction report data...');

    // Get all orders
    const allOrders = await Order.find().select('createdAt');

    // Group by month
    const monthlyMap = new Map();

    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    // Note: Rating functionality has been removed
    // This report now only shows satisfaction rate based on completed orders
    allOrders.forEach(order => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const monthIndex = orderDate.getMonth();
      const monthName = monthNames[monthIndex];
      const year = orderDate.getFullYear();
      const monthKey = `${year}-${monthIndex}`;

      // Monthly data - count completed orders as reviews
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          name: monthName,
          reviews: 0,
        });
      }
      const monthData = monthlyMap.get(monthKey);
      if (order.status === 'done') {
        monthData.reviews++;
      }
    });

    // Convert maps to arrays
    const monthlyData = Array.from(monthlyMap.values())
      .filter(month => month.reviews > 0)
      .sort((a, b) => {
        const aIndex = monthNames.indexOf(a.name);
        const bIndex = monthNames.indexOf(b.name);
        return aIndex - bIndex;
      })
      .map(month => ({
        name: month.name,
        reviews: month.reviews,
      }));

    const satisfactionByService = [];

    const totalReviews = allOrders.filter(o => o.status === 'done').length;
    const satisfactionRate = totalReviews > 0
      ? ((totalReviews / allOrders.length) * 100).toFixed(1)
      : 0;

    console.log('✅ Satisfaction report data fetched successfully');

    res.json({
      success: true,
      data: {
        monthlyData,
        satisfactionByService,
        totalReviews,
        satisfactionRate,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching satisfaction report:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب بيانات تقرير رضا العملاء',
      error: error.message,
    });
  }
};

