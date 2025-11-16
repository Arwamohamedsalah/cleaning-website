import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Map from '../components/Map';
import '../styles/globals.css';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';
import { ordersAPI } from '../services/api';

const Contact = () => {
  const phoneNumber = '920012345';
  const email = 'info@cleaningservice.sa';
  const whatsappNumber = '966501234567';
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Multi-step wizard state (same flow labels as طلب الخدمة)
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { number: 1, title: 'المعلومات الشخصية' },
    { number: 2, title: 'نوع الخدمة' },
    { number: 3, title: 'اختيار العامل/المساعدة' },
    { number: 4, title: 'تفاصيل الخدمة' },
    { number: 5, title: 'العنوان' },
    { number: 6, title: 'التأكيد' },
  ];

  const [inquiry, setInquiry] = useState({
    name: '',
    phone: '',
    email: '',
    serviceCategory: '', // 'worker' | 'housemaid'
    personName: '',      // اسم العاملة/المساعدة (اختياري)
    nationality: '',     // الدولة/الجنسية (اختياري)
    serviceType: '',     // comprehensive | normal | quick
    date: '',
    time: '',
    rooms: 1,
    workers: 1,
    address: '',
    notes: '',
  });

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiry(prev => ({ ...prev, [name]: value }));
  };

  const submitInquiry = async () => {
    if (!inquiry.name || !inquiry.phone) {
      alert('يرجى إدخال الاسم ورقم الهاتف');
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        name: inquiry.name,
        phone: inquiry.phone,
        serviceType: inquiry.serviceType || 'general',
        date: inquiry.date || undefined,
        time: inquiry.time || undefined,
        address: inquiry.address || undefined,
        notes: inquiry.notes || undefined,
      };
      const res = await ordersAPI.createInquiry(payload);
      if (res?.success) {
        alert('تم إرسال الاستفسار بنجاح! سنتواصل معك قريباً.');
        setInquiry({
          name: '',
          phone: '',
          email: '',
          serviceCategory: '',
          personName: '',
          nationality: '',
          serviceType: '',
          date: '',
          time: '',
          address: '',
          notes: '',
        });
        setCurrentStep(1);
      } else {
        alert(res?.message || 'حدث خطأ أثناء إرسال الاستفسار');
      }
    } catch (err) {
      alert(err?.message || 'حدث خطأ أثناء إرسال الاستفسار');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    // Simple per-step validation to ensure required data is filled before moving on
    if (currentStep === 1) {
      if (!inquiry.name?.trim() || !inquiry.phone?.trim()) {
        alert('يرجى إدخال الاسم ورقم الهاتف');
        return;
      }
    }
    if (currentStep === 4) {
      if (!inquiry.serviceType || !inquiry.date || !inquiry.time) {
        alert('يرجى إكمال تفاصيل الخدمة: نوع الخدمة والتاريخ والوقت');
        return;
      }
      if (!inquiry.rooms || Number(inquiry.rooms) < 1 || !inquiry.workers || Number(inquiry.workers) < 1) {
        alert('يرجى إدخال عدد الغرف والعاملات بشكل صحيح');
        return;
      }
    }
    if (currentStep === 5) {
      if (!inquiry.address?.trim()) {
        alert('يرجى إدخال العنوان');
        return;
      }
    }
    setCurrentStep((s) => Math.min(6, s + 1));
  };
  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1));

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
        background: '#ffffff',
      }}>
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
        background: '#ffffff',
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
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              }}
              onClick={handleWhatsApp}
            >
              محادثة واتساب
            </button>
          </div>
        </div>

        {/* Multi-step Service Request (wizard) */}
        <div style={{ marginTop: '30px' }}>
          <div className="dashboard-chart-card" style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px', color: '#0f172a', letterSpacing: '-0.3px', textAlign: 'center' }}>
              طلب خدمة
            </h2>

            {/* Steps header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', position: 'relative' }}>
              {steps.map((s, idx) => (
                <React.Fragment key={s.number}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '16px',
                        background: currentStep > s.number ? '#10B981' : currentStep === s.number ? '#0f172a' : '#e5e7eb',
                        color: currentStep >= s.number ? '#ffffff' : '#1e293b',
                        zIndex: 2,
                      }}
                    >
                      {currentStep > s.number ? '✓' : s.number}
                    </div>
                    <p style={{ marginTop: '8px', fontSize: '12px', color: currentStep >= s.number ? '#0f172a' : '#1e293b', fontWeight: currentStep === s.number ? 700 : 400 }}>
                      {s.title}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '23px',
                        right: `${(idx + 1) * (100 / steps.length)}%`,
                        width: `${100 / steps.length}%`,
                        height: '2px',
                        background: currentStep > s.number ? '#10B981' : '#e5e7eb',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Steps body */}
            <div style={{ display: 'grid', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
              {currentStep === 1 && (
                <>
                  <div className="glass-input-group">
                    <input
                      type="text"
                      name="name"
                      value={inquiry.name}
                      onChange={handleInquiryChange}
                      className="glass-input"
                      placeholder="الاسم الكامل"
                      required
                    />
                  </div>

                  <div className="glass-input-group">
                    <input
                      type="tel"
                      name="phone"
                      value={inquiry.phone}
                      onChange={handleInquiryChange}
                      className="glass-input"
                      placeholder="رقم الهاتف"
                      required
                    />
                  </div>

                  <div className="glass-input-group">
                    <input
                      type="email"
                      name="email"
                      value={inquiry.email}
                      onChange={handleInquiryChange}
                      className="glass-input"
                      placeholder="البريد الإلكتروني (اختياري)"
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setInquiry(prev => ({ ...prev, serviceCategory: 'worker' }))}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: inquiry.serviceCategory === 'worker' ? 'rgba(15, 23, 42, 0.08)' : '#ffffff',
                      border: inquiry.serviceCategory === 'worker' ? '2px solid #0f172a' : '1.5px solid #e5e7eb',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    👷‍♀️ عاملة
                  </button>
                  <button
                    type="button"
                    onClick={() => setInquiry(prev => ({ ...prev, serviceCategory: 'housemaid' }))}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: inquiry.serviceCategory === 'housemaid' ? 'rgba(15, 23, 42, 0.08)' : '#ffffff',
                      border: inquiry.serviceCategory === 'housemaid' ? '2px solid #0f172a' : '1.5px solid #e5e7eb',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    👔 مساعدة
                  </button>
                </div>
              )}

              {currentStep === 3 && (
                <>
                  <div className="glass-input-group">
                    <input type="text" name="nationality" value={inquiry.nationality} onChange={handleInquiryChange} className="glass-input" placeholder="الجنسية / الدولة" />
                  </div>
                  <div className="glass-input-group">
                    <input type="text" name="personName" value={inquiry.personName} onChange={handleInquiryChange} className="glass-input" placeholder="اسم العاملة/المساعدة (اختياري)" />
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                    <select name="serviceType" value={inquiry.serviceType} onChange={handleInquiryChange} className="glass-input" required>
                      <option value="">اختر نوع الخدمة (مثلاً: تنظيف شامل)</option>
                      <option value="comprehensive">تنظيف شامل</option>
                      <option value="normal">عادي</option>
                      <option value="quick">سريع</option>
                    </select>
                    <input type="date" name="date" value={inquiry.date} onChange={handleInquiryChange} className="glass-input" required />
                    <input type="time" name="time" value={inquiry.time} onChange={handleInquiryChange} className="glass-input" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <label style={{ display: 'grid' }}>
                      <span style={{ fontSize: '14px', marginBottom: '6px' }}>عدد الغرف</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        name="rooms"
                        value={inquiry.rooms}
                        onChange={handleInquiryChange}
                        className="glass-input"
                        placeholder="مثلاً: 3"
                        required
                        aria-label="عدد الغرف"
                      />
                    </label>
                    <label style={{ display: 'grid' }}>
                      <span style={{ fontSize: '14px', marginBottom: '6px' }}>عدد العاملات</span>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        name="workers"
                        value={inquiry.workers}
                        onChange={handleInquiryChange}
                        className="glass-input"
                        placeholder="مثلاً: 2"
                        required
                        aria-label="عدد العاملات"
                      />
                    </label>
                  </div>
                </>
              )}

              {currentStep === 5 && (
                <>
                  <div className="glass-input-group">
                    <input type="text" name="address" value={inquiry.address} onChange={handleInquiryChange} className="glass-input" placeholder="العنوان التفصيلي (اسم الشارع/الحي/المعالم)" required />
                  </div>
                </>
              )}

              {currentStep === 6 && (
                <>
                  <textarea
                    name="notes"
                    value={inquiry.notes}
                    onChange={handleInquiryChange}
                    className="glass-textarea"
                    placeholder="ملاحظات إضافية (اختياري)"
                    style={{ minHeight: '100px' }}
                  />
                  <div className="dashboard-stats-card" style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>ملخص</h3>
                    <div style={{ lineHeight: 2, color: '#0f172a' }}>
                      <div><strong>الاسم:</strong> {inquiry.name}</div>
                      <div><strong>الهاتف:</strong> {inquiry.phone}</div>
                      {inquiry.email && <div><strong>البريد:</strong> {inquiry.email}</div>}
                      {inquiry.serviceCategory && <div><strong>النوع:</strong> {inquiry.serviceCategory === 'worker' ? 'عاملة' : 'مساعدة'}</div>}
                      {inquiry.nationality && <div><strong>الجنسية:</strong> {inquiry.nationality}</div>}
                      {inquiry.personName && <div><strong>الاسم المختار:</strong> {inquiry.personName}</div>}
                      {inquiry.serviceType && <div><strong>الخدمة:</strong> {inquiry.serviceType}</div>}
                      {inquiry.date && <div><strong>التاريخ:</strong> {inquiry.date}</div>}
                      {inquiry.time && <div><strong>الوقت:</strong> {inquiry.time}</div>}
                      <div><strong>الغرف:</strong> {inquiry.rooms}</div>
                      <div><strong>العاملات:</strong> {inquiry.workers}</div>
                      {inquiry.address && <div><strong>العنوان:</strong> {inquiry.address}</div>}
                    </div>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goPrev}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid rgba(15,23,42,0.2)',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    السابق
                  </button>
                ) : <span />}

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid rgba(15,23,42,0.2)',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={submitInquiry}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid rgba(15,23,42,0.25)',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      fontWeight: 800,
                      minWidth: '200px',
                    }}
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Contact;

