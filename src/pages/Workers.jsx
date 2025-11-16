import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchWorkers } from '../store/slices/workersSlice';
import { discountsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import '../styles/globals.css';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const Workers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workers, loading } = useSelector((state) => state.workers);
  const [activeDiscounts, setActiveDiscounts] = useState([]);

  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  // Fetch active discounts for workers
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await discountsAPI.getActive('workers');
        if (response.success) {
          setActiveDiscounts(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };
    fetchDiscounts();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      available: { label: '✅ متاحة', color: '#4caf50' },
      busy: { label: '⏳ مشغولة', color: '#ff9800' },
      'on-leave': { label: '🏖 إجازة', color: '#2196f3' },
      inactive: { label: '❌ غير نشطة', color: '#9e9e9e' },
    };
    return badges[status] || badges.available;
  };

  const getContractTypePrice = (contractType, workerPrice) => {
    // Use price from worker data if available, otherwise use default based on contract type
    if (workerPrice !== null && workerPrice !== undefined) {
      return workerPrice;
    }
    const prices = {
      hourly: 100,
      daily: 200,
    };
    return prices[contractType] || 100;
  };

  // Calculate price with discount
  const calculatePriceWithDiscount = (basePrice, discounts) => {
    if (!discounts || discounts.length === 0) {
      return { originalPrice: basePrice, finalPrice: basePrice, discountAmount: 0, appliedDiscount: null };
    }

    // Apply the first active discount
    const discount = discounts[0];
    let discountAmount = 0;
    
    if (discount.discountType === 'percentage') {
      discountAmount = (basePrice * discount.discountValue) / 100;
    } else {
      discountAmount = Math.min(discount.discountValue, basePrice);
    }

    const finalPrice = Math.max(0, basePrice - discountAmount);

    return {
      originalPrice: basePrice,
      finalPrice: finalPrice,
      discountAmount: discountAmount,
      appliedDiscount: discount,
    };
  };

  const handleBookWorker = (workerId) => {
    navigate(`/service-request?worker=${workerId}`);
  };

  const handleViewDetails = (workerId) => {
    navigate(`/worker/${workerId}`);
  };

  // Filter only active workers (for hourly/daily bookings)
  const activeWorkers = workers.filter(worker => 
    worker.isActive !== false && 
    worker.status !== 'inactive' &&
    (worker.contractType === 'hourly' || worker.contractType === 'daily')
  );

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
        minHeight: '50vh',
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
            تنظيف اليوم
          </h1>
          <p style={{ 
            fontSize: 'clamp(18px, 2.5vw, 24px)', 
            color: '#475569', 
            lineHeight: '1.8',
            fontWeight: 500,
          }}>
            احجز خدمة تنظيف يومية محترفة - تنظيف شامل ومنظم لمنزلك أو مكتبك
          </p>
        </div>
      </section>

      {/* Workers Grid */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
        background: '#ffffff',
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '24px', color: '#334155', fontWeight: 600 }}>جاري التحميل...</div>
          </div>
        ) : activeWorkers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '24px', color: '#334155', fontWeight: 600 }}>لا توجد عاملات متاحة حالياً</div>
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
              
              // Calculate price with discount
              const basePrice = getContractTypePrice(worker.contractType, worker.price);
              const priceInfo = calculatePriceWithDiscount(basePrice, activeDiscounts);
              
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
                      : '#f8fafc',
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
                                background: '#f8fafc',
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
                    color: '#ffffff',
                  }}>
                    {workerName}
                  </h3>

                  {/* Worker Info */}
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    marginBottom: '8px',
                    fontSize: '16px',
                  }}>
                    {worker.nationality} | {worker.age} سنة
                  </p>

                  {/* Contract Type */}
                  <p style={{ 
                    color: '#8b5cf6', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}>
                    {worker.contractType === 'hourly' ? '⏰ بالساعة' : worker.contractType === 'daily' ? '📅 باليوم' : '📋 حسب الطلب'}
                  </p>

                  {/* Price with Discount */}
                  <div style={{ marginBottom: '12px' }}>
                    {priceInfo.appliedDiscount ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ 
                            fontSize: '18px', 
                            color: 'rgba(255, 255, 255, 0.6)', 
                            textDecoration: 'line-through',
                            fontWeight: 500,
                          }}>
                            {priceInfo.originalPrice}$
                          </span>
                          <span style={{ 
                            fontSize: '24px', 
                            color: '#4caf50', 
                            fontWeight: 800,
                          }}>
                            {priceInfo.finalPrice}$
                          </span>
                        </div>
                        <div style={{
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'inline-block',
                        }}>
                          {priceInfo.appliedDiscount.discountType === 'percentage' 
                            ? `خصم ${priceInfo.appliedDiscount.discountValue}%`
                            : `خصم ${priceInfo.appliedDiscount.discountValue}$`}
                        </div>
                      </div>
                    ) : (
                      <div style={{ 
                        fontSize: '24px', 
                        color: 'rgba(255, 255, 255, 0.95)', 
                        fontWeight: 800,
                      }}>
                        {priceInfo.originalPrice}$
                      </div>
                    )}
                  </div>

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
                        color: 'rgba(255, 255, 255, 0.9)',
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
                            color: '#f6ebb3',
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
                            color: '#f6ebb3',
                          }}>
                            +{worker.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                    {/* Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                      <button
                        onClick={() => handleBookWorker(worker._id || worker.id)}
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
                          position: 'relative',
                          zIndex: 10,
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
                        احجز الآن
                      </button>
                      <button
                        onClick={() => handleViewDetails(worker._id || worker.id)}
                        style={{
                          width: '100%',
                          padding: '12px 24px',
                          fontSize: '14px',
                          fontWeight: 600,
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#000000',
                          border: '2px solid rgba(37, 150, 190, 0.4)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          position: 'relative',
                          zIndex: 10,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(37, 150, 190, 0.15)';
                          e.target.style.borderColor = 'rgba(37, 150, 190, 1)';
                          e.target.style.color = '#000000';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                          e.target.style.borderColor = 'rgba(37, 150, 190, 0.4)';
                          e.target.style.color = '#000000';
                        }}
                      >
                        المزيد من التفاصيل
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Info Section */}
      <section style={{
        padding: '80px 40px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 700,
            marginBottom: '30px',
            color: 'rgba(37, 150, 190, 1)',
          }}>
            كيف تعمل خدمة العاملات؟
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
          }}>
            {[
              { icon: '📅', title: 'اختر الموعد', desc: 'اختر التاريخ والوقت المناسب لك' },
              { icon: '👷‍♀', title: 'اختر العاملة', desc: 'اختر العاملة المناسبة من قائمتنا' },
              { icon: '✅', title: 'تأكيد الحجز', desc: 'سيتم تأكيد الحجز وإرسال التفاصيل' },
              { icon: '🏠', title: 'الخدمة', desc: 'تأتي العاملة في الموعد المحدد' },
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

      <Footer />
    </div>
  );
};

export default Workers;

