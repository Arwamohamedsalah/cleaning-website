import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchWorkers } from '../store/slices/workersSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import FloatingShapes from '../components/FloatingShapes';
import '../styles/globals.css';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const Services = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workers, loading } = useSelector((state) => state.workers);

  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const badges = {
      available: { label: '✅ متاحة', color: '#4caf50' },
      busy: { label: '⏳ مشغولة', color: '#ff9800' },
      'on-leave': { label: '🏖 إجازة', color: '#2196f3' },
      inactive: { label: '❌ غير نشطة', color: '#9e9e9e' },
    };
    return badges[status] || badges.available;
  };

  const handleViewDetails = (workerId) => {
    navigate(`/worker/${workerId}`);
  };

  // Filter only active workers
  const activeWorkers = workers.filter(worker => worker.isActive !== false && worker.status !== 'inactive');

  // Generate stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
  }));

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
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 40px 60px',
        overflow: 'hidden',
      }}>
        <FloatingShapes />
        <div style={{
          maxWidth: '800px',
          width: '100%',
          textAlign: 'center',
          zIndex: 1,
          position: 'relative',
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '20px',
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}>
            عاملاتنا المحترفات
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.8' }}>
            فريق من العاملات المدربات والمحترفات جاهزون لخدمتك بأعلى معايير الجودة
          </p>
        </div>
      </section>

      {/* Workers Grid */}
      <section style={{
        padding: '80px 40px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '24px', color: 'var(--text-secondary)' }}>جاري التحميل...</div>
          </div>
        ) : activeWorkers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '24px', color: 'var(--text-secondary)' }}>لا توجد عاملات متاحة حالياً</div>
          </div>
        ) : (
          <div className="cards-grid-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px',
            justifyContent: 'center',
          }}>
            {activeWorkers.map((worker, index) => {
              const status = getStatusBadge(worker.status);
              const workerName = worker.arabicName || worker.name || 'عاملة';
              const workerPhotos = worker.photos && worker.photos.length > 0 
                ? worker.photos 
                : [];
              
              return (
                <div
                  key={worker._id || worker.id}
                  className="dashboard-stats-card"
                  style={{
                    padding: '0',
                    textAlign: 'center',
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {/* Worker Images Carousel */}
                  <div style={{
                    width: '100%',
                    height: '280px',
                    marginBottom: '0',
                    overflow: 'hidden',
                    position: 'relative',
                    background: workerPhotos.length > 0 
                      ? 'transparent' 
                      : 'linear-gradient(135deg, rgba(37, 150, 190, 0.9) 0%, rgba(37, 150, 190, 0.8) 25%, rgba(37, 150, 190, 0.7) 50%, rgba(29, 120, 152, 0.8) 75%, rgba(22, 90, 114, 0.9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '60px',
                    color: 'white',
                  }}>
                    {workerPhotos.length > 0 ? (
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={workerPhotos.length > 1}
                        pagination={{ 
                          clickable: true,
                          dynamicBullets: true,
                        }}
                        autoplay={{
                          delay: 3000,
                          disableOnInteraction: false,
                        }}
                        loop={workerPhotos.length > 1}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        {workerPhotos.map((photo, photoIndex) => (
                          <SwiperSlide key={photoIndex}>
                            <img 
                              src={photo} 
                              alt={`${workerName} - ${photoIndex + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block',
                                background: 'linear-gradient(135deg, rgba(37, 150, 190, 0.1) 0%, rgba(37, 150, 190, 0.05) 100%)',
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <span style={{
                        fontSize: '80px',
                        fontWeight: 700,
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                      }}>{workerName[0]}</span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '20px 30px 30px' }}>

                  {/* Worker Name */}
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: 700, 
                    marginBottom: '10px',
                    color: 'var(--text-primary)',
                  }}>
                    {workerName}
                  </h3>

                  {/* Worker Info */}
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    marginBottom: '8px',
                    fontSize: '16px',
                  }}>
                    {worker.nationality} | {worker.age} سنة
                  </p>


                  {/* Experience */}
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    marginBottom: '12px',
                    fontSize: '14px',
                  }}>
                    🕐 خبرة {worker.experience || 0} سنوات
                  </p>

                  {/* Status */}
                  <p style={{ 
                    color: status.color, 
                    fontWeight: 700, 
                    marginBottom: '15px',
                    fontSize: '16px',
                  }}>
                    {status.label}
                  </p>

                  {/* Skills */}
                  {worker.skills && worker.skills.length > 0 && (
                    <div style={{ marginBottom: '20px', minHeight: '60px' }}>
                      <p style={{ 
                        fontSize: '14px', 
                        marginBottom: '8px',
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                      }}>
                        المهارات:
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '6px', 
                        justifyContent: 'center' 
                      }}>
                        {worker.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} style={{
                            background: 'rgba(37, 150, 190, 0.2)',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: 'rgba(37, 150, 190, 1)',
                            fontWeight: 500,
                          }}>
                            {skill}
                          </span>
                        ))}
                        {worker.skills.length > 3 && (
                          <span style={{
                            background: 'rgba(37, 150, 190, 0.1)',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                          }}>
                            +{worker.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Orders Count */}
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    marginBottom: '20px',
                    fontSize: '14px',
                  }}>
                    📊 {worker.totalOrders || 0} طلب مكتمل
                  </p>

                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewDetails(worker._id || worker.id)}
                      style={{
                        width: '100%',
                        padding: '14px 24px',
                        fontSize: '16px',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, rgba(37, 150, 190, 0.6) 0%, rgba(37, 150, 190, 0.8) 50%, rgba(37, 150, 190, 1) 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(37, 150, 190, 0.4)',
                        transition: 'all 0.3s',
                        marginTop: 'auto',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 24px rgba(37, 150, 190, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 16px rgba(37, 150, 190, 0.4)';
                      }}
                    >
                      المزيد من التفاصيل
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section style={{
        padding: '80px 40px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 700,
            marginBottom: '50px',
            color: 'rgba(37, 150, 190, 1)',
          }}>
            لماذا تختار عاملاتنا؟
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
          }}>
            {[
              { icon: '⭐', title: 'جودة عالية', desc: 'عاملات مدربات بأعلى معايير الجودة' },
              { icon: '👷‍♀️', title: 'فريق محترف', desc: 'خبرة سنوات في مجال التنظيف' },
              { icon: '⏰', title: 'مواعيد مرنة', desc: 'نعمل حسب جدولك الزمني' },
              { icon: '💰', title: 'أسعار مناسبة', desc: 'أسعار تنافسية وجودة ممتازة' },
            ].map((item, index) => (
              <div key={index} className="dashboard-stats-card" style={{ padding: '30px' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>{item.icon}</div>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  marginBottom: '10px',
                  color: '#ffffff',
                }}>
                  {item.title}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 40px',
        textAlign: 'center',
      }}>
        <div className="dashboard-chart-card" style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '60px 40px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 700,
            marginBottom: '20px',
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}>
            جاهزون لخدمتك؟
          </h2>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '40px', 
            lineHeight: '1.8' 
          }}>
            احجز خدمتك الآن واستمتع بمنزل نظيف ومرتب
          </p>
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
              احجز خدمتك الآن
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
