import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { reportsAPI } from '../../services/api';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import Chart from '../../components/Chart';
import PieChart from '../../components/PieChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const Reports = () => {
  const { sidebarWidth } = useSelector((state) => state.theme);
  const [activeReport, setActiveReport] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  // Report data states
  const [ordersReportData, setOrdersReportData] = useState(null);
  const [revenueReportData, setRevenueReportData] = useState(null);
  const [workersReportData, setWorkersReportData] = useState(null);
  const [satisfactionReportData, setSatisfactionReportData] = useState(null);
  
  // Default sidebar width if not set
  const sidebarWidthValue = sidebarWidth || 280;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch reports data from API
  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        // Load orders report
        const ordersRes = await reportsAPI.getOrdersReport();
        if (ordersRes && ordersRes.success) {
          setOrdersReportData(ordersRes.data);
        }

        // Load revenue report
        const revenueRes = await reportsAPI.getRevenueReport();
        if (revenueRes && revenueRes.success) {
          setRevenueReportData(revenueRes.data);
        }

        // Load workers report
        const workersRes = await reportsAPI.getWorkersReport();
        if (workersRes && workersRes.success) {
          setWorkersReportData(workersRes.data);
        }

        // Load satisfaction report
        const satisfactionRes = await reportsAPI.getSatisfactionReport();
        if (satisfactionRes && satisfactionRes.success) {
          setSatisfactionReportData(satisfactionRes.data);
        }
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // Report type cards
  const reportTypes = [
    { id: 'orders', icon: '📋', label: 'تقارير الطلبات', color: 'rgba(37, 150, 190, 1)' },
    { id: 'revenue', icon: '💰', label: 'تقارير الإيرادات', color: 'rgba(37, 150, 190, 0.9)' },
    { id: 'workers', icon: '👷‍♀', label: 'أداء العاملات', color: 'rgba(37, 150, 190, 0.8)' },
    { id: 'satisfaction', icon: '⭐', label: 'رضا العملاء', color: 'rgba(37, 150, 190, 0.7)' },
  ];

  // Get orders report data from state
  const ordersData = ordersReportData?.monthlyData || [];
  const ordersByStatus = ordersReportData?.statusData || [];
  const ordersByService = ordersReportData?.serviceData || [];
  
  // Get revenue report data from state
  const revenueData = revenueReportData?.monthlyData || [];
  const revenueByService = revenueReportData?.serviceData || [];
  
  // Get workers report data from state
  const workerPerformance = workersReportData?.workerPerformance || [];
  const workerSkills = workersReportData?.skillsData || [];
  
  // Get satisfaction report data from state
  const satisfactionData = satisfactionReportData?.monthlyData || [];
  const satisfactionByService = satisfactionReportData?.satisfactionByService || [];


  const renderOrdersReport = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px', color: '#334155', fontSize: '16px', fontWeight: 500 }}>جاري تحميل البيانات...</div>;
    }

    if (!ordersReportData) {
      return <div style={{ textAlign: 'center', padding: '40px', color: '#334155', fontSize: '16px', fontWeight: 500 }}>لا توجد بيانات متاحة</div>;
    }

    return (
      <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile 
          ? '1fr' 
          : 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: isMobile ? '20px' : '32px', 
        marginBottom: isMobile ? '28px' : '36px' 
      }}>
        <div className="dashboard-stats-card" style={{ padding: isMobile ? '16px' : '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, marginBottom: isMobile ? '8px' : '10px', color: '#334155' }}>إجمالي الطلبات</h3>
          <p style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>{ordersReportData.totalOrders}</p>
        </div>
        <div className="dashboard-stats-card" style={{ padding: isMobile ? '16px' : '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, marginBottom: isMobile ? '8px' : '10px', color: '#334155' }}>مكتملة</h3>
          <p style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#059669', letterSpacing: '-0.5px' }}>{ordersReportData.completedOrders}</p>
        </div>
        <div className="dashboard-stats-card" style={{ padding: isMobile ? '16px' : '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, marginBottom: isMobile ? '8px' : '10px', color: '#334155' }}>معدل الإتمام</h3>
          <p style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#3b82f6', letterSpacing: '-0.5px' }}>{ordersReportData.completionRate}%</p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile 
          ? '1fr' 
          : 'auto auto', 
        gap: isMobile ? '20px' : '32px', 
        marginBottom: isMobile ? '28px' : '36px',
        maxWidth: isMobile ? '100%' : 'none',
        width: isMobile ? '100%' : 'auto',
        justifyContent: isMobile ? 'stretch' : 'center'
      }}>
        <GlassCard style={{ 
          padding: isMobile ? '12px' : '16px',
          maxWidth: isMobile ? '100%' : '350px',
          margin: isMobile ? '0 auto' : '0',
          width: isMobile ? '100%' : '350px',
          aspectRatio: isMobile ? '1' : '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ marginBottom: isMobile ? '8px' : '10px' }}>
            <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 700 }}>الطلبات الشهرية</h3>
          </div>
          <ResponsiveContainer width="100%" height={isMobile ? 'calc(100% - 40px)' : '280px'}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
              <XAxis dataKey="name" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '12px',
                  padding: '10px',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              />
              <Legend wrapperStyle={{ direction: 'rtl', textAlign: 'right' }} />
              <Bar dataKey="orders" fill="rgba(37, 150, 190, 1)" name="إجمالي الطلبات" />
              <Bar dataKey="completed" fill="#4caf50" name="مكتملة" />
              <Bar dataKey="cancelled" fill="#f44336" name="ملغاة" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard style={{ 
          padding: isMobile ? '12px' : '16px',
          maxWidth: isMobile ? '100%' : '350px',
          margin: isMobile ? '0 auto' : '0',
          width: isMobile ? '100%' : '350px',
          aspectRatio: isMobile ? '1' : '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ marginBottom: isMobile ? '8px' : '10px' }}>
            <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 700 }}>الطلبات حسب الحالة</h3>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PieChart data={ordersByStatus} dataKey="value" nameKey="name" height={isMobile ? '100%' : '280px'} />
          </div>
        </GlassCard>
      </div>

      <GlassCard style={{ 
          padding: isMobile ? '12px' : '16px',
          maxWidth: isMobile ? '100%' : '350px',
          margin: isMobile ? '0 auto' : '0',
          width: isMobile ? '100%' : '350px',
          aspectRatio: isMobile ? '1' : '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
      }}>
        <div style={{ marginBottom: isMobile ? '8px' : '10px' }}>
          <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 700 }}>الطلبات حسب نوع الخدمة</h3>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PieChart data={ordersByService} dataKey="value" nameKey="name" height={isMobile ? '100%' : '400px'} />
        </div>
      </GlassCard>

      <div className="dashboard-table-card" style={{ 
        padding: isMobile ? '12px' : '20px',
        maxWidth: isMobile ? '100%' : 'none',
        margin: isMobile ? '0 auto' : '0',
        width: isMobile ? '100%' : 'auto',
        marginTop: isMobile ? '28px' : '36px',
        marginBottom: isMobile ? '28px' : '36px'
      }}>
        <div style={{ marginBottom: isMobile ? '12px' : '16px' }}>
          <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>جدول تفصيلي للطلبات</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {ordersData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#334155', fontSize: '16px', fontWeight: 500 }}>
              لا توجد طلبات لعرضها
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>الشهر</th>
                  <th>إجمالي الطلبات</th>
                  <th>مكتملة</th>
                  <th>قيد التنفيذ</th>
                  <th>معلقة</th>
                  <th>ملغاة</th>
                  <th>معدل الإتمام</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.name || '-'}</td>
                    <td>{row.orders || 0}</td>
                    <td>{row.completed || 0}</td>
                    <td>{row.inProgress || 0}</td>
                    <td>{row.pending || 0}</td>
                    <td>{row.cancelled || 0}</td>
                    <td>{row.orders > 0 ? ((row.completed / row.orders) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </>
    );
  };

  const renderRevenueReport = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px', color: '#334155', fontSize: '16px', fontWeight: 500 }}>جاري تحميل البيانات...</div>;
    }

    if (!revenueReportData) {
      return <div style={{ textAlign: 'center', padding: '40px', color: '#334155', fontSize: '16px', fontWeight: 500 }}>لا توجد بيانات متاحة</div>;
    }

    return (
    <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile 
          ? '1fr' 
          : 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: isMobile ? '20px' : '32px', 
        marginBottom: isMobile ? '28px' : '36px' 
      }}>
        <div className="dashboard-stats-card" style={{ padding: isMobile ? '16px' : '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, marginBottom: isMobile ? '8px' : '10px', color: '#334155' }}>إجمالي الإيرادات</h3>
          <p style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>{revenueReportData.totalRevenue?.toLocaleString() || 0} ر.س</p>
        </div>
        <div className="dashboard-stats-card" style={{ padding: isMobile ? '16px' : '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, marginBottom: isMobile ? '8px' : '10px', color: '#334155' }}>إجمالي الأرباح</h3>
          <p style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#059669', letterSpacing: '-0.5px' }}>{revenueReportData.totalProfit?.toLocaleString() || 0} ر.س</p>
        </div>
        <div className="dashboard-stats-card" style={{ padding: isMobile ? '16px' : '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, marginBottom: isMobile ? '8px' : '10px', color: '#334155' }}>متوسط الشهري</h3>
          <p style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#3b82f6', letterSpacing: '-0.5px' }}>{revenueReportData.averageMonthly?.toLocaleString() || 0} ر.س</p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile 
          ? '1fr' 
          : 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: isMobile ? '20px' : '32px', 
        marginBottom: isMobile ? '28px' : '36px' 
      }}>
        <GlassCard style={{ padding: isMobile ? '16px' : '30px' }}>
          <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
            <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 700 }}>الإيرادات والأرباح الشهرية</h3>
          </div>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
              <XAxis dataKey="name" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '12px',
                  padding: '10px',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              />
              <Legend wrapperStyle={{ direction: 'rtl', textAlign: 'right' }} />
              <Bar dataKey="revenue" fill="rgba(37, 150, 190, 1)" name="الإيرادات" />
              <Bar dataKey="profit" fill="#4caf50" name="الأرباح" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard style={{ padding: isMobile ? '16px' : '30px' }}>
          <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
            <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 700 }}>الإيرادات حسب نوع الخدمة</h3>
          </div>
          <PieChart data={revenueByService} dataKey="value" nameKey="name" height={isMobile ? 250 : 300} />
        </GlassCard>
      </div>

      <GlassCard style={{ 
        padding: isMobile ? '16px' : '30px',
        marginBottom: isMobile ? '28px' : '36px'
      }}>
        <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
          <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 700 }}>جدول تفصيلي للإيرادات</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>الشهر</th>
                <th>الإيرادات</th>
                <th>الأرباح</th>
                <th>نسبة الربح</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.revenue.toLocaleString()} ر.س</td>
                  <td>{row.profit.toLocaleString()} ر.س</td>
                  <td>{((row.profit / row.revenue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
      </>
    );
  };

  const renderWorkersReport = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px', color: '#334155', fontSize: '16px', fontWeight: 500 }}>جاري تحميل البيانات...</div>;
    }

    if (!workersReportData) {
      return <div style={{ textAlign: 'center', padding: '40px', color: '#334155', fontSize: '16px', fontWeight: 500 }}>لا توجد بيانات متاحة</div>;
    }

    return (
    <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile 
          ? '1fr' 
          : 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: isMobile ? '20px' : '32px', 
        marginBottom: isMobile ? '28px' : '36px' 
      }}>
        <div className="dashboard-stats-card" style={{ padding: isMobile ? '16px' : '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, marginBottom: isMobile ? '8px' : '10px', color: '#334155' }}>إجمالي العاملات</h3>
          <p style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>{workersReportData.totalWorkers || 0}</p>
        </div>
        <div className="dashboard-stats-card" style={{ padding: isMobile ? '16px' : '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, marginBottom: isMobile ? '8px' : '10px', color: '#334155' }}>إجمالي الطلبات</h3>
          <p style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#3b82f6', letterSpacing: '-0.5px' }}>{workersReportData.totalOrders || 0}</p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile 
          ? '1fr' 
          : 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: isMobile ? '20px' : '32px', 
        marginBottom: isMobile ? '28px' : '36px' 
      }}>
        <GlassCard style={{ padding: isMobile ? '16px' : '30px' }}>
          <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
            <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 700 }}>أداء العاملات</h3>
          </div>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <BarChart data={workerPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
              <XAxis dataKey="name" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '12px',
                  padding: '10px',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              />
              <Legend wrapperStyle={{ direction: 'rtl', textAlign: 'right' }} />
              <Bar dataKey="orders" fill="rgba(37, 150, 190, 1)" name="عدد الطلبات" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard style={{ padding: isMobile ? '16px' : '30px' }}>
          <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
            <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 700 }}>توزيع المهارات</h3>
          </div>
          <PieChart data={workerSkills} dataKey="value" nameKey="name" height={isMobile ? 250 : 300} />
        </GlassCard>
      </div>

      <GlassCard style={{ 
        padding: isMobile ? '16px' : '30px',
        marginBottom: isMobile ? '28px' : '36px'
      }}>
        <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
          <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 700 }}>جدول تفصيلي لأداء العاملات</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>اسم العاملة</th>
                <th>عدد الطلبات</th>
                <th>الإيرادات</th>
              </tr>
            </thead>
            <tbody>
              {workerPerformance.map((worker, index) => (
                <tr key={index}>
                  <td>{worker.name}</td>
                  <td>{worker.orders}</td>
                  <td>{worker.revenue.toLocaleString()} ر.س</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
      </>
    );
  };

  const renderSatisfactionReport = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px', color: '#334155', fontSize: '16px', fontWeight: 500 }}>جاري تحميل البيانات...</div>;
    }

    if (!satisfactionReportData) {
      return <div style={{ textAlign: 'center', padding: '40px', color: '#334155', fontSize: '16px', fontWeight: 500 }}>لا توجد بيانات متاحة</div>;
    }

    return (
    <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile 
          ? '1fr' 
          : 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: isMobile ? '20px' : '32px', 
        marginBottom: isMobile ? '28px' : '36px' 
      }}>
        <div className="dashboard-stats-card" style={{ padding: isMobile ? '16px' : '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, marginBottom: isMobile ? '8px' : '10px', color: '#334155' }}>نسبة الرضا</h3>
          <p style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#3b82f6', letterSpacing: '-0.5px' }}>{satisfactionReportData.satisfactionRate || 0}%</p>
        </div>
      </div>
      </>
    );
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
        marginRight: isMobile ? '0' : `${sidebarWidthValue}px`,
        paddingTop: isMobile ? '70px' : '90px',
        transition: 'margin-right 0.3s ease',
      }}>
        <TopBar 
          pageTitle="التقارير"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div style={{ padding: isMobile ? '16px' : '40px', flex: 1 }}>
          {/* Report Type Selection */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile 
              ? 'repeat(auto-fit, minmax(140px, 1fr))' 
              : 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: isMobile ? '12px' : '20px', 
            marginBottom: isMobile ? '28px' : '36px' 
          }}>
            {reportTypes.map((type) => (
              <GlassCard
                key={type.id}
                onClick={() => setActiveReport(type.id)}
                style={{
                  padding: isMobile ? '16px' : '25px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: activeReport === type.id
                    ? '2px solid rgba(37, 150, 190, 1)'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                  background: activeReport === type.id
                    ? 'rgba(37, 150, 190, 0.2)'
                    : 'rgba(255, 255, 255, 0.4)',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ fontSize: isMobile ? '32px' : '48px', marginBottom: isMobile ? '10px' : '15px' }}>{type.icon}</div>
                <h3 style={{
                  fontSize: isMobile ? '14px' : '18px',
                  fontWeight: activeReport === type.id ? 700 : 600,
                  color: activeReport === type.id ? '#3b82f6' : '#111827',
                }}>
                  {type.label}
                </h3>
              </GlassCard>
            ))}
          </div>

          {/* Report Content */}
          {activeReport === 'orders' && renderOrdersReport()}
          {activeReport === 'revenue' && renderRevenueReport()}
          {activeReport === 'workers' && renderWorkersReport()}
          {activeReport === 'satisfaction' && renderSatisfactionReport()}
        </div>
      </div>
    </div>
  );
};

export default Reports;

