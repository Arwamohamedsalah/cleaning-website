import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from './GlassCard';
import Modal from './Modal';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const Footer = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid rgba(15, 23, 42, 0.08)',
      padding: '60px 40px 20px',
      marginTop: '80px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '40px',
      }}>
        {/* عن الشركة */}
        <div>
          <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>عن الشركة</h3>
          <p style={{ color: '#334155', lineHeight: '1.8', marginBottom: '20px', fontWeight: 500 }}>
            نوفر أفضل خدمات التنظيف الاحترافية بأيدي محترفة ومدربة. خبرة تتجاوز 10 سنوات في خدمة عملائنا.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <img 
              src="/img/logo.jpg" 
              alt="Ard El Baraka Logo" 
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
            <div>
              <div style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.5px',
                lineHeight: '1.2',
              }}>
                Ard El Baraka
              </div>
              <div style={{ fontSize: '12px', color: '#FFD700', fontWeight: 600, letterSpacing: '1px' }}>
                M a n p o w e r
              </div>
            </div>
          </div>
        </div>

        {/* روابط سريعة */}
        <div>
          <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>روابط سريعة</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/workers" style={{ color: '#334155', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 500, padding: '6px 0' }} onMouseEnter={(e) => { e.target.style.color = '#0f172a'; e.target.style.transform = 'translateX(-4px)'; }} onMouseLeave={(e) => { e.target.style.color = '#334155'; e.target.style.transform = 'translateX(0)'; }}>تنظيف اليوم</Link>
            <Link to="/assistants" style={{ color: '#334155', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 500, padding: '6px 0' }} onMouseEnter={(e) => { e.target.style.color = '#0f172a'; e.target.style.transform = 'translateX(-4px)'; }} onMouseLeave={(e) => { e.target.style.color = '#334155'; e.target.style.transform = 'translateX(0)'; }}>الاستقدام</Link>
            <Link to="/contact" style={{ color: '#334155', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 500, padding: '6px 0' }} onMouseEnter={(e) => { e.target.style.color = '#0f172a'; e.target.style.transform = 'translateX(-4px)'; }} onMouseLeave={(e) => { e.target.style.color = '#334155'; e.target.style.transform = 'translateX(0)'; }}>تواصل معنا</Link>
            <button
              onClick={() => setShowPrivacyModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#334155',
                textDecoration: 'none',
                transition: 'all 0.2s',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'right',
                padding: 0,
                fontSize: 'inherit',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.target.style.color = '#0f172a'; e.target.style.transform = 'translateX(-4px)'; }}
              onMouseLeave={(e) => { e.target.style.color = '#334155'; e.target.style.transform = 'translateX(0)'; }}
            >
              سياسة الخصوصية
            </button>
          </div>
        </div>

        {/* معلومات الاتصال */}
        <div>
          <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>معلومات الاتصال</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#334155', fontWeight: 500 }}>
            <div>📞 920012345</div>
            <div>📧 info@cleaningservice.sa</div>
            <div>📍 الرياض، المملكة العربية السعودية</div>
          </div>
        </div>

        {/* تابعنا */}
        <div>
          <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>تابعنا</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            {['Facebook', 'Twitter', 'Instagram', 'WhatsApp'].map((social) => (
              <GlassCard
                key={social}
                style={{
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '24px',
                  border: '1px solid rgba(15,23,42,0.08)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                {social === 'Facebook' && '📘'}
                {social === 'Twitter' && '🐦'}
                {social === 'Instagram' && '📷'}
                {social === 'WhatsApp' && '💬'}
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(15, 23, 42, 0.08)',
        paddingTop: '20px',
        textAlign: 'center',
        color: '#64748b',
        fontWeight: 500,
      }}>
        © 2025 جميع الحقوق محفوظة - Ard El Baraka Manpower
      </div>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        size="large"
        title="سياسة الخصوصية"
      >
        <div style={{
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '10px',
          color: '#0f172a',
        }}>
          <div style={{
            lineHeight: '1.8',
            fontSize: '14px',
          }}>
            <p style={{ marginBottom: '15px', color: '#64748b', fontSize: '12px' }}>
              آخر تحديث: {new Date().toLocaleDateString('ar-SA', { calendar: 'gregory', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '12px',
              }}>
                1. مقدمة
              </h3>
              <p style={{ marginBottom: '10px', fontSize: '14px' }}>
                نحن في Ard El Baraka Manpower نلتزم بحماية خصوصية عملائنا. تشرح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها لنا عند استخدام خدماتنا.
              </p>
            </section>

            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '12px',
              }}>
                2. المعلومات التي نجمعها
              </h3>
              <p style={{ marginBottom: '10px', fontSize: '14px' }}>
                نجمع المعلومات التالية عند استخدام خدماتنا:
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '10px 0',
                fontSize: '14px',
              }}>
                <li style={{ marginBottom: '8px', paddingRight: '20px', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: 0, color: '#0f172a' }}>•</span>
                  الاسم الكامل ورقم الهاتف والعنوان
                </li>
                <li style={{ marginBottom: '8px', paddingRight: '20px', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: 0, color: '#0f172a' }}>•</span>
                  معلومات الحجز والطلبات
                </li>
                <li style={{ marginBottom: '8px', paddingRight: '20px', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: 0, color: '#0f172a' }}>•</span>
                  أي معلومات أخرى تقدمها طواعية
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '12px',
              }}>
                3. كيفية استخدام المعلومات
              </h3>
              <p style={{ marginBottom: '10px', fontSize: '14px' }}>
                نستخدم المعلومات لمعالجة طلباتك والتواصل معك وتحسين خدماتنا. لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة.
              </p>
            </section>

            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '12px',
              }}>
                4. حماية المعلومات
              </h3>
              <p style={{ marginBottom: '10px', fontSize: '14px' }}>
                نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.
              </p>
            </section>

            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '12px',
              }}>
                5. حقوقك
              </h3>
              <p style={{ marginBottom: '10px', fontSize: '14px' }}>
                لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو تحديثها أو حذفها. للاتصال بنا: 📞 920012345 | 📧 info@cleaningservice.sa
              </p>
            </section>

            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '12px',
              }}>
                6. التغييرات
              </h3>
              <p style={{ marginBottom: '10px', fontSize: '14px' }}>
                قد نحدث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بأي تغييرات مهمة عن طريق نشر السياسة المحدثة.
              </p>
            </section>
          </div>
        </div>
      </Modal>
    </footer>
  );
};

export default Footer;

