import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import GlassCard from '../GlassCard';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const TopBar = ({ pageTitle, onSearch, onMenuToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

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
      direction: 'rtl', // RTL layout
    }}>
      {/* Left Side (North in RTL): Account Profile */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        flex: '0 0 auto',
        flexShrink: 0,
        order: 1,
      }}>
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{
              width: isMobile ? '40px' : '50px',
              height: isMobile ? '40px' : '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 25%, #6366F1 50%, #4F46E5 75%, #4338CA 100%)',
              color: 'white',
              fontSize: isMobile ? '18px' : '20px',
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
              right: 0,
              top: isMobile ? '50px' : '60px',
              minWidth: '200px',
              padding: '10px 0',
              zIndex: 1000,
              background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.95) 0%, rgba(45, 74, 122, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(30, 58, 95, 0.4)',
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
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 600,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(139, 92, 246, 0.2)';
                    e.target.style.transform = 'translateX(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  الملف الشخصي
                </button>
                <div style={{ height: '1px', background: 'rgba(139, 92, 246, 0.3)', margin: '5px 0' }} />
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
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  تسجيل خروج
                </button>
              </div>
            </div>
          )}
        </div>
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
      
      {/* Right Side (South in RTL): Page Title + Hamburger (mobile) or Home Button (desktop) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? '20px' : '20px',
        flex: isMobile ? '1 1 auto' : '0 0 auto',
        minWidth: 0,
        order: 3,
        justifyContent: isMobile ? 'flex-end' : 'flex-end',
      }}>
        {/* Hamburger Menu Button - Mobile only, on the right */}
        {isMobile && (
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
        )}

        {/* Home Button - Desktop only */}
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

        {/* Page Title */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginRight: isMobile ? '0' : '0',
        }}>
          <h1 style={{ margin: 0, fontSize: isMobile ? '18px' : '24px' }}>{pageTitle}</h1>
        </div>
      </div>

      
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
