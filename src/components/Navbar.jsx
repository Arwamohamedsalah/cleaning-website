import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'الرئيسية' },
    { path: '/assistants', label: 'الاستقدام' },
    { path: '/workers', label: 'تنظيف اليوم' },
    { path: '/contact', label: 'تواصل معنا' },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('nav')) {
          setMobileMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: isMobile ? (scrolled ? '12px 16px' : '16px') : (scrolled ? '14px 60px' : '20px 60px'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled 
          ? 'rgba(255, 255, 255, 0.98)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled 
          ? '1px solid rgba(37, 150, 190, 0.1)' 
          : '1px solid rgba(37, 150, 190, 0.05)',
        boxShadow: scrolled 
          ? '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 40px rgba(37, 150, 190, 0.1)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Logo */}
      <Link 
        to="/" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? '10px' : '16px', 
          textDecoration: 'none',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img
          src="/img/logo.jpg"
          alt="Ard El Baraka Logo"
          style={{ 
            width: isMobile ? '45px' : '56px', 
            height: isMobile ? '45px' : '56px', 
            objectFit: 'contain', 
            borderRadius: '14px',
            boxShadow: '0 4px 20px rgba(37, 150, 190, 0.3)',
            border: '2px solid rgba(37, 150, 190, 0.1)',
            transition: 'all 0.3s ease',
          }}
        />
        <div>
          <div style={{ 
            fontWeight: 800, 
            fontSize: isMobile ? '18px' : '22px', 
            color: '#0f172a',
            letterSpacing: '-0.5px',
            lineHeight: '1.2',
          }}>
            Ard El Baraka
          </div>
          <div style={{ 
            fontWeight: 600, 
            fontSize: isMobile ? '11px' : '13px', 
            color: '#FFD700',
            letterSpacing: '1px',
            marginTop: '2px',
          }}>
            M a n p o w e r
          </div>
        </div>
      </Link>

      {/* Desktop Links */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: active 
                    ? 'linear-gradient(135deg, rgba(37, 150, 190, 0.15), rgba(59, 130, 246, 0.1))' 
                    : 'transparent',
                  color: active ? '#2596be' : '#0f172a',
                  fontWeight: active ? 700 : 500,
                  fontSize: '15px',
                  border: active ? '1px solid rgba(37, 150, 190, 0.2)' : '1px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(37, 150, 190, 0.08)';
                    e.currentTarget.style.color = '#2596be';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#0f172a';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Desktop Buttons */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/service-request" style={{ textDecoration: 'none' }}>
            <button
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2596be 0%, #3ba8d0 50%, #52bae2 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '15px',
                boxShadow: '0 4px 16px rgba(37, 150, 190, 0.4)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 150, 190, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 150, 190, 0.4)';
              }}
            >
              طلب خدمة
            </button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid rgba(37, 150, 190, 0.2)',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '15px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(37, 150, 190, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(37, 150, 190, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(37, 150, 190, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              تسجيل دخول
            </button>
          </Link>
        </div>
      )}

      {/* Hamburger - Mobile */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          style={{
            width: '44px',
            height: '44px',
            fontSize: '24px',
            border: '1px solid rgba(37, 150, 190, 0.2)',
            borderRadius: '12px',
            background: '#ffffff',
            cursor: 'pointer',
            zIndex: 1005,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: mobileMenuOpen 
              ? '0 4px 12px rgba(37, 150, 190, 0.3)' 
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(37, 150, 190, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(37, 150, 190, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = 'rgba(37, 150, 190, 0.2)';
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      )}

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
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)',
              zIndex: 1002,
              cursor: 'pointer',
            }}
          />

          {/* Menu Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: scrolled ? '78px' : '88px',
              left: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              borderRadius: '16px',
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15), 0 0 40px rgba(37, 150, 190, 0.1)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 1003,
              border: '1px solid rgba(37, 150, 190, 0.1)',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              animation: 'fadeInDown 0.3s ease-out',
            }}
          >
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: active 
                      ? 'linear-gradient(135deg, rgba(37, 150, 190, 0.15), rgba(59, 130, 246, 0.1))' 
                      : 'rgba(37, 150, 190, 0.05)',
                    color: active ? '#2596be' : '#0f172a',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontWeight: active ? 700 : 500,
                    fontSize: '16px',
                    border: active ? '1px solid rgba(37, 150, 190, 0.2)' : '1px solid transparent',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(37, 150, 190, 0.1)';
                      e.currentTarget.style.color = '#2596be';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(37, 150, 190, 0.05)';
                      e.currentTarget.style.color = '#0f172a';
                    }
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
            
            <Link to="/service-request" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2596be 0%, #3ba8d0 50%, #52bae2 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '16px',
                  boxShadow: '0 4px 16px rgba(37, 150, 190, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 150, 190, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 150, 190, 0.4)';
                }}
              >
                طلب خدمة
              </button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid rgba(37, 150, 190, 0.2)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(37, 150, 190, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(37, 150, 190, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(37, 150, 190, 0.2)';
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
