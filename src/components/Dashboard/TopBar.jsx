import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import GlassCard from '../GlassCard';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const TopBar = ({ pageTitle, onSearch, onMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Menu items with icons (same as Sidebar)
  const allMenuItems = [
    { path: '/dashboard', icon: '📊', label: 'نظرة عامة', permissionKey: 'overview' },
    { path: '/dashboard/orders', icon: '📋', label: 'الطلبات', permissionKey: 'orders' },
    { path: '/dashboard/customers', icon: '👥', label: 'العملاء', permissionKey: 'customers' },
    { path: '/dashboard/assistants', icon: '👔', label: 'الاستقدام', permissionKey: 'assistants' },
    { path: '/dashboard/discounts', icon: '🎁', label: 'الخصومات', permissionKey: 'discounts' },
    { path: '/dashboard/messages', icon: '💬', label: 'الرسائل', permissionKey: 'messages' },
    { path: '/dashboard/reports', icon: '📊', label: 'التقارير', permissionKey: 'reports' },
    { path: '/dashboard/profile', icon: '👤', label: 'الملف الشخصي' },
    { path: '/dashboard/settings', icon: '⚙️', label: 'الإعدادات' },
  ];

  // Get current page icon
  const getCurrentPageIcon = () => {
    const currentItem = allMenuItems.find(item => item.path === location.pathname);
    return currentItem?.icon || '📄';
  };

  const currentPageIcon = getCurrentPageIcon();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-topbar" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      gap: isMobile ? '10px' : '20px',
      flexWrap: 'nowrap',
      direction: 'ltr', // LTR layout for proper positioning
    }}>
      {/* Left Side: On mobile - Hamburger + Title + Profile Icon, On desktop - Home Button */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: isMobile ? '12px' : '20px',
        flex: '0 0 auto',
        flexShrink: 0,
        order: 1,
        marginLeft: 0,
        minWidth: 0, // Allow shrinking if needed
      }}>
        {/* Mobile: Hamburger first (leftmost), then Title, then Profile Icon */}
        {isMobile && (
          <>
            {/* Hamburger Menu Button - Leftmost on mobile */}
            <button
              className="hamburger-menu"
              onClick={onMenuToggle}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
                color: '#1e293b',
                fontSize: '24px',
                zIndex: 1001,
                boxShadow: '2px 0 15px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s',
                width: '44px',
                height: '44px',
                flexShrink: 0,
                flex: '0 0 44px', // Fixed width
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              ☰
            </button>
            
            {/* Page Icon + Title - After hamburger on mobile */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '8px',
              flex: '0 0 auto',
              minWidth: 0,
              overflow: 'hidden', // Prevent overflow
            }}>
              {/* Page Icon */}
              <span style={{ 
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>{currentPageIcon}</span>
              
              {/* Page Title */}
              <h1 style={{ 
                margin: 0, 
                fontSize: '18px', 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '120px', // Limit width to prevent overlap
              }}>{pageTitle}</h1>
            </div>

            {/* Account Profile Icon - After title on mobile */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 25%, #6366F1 50%, #4F46E5 75%, #4338CA 100%)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  lineHeight: '1',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                  e.currentTarget.style.boxShadow = '0 6px 30px rgba(139, 92, 246, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
                }}
              >
                {user?.name?.[0] || '👤'}
              </div>
              {showProfileDropdown && (
                <div style={{
                  position: 'absolute',
                  left: 0, // Dropdown opens from left on mobile
                  top: '50px',
                  minWidth: '200px',
                  padding: '8px 0',
                  zIndex: 1000,
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                      onClick={() => {
                        navigate('/dashboard/profile');
                        setShowProfileDropdown(false);
                      }}
                      style={{
                        padding: '12px 20px',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'right',
                        cursor: 'pointer',
                        color: '#0f172a',
                        fontWeight: 600,
                        fontSize: '15px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f1f5f9';
                        e.target.style.color = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#0f172a';
                      }}
                    >
                      الملف الشخصي
                    </button>
                    <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0' }} />
                    <button
                      onClick={() => {
                        dispatch(logout());
                        navigate('/login');
                        setShowProfileDropdown(false);
                      }}
                      style={{
                        padding: '12px 20px',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'right',
                        cursor: 'pointer',
                        color: '#ef4444',
                        fontWeight: 600,
                        fontSize: '15px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#fef2f2';
                        e.target.style.color = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#ef4444';
                      }}
                    >
                      تسجيل خروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Desktop: Home Button only */}
        {!isMobile && (
          <Link
            to="/"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                padding: '11px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
                color: '#64748b',
                fontWeight: '500',
                fontSize: '15px',
                boxShadow: '2px 0 15px rgba(0, 0, 0, 0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-2px)';
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <span style={{ fontSize: '16px' }}>←</span>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>الرئيسية</span>
            </div>
          </Link>
        )}
      </div>

      {/* Center: Search Bar - Desktop only */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto', order: 2 }}>
          <div style={{
            padding: '11px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            position: 'relative',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            boxShadow: '2px 0 15px rgba(0, 0, 0, 0.05)',
          }}>
            <input
              type="text"
              placeholder="بحث..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (onSearch) {
                  onSearch(e.target.value);
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && onSearch) {
                  onSearch(searchTerm);
                }
              }}
              style={{ 
                border: 'none', 
                background: 'transparent', 
                padding: '0', 
                width: '200px',
                position: 'relative',
                zIndex: 10,
                color: '#1e293b',
                outline: 'none',
                fontSize: '15px',
              }}
            />
            <span 
              style={{ 
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10,
                fontSize: '18px',
              }}
              onClick={() => {
                if (onSearch) {
                  onSearch(searchTerm);
                }
              }}
            >🔍</span>
          </div>
        </div>
      )}
      
      {/* Right Side: On desktop - Page Title + Account Profile Icon */}
      {!isMobile && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '20px',
          flex: '0 0 auto',
          flexShrink: 0,
          order: 3,
          marginRight: 0,
        }}>
          {/* Page Title - Desktop only, on the right */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            flex: '0 0 auto',
          }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              whiteSpace: 'nowrap' 
            }}>{pageTitle}</h1>
          </div>

          {/* Account Profile Icon - Desktop only, on the right */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 25%, #6366F1 50%, #4F46E5 75%, #4338CA 100%)',
                color: 'white',
                fontSize: '20px',
                fontWeight: '700',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                lineHeight: '1',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(139, 92, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
              }}
            >
              {user?.name?.[0] || '👤'}
            </div>
            {showProfileDropdown && (
              <div style={{
                position: 'absolute',
                right: 0, // Dropdown opens from right on desktop
                top: '60px',
                minWidth: '200px',
                padding: '8px 0',
                zIndex: 1000,
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button
                    onClick={() => {
                      navigate('/dashboard/profile');
                      setShowProfileDropdown(false);
                    }}
                    style={{
                      padding: '12px 20px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'right',
                      cursor: 'pointer',
                      color: '#0f172a',
                      fontWeight: 600,
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f1f5f9';
                      e.target.style.color = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#0f172a';
                    }}
                  >
                    الملف الشخصي
                  </button>
                  <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0' }} />
                  <button
                    onClick={() => {
                      dispatch(logout());
                      navigate('/login');
                      setShowProfileDropdown(false);
                    }}
                    style={{
                      padding: '12px 20px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'right',
                      cursor: 'pointer',
                      color: '#ef4444',
                      fontWeight: 600,
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#fef2f2';
                      e.target.style.color = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#ef4444';
                    }}
                  >
                    تسجيل خروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Close dropdown overlay */}
      {showProfileDropdown && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </div>
  );
};

export default TopBar;
