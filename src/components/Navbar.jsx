import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';
import '../styles/mobile-menu.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return (
    <nav
      className={`glass-navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: isMobile ? (scrolled ? '12px 16px' : '14px 16px') : (scrolled ? '14px 60px' : '20px 60px'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: scrolled ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px', textDecoration: 'none' }}>
        <img
          src="/img/logo.jpg"
          alt="Ard El Baraka Logo"
          onError={(e) => {
            console.error('❌ Logo image failed to load:', e.target.src);
            // Try alternative paths
            const currentSrc = e.target.src;
            if (currentSrc.includes('/img/logo.jpg')) {
              // Try with base URL
              e.target.src = `${window.location.origin}/img/logo.jpg`;
            } else {
              e.target.style.display = 'none';
            }
          }}
          style={{
            width: isMobile ? '40px' : '56px',
            height: isMobile ? '40px' : '56px',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(37, 150, 190, 0.3)',
            flexShrink: 0,
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            maxWidth: '100%',
            height: 'auto',
          }}
        />
        <div>
          <div style={{ fontSize: isMobile ? '16px' : '22px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Ard El Baraka
          </div>
          <div style={{ fontSize: isMobile ? '10px' : '13px', color: '#FFD700', fontWeight: 600, letterSpacing: '1px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            M a n p o w e r
          </div>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div style={{ display: isMobile ? 'none' : 'flex', gap: '4px', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
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
                padding: '12px 24px',
                borderRadius: '10px',
                background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: active ? '#3b82f6' : '#0f172a',
                fontWeight: active ? 700 : 500,
                fontSize: '15px',
                transition: 'all 0.3s',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Desktop Buttons */}
        <div style={{ display: isMobile ? 'none' : 'flex', gap: '12px' }}>
          <Link to="/service-request">
            <button style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #2596be 0%, #3ba8d0 50%, #52bae2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}>طلب خدمة</button>
          </Link>
          <Link to="/login">
            <button style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 500,
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              cursor: 'pointer',
            }}>تسجيل دخول</button>
          </Link>
        </div>

        {/* Hamburger - Mobile Only */}
        {isMobile && (
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              padding: '10px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              zIndex: 1005,
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 1002,
              cursor: 'pointer',
            }}
          />

          {/* Menu Content */}
          <div
            id="mobile-menu-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: scrolled ? '78px' : '88px',
              left: '20px',
              right: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#ffffff',
              borderRadius: '16px',
              zIndex: 1003,
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              minHeight: '300px',
              visibility: 'visible',
              opacity: 1,
            }}
          >
            {/* Navigation Links - نفس الروابط في الديسكتوب */}
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
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: active ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    color: active ? '#3b82f6' : '#0f172a',
                    fontWeight: 600,
                    fontSize: '16px',
                    textAlign: 'center',
                    width: '100%',
                    display: 'block',
                    transition: 'all 0.3s',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Divider */}
            <div style={{ 
              height: '1px', 
              background: 'linear-gradient(90deg, transparent 0%, rgba(37, 150, 190, 0.3) 50%, transparent 100%)', 
              margin: '8px 0' 
            }} />
            
            {/* Action Buttons - نفس الأزرار في الديسكتوب */}
            <Link 
              to="/service-request" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', width: '100%', display: 'block' }}
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
              }}>
                طلب خدمة
              </button>
            </Link>
            <Link 
              to="/login" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', width: '100%', display: 'block' }}
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
              }}>
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