import React, { useState } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import { useSelector, useDispatch } from 'react-redux';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const dispatch = useDispatch();
  const { sidebarWidth } = useSelector((state) => state.theme);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-1',
      type: 'new-order',
      title: 'طلب جديد',
      message: 'تم استلام طلب جديد من أحمد محمد',
      read: false,
      createdAt: new Date('2025-01-15T10:30:00'),
      link: '/dashboard/orders',
    },
    {
      id: 'NOTIF-2',
      type: 'order-status',
      title: 'تغيير حالة الطلب',
      message: 'تم تغيير حالة الطلب #1234 إلى "قيد التنفيذ"',
      read: false,
      createdAt: new Date('2025-01-15T09:15:00'),
      link: '/dashboard/orders',
    },
    {
      id: 'NOTIF-3',
      type: 'new-application',
      title: 'طلب توظيف جديد',
      message: 'تم استلام طلب توظيف جديد من سارة أحمد',
      read: true,
      createdAt: new Date('2025-01-14T16:45:00'),
      link: '/dashboard/applications',
    },
    {
      id: 'NOTIF-4',
      type: 'new-message',
      title: 'رسالة جديدة',
      message: 'رسالة جديدة من فاطمة علي',
      read: true,
      createdAt: new Date('2025-01-14T14:20:00'),
      link: '/dashboard/messages',
    },
    {
      id: 'NOTIF-5',
      type: 'order-status',
      title: 'تغيير حالة الطلب',
      message: 'تم إكمال الطلب #1230 بنجاح',
      read: true,
      createdAt: new Date('2025-01-14T12:00:00'),
      link: '/dashboard/orders',
    },
  ]);

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notif.read;
    if (activeFilter === 'read') return notif.read;
    return notif.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    alert('تم تحديد جميع الإشعارات كمقروءة');
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
      setNotifications([]);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'new-order': '📋',
      'order-status': '🔄',
      'new-application': '📝',
      'new-message': '💬',
      'system': '⚙️',
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      'new-order': 'rgba(37, 150, 190, 1)',
      'order-status': '#6366F1',
      'new-application': '#4F46E5',
      'new-message': '#7DD3C8',
      'system': '#94A3B8',
    };
    return colors[type] || 'rgba(37, 150, 190, 1)';
  };

  const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return d.toLocaleDateString('ar-SA', { calendar: 'gregory',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ 
        flex: 1,
        background: '#FFFFFF',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }} className="dashboard-content">
        <TopBar pageTitle="الإشعارات" />
        <div style={{ padding: '40px', flex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700 }}>الإشعارات ({notifications.length})</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              {unreadCount > 0 && (
                <GlassButton variant="secondary" onClick={handleMarkAllAsRead}>
                  تحديد الكل كمقروء
                </GlassButton>
              )}
              {notifications.length > 0 && (
                <GlassButton
                  variant="secondary"
                  onClick={handleDeleteAll}
                  style={{
                    background: 'rgba(244, 67, 54, 0.2)',
                    border: '1px solid rgba(244, 67, 54, 0.4)',
                    color: '#f44336',
                  }}
                >
                  حذف الكل
                </GlassButton>
              )}
            </div>
          </div>

          {/* Filters */}
          <GlassCard style={{ padding: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'الكل' },
                { id: 'unread', label: `غير مقروءة (${unreadCount})` },
                { id: 'read', label: 'مقروءة' },
                { id: 'new-order', label: 'طلبات جديدة' },
                { id: 'order-status', label: 'حالة الطلبات' },
                { id: 'new-application', label: 'طلبات توظيف' },
                { id: 'new-message', label: 'رسائل' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: activeFilter === filter.id
                      ? 'linear-gradient(135deg, rgba(37, 150, 190, 0.6) 0%, rgba(37, 150, 190, 0.8) 50%, rgba(37, 150, 190, 1) 100%)'
                      : 'rgba(255, 255, 255, 0.3)',
                    color: activeFilter === filter.id ? 'white' : '#000000',
                    fontWeight: activeFilter === filter.id ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Notifications List */}
          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredNotifications.length === 0 ? (
              <GlassCard style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#000000', fontSize: '18px', fontWeight: 600 }}>لا توجد إشعارات</p>
              </GlassCard>
            ) : (
              filteredNotifications.map((notif) => (
                <GlassCard
                  key={notif.id}
                  style={{
                    padding: '20px',
                    border: !notif.read ? '2px solid rgba(37, 150, 190, 0.4)' : '1px solid rgba(255, 255, 255, 0.5)',
                    background: !notif.read ? 'rgba(37, 150, 190, 0.1)' : 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (!notif.read) handleMarkAsRead(notif.id);
                    if (notif.link) window.location.href = notif.link;
                  }}
                >
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'start' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${getNotificationColor(notif.type)} 0%, ${getNotificationColor(notif.type)}80 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}>
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: !notif.read ? 700 : 600,
                          margin: 0,
                          color: '#000000',
                        }}>
                          {notif.title}
                        </h3>
                        {!notif.read && (
                          <span style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: 'rgba(37, 150, 190, 1)',
                            display: 'inline-block',
                            flexShrink: 0,
                          }} />
                        )}
                      </div>
                      <p style={{
                        color: '#000000',
                        marginBottom: '8px',
                        lineHeight: '1.6',
                        fontWeight: 500,
                      }}>
                        {notif.message}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: '#475569', fontSize: '12px', fontWeight: 500 }}>
                          {formatDate(notif.createdAt)}
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {!notif.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notif.id);
                              }}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '8px',
                                border: 'none',
            background: 'rgba(37, 150, 190, 0.2)',
            color: 'rgba(37, 150, 190, 1)',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}
                            >
                              تحديد كمقروء
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notif.id);
                            }}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'rgba(244, 67, 54, 0.2)',
                              color: '#f44336',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

