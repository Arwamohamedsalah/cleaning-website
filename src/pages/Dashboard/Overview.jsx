import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../../store/slices/ordersSlice';
import { overviewAPI } from '../../services/api';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import GlassCard from '../../components/GlassCard';
import CounterAnimation from '../../components/CounterAnimation';
import Chart from '../../components/Chart';
import PieChart from '../../components/PieChart';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const Overview = () => {
  const dispatch = useDispatch();
  const { sidebarWidth } = useSelector((state) => state.theme);
  const { orders } = useSelector((state) => state.orders);
  const [overviewData, setOverviewData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  // Default sidebar width if not set
  const sidebarWidthValue = sidebarWidth || 280;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch overview data
  useEffect(() => {
    const loadOverview = async () => {
      try {
        const response = await overviewAPI.getStats();
        if (response && response.success) {
          setOverviewData(response.data);
        } else {
          console.warn('Overview API returned unsuccessful response:', response);
          // Set default data if API fails
          setOverviewData({
            stats: {
              totalOrdersToday: 0,
              inProgressOrders: 0,
              completedToday: 0,
              totalWorkers: 0,
              availableWorkers: 0,
            },
            ordersLast7Days: [],
            serviceDistribution: [],
            recentOrders: [],
          });
        }
      } catch (error) {
        console.error('Error loading overview:', error);
        // Set default data on error
        setOverviewData({
          stats: {
            totalOrdersToday: 0,
            inProgressOrders: 0,
            completedToday: 0,
            totalWorkers: 0,
            availableWorkers: 0,
          },
          ordersLast7Days: [],
          serviceDistribution: [],
          recentOrders: [],
        });
      }
    };
    loadOverview();
    dispatch(fetchOrders());
  }, [dispatch]);

  const stats = (overviewData && overviewData.stats) ? [
    { icon: '📋', label: 'إجمالي الطلبات اليوم', value: overviewData.stats.totalOrdersToday || 0 },
    { icon: '⏳', label: 'قيد التنفيذ', value: overviewData.stats.inProgressOrders || 0, progress: 60 },
    { icon: '✅', label: 'مكتملة اليوم', value: overviewData.stats.completedToday || 0 },
    { icon: '👷‍♀', label: 'إجمالي العاملات', value: overviewData.stats.totalWorkers || 0, subtitle: `${overviewData.stats.availableWorkers || 0} متاحة الآن` },
  ] : [
    { icon: '📋', label: 'إجمالي الطلبات اليوم', value: 0 },
    { icon: '⏳', label: 'قيد التنفيذ', value: 0, progress: 0 },
    { icon: '✅', label: 'مكتملة اليوم', value: 0 },
    { icon: '👷‍♀', label: 'إجمالي العاملات', value: 0, subtitle: '0 متاحة الآن' },
  ];

  const recentOrders = (overviewData?.recentOrders && Array.isArray(overviewData.recentOrders)) 
    ? overviewData.recentOrders 
    : (Array.isArray(orders) ? orders.slice(0, 10) : []);

  // Chart data for orders over last 7 days
  const ordersData = (overviewData?.ordersLast7Days && Array.isArray(overviewData.ordersLast7Days))
    ? overviewData.ordersLast7Days.map((item, index) => {
        const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
        return { name: days[index] || `يوم ${index + 1}`, orders: item.count || 0 };
      })
    : [
    { name: 'السبت', orders: 0 },
    { name: 'الأحد', orders: 0 },
    { name: 'الإثنين', orders: 0 },
    { name: 'الثلاثاء', orders: 0 },
    { name: 'الأربعاء', orders: 0 },
    { name: 'الخميس', orders: 0 },
    { name: 'الجمعة', orders: 0 },
  ];

  // Pie chart data for service distribution
  const serviceDistribution = (overviewData?.serviceDistribution && Array.isArray(overviewData.serviceDistribution))
    ? overviewData.serviceDistribution.map(item => {
        const serviceNames = {
          comprehensive: 'تنظيف شامل',
          normal: 'تنظيف عادي',
          quick: 'تنظيف سريع',
          deep: 'تنظيف عميق',
        };
        return { name: serviceNames[item._id] || item._id, value: item.count || 0 };
      })
    : [
        { name: 'تنظيف شامل', value: 0 },
        { name: 'تنظيف عادي', value: 0 },
        { name: 'تنظيف سريع', value: 0 },
        { name: 'تنظيف المطبخ', value: 0 },
      ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'قيد الانتظار', class: 'badge-pending' },
      confirmed: { label: 'مؤكد', class: 'badge-confirmed' },
      'in-progress': { label: 'جاري التنفيذ', class: 'badge-in-progress' },
      done: { label: 'مكتمل', class: 'badge-done' },
      cancelled: { label: 'ملغي', class: 'badge-cancelled' },
    };
    return badges[status] || badges.pending;
  };

  // Generate stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
      {/* Stars Background */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="dashboard-content-area" style={{ 
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: isMobile ? '0' : `${sidebarWidthValue}px`,
        paddingTop: '80px',
        transition: 'margin-left 0.3s ease',
      }}>
        <TopBar 
          pageTitle="نظرة عامة" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div style={{ 
          padding: isMobile ? '16px' : '40px', 
          flex: 1,
          paddingTop: isMobile ? '90px' : '40px',
        }} className="dashboard-content-area">
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: isMobile ? '12px' : '24px',
            marginBottom: isMobile ? '20px' : '40px',
          }}>
            {stats.map((stat, index) => (
              <div key={index} className="dashboard-stats-card">
                <div className="icon">{stat.icon}</div>
                <div className="value">
                  <CounterAnimation end={stat.value} />
                </div>
                <div className="label">{stat.label}</div>
                {stat.subtitle && (
                  <div className="label" style={{ marginTop: '8px', fontSize: '13px', opacity: 0.7 }}>
                    {stat.subtitle}
                  </div>
                )}
                {stat.progress && (
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '3px',
                    marginTop: '12px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${stat.progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 50%, #8b5cf6 100%)',
                      borderRadius: '3px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
            gap: isMobile ? '16px' : '30px',
            marginBottom: isMobile ? '20px' : '40px',
          }}>
            <div className="dashboard-chart-card" style={{ padding: isMobile ? '16px' : '32px' }}>
              <h3 style={{ fontSize: isMobile ? '16px' : '20px', marginBottom: isMobile ? '12px' : '28px' }}>الطلبات - آخر 7 أيام</h3>
              <div style={{ height: isMobile ? '200px' : '300px', width: '100%' }}>
                <Chart 
                  data={ordersData}
                  dataKey="orders"
                  name="عدد الطلبات"
                  color="#8b5cf6"
                  height={isMobile ? 200 : 300}
                />
              </div>
            </div>
            <div className="dashboard-chart-card" style={{ padding: isMobile ? '16px' : '32px' }}>
              <h3 style={{ fontSize: isMobile ? '16px' : '20px', marginBottom: isMobile ? '12px' : '28px' }}>توزيع أنواع الخدمات</h3>
              <div style={{ height: isMobile ? '200px' : '300px', width: '100%' }}>
                <PieChart 
                  data={serviceDistribution}
                  dataKey="value"
                  nameKey="name"
                  height={isMobile ? 200 : 300}
                />
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="dashboard-table-card" style={{ padding: isMobile ? '16px' : '32px' }}>
            <h3 style={{ fontSize: isMobile ? '16px' : '22px', marginBottom: isMobile ? '12px' : '24px' }}>آخر 10 طلبات</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>العميل</th>
                    <th>الخدمة</th>
                    <th>التاريخ</th>
                    <th>الوقت</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => {
                    const status = getStatusBadge(order.status);
                    // Handle customer - could be object or string
                    const customerName = typeof order.customer === 'object' 
                      ? (order.customer?.name || order.customer?.arabicName || order.customer?.phone || 'غير محدد')
                      : (order.customer || 'غير محدد');
                    // Handle service - could be object or string
                    const serviceName = typeof order.service === 'object'
                      ? (order.service?.name || order.service?.type || 'غير محدد')
                      : (order.service || order.serviceType || 'غير محدد');
                    // Handle date
                    const orderDate = order.date || order.createdAt 
                      ? (typeof order.date === 'string' ? order.date : new Date(order.date || order.createdAt).toLocaleDateString('ar-SA', { calendar: 'gregory' }))
                      : 'غير محدد';
                    // Handle time
                    const orderTime = order.time || order.serviceTime || 'غير محدد';
                    // Handle order ID
                    const orderId = order.id || order._id || order.orderNumber || `#${index + 1}`;
                    
                    return (
                      <tr key={order._id || order.id || index}>
                        <td>{orderId}</td>
                        <td>{customerName}</td>
                        <td>{serviceName}</td>
                        <td>{orderDate}</td>
                        <td>{orderTime}</td>
                        <td>
                          <span className={`dashboard-badge ${status.class.replace('badge-', '')}`}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="dashboard-action-btn">👁</button>
                            <button className="dashboard-action-btn">✏</button>
                            <button className="dashboard-action-btn">💬</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

