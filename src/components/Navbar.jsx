import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GlassButton from './GlassButton';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    // Check if window is available (SSR safety)
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      // Use a more reliable breakpoint check
      const width = window.innerWidth;
      const isMobileView = width <= 768;
      
      setIsMobile(isMobileView);
      
      // Close mobile menu if switching to desktop
      if (!isMobileView && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    // Check immediately on mount
    checkMobile();

    // Debounce resize for better performance
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };

    // Check on resize
    window.addEventListener('resize', handleResize);
    
    // Check on orientation change (for mobile devices)
    window.addEventListener('orientationchange', checkMobile);
    
    // Check on load (in case of late loading)
    window.addEventListener('load', checkMobile);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', checkMobile);
      window.removeEventListener('load', checkMobile);
    };
  }, [mobileMenuOpen, isMobile]);

  const isActive = (path) => location.pathname === path;

  // Debug effect for mobile menu
  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      console.log('📱 Mobile menu is open:', { isMobile, mobileMenuOpen });
    }
  }, [isMobile, mobileMenuOpen]);

  return (
    <nav className={`glass-navbar ${scrolled ? 'scrolled' : ''}`} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: isMobile 
        ? (scrolled ? '12px 16px' : '14px 16px')
        : (scrolled ? '14px 60px' : '20px 60px'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      background: scrolled 
        ? 'rgba(255, 255, 255, 0.98)'
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: scrolled ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
    }}>
      <Link 
        to="/" 
        style={{ 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? '10px' : '16px',
          flexShrink: 0,
          minWidth: 0,
        }}
      >
        <img 
          src="/img/logo.jpg" 
          alt="Ard El Baraka Logo" 
          style={{
            width: isMobile ? '40px' : '56px',
            height: isMobile ? '40px' : '56px',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(37, 150, 190, 0.3)',
            transition: 'all 0.3s',
            flexShrink: 0,
            display: 'block',
          }}
          onError={(e) => {
            console.error('Logo image failed to load:', e.target.src);
          }}
        />
        <div style={{ minWidth: 0, flexShrink: 1 }}>
          <div style={{
            fontSize: isMobile ? '16px' : '22px',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.5px',
            lineHeight: '1.2',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            Ard El Baraka
          </div>
          <div style={{
            fontSize: isMobile ? '10px' : '13px',
            color: '#FFD700',
            fontWeight: 600,
            letterSpacing: '1px',
            marginTop: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            M a n p o w e r
          </div>
        </div>
      </Link>
      
      {/* Desktop Navigation Links - Hidden on Mobile */}
      <div style={{
        display: isMobile ? 'none' : 'flex',
        gap: '4px',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
        {[
          { path: '/', label: 'الرئيسية' },
          { path: '/assistants', label: 'الاستقدام' },
          { path: '/workers', label: 'تنظيف اليوم' },
          { path: '/contact', label: 'تواصل معنا' },
        ].map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                position: 'relative',
                padding: '12px 24px',
                borderRadius: '10px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{
                color: active ? '#3b82f6' : '#0f172a',
                fontWeight: active ? 700 : 500,
                fontSize: '15px',
                letterSpacing: '0.2px',
                transition: 'all 0.3s',
              }}>
                {item.label}
              </span>
              {active && (
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '50%',
                  transform: 'translateX(50%)',
                  width: '24px',
                  height: '2px',
                  background: '#3b82f6',
                  borderRadius: '2px',
                  animation: 'fadeInUp 0.3s ease-out',
                }} />
              )}
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Desktop Buttons - Hidden on Mobile */}
        <div style={{ display: isMobile ? 'none' : 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/service-request" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #2596be 0%, #3ba8d0 50%, #52bae2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(37, 150, 190, 0.5)',
              transition: 'all 0.3s',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #1e88e5 0%, #2596be 50%, #2ba3d6 100%)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(37, 150, 190, 0.7), 0 0 30px rgba(37, 150, 190, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #2596be 0%, #3ba8d0 50%, #52bae2 100%)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 150, 190, 0.5)';
            }}
            >
              طلب خدمة
            </button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 500,
            background: '#ffffff',
            backdropFilter: 'blur(10px)',
            color: '#0f172a',
            border: '1px solid #e5e7eb',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
            }}
            >
              تسجيل دخول
            </button>
          </Link>
        </div>
        
        {/* Hamburger Menu Button - Visible on Mobile */}
        {isMobile && (
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🍔 Button clicked! Current state:', mobileMenuOpen);
              setMobileMenuOpen(prev => {
                console.log('🔄 Toggling menu:', prev, '->', !prev);
                return !prev;
              });
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('👆 Button touched! Current state:', mobileMenuOpen);
              setMobileMenuOpen(prev => {
                console.log('🔄 Toggling menu (touch):', prev, '->', !prev);
                return !prev;
              });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: mobileMenuOpen 
                ? 'rgba(37, 150, 190, 0.2)' 
                : '#ffffff',
              border: mobileMenuOpen 
                ? '2px solid rgba(37, 150, 190, 1)' 
                : '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '10px',
              cursor: 'pointer',
              width: '44px',
              height: '44px',
              transition: 'all 0.3s',
              zIndex: 1003,
              position: 'relative',
              flexShrink: 0,
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              userSelect: 'none',
              pointerEvents: 'auto', // Ensure pointer events are enabled
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = mobileMenuOpen 
                ? 'rgba(37, 150, 190, 0.3)' 
                : '#f1f5f9';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = mobileMenuOpen 
                ? 'rgba(37, 150, 190, 0.2)' 
                : '#ffffff';
              e.currentTarget.style.borderColor = mobileMenuOpen 
                ? 'rgba(37, 150, 190, 1)' 
                : '#e5e7eb';
            }}
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Overlay - must be before menu for proper z-index */}
          <div
            onClick={() => {
              console.log('🖱️ Overlay clicked, closing menu');
              setMobileMenuOpen(false);
            }}
            onTouchStart={() => {
              console.log('👆 Overlay touched, closing menu');
              setMobileMenuOpen(false);
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(2px)',
              zIndex: 1001,
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
          />
          {/* Menu Content */}
          <div
            className="glass-card"
            onClick={(e) => {
              console.log('🖱️ Menu content clicked');
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              console.log('👆 Menu content touched');
              e.stopPropagation();
            }}
            style={{
              position: 'fixed',
              top: scrolled ? '78px' : '88px',
              left: '20px',
              right: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              animation: 'fadeInUp 0.3s ease-out',
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              zIndex: 1002,
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              pointerEvents: 'auto',
              touchAction: 'pan-y',
              visibility: 'visible',
              opacity: 1,
              transform: 'translateY(0)',
              willChange: 'transform, opacity',
            }}
          >
          {/* Navigation Links */}
          {[
            { path: '/', label: 'الرئيسية' },
            { path: '/assistants', label: 'الاستقدام' },
            { path: '/workers', label: 'تنظيف اليوم' },
            { path: '/contact', label: 'تواصل معنا' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                padding: '14px 20px',
                borderRadius: '12px',
                background: isActive(item.path) 
                  ? 'rgba(59, 130, 246, 0.1)' 
                  : 'transparent',
                border: isActive(item.path) 
                  ? '2px solid #3b82f6' 
                  : '1px solid #e5e7eb',
                color: isActive(item.path) ? '#3b82f6' : '#0f172a',
                fontWeight: isActive(item.path) ? 700 : 600,
                fontSize: '16px',
                transition: 'all 0.3s',
                letterSpacing: '0.2px',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(37, 150, 190, 0.3) 50%, transparent 100%)',
            margin: '8px 0',
          }} />
          
          {/* Action Buttons */}
          <Link 
            to="/service-request" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', width: '100%' }}
          >
            <button style={{
              width: '100%',
              padding: '14px 24px',
              fontSize: '16px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #2596be 0%, #3ba8d0 50%, #52bae2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(37, 150, 190, 0.5)',
              transition: 'all 0.3s',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #1e88e5 0%, #2596be 50%, #2ba3d6 100%)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(37, 150, 190, 0.7), 0 0 30px rgba(37, 150, 190, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #2596be 0%, #3ba8d0 50%, #52bae2 100%)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 150, 190, 0.5)';
            }}
            >
              طلب خدمة
            </button>
          </Link>
          
          <Link 
            to="/login" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', width: '100%' }}
          >
            <button style={{
              width: '100%',
              padding: '14px 24px',
              fontSize: '16px',
              fontWeight: 600,
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              letterSpacing: '0.3px',
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
              تسجيل دخول
            </button>
          </Link>
        </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;

