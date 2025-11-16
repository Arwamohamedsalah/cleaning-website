import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { ordersAPI } from '../services/api';
import '../styles/globals.css';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const Home = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    workers: 1,
    date: '',
    workerNotes: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const baseAmount = 100;
      const amount = baseAmount * formData.workers;

      // Ensure date is properly formatted
      const orderDate = formData.date ? new Date(formData.date) : new Date();
      orderDate.setHours(9, 0, 0, 0); // Set time to 09:00

      const orderData = {
        fullName: formData.fullName,
        phone: formData.phone,
        workers: parseInt(formData.workers),
        date: orderDate.toISOString(), // Convert to ISO string for backend
        time: '09:00',
        address: formData.address,
        serviceType: 'normal',
        rooms: 1,
        amount: amount,
        notes: formData.workerNotes || '',
        status: 'pending',
      };

      console.log('📤 Sending order data:', orderData);

      const response = await ordersAPI.create(orderData);
      
      console.log('📥 Order response:', response);

      if (response.success) {
        setSuccess(true);
        setFormData({
          fullName: '',
          phone: '',
          workers: 1,
          date: '',
          workerNotes: '',
          address: '',
        });
      } else {
        setError(response.message || 'حدث خطأ أثناء الحجز');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء الحجز');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  };

  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes successPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 25px 50px rgba(16, 185, 129, 0.4);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .input-focus-effect {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-focus-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
        }
      `}</style>
      
      <div className="dashboard-container" style={{ minHeight: '100vh' }}>
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
        
        <section style={{
          position: 'relative',
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '100px 0 40px' : '120px 0 60px',
          overflow: 'hidden',
          background: '#ffffff',
        }}>
          
          
          <div style={{
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            padding: isMobile ? '0 16px' : '0 40px',
            zIndex: 1,
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '40px' : '60px',
            alignItems: 'center',
            justifyItems: 'center',
          }}>
            {/* Left Side - Content */}
            <div style={{
              animation: 'fadeInRight 0.8s ease-out',
              width: '100%',
              maxWidth: isMobile ? '100%' : '600px',
              textAlign: isMobile ? 'center' : 'right',
            }}>
              <h1 style={{
                fontSize: 'clamp(42px, 6vw, 72px)',
                fontWeight: 900,
                marginBottom: '30px',
                color: '#0f172a',
                lineHeight: 1.2,
                letterSpacing: '-1.5px',
              }}>
                ريح بالك مع خدماتنا
              </h1>
              
              <div style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                color: '#334155',
                lineHeight: 1.8,
                marginBottom: '40px',
                fontWeight: 400,
              }}>
                <p style={{ marginBottom: '16px' }}>
                  نوفر لك أفضل الطرق لتوفير الراحة لنفسك ولأحبائك. نقدم مجموعة واسعة من الخدمات المصممة خصيصاً لراحتك:
                </p>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  margin: '20px 0',
                }}>
                  <li style={{ marginBottom: '12px', paddingRight: '24px', position: 'relative' }}>
                    <span style={{ position: 'absolute', right: 0, color: '#0f172a' }}>✓</span>
                    تنظيف المنازل
                  </li>
                  <li style={{ marginBottom: '12px', paddingRight: '24px', position: 'relative' }}>
                    <span style={{ position: 'absolute', right: 0, color: '#0f172a' }}>✓</span>
                    إدارة المنزل
                  </li>
                  <li style={{ marginBottom: '12px', paddingRight: '24px', position: 'relative' }}>
                    <span style={{ position: 'absolute', right: 0, color: '#0f172a' }}>✓</span>
                    خدمات الضيافة
                  </li>
                </ul>
                <p style={{ marginTop: '20px', fontWeight: 600, color: '#0f172a' }}>
                  احصل على خدمة عالية الجودة من عمالة مدربة وموثوقة من مختلف الجنسيات، متاحة عبر باقات متنوعة.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'column',
                gap: '20px',
                marginTop: '50px',
                alignItems: isMobile ? 'stretch' : 'flex-start',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  padding: '16px 24px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '2px solid #e5e7eb',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0f172a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
                onClick={() => window.open('https://wa.me/966501234567', '_blank')}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '28px', color: '#ffffff' }}>💬</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                      تواصل معنا عبر واتساب
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      نحن هنا لمساعدتك
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Side - Phone Image */}
            {!isMobile && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                animation: 'fadeInLeft 0.8s ease-out',
                position: 'relative',
                width: '100%',
              }}>
                <div style={{
                  width: '100%',
                  maxWidth: '400px',
                  position: 'relative',
                  animation: 'float 3s ease-in-out infinite',
                }}>
                  {/* Phone Mockup */}
                  <div style={{
                    width: '280px',
                    height: '560px',
                    margin: '0 auto',
                    background: '#000000',
                    borderRadius: '40px',
                    padding: '12px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 8px rgba(15, 23, 42, 0.06)',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: '#ffffff',
                      borderRadius: '32px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 20px',
                    }}>
                      {/* Logo */}
                      <div style={{
                        textAlign: 'center',
                        marginTop: '60px',
                      }}>
                        <div style={{
                          fontSize: 'clamp(28px, 4vw, 36px)',
                          fontWeight: 900,
                          color: '#0f172a',
                          marginBottom: '8px',
                          fontFamily: 'Cairo, sans-serif',
                          letterSpacing: '-1px',
                          lineHeight: 1.2,
                        }}>
                          Ard El Baraka
                        </div>
                        <div style={{
                          fontSize: 'clamp(12px, 2vw, 16px)',
                          fontWeight: 600,
                          color: '#ebd573',
                          letterSpacing: '2px',
                          marginTop: '8px',
                        }}>
                          M a n p o w e r
                        </div>
                      </div>
                      
                      {/* Decorative Elements */}
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        width: '60px',
                        height: '60px',
                        background: 'radial-gradient(circle, rgba(15, 23, 42, 0.06) 0%, transparent 70%)',
                        borderRadius: '50%',
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        width: '40px',
                        height: '40px',
                        background: 'radial-gradient(circle, rgba(15, 23, 42, 0.05) 0%, transparent 70%)',
                        borderRadius: '50%',
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Form Section */}
        <section style={{
          position: 'relative',
          padding: '80px 20px',
          background: '#ffffff',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {/* Form Card */}
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              padding: '50px 40px',
              background: '#ffffff',
              borderRadius: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
              animation: 'fadeInUp 0.8s ease-out',
              border: '1px solid rgba(59, 130, 246, 0.1)',
            }}>
              {success ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  animation: 'scaleIn 0.5s ease-out',
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 30px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
                    animation: 'successPulse 2s ease-in-out infinite',
                  }}>
                    <span style={{ fontSize: '64px' }}>✅</span>
                  </div>
                  <h2 style={{
                    fontSize: 'clamp(28px, 4vw, 36px)',
                    fontWeight: 900,
                    color: '#0f172a',
                    marginBottom: '20px',
                    letterSpacing: '-0.5px',
                  }}>
                    تم الحجز بنجاح!
                  </h2>
                  <p style={{
                    fontSize: 'clamp(16px, 2vw, 20px)',
                    color: '#64748b',
                    lineHeight: '1.8',
                    marginBottom: '40px',
                  }}>
                    تم إرسال طلبك بنجاح. سيتم التواصل معك قريباً لتأكيد الحجز.
                  </p>
                  <GlassButton
                    onClick={() => setSuccess(false)}
                    style={{
                      padding: '16px 48px',
                      fontSize: '18px',
                      fontWeight: 600,
                    }}
                  >
                    حجز جديد
                  </GlassButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* عدد العاملات */}
                  <div style={{ marginBottom: '32px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '16px',
                      letterSpacing: '-0.3px',
                    }}>
                      اختر عاملة واحدة أو عاملتين أو ثلاث عاملات
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '16px',
                    }}>
                      {[1, 2, 3].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, workers: num }))}
                          style={{
                            padding: '24px 20px',
                            fontSize: '18px',
                            fontWeight: 700,
                            background: formData.workers === num
                              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                              : '#ffffff',
                            color: formData.workers === num ? '#ffffff' : '#0f172a',
                            border: `3px solid ${formData.workers === num ? '#3b82f6' : '#e5e7eb'}`,
                            borderRadius: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: formData.workers === num
                              ? '0 20px 40px rgba(59, 130, 246, 0.3), 0 0 0 4px rgba(59, 130, 246, 0.1)'
                              : '0 4px 10px rgba(0, 0, 0, 0.05)',
                            transform: formData.workers === num ? 'scale(1.05)' : 'scale(1)',
                          }}
                          onMouseEnter={(e) => {
                            if (formData.workers !== num) {
                              e.currentTarget.style.transform = 'translateY(-4px)';
                              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                              e.currentTarget.style.borderColor = '#3b82f6';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (formData.workers !== num) {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.05)';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }
                          }}
                        >
                          {num} {num === 1 ? 'عاملة' : 'عاملات'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* اختيار اليوم */}
                  <div style={{ marginBottom: '32px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '16px',
                      letterSpacing: '-0.3px',
                    }}>
                      اختر اليوم المطلوب
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={getMinDate()}
                      required
                      className="input-focus-effect"
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        fontSize: '17px',
                        background: '#ffffff',
                        border: '3px solid #e5e7eb',
                        borderRadius: '16px',
                        color: '#0f172a',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontWeight: 500,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>

                  {/* خيارات خاصة بالعاملة */}
                  <div style={{ marginBottom: '32px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '16px',
                      letterSpacing: '-0.3px',
                    }}>
                      خيارات خاصة بالعاملة (اختياري)
                    </label>
                    <textarea
                      name="workerNotes"
                      value={formData.workerNotes}
                      onChange={handleChange}
                      rows="4"
                      placeholder="اكتب أي ملاحظات أو طلبات خاصة..."
                      className="input-focus-effect"
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        fontSize: '16px',
                        background: '#ffffff',
                        border: '3px solid #e5e7eb',
                        borderRadius: '16px',
                        color: '#0f172a',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontFamily: 'inherit',
                        fontWeight: 500,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>

                  {/* اسم العميل */}
                  <div style={{ marginBottom: '32px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '16px',
                      letterSpacing: '-0.3px',
                    }}>
                      اسمك
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="أدخل اسمك الكامل"
                      className="input-focus-effect"
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        fontSize: '17px',
                        background: '#ffffff',
                        border: '3px solid #e5e7eb',
                        borderRadius: '16px',
                        color: '#0f172a',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontWeight: 500,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>

                  {/* رقم الهاتف */}
                  <div style={{ marginBottom: '32px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '16px',
                      letterSpacing: '-0.3px',
                    }}>
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="أي رقم هاتف من أي بلد (مثال: +1234567890 أو 0501234567)"
                      pattern="[\+]?[0-9\s\-\(\)]{7,20}"
                      className="input-focus-effect"
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        fontSize: '17px',
                        background: '#ffffff',
                        border: '3px solid #e5e7eb',
                        borderRadius: '16px',
                        color: '#0f172a',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontWeight: 500,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    />
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      marginTop: '12px',
                      lineHeight: '1.5',
                    }}>
                      يمكنك إدخال رقم الهاتف من أي بلد (مثال: +966501234567 أو 0501234567)
                    </p>
                  </div>

                  {/* العنوان */}
                  <div style={{ marginBottom: '40px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '16px',
                      letterSpacing: '-0.3px',
                    }}>
                      العنوان
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="أدخل عنوانك الكامل"
                      className="input-focus-effect"
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        fontSize: '17px',
                        background: '#ffffff',
                        border: '3px solid #e5e7eb',
                        borderRadius: '16px',
                        color: '#0f172a',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontWeight: 500,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div style={{
                      padding: '20px',
                      marginBottom: '32px',
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                      border: '3px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '16px',
                      color: '#991b1b',
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: 600,
                      animation: 'scaleIn 0.3s ease-out',
                    }}>
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <GlassButton
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '20px 48px',
                      fontSize: '20px',
                      fontWeight: 700,
                      borderRadius: '16px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {loading ? 'جاري الحجز...' : 'احجز الآن'}
                  </GlassButton>
                </form>
              )}
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default Home;