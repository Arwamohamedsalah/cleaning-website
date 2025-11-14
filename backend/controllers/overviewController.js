import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Worker from '../models/Worker.js';
import Application from '../models/Application.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get dashboard overview stats
// @route   GET /api/overview
// @access  Private
export const getOverview = async (req, res, next) => {
  try {
    console.log('📊 Fetching overview data...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total orders today
    const totalOrdersToday = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // In progress orders
    const inProgressOrders = await Order.countDocuments({
      status: 'in-progress',
    });

    // Completed today
    const completedToday = await Order.countDocuments({
      status: 'done',
      completedAt: { $gte: today, $lt: tomorrow },
    });

    // Total workers
    const totalWorkers = await Worker.countDocuments({ isActive: true });
    const availableWorkers = await Worker.countDocuments({
      status: 'available',
      isActive: true,
    });

    // Orders in last 7 days - simplified approach
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    let ordersLast7Days = [];
    try {
      // Get orders and group by day manually (more reliable)
      const orders = await Order.find({ createdAt: { $gte: sevenDaysAgo } }).select('createdAt');
      const dayCounts = {};
      orders.forEach(order => {
        const day = order.createdAt.getDay(); // 0 = Sunday, 1 = Monday, etc.
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      });
      // Convert to array format expected by frontend
      ordersLast7Days = Object.entries(dayCounts).map(([day, count]) => ({
        _id: { $dayOfWeek: parseInt(day) },
        count,
      }));
    } catch (aggError) {
      console.error('Error in ordersLast7Days:', aggError);
      ordersLast7Days = [];
    }

    // Service distribution
    let serviceDistribution = [];
    try {
      serviceDistribution = await Order.aggregate([
        {
          $group: {
            _id: '$serviceType',
            count: { $sum: 1 },
          },
        },
      ]);
    } catch (aggError) {
      console.error('Error in serviceDistribution aggregation:', aggError);
      // Fallback: get all orders and group manually
      const allOrders = await Order.find().select('serviceType');
      const serviceCounts = {};
      allOrders.forEach(order => {
        const type = order.serviceType || 'unknown';
        serviceCounts[type] = (serviceCounts[type] || 0) + 1;
      });
      serviceDistribution = Object.entries(serviceCounts).map(([type, count]) => ({
        _id: type,
        count,
      }));
    }

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber customer serviceType date time status amount createdAt');

    console.log('✅ Overview data fetched successfully');
    
    res.json({
      success: true,
      data: {
        stats: {
          totalOrdersToday: totalOrdersToday || 0,
          inProgressOrders: inProgressOrders || 0,
          completedToday: completedToday || 0,
          totalWorkers: totalWorkers || 0,
          availableWorkers: availableWorkers || 0,
        },
        ordersLast7Days: ordersLast7Days || [],
        serviceDistribution: serviceDistribution || [],
        recentOrders: recentOrders || [],
      },
    });
  } catch (error) {
    console.error('❌ Error in getOverview:', error);
    console.error('Error stack:', error.stack);
    next(error);
  }
};

// @desc    Get profile statistics
// @route   GET /api/overview/profile-stats
// @access  Private
export const getProfileStats = async (req, res, next) => {
  try {
    console.log('📊 Fetching profile statistics...');
    
    // Total orders
    const totalOrders = await Order.countDocuments();
    
    // Total customers
    const totalCustomers = await Customer.countDocuments();
    
    // Total workers
    const totalWorkers = await Worker.countDocuments({ isActive: true });
    
    console.log('✅ Profile stats fetched successfully');
    
    res.json({
      success: true,
      data: {
        totalOrders: totalOrders || 0,
        totalCustomers: totalCustomers || 0,
        totalWorkers: totalWorkers || 0,
      },
    });
  } catch (error) {
    console.error('❌ Error in getProfileStats:', error);
    console.error('Error stack:', error.stack);
    next(error);
  }
};

