import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkers } from '../store/slices/workersSlice';
import { fetchHousemaids } from '../store/slices/housemaidsSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import FloatingShapes from '../components/FloatingShapes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/globals.css';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const WorkerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workers, loading: workersLoading } = useSelector((state) => state.workers);
  const { housemaids, loading: housemaidsLoading } = useSelector((state) => state.housemaids);
  const [worker, setWorker] = useState(null);
  const [isAssistant, setIsAssistant] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkers());
    dispatch(fetchHousemaids());
  }, [dispatch]);

  useEffect(() => {
    // Search in workers first
    if (workers.length > 0) {
      const foundWorker = workers.find(w => (w._id || w.id) === id);
      if (foundWorker) {
        setWorker(foundWorker);
        setIsAssistant(false);
        return;
      }
    }
    
    // If not found in workers, search in housemaids
    if (housemaids.length > 0) {
      const foundHousemaid = housemaids.find(h => (h._id || h.id) === id);
      if (foundHousemaid) {
        setWorker(foundHousemaid);
        setIsAssistant(true);
        return;
      }
    }
    
    // If still not found and both lists are loaded, set to null
    if (!workersLoading && !housemaidsLoading && workers.length > 0 && housemaids.length > 0) {
      setWorker(null);
    }
  }, [workers, housemaids, id, workersLoading, housemaidsLoading]);

  const loading = workersLoading || housemaidsLoading;

  // Generate stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  if (loading) {
    return (
      <div className="dashboard-container" style={{ minHeight: '100vh' }}>
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
        <div style={{ 
          padding: '120px 40px', 
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ fontSize: '24px', color: 'rgba(255, 255, 255, 0.9)' }}>
            جاري التحميل...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="dashboard-container" style={{ minHeight: '100vh' }}>
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
        <div style={{ 
          padding: '120px 40px', 
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h2 style={{ 
            fontSize: '32px', 
            marginBottom: '20px',
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}>
            العاملة غير موجودة
          </h2>
          <Link to="/assistants" style={{ textDecoration: 'none', marginRight: '10px' }}>
            <button style={{
              fontSize: '18px',
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              العودة إلى الاستقدام
            </button>
          </Link>
          <Link to="/workers" style={{ textDecoration: 'none' }}>
            <button style={{
              fontSize: '18px',
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              العودة إلى العاملات
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const workerName = worker.arabicName || worker.name || 'عاملة';
  const workerPhotos = Array.isArray(worker.photos) && worker.photos.length > 0 ? worker.photos : [];
  
  const getStatusBadge = (status) => {
    const badges = {
      available: { label: '✅ متاحة', color: '#4caf50', bg: 'rgba(76, 175, 80, 0.1)' },
      busy: { label: '⏳ مشغولة', color: '#ff9800', bg: 'rgba(255, 152, 0, 0.1)' },
      'on-leave': { label: '🏖 إجازة', color: '#2196f3', bg: 'rgba(33, 150, 243, 0.1)' },
      inactive: { label: '❌ غير نشطة', color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.1)' },
    };
    return badges[status] || badges.available;
  };

  const status = getStatusBadge(worker.status);

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh' }}>
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
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 40px 60px',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          zIndex: 1,
          position: 'relative',
        }}>
          <Link 
            to={isAssistant ? "/assistants" : "/workers"} 
            style={{ 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '30px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
          >
            ← العودة إلى {isAssistant ? 'الاستقدام' : 'العاملات'}
          </Link>
          
          <div className="dashboard-chart-card" style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            {/* Worker Images - Square slider */}
            <div
              style={{
                width: '100%',
                maxWidth: '520px',
                height: '320px',
                marginBottom: '30px',
                overflow: 'hidden',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                background: workerPhotos.length > 0 ? '#ffffff' : '#f8fafc',
                boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {workerPhotos.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation={workerPhotos.length > 1}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  loop={workerPhotos.length > 1}
                  style={{ width: '100%', height: '100%' }}
                >
                  {workerPhotos.map((photo, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={photo}
                        alt={`${workerName} - ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          background: '#f8fafc',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <span style={{ fontSize: '80px', fontWeight: 800, color: '#0f172a' }}>
                  {workerName[0]}
                </span>
              )}
            </div>

            {/* Worker Name */}
            <h1 style={{
              fontSize: '36px',
              fontWeight: 700,
              marginBottom: '15px',
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}>
              {workerName}
            </h1>

            {/* Status Badge */}
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: '20px',
              background: status.bg,
              color: status.color,
              fontWeight: 700,
              marginBottom: '20px',
              fontSize: '16px',
            }}>
              {status.label}
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section style={{
        padding: '60px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {/* Basic Info */}
          <div className="dashboard-stats-card" style={{ padding: '30px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '20px',
              color: '#ffffff',
            }}>
              المعلومات الأساسية
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>الاسم:</span>
                <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginTop: '5px' }}>
                  {workerName}
                </p>
              </div>
              {worker.englishName && (
                <div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>الاسم بالإنجليزي:</span>
                  <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginTop: '5px' }}>
                    {worker.englishName}
                  </p>
                </div>
              )}
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>الجنسية:</span>
                <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginTop: '5px' }}>
                  {worker.nationality}
                </p>
              </div>
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>العمر:</span>
                <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginTop: '5px' }}>
                  {worker.age} سنة
                </p>
              </div>
              {worker.phone && (
                <div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>رقم الهاتف:</span>
                  <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginTop: '5px' }}>
                    {worker.phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="dashboard-stats-card" style={{ padding: '30px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '20px',
              color: '#ffffff',
            }}>
              الخبرة
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>سنوات الخبرة:</span>
                <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginTop: '5px' }}>
                  {worker.experience || 0} سنوات
                </p>
              </div>
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>الطلبات المكتملة:</span>
                <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginTop: '5px' }}>
                  {worker.totalOrders || 0} طلب
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {worker.skills && worker.skills.length > 0 && (
            <div className="dashboard-stats-card" style={{ padding: '30px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                marginBottom: '20px',
                color: '#ffffff',
              }}>
                <span style={{ color: '#f6ebb3' }}>المهارات</span>
              </h2>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px' 
              }}>
                {worker.skills.map((skill, i) => (
                  <span key={i} style={{
                    background: 'rgba(37, 150, 190, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: '#f6ebb3',
                    fontWeight: 600,
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {worker.languages && worker.languages.length > 0 && (
            <div className="dashboard-stats-card" style={{ padding: '30px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                marginBottom: '20px',
                color: '#ffffff',
              }}>
                اللغات
              </h2>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px' 
              }}>
                {worker.languages.map((lang, i) => (
                  <span key={i} style={{
                    background: 'rgba(37, 150, 190, 0.15)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: '#ffffff',
                    fontWeight: 500,
                  }}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          {isAssistant ? (
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <button style={{
                fontSize: '18px',
                padding: '15px 40px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                استفسر عن العقد مع {workerName}
              </button>
            </Link>
          ) : (
            <Link to="/service-request" style={{ textDecoration: 'none' }}>
              <button style={{
                fontSize: '18px',
                padding: '15px 40px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                احجز خدمة مع {workerName}
              </button>
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WorkerDetails;

