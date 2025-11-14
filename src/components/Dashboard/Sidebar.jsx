import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { permissionsAPI } from '../../services/api';
import GlassCard from '../GlassCard';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sidebarWidth } = useSelector((state) => state.theme);
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    // Apply sidebar width to CSS variable
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  }, [sidebarWidth]);

  // Load permissions for supervisor
  useEffect(() => {
    if (user?.role === 'supervisor') {
      loadPermissions();
    }
  }, [user]);

  const loadPermissions = async () => {
    try {
      const response = await permissionsAPI.getMyPermissions();
      if (response.success) {
        setPermissions(response.data.permissions || response.data);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const allMenuItems = [
    { path: '/dashboard', icon: '📊', label: 'نظرة عامة', permissionKey: 'overview' },
    { path: '/dashboard/orders', icon: '📋', label: 'الطلبات', permissionKey: 'orders' },
    { path: '/dashboard/customers', icon: '👥', label: 'العملاء', permissionKey: 'customers' },
    { path: '/dashboard/assistants', icon: '👔', label: 'الاستقدام', permissionKey: 'assistants' },
    { path: '/dashboard/discounts', icon: '🎁', label: 'الخصومات', permissionKey: 'discounts' },
    { path: '/dashboard/messages', icon: '💬', label: 'الرسائل', permissionKey: 'messages' },
    { path: '/dashboard/reports', icon: '📊', label: 'التقارير', permissionKey: 'reports' },
  ];

  // Settings is only for admin
  const settingsItem = user?.role === 'admin' 
    ? { path: '/dashboard/settings', icon: '⚙️', label: 'الإعدادات' }
    : null;

  // Filter menu items based on user role and permissions
  const getMenuItems = () => {
    if (user?.role === 'admin') {
      // Admin sees all items
      return allMenuItems;
    } else if (user?.role === 'supervisor' && permissions) {
      // Supervisor sees only items with permissions
      return allMenuItems.filter(item => permissions[item.permissionKey] === true);
    }
    // Default: show all (for other roles or while loading)
    return allMenuItems;
  };

  const menuItems = getMenuItems();

  const isActive = (path) => location.pathname === path;

  const sidebarStyles = {
    background: '#ffffff',
    boxShadow: '2px 0 15px rgba(0, 0, 0, 0.05)',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    position: 'fixed',
    right: 0,
    top: 0,
  };

  const logoContainerStyles = {
    padding: '24px 20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  };

  const logoImageStyles = {
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    objectFit: 'cover',
    border: '2px solid #3b82f6',
  };

  const logoTextStyles = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: '0.3px',
  };

  const menuContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    padding: '16px 12px',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const menuItemBaseStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 16px',
    borderRadius: '10px',
    textDecoration: 'none',
    color: '#64748b',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: '1px solid transparent',
  };

  const menuItemActiveStyles = {
    ...menuItemBaseStyles,
    background: '#3b82f6',
    color: '#ffffff',
    border: '1px solid #3b82f6',
  };

  const menuItemHoverStyles = {
    background: '#f1f5f9',
    color: '#3b82f6',
    border: '1px solid #e2e8f0',
  };

  const iconStyles = {
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
  };

  const logoutSectionStyles = {
    padding: '16px 12px',
    borderTop: '1px solid #e5e7eb',
    flexShrink: 0,
  };

  const logoutButtonStyles = {
    ...menuItemBaseStyles,
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    fontWeight: '600',
  };

  const logoutButtonHoverStyles = {
    background: '#fee2e2',
    border: '1px solid #fca5a5',
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
          }}
        />
      )}
      <div 
        className={`dashboard-sidebar ${isOpen ? 'sidebar-open' : ''}`}
        style={{ 
          width: `${sidebarWidth}px`,
          ...sidebarStyles,
          position: 'fixed',
          right: isMobile && !isOpen ? '-100%' : 0,
          top: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          boxShadow: isMobile && isOpen ? '0 0 30px rgba(0, 0, 0, 0.3)' : '2px 0 15px rgba(0, 0, 0, 0.05)',
        }}
      >
      {/* Header */}
      <Link 
        to="/" 
        style={{
          ...logoContainerStyles,
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        <img 
          src="/img/logo.jpg" 
          alt="Ard El Baraka Logo"
          style={logoImageStyles}
        />
        <div style={logoTextStyles}>Ard El Baraka</div>
      </Link>

      {/* Menu */}
      <div className="sidebar-menu-container" style={menuContainerStyles}>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            style={isActive(item.path) ? menuItemActiveStyles : menuItemBaseStyles}
            onClick={() => {
              if (window.innerWidth <= 1024 && onClose) {
                onClose();
              }
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                Object.assign(e.currentTarget.style, menuItemHoverStyles);
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                Object.assign(e.currentTarget.style, menuItemBaseStyles);
              }
            }}
          >
            <span style={iconStyles}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        {/* Profile - Available for all users */}
        <Link 
          to="/dashboard/profile" 
          style={isActive('/dashboard/profile') ? menuItemActiveStyles : menuItemBaseStyles}
          onClick={() => {
            if (window.innerWidth <= 1024 && onClose) {
              onClose();
            }
          }}
          onMouseEnter={(e) => {
            if (!isActive('/dashboard/profile')) {
              Object.assign(e.currentTarget.style, menuItemHoverStyles);
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/dashboard/profile')) {
              Object.assign(e.currentTarget.style, menuItemBaseStyles);
            }
          }}
        >
          <span style={iconStyles}>👤</span>
          <span>الملف الشخصي</span>
        </Link>
        {settingsItem && (
          <Link 
            to={settingsItem.path} 
            style={isActive(settingsItem.path) ? menuItemActiveStyles : menuItemBaseStyles}
            onClick={() => {
              if (window.innerWidth <= 1024 && onClose) {
                onClose();
              }
            }}
            onMouseEnter={(e) => {
              if (!isActive(settingsItem.path)) {
                Object.assign(e.currentTarget.style, menuItemHoverStyles);
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(settingsItem.path)) {
                Object.assign(e.currentTarget.style, menuItemBaseStyles);
              }
            }}
          >
            <span style={iconStyles}>{settingsItem.icon}</span>
            <span>{settingsItem.label}</span>
          </Link>
        )}
      </div>

      {/* Logout */}
      <div style={logoutSectionStyles}>
        <div
          onClick={() => {
            dispatch(logout());
            if (window.innerWidth <= 1024 && onClose) {
              onClose();
            }
          }}
          style={logoutButtonStyles}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, logoutButtonHoverStyles);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, logoutButtonStyles);
          }}
        >
          <span style={iconStyles}>🚪</span>
          <span>تسجيل خروج</span>
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;