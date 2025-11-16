import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchHousemaids } from '../store/slices/housemaidsSlice';
import { fetchWorkers } from '../store/slices/workersSlice';
import { discountsAPI, ordersAPI } from '../services/api';
import { inquirySchema } from '../schemas/validationSchemas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import FloatingShapes from '../components/FloatingShapes';
import Modal from '../components/Modal';
import '../styles/globals.css';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const Assistants = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { housemaids, loading: housemaidsLoading, error: housemaidsError } = useSelector((state) => state.housemaids);
  const { workers, loading: workersLoading } = useSelector((state) => state.workers);
  const [activeDiscounts, setActiveDiscounts] = useState([]);
  const [activeTab, setActiveTab] = useState('assistants'); // 'assistants' or 'workers'
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [selectedHousemaidId, setSelectedHousemaidId] = useState(null);
  const [inquiryType, setInquiryType] = useState('general'); // 'contract', 'booking', 'general'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Build countries dynamically from data nationalities; optional emoji map
  const nationalityToEmoji = {
    'إثيوبيا': '🇪🇹', Ethiopia: '🇪🇹',
    'أوغندا': '🇺🇬', Uganda: '🇺🇬',
    'كينيا': '🇰🇪', Kenya: '🇰🇪',
    'غانا': '🇬🇭', Ghana: '🇬🇭',
    'تنزانيا': '🇹🇿', Tanzania: '🇹🇿',
    'بوروندي': '🇧🇮', Burundi: '🇧🇮',
    'رواندا': '🇷🇼', Rwanda: '🇷🇼',
    'ميانمار': '🇲🇲', Myanmar: '🇲🇲',
    'الفلبين': '🇵🇭', Philippines: '🇵🇭',
  };

  const buildCountriesFromData = () => {
    const names = new Set();
    assistants.forEach(a => a.nationality && names.add(String(a.nationality).trim()));
    activeWorkers.forEach(w => w.nationality && names.add(String(w.nationality).trim()));
    const items = Array.from(names).map(n => ({ key: n.toLowerCase(), label: n, emoji: nationalityToEmoji[n] || '🌍' }));
    return items;
  };

  const countries = buildCountriesFromData();

  // Helper: filter by selectedCountry using nationality
  const nationalityMatches = (nation, selectedKey) => {
    if (!nation) return false;
    if (selectedKey === 'all') return true;
    return String(nation).toLowerCase().includes(String(selectedKey).toLowerCase());
  };

  // Filter assistants by country selection
  const assistantsFiltered = selectedCountry === 'all'
    ? assistants
    : assistants.filter(a => nationalityMatches(a.nationality, selectedCountry));

  // Date options helper (اليوم/غداً/بعد غد/موعد لاحق بتاريخ)
  const buildDateOptions = () => {
    const today = new Date();
    const next = (d) => {
      const x = new Date(today);
      x.setDate(x.getDate() + d);
      return x;
    };
    const fmt = (d) => d.toLocaleDateString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return [
      { label: 'اليوم', sub: fmt(today) },
      { label: 'غداً', sub: fmt(next(1)) },
      { label: 'بعد غد', sub: fmt(next(2)) },
      { label: 'موعد لاحق', sub: fmt(next(7)) },
    ];
  };

  const dateOptions = buildDateOptions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      inquiryType: 'general',
    },
  });

  useEffect(() => {
    console.log('🔄 Dispatching fetchHousemaids...');
    dispatch(fetchHousemaids()).then((result) => {
      console.log('📊 Fetch result:', result);
      if (result.type === 'housemaids/fetchHousemaids/fulfilled') {
        console.log('✅ Housemaids fetched successfully:', result.payload);
      } else if (result.type === 'housemaids/fetchHousemaids/rejected') {
        console.error('❌ Failed to fetch housemaids:', result.payload);
      }
    });
    dispatch(fetchWorkers());
  }, [dispatch]);

  // Fetch active discounts for both assistants and workers
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const [assistantsResponse, workersResponse] = await Promise.all([
          discountsAPI.getActive('assistants'),
          discountsAPI.getActive('workers'),
        ]);
        const allDiscounts = [
          ...(assistantsResponse.success ? assistantsResponse.data || [] : []),
          ...(workersResponse.success ? workersResponse.data || [] : []),
        ];
        setActiveDiscounts(allDiscounts);
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

  const getContractTypeLabel = (contractType) => {
    const types = {
      monthly: { label: 'عقد شهري', icon: '📅', color: 'rgba(37, 150, 190, 1)' },
      yearly: { label: 'عقد سنوي', icon: '📆', color: 'rgba(37, 150, 190, 0.9)' },
    };
    return types[contractType] || { label: 'عقد', icon: '📋', color: 'rgba(37, 150, 190, 0.8)' };
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

  const handleOpenInquiryModal = (type = 'general', workerId = null, housemaidId = null) => {
    setInquiryType(type);
    setSelectedWorkerId(workerId);
    setSelectedHousemaidId(housemaidId);
    setValue('inquiryType', type);
    if (workerId) setValue('workerId', workerId);
    if (housemaidId) setValue('housemaidId', housemaidId);
    setShowInquiryModal(true);
  };

  const handleCloseInquiryModal = () => {
    setShowInquiryModal(false);
    setSelectedWorkerId(null);
    setSelectedHousemaidId(null);
    setInquiryType('general');
    reset();
  };

  const onSubmitInquiry = async (data) => {
    setIsSubmitting(true);
    try {
      const inquiryData = {
        ...data,
        workerId: selectedWorkerId,
        housemaidId: selectedHousemaidId,
        inquiryType: inquiryType,
      };

      const result = await ordersAPI.createInquiry(inquiryData);
      
      if (result.success) {
        alert('تم إرسال الاستفسار بنجاح! سنتواصل معك قريباً.');
        handleCloseInquiryModal();
      } else {
        alert(result.message || 'حدث خطأ أثناء إرسال الاستفسار');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('حدث خطأ أثناء إرسال الاستفسار');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate price with discount
  const calculatePriceWithDiscount = (basePrice, discounts) => {
    if (!discounts || discounts.length === 0) {
      return { originalPrice: basePrice, finalPrice: basePrice, discountAmount: 0, appliedDiscount: null };
    }

    // Apply the first active discount (you can modify this logic to apply the best discount)
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

  const handleViewDetails = (workerId) => {
    navigate(`/worker/${workerId}`);
  };

  const handleContactForContract = () => {
    navigate('/contact');
  };

  // All housemaids are assistants (monthly/yearly contracts)
  const assistants = housemaids.filter(housemaid => 
    housemaid.isActive !== false && 
    housemaid.status !== 'inactive'
  );

  // Filter workers (hourly/daily contracts)
  const activeWorkers = workers.filter(worker => 
    worker.isActive !== false && 
    worker.status !== 'inactive' &&
    (worker.contractType === 'hourly' || worker.contractType === 'daily')
  );
  
  console.log('📋 Total housemaids from store:', housemaids.length);
  console.log('✅ Filtered assistants:', assistants.length);
  console.log('📋 Total workers from store:', workers.length);
  console.log('✅ Filtered workers:', activeWorkers.length);

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

      {/* Active Discounts Banner */}
      {activeDiscounts.length > 0 && (
        <section style={{
          padding: '20px',
          paddingTop: '100px', // Add space below fixed navbar
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)',
          borderBottom: '2px solid #f59e0b',
          marginTop: '0',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}>
            {activeDiscounts.map((discount) => {
              const discountText = discount.discountType === 'percentage' 
                ? `خصم ${discount.discountValue}%` 
                : `خصم ${discount.discountValue}$`;
              return (
                <div
                  key={discount._id || discount.id}
                  style={{
                    background: '#ffffff',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '2px solid #f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '15px',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                    <div style={{
                      fontSize: '36px',
                      fontWeight: 900,
                      color: '#f59e0b',
                      background: '#fef3c7',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: '2px solid #f59e0b',
                    }}>
                      🎁
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginBottom: '5px',
                      }}>
                        {discount.title}
                      </h3>
                      {discount.description && (
                        <p style={{
                          fontSize: '14px',
                          color: '#64748b',
                          margin: 0,
                        }}>
                          {discount.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: 900,
                      color: '#dc2626',
                      textAlign: 'center',
                    }}>
                      {discountText}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      textAlign: 'center',
                    }}>
                      <div>من {new Date(discount.startDate).toLocaleDateString('ar-SA', { calendar: 'gregory' })}</div>
                      <div>إلى {new Date(discount.endDate).toLocaleDateString('ar-SA', { calendar: 'gregory' })}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

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
        {/* FloatingShapes removed */}
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
            الاستقدام
          </h1>
          <p style={{ 
            fontSize: 'clamp(18px, 2.5vw, 24px)', 
            color: '#475569', 
            lineHeight: '1.8',
            fontWeight: 500,
            marginBottom: '40px',
          }}>
            اختر من بين مساعداتنا بعقد أو عاملاتنا للوقت المحدد
          </p>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setActiveTab('assistants')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                fontWeight: 700,
                background: activeTab === 'assistants'
                  ? '#f3f4f6'
                  : '#ffffff',
                color: '#0f172a',
                border: `3px solid ${activeTab === 'assistants' ? '#e5e7eb' : '#e5e7eb'}`,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              📅 المساعدات (بعقد)
            </button>
            <button
              onClick={() => setActiveTab('workers')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                fontWeight: 700,
                background: activeTab === 'workers'
                  ? '#f3f4f6'
                  : '#ffffff',
                color: '#0f172a',
                border: `3px solid ${activeTab === 'workers' ? '#e5e7eb' : '#e5e7eb'}`,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              ⏰ العاملات (وقت محدد)
            </button>
          </div>
        </div>
      </section>

      {/* Countries Flags Selector */}
      <section style={{ padding: '20px', paddingTop: activeDiscounts.length > 0 ? '20px' : '100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textAlign: 'center' }}>
            اختر الدولة
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
            gap: '14px',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <button
              onClick={() => setSelectedCountry('all')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '14px 10px', borderRadius: '16px', cursor: 'pointer',
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: '#f8fafc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', color: '#0f172a', border: '1px solid #e5e7eb'
              }}>🌍</div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>الكل</span>
            </button>
            {countries.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCountry(c.key)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', padding: '14px 10px', borderRadius: '16px', cursor: 'pointer',
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden',
                  background: '#f8fafc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', border: '1px solid #e5e7eb'
                }}>
                  <span>{c.emoji}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid - Shows based on active tab */}
      <section style={{
        padding: '40px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
        background: '#ffffff',
      }}>
        {/* Assistants Tab Content */}
        {activeTab === 'assistants' && (
          <>
            {housemaidsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '24px', color: '#334155', fontWeight: 600 }}>جاري التحميل...</div>
              </div>
            ) : housemaidsError ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '24px', color: '#dc2626', marginBottom: '20px', fontWeight: 600 }}>
                  ❌ خطأ في تحميل البيانات: {housemaidsError}
                </div>
                <button
                  onClick={() => dispatch(fetchHousemaids())}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, rgba(37, 150, 190, 0.6) 0%, rgba(37, 150, 190, 0.8) 50%, rgba(37, 150, 190, 1) 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : assistantsFiltered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '24px', color: '#334155', marginBottom: '20px', fontWeight: 600 }}>
                  لا توجد مساعدات متاحة حالياً
                </div>
                {housemaids.length > 0 && (
                  <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '20px' }}>
                    تم العثور على {housemaids.length} مساعدة لكنها غير نشطة
                  </div>
                )}
                <GlassButton 
                  onClick={() => handleOpenInquiryModal('contract')}
                  style={{ cursor: 'pointer' }}
                >
                  تواصل معنا للاستفسار
                </GlassButton>
              </div>
            ) : (
          <div className="cards-grid-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px',
            justifyContent: 'center',
          }}>
            {assistantsFiltered.map((assistant, index) => {
              const status = getStatusBadge(assistant.status);
              const contractInfo = getContractTypeLabel(assistant.contractType);
              const assistantName = assistant.arabicName || assistant.name || 'مساعدة';
              const assistantPhotos = assistant.photos && assistant.photos.length > 0 
                ? assistant.photos 
                : [];
              
              // Get price from assistant data or use default based on contract type
              const basePrice = assistant.price || (assistant.contractType === 'yearly' ? 5000 : 500);
              const priceInfo = calculatePriceWithDiscount(basePrice, activeDiscounts);
              
              return (
                <div
                  key={assistant._id || assistant.id}
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
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 150, 190, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {/* Assistant Images Carousel */}
                  <div style={{
                    width: '100%',
                    height: '280px',
                    marginBottom: '0',
                    overflow: 'hidden',
                    position: 'relative',
                    background: assistantPhotos.length > 0 
                      ? 'transparent' 
                      : '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '60px',
                    color: 'white',
                  }}>
                    {assistantPhotos.length > 0 ? (
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={assistantPhotos.length > 1}
                        pagination={{ 
                          clickable: true,
                          dynamicBullets: true,
                        }}
                        autoplay={{
                          delay: 3000,
                          disableOnInteraction: false,
                        }}
                        loop={assistantPhotos.length > 1}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        {assistantPhotos.map((photo, photoIndex) => (
                          <SwiperSlide key={photoIndex}>
                            <img 
                              src={photo} 
                              alt={`${assistantName} - ${photoIndex + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block',
                                background: 'transparent',
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
                      }}>{assistantName[0]}</span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '20px 30px 30px' }}>

                  {/* Assistant Name */}
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: 700, 
                    marginBottom: '10px',
                    color: '#ffffff',
                  }}>
                    {assistantName}
                  </h3>

                  {/* Assistant Info */}
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    marginBottom: '8px',
                    fontSize: '16px',
                  }}>
                    {assistant.nationality} | {assistant.age} سنة
                  </p>

                  {/* Contract Type */}
                  <div style={{
                    background: `rgba(37, 150, 190, 0.15)`,
                    padding: '8px 16px',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    display: 'inline-block',
                  }}>
                    <span style={{ fontSize: '20px', marginLeft: '8px' }}>{contractInfo.icon}</span>
                    <span style={{ 
                      color: contractInfo.color, 
                      fontWeight: 700,
                      fontSize: '14px',
                    }}>
                      {contractInfo.label}
                    </span>
                  </div>

                  {/* Price with Discount */}
                  <div style={{ marginBottom: '15px' }}>
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
                          background: '#ef4444',
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
                  {assistant.skills && assistant.skills.length > 0 && (
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
                        {assistant.skills.slice(0, 3).map((skill, i) => (
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
                        {assistant.skills.length > 3 && (
                          <span style={{
                            background: 'rgba(37, 150, 190, 0.1)',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: '#f6ebb3',
                          }}>
                            +{assistant.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                    {/* Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                      <button
                        onClick={handleContactForContract}
                        style={{
                          width: '100%',
                          padding: '14px 24px',
                          fontSize: '16px',
                          fontWeight: 600,
                          background: '#ffffff',
                          color: '#0f172a',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          position: 'relative',
                          zIndex: 10,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                        }}
                      >
                        استفسر عن العقد
                      </button>
                      <button
                        onClick={() => handleViewDetails(assistant._id || assistant.id)}
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
          </>
        )}

        {/* Workers Tab Content */}
        {activeTab === 'workers' && (
          <>
            {workersLoading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '24px', color: '#334155', fontWeight: 600 }}>جاري التحميل...</div>
              </div>
            ) : activeWorkers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '24px', color: '#334155', marginBottom: '20px', fontWeight: 600 }}>
                  لا توجد عاملات متاحة حالياً
                </div>
                {workers.length > 0 && (
                  <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '20px' }}>
                    تم العثور على {workers.length} عاملة لكنها غير نشطة
                  </div>
                )}
                <GlassButton 
                  onClick={() => handleOpenInquiryModal('booking')}
                  style={{ cursor: 'pointer' }}
                >
                  تواصل معنا للاستفسار
                </GlassButton>
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
                  const priceInfo = calculatePriceWithDiscount(basePrice, activeDiscounts.filter(d => d.targetType === 'workers' || d.targetType === 'all'));
                  
                  return (
                    <GlassCard
                      key={worker._id || worker.id}
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
                                    objectFit: 'cover',
                                    display: 'block',
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
                        color: '#0f172a',
                      }}>
                        {workerName}
                      </h3>

                      {/* Worker Info */}
                      <p style={{ 
                        color: '#64748b', 
                        marginBottom: '8px',
                        fontSize: '16px',
                      }}>
                        {worker.nationality} | {worker.age} سنة
                      </p>

                      {/* Contract Type */}
                      <p style={{ 
                        color: '#3b82f6', 
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
                                color: '#94a3b8', 
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
                            color: '#0f172a', 
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
                            color: '#334155',
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
                                color: '#0f172a',
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
                                color: '#334155',
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
                            onClick={() => handleViewDetails(worker._id || worker.id)}
                            style={{
                              width: '100%',
                              padding: '14px 24px',
                              fontSize: '16px',
                              fontWeight: 600,
                              background: '#ffffff',
                              color: '#0f172a',
                              border: '1px solid #e5e7eb',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                              transition: 'all 0.3s',
                              position: 'relative',
                              zIndex: 10,
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                            }}
                          >
                            المزيد من التفاصيل
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </>
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
            مزايا المساعدات بعقد
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
          }}>
            {[
              { icon: '📅', title: 'عقد شهري/سنوي', desc: 'خدمة مستمرة بعقد شهري أو سنوي' },
              { icon: '✅', title: 'موثوقية', desc: 'مساعدات محترفات ومدربات' },
              { icon: '🏠', title: 'خدمة مستمرة', desc: 'خدمة يومية مستمرة في منزلك' },
              { icon: '💰', title: 'أسعار تنافسية', desc: 'أسعار مناسبة للعقود' },
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
            تريد مساعدة بعقد؟
          </h2>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '40px', 
            lineHeight: '1.8' 
          }}>
            تواصل معنا للاستفسار عن العقود الشهرية والسنوية
          </p>
          <button 
            onClick={() => handleOpenInquiryModal('contract')}
            style={{ 
              fontSize: '18px', 
              padding: '15px 40px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              color: '#0f172a',
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
            تواصل معنا
          </button>
        </div>
      </section>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <Modal
          isOpen={showInquiryModal}
          onClose={handleCloseInquiryModal}
          title="استفسار عن الخدمة"
        >
          <form onSubmit={handleSubmit(onSubmitInquiry)}>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0f172a', fontWeight: 600 }}>
                  الاسم الكامل *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', padding: '12px' }}
                  placeholder="أدخل اسمك الكامل"
                />
                {errors.name && (
                  <p style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0f172a', fontWeight: 600 }}>
                  رقم الهاتف *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="glass-input"
                  style={{ width: '100%', padding: '12px' }}
                  placeholder="أدخل رقم هاتفك"
                />
                {errors.phone && (
                  <p style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0f172a', fontWeight: 600 }}>
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="glass-input"
                  style={{ width: '100%', padding: '12px' }}
                  placeholder="أدخل بريدك الإلكتروني"
                />
                {errors.email && (
                  <p style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0f172a', fontWeight: 600 }}>
                  العنوان (اختياري)
                </label>
                <input
                  {...register('address')}
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', padding: '12px' }}
                  placeholder="أدخل عنوانك"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0f172a', fontWeight: 600 }}>
                  نوع الاستفسار *
                </label>
                <select
                  {...register('inquiryType')}
                  className="glass-input"
                  style={{ width: '100%', padding: '12px' }}
                  value={inquiryType}
                  onChange={(e) => {
                    setInquiryType(e.target.value);
                    setValue('inquiryType', e.target.value);
                  }}
                >
                  <option value="contract">استفسار عن عقد</option>
                  <option value="booking">استفسار عن حجز</option>
                  <option value="general">استفسار عام</option>
                </select>
                {errors.inquiryType && (
                  <p style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>
                    {errors.inquiryType.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0f172a', fontWeight: 600 }}>
                  ملاحظات (اختياري)
                </label>
                <textarea
                  {...register('notes')}
                  className="glass-input"
                  style={{ width: '100%', padding: '12px', minHeight: '100px', resize: 'vertical' }}
                  placeholder="اكتب استفسارك هنا..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleCloseInquiryModal}
                  style={{
                    padding: '12px 24px',
                    background: '#f1f5f9',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    background: isSubmitting ? '#94a3b8' : '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الاستفسار'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      <Footer />
    </div>
  );
};

export default Assistants;

