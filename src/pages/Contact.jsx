import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Map from '../components/Map';
import FloatingShapes from '../components/FloatingShapes';
import '../styles/globals.css';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const Contact = () => {
  const phoneNumber = '920012345';
  const email = 'info@cleaningservice.sa';
  const whatsappNumber = '966501234567';

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}?subject=استفسار من موقع التنظيف`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('مرحباً، أريد الاستفسار عن خدمات التنظيف');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  // Generate stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', paddingTop: '100px' }}>
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
      <Navbar />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 20px 60px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
      }}>
        <FloatingShapes />
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          textAlign: 'center',
          zIndex: 1,
          position: 'relative',
        }}>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 900,
            marginBottom: '20px',
            color: '#0f172a',
            lineHeight: 1.1,
            letterSpacing: '-1px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.05)',
          }}>
            نسعد بتواصلك معنا
          </h1>
          <p style={{ 
            fontSize: 'clamp(18px, 2.5vw, 24px)', 
            color: '#475569', 
            fontWeight: 500,
          }}>
            فريقنا جاهز لخدمتك
          </p>
        </div>
      </section>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px 60px',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
      }}>
        {/* Map */}
        <div className="dashboard-chart-card" style={{ padding: '20px', marginBottom: '40px', overflow: 'hidden' }}>
          <Map 
            center={[24.7136, 46.6753]} 
            zoom={13}
            markerPosition={[24.7136, 46.6753]}
            height="400px"
          />
        </div>

        {/* Contact Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}>
          <div className="dashboard-stats-card" style={{ padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📍</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '15px', color: '#0f172a', letterSpacing: '-0.3px' }}>الموقع</h3>
            <p style={{ color: '#334155', lineHeight: '1.8', fontWeight: 500 }}>
              الرياض، المملكة العربية السعودية<br />
              حي النرجس، شارع التخصصي
            </p>
          </div>

          <div className="dashboard-stats-card" style={{ padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📞</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '15px', color: '#0f172a', letterSpacing: '-0.3px' }}>الهاتف</h3>
            <p style={{ color: '#334155', marginBottom: '15px', fontWeight: 500 }}>920012345</p>
            <button 
              className="dashboard-action-btn" 
              style={{ width: '100%', padding: '12px' }}
              onClick={handleCall}
            >
              اتصل الآن
            </button>
          </div>

          <div className="dashboard-stats-card" style={{ padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📧</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '15px', color: '#0f172a', letterSpacing: '-0.3px' }}>البريد</h3>
            <p style={{ color: '#334155', marginBottom: '15px', fontWeight: 500 }}>info@cleaningservice.sa</p>
            <button 
              className="dashboard-action-btn" 
              style={{ width: '100%', padding: '12px' }}
              onClick={handleEmail}
            >
              راسلنا
            </button>
          </div>

          <div className="dashboard-stats-card" style={{ padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>💬</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '15px', color: '#0f172a', letterSpacing: '-0.3px' }}>واتساب</h3>
            <p style={{ color: '#334155', marginBottom: '15px', fontWeight: 500 }}>+966501234567</p>
            <button
              className="dashboard-action-btn"
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              }}
              onClick={handleWhatsApp}
            >
              محادثة واتساب
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Contact;

