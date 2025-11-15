import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GlassButton from './GlassButton';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth <= 768;
      console.log('📱 Checking mobile view:', { width: window.innerWidth, isMobileView, currentIsMobile: isMobile });
      setIsMobile(isMobileView);
      if (!isMobileView && mobileMenuOpen) setMobileMenuOpen(false);
    };
    checkMobile();
    const resizeListener = () => checkMobile();
    window.addEventListener('resize', resizeListener);
    window.addEventListener('orientationchange', checkMobile);
    return () => {
      window.removeEventListener('resize', resizeListener);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, [mobileMenuOpen, isMobile]);

  const isActive = (path) => location.pathname === path;

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
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px', flexShrink: 0, textDecoration: 'none' }}>
        <img 
          src="/img/logo.jpg" 
          alt="Logo" 
          style={{ width: isMobile ? '40px' : '56px', height: isMobile ? '40px' : '56px', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 4px 20px rgba(37,150,190,0.3)' }}
        />
        <div>
          <div style={{ fontSize: isMobile ? '16px' : '22px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Ard El Baraka</div>
          <div style={{ fontSize: isMobile ? '10px' : '13px', color: '#FFD700', fontWeight: 600, letterSpacing: '1px', marginTop: '2px' }}>M a n p o w e r</div>
        </div>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: isMobile ? 'none' : 'flex', gap: '4px', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        {['/', '/assistants', '/workers', '/contact'].map((path, i) => (
          <Link key={path} to={path} style={{
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            background: isActive(path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: isActive(path) ? '#3b82f6' : '#0f172a',
            fontWeight: isActive(path) ? 700 : 500,
          }}>{['الرئيسية','الاستقدام','تنظيف اليوم','تواصل معنا'][i]}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Desktop Buttons */}
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
            }}>
              طلب خدمة
            </button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 500,
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}>
              تسجيل دخول
            </button>
          </Link>
        </div>

        {/* Hamburger - Mobile */}
        {isMobile && (
          <button 
            type="button"
            id="hamburger-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🍔 Hamburger clicked!', { currentState: mobileMenuOpen });
              setMobileMenuOpen(prev => {
                const newState = !prev;
                console.log('🔄 Menu state changed:', prev, '->', newState);
                return newState;
              });
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('👆 Hamburger touched!', { currentState: mobileMenuOpen });
              setMobileMenuOpen(prev => {
                const newState = !prev;
                console.log('🔄 Menu state changed (touch):', prev, '->', newState);
                return newState;
              });
            }}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              padding: '10px',
              background: mobileMenuOpen ? 'rgba(37, 150, 190, 0.2)' : '#ffffff',
              border: mobileMenuOpen ? '2px solid rgba(37, 150, 190, 1)' : '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              zIndex: 1003,
              fontSize: '20px',
              transition: 'all 0.3s',
              position: 'relative',
              pointerEvents: 'auto',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {(() => {
        if (isMobile && mobileMenuOpen) {
          console.log('📱 Rendering mobile menu:', { isMobile, mobileMenuOpen });
        }
        return null;
      })()}
      {isMobile && mobileMenuOpen && (
        <>
          <div 
            onClick={() => {
              console.log('🖱️ Overlay clicked');
              setMobileMenuOpen(false);
            }}
            onTouchStart={() => {
              console.log('👆 Overlay touched');
              setMobileMenuOpen(false);
            }}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: 'rgba(0, 0, 0, 0.3)', 
              zIndex: 1003,
              cursor: 'pointer',
            }} 
          />
          <div 
            id="mobile-menu-content"
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
              background: '#ffffff !important', 
              borderRadius: '16px', 
              zIndex: 1004,
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              visibility: 'visible !important',
              opacity: '1 !important',
              minHeight: '200px',
              width: 'calc(100% - 40px)',
              pointerEvents: 'auto',
              transform: 'translateZ(0)',
            }}
          >
            {['/', '/assistants', '/workers', '/contact'].map((path, i) => (
              <Link 
                key={path} 
                to={path} 
                onClick={() => {
                  console.log('🔗 Link clicked:', path);
                  setMobileMenuOpen(false);
                }} 
                style={{ 
                  textDecoration: 'none', 
                  padding: '14px 20px', 
                  borderRadius: '12px', 
                  background: isActive(path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent', 
                  border: isActive(path) ? '2px solid #3b82f6' : '1px solid #e5e7eb', 
                  color: isActive(path) ? '#3b82f6' : '#0f172a', 
                  textAlign: 'center', 
                  fontWeight: 600,
                  fontSize: '16px',
                  transition: 'all 0.3s',
                  display: 'block',
                  width: '100%',
                  minHeight: '44px',
                  lineHeight: '1.5',
                }}
              >
                {['الرئيسية', 'الاستقدام', 'تنظيف اليوم', 'تواصل معنا'][i]}
              </Link>
            ))}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(37, 150, 190, 0.3) 50%, transparent 100%)', margin: '8px 0' }} />
            <Link 
              to="/service-request" 
              onClick={() => {
                console.log('🔗 Service request clicked');
                setMobileMenuOpen(false);
              }} 
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
                minHeight: '44px',
              }}>
                طلب خدمة
              </button>
            </Link>
            <Link 
              to="/login" 
              onClick={() => {
                console.log('🔗 Login clicked');
                setMobileMenuOpen(false);
              }} 
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
                minHeight: '44px',
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