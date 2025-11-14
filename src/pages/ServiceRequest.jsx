import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkers } from '../store/slices/workersSlice';
import { fetchHousemaids } from '../store/slices/housemaidsSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import Modal from '../components/Modal';
import Map from '../components/Map';
import { serviceRequestSchema } from '../schemas/validationSchemas';
import { createOrder } from '../store/slices/ordersSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/globals.css';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const ServiceRequest = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedHousemaid, setSelectedHousemaid] = useState(null);
  const [serviceCategory, setServiceCategory] = useState(null); // 'worker' or 'housemaid'
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workers: workersList } = useSelector((state) => state.workers);
  const { housemaids: housemaidsList } = useSelector((state) => state.housemaids);

  // Get worker ID from URL
  useEffect(() => {
    const workerId = searchParams.get('worker');
    if (workerId) {
      dispatch(fetchWorkers());
    }
  }, [searchParams, dispatch]);

  // Find selected worker
  useEffect(() => {
    const workerId = searchParams.get('worker');
    if (workerId && workersList.length > 0) {
      const worker = workersList.find(w => (w._id || w.id) === workerId);
      if (worker) {
        setSelectedWorker(worker);
      }
    }
  }, [searchParams, workersList]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    getValues,
  } = useForm({
    resolver: zodResolver(serviceRequestSchema),
    mode: 'onChange',
  });

  const serviceType = watch('serviceType');
  const rooms = watch('rooms') || 1;
  const workers = watch('workers') || 1;
  const [mapPosition, setMapPosition] = useState([24.7136, 46.6753]); // Default: Riyadh

  const onSubmit = async (data) => {
    try {
      // Prepare order data for API
      const orderData = {
        ...data,
        date: data.date instanceof Date ? data.date.toISOString() : data.date,
        amount: calculateAmount(data.serviceType, data.rooms, data.workers),
        selectedWorkerId: selectedWorker ? (selectedWorker._id || selectedWorker.id) : null,
        selectedHousemaidId: selectedHousemaid ? (selectedHousemaid._id || selectedHousemaid.id) : null,
        serviceCategory: serviceCategory, // 'worker' or 'housemaid'
        selectedCountry: selectedCountry,
      };

      const result = await dispatch(createOrder(orderData));
      
      if (createOrder.fulfilled.match(result)) {
        setOrderNumber(result.payload.orderNumber || result.payload._id);
        setShowSuccessModal(true);
      } else {
        alert(result.payload || 'حدث خطأ أثناء إرسال الطلب');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('حدث خطأ أثناء إرسال الطلب');
    }
  };

  // Calculate order amount based on service type, rooms, and workers
  const calculateAmount = (serviceType, rooms, workers) => {
    const basePrices = {
      comprehensive: 500,
      normal: 300,
      quick: 200,
      deep: 400,
    };
    const basePrice = basePrices[serviceType] || 300;
    const roomMultiplier = rooms * 50;
    const workerMultiplier = workers * 100;
    return basePrice + roomMultiplier + workerMultiplier;
  };

  // Fetch workers and housemaids on mount
  useEffect(() => {
    dispatch(fetchWorkers());
    dispatch(fetchHousemaids());
  }, [dispatch]);

  const nextStep = async () => {
    let isValid = false;
    let fieldsToValidate = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'phone'];
      isValid = await trigger(fieldsToValidate);
    } else if (currentStep === 2) {
      // Service category selection - no validation needed, just check if selected
      isValid = serviceCategory !== null;
      if (!isValid) {
        alert('يرجى اختيار نوع الخدمة');
      }
    } else if (currentStep === 3) {
      // Worker/Housemaid selection - check if country and person selected
      isValid = selectedCountry !== null && (selectedWorker !== null || selectedHousemaid !== null);
      if (!isValid) {
        alert('يرجى اختيار البلد والعامل/المساعدة');
      }
    } else if (currentStep === 4) {
      fieldsToValidate = ['serviceType', 'rooms', 'workers', 'date', 'time'];
      isValid = await trigger(fieldsToValidate);
    } else if (currentStep === 5) {
      fieldsToValidate = ['address', 'city', 'district'];
      isValid = await trigger(fieldsToValidate);
    } else if (currentStep === 6) {
      fieldsToValidate = ['agreeToTerms'];
      isValid = await trigger(fieldsToValidate);
    }

    // Log validation errors for debugging
    if (!isValid) {
      const fieldErrors = fieldsToValidate.filter(field => errors[field]);
      console.log('Validation errors:', fieldErrors.map(field => ({ field, error: errors[field]?.message })));
      console.log('Current form values:', getValues());
      
      // Show alert with first error message
      if (fieldErrors.length > 0) {
        const firstError = errors[fieldErrors[0]];
        if (firstError?.message) {
          alert(`يرجى إصلاح الخطأ التالي:\n${firstError.message}`);
        } else {
          alert('يرجى ملء جميع الحقول المطلوبة');
        }
      } else {
        alert('يرجى ملء جميع الحقول المطلوبة');
      }
      
      // Scroll to first error
      if (fieldErrors.length > 0) {
        const firstErrorField = document.querySelector(`[name="${fieldErrors[0]}"]`);
        if (firstErrorField) {
          setTimeout(() => {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorField.focus();
          }, 100);
        }
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'المعلومات الشخصية' },
    { number: 2, title: 'نوع الخدمة' },
    { number: 3, title: 'اختيار العامل/المساعدة' },
    { number: 4, title: 'تفاصيل الخدمة' },
    { number: 5, title: 'العنوان' },
    { number: 6, title: 'التأكيد' },
  ];

  // Generate stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)' }}>
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
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 20px 40px', position: 'relative', zIndex: 1 }}>
        <GlassCard style={{
          padding: '40px',
          borderRadius: '24px',
        }}>
          {/* Progress Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '40px',
            position: 'relative',
          }}>
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                  <div
                    className="glass-card"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '20px',
                      background: currentStep > step.number
                        ? 'linear-gradient(135deg, #10B981 0%, #3b82f6 50%, #0a2851 100%)'
                        : currentStep === step.number
                        ? 'linear-gradient(135deg, #0a2851 0%, #0a2851 50%, #0a2851 100%)'
                        : '#bfdbfe',
                      color: currentStep >= step.number ? 'white' : '#1e293b',
                      zIndex: 2,
                    }}
                  >
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <p style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    textAlign: 'center',
                    color: currentStep >= step.number ? '#0f172a' : '#1e293b',
                    fontWeight: currentStep === step.number ? 700 : 400,
                  }}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '30px',
                      right: `${(index + 1) * 25}%`,
                      width: '25%',
                      height: '2px',
                      background: currentStep > step.number
                        ? 'linear-gradient(90deg, #10B981 0%, #3b82f6 50%, #0a2851 100%)'
                        : '#bfdbfe',
                      zIndex: 1,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Selected Worker Info */}
            {selectedWorker && (
              <GlassCard style={{ 
                padding: '20px', 
                marginBottom: '30px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0a2851 0%, #0a2851 50%, #0a2851 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: 'white',
                  }}>
                    {(selectedWorker.arabicName || selectedWorker.name || 'ع')[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '5px', color: '#0f172a' }}>
                      {selectedWorker.arabicName || selectedWorker.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                      {selectedWorker.contractType === 'hourly' ? '⏰ بالساعة' : 
                       selectedWorker.contractType === 'daily' ? '📅 باليوم' :
                       selectedWorker.contractType === 'monthly' ? '📅 عقد شهري' :
                       selectedWorker.contractType === 'yearly' ? '📆 عقد سنوي' : 'عاملة'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWorker(null);
                      navigate('/service-request');
                    }}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(244, 67, 54, 0.1)',
                      border: '1px solid rgba(244, 67, 54, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#f44336',
                      fontWeight: 600,
                    }}
                  >
                    تغيير
                  </button>
                </div>
              </GlassCard>
            )}

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '30px', textAlign: 'center', color: '#0f172a' }}>
                  من أنت؟
                </h2>
                <div className="glass-input-group">
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="الاسم الكامل"
                    {...register('fullName')}
                  />
                  <span className="icon">👤</span>
                  {errors.fullName && (
                    <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="glass-input-group">
                  <input
                    type="tel"
                    className="glass-input"
                    placeholder="رقم الهاتف"
                    {...register('phone')}
                  />
                  <span className="icon">📞</span>
                  {errors.phone && (
                    <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="glass-input-group">
                  <input
                    type="email"
                    className="glass-input"
                    placeholder="البريد الإلكتروني (اختياري)"
                    {...register('email')}
                  />
                  <span className="icon">📧</span>
                  {errors.email && (
                    <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Service Category Selection */}
            {currentStep === 2 && (
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '30px', textAlign: 'center', color: '#0f172a' }}>
                  ما نوع الخدمة التي تحتاجها؟
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
                  <GlassCard
                    onClick={() => {
                      setServiceCategory('worker');
                      setSelectedHousemaid(null);
                    }}
                    style={{
                      padding: '30px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: serviceCategory === 'worker' ? '3px solid #0a2851' : '2px solid #bfdbfe',
                      background: serviceCategory === 'worker' ? 'rgba(10, 40, 81, 0.1)' : 'transparent',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (serviceCategory !== 'worker') {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 150, 190, 0.25)';
                        e.currentTarget.style.border = '2px solid #3b82f6';
                        e.currentTarget.style.background = 'rgba(37, 150, 190, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (serviceCategory !== 'worker') {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.border = '2px solid #bfdbfe';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>👷‍♀️</div>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: '#0f172a' }}>عاملة</h3>
                    <p style={{ fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
                      للخدمات اليومية أو الأسبوعية<br />
                      (مرة أو مرتين في الشهر)
                    </p>
                  </GlassCard>
                  
                  <GlassCard
                    onClick={() => {
                      setServiceCategory('housemaid');
                      setSelectedWorker(null);
                    }}
                    style={{
                      padding: '30px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: serviceCategory === 'housemaid' ? '3px solid #0a2851' : '2px solid #bfdbfe',
                      background: serviceCategory === 'housemaid' ? 'rgba(10, 40, 81, 0.1)' : 'transparent',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (serviceCategory !== 'housemaid') {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 150, 190, 0.25)';
                        e.currentTarget.style.border = '2px solid #3b82f6';
                        e.currentTarget.style.background = 'rgba(37, 150, 190, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (serviceCategory !== 'housemaid') {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.border = '2px solid #bfdbfe';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>👔</div>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: '#0f172a' }}>مساعدة</h3>
                    <p style={{ fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
                      للخدمات الشهرية أو السنوية<br />
                      (بعقد شهري أو سنوي)
                    </p>
                  </GlassCard>
                </div>
              </div>
            )}

            {/* Step 3: Country and Worker/Housemaid Selection */}
            {currentStep === 3 && (
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '30px', textAlign: 'center', color: '#0f172a' }}>
                  اختر البلد والعامل/المساعدة
                </h2>
                
                {/* Country Selection */}
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>
                    اختر البلد
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                    {['فلبينية', 'إندونيسية', 'سريلانكية', 'هندية', 'باكستانية', 'إثيوبية', 'سودانية', 'مصرية'].map((country) => {
                      const availableWorkers = serviceCategory === 'worker' 
                        ? workersList.filter(w => w.nationality === country && w.isActive !== false && w.status !== 'inactive')
                        : [];
                      const availableHousemaids = serviceCategory === 'housemaid'
                        ? housemaidsList.filter(h => h.nationality === country && h.isActive !== false && h.status !== 'inactive')
                        : [];
                      const hasAvailable = availableWorkers.length > 0 || availableHousemaids.length > 0;
                      
                      return (
                        <GlassCard
                          key={country}
                          onClick={() => {
                            if (hasAvailable) {
                              setSelectedCountry(country);
                              setSelectedWorker(null);
                              setSelectedHousemaid(null);
                            }
                          }}
                          style={{
                            padding: '20px',
                            textAlign: 'center',
                            cursor: hasAvailable ? 'pointer' : 'not-allowed',
                            border: selectedCountry === country ? '3px solid #0a2851' : '2px solid #bfdbfe',
                            background: selectedCountry === country 
                              ? 'rgba(10, 40, 81, 0.1)' 
                              : hasAvailable 
                                ? 'transparent' 
                                : '#f0f9ff',
                            opacity: hasAvailable ? 1 : 0.5,
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (hasAvailable && selectedCountry !== country) {
                              e.currentTarget.style.transform = 'translateY(-4px)';
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 150, 190, 0.2)';
                              e.currentTarget.style.border = '2px solid #3b82f6';
                              e.currentTarget.style.background = 'rgba(37, 150, 190, 0.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (hasAvailable && selectedCountry !== country) {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '';
                              e.currentTarget.style.border = '2px solid #bfdbfe';
                              e.currentTarget.style.background = hasAvailable ? 'transparent' : '#f0f9ff';
                            }
                          }}
                        >
                          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌍</div>
                          <p style={{ fontWeight: 700, marginBottom: '5px', color: '#0f172a' }}>{country}</p>
                          <p style={{ fontSize: '12px', color: '#1e293b' }}>
                            {serviceCategory === 'worker' 
                              ? `${availableWorkers.length} عاملة متاحة`
                              : `${availableHousemaids.length} مساعدة متاحة`}
                          </p>
                        </GlassCard>
                      );
                    })}
                  </div>
                </div>

                {/* Worker/Housemaid Selection */}
                {selectedCountry && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>
                      اختر {serviceCategory === 'worker' ? 'العاملة' : 'المساعدة'}
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                      gap: '20px',
                      maxHeight: '500px',
                      overflowY: 'auto',
                      padding: '10px',
                    }}>
                      {serviceCategory === 'worker' 
                        ? workersList
                            .filter(w => w.nationality === selectedCountry && w.isActive !== false && w.status !== 'inactive')
                            .map((worker) => (
                              <GlassCard
                                key={worker._id || worker.id}
                                onClick={() => {
                                  setSelectedWorker(worker);
                                  setSelectedHousemaid(null);
                                }}
                                style={{
                                  padding: '20px',
                                  cursor: 'pointer',
                                  border: selectedWorker?._id === worker._id || selectedWorker?.id === worker.id
                                    ? '3px solid #0a2851'
                                    : '2px solid #bfdbfe',
                                  background: selectedWorker?._id === worker._id || selectedWorker?.id === worker.id
                                    ? 'rgba(10, 40, 81, 0.1)'
                                    : 'transparent',
                                  transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                  const isSelected = selectedWorker?._id === worker._id || selectedWorker?.id === worker.id;
                                  if (!isSelected) {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(37, 150, 190, 0.25)';
                                    e.currentTarget.style.border = '2px solid #3b82f6';
                                    e.currentTarget.style.background = 'rgba(37, 150, 190, 0.05)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  const isSelected = selectedWorker?._id === worker._id || selectedWorker?.id === worker.id;
                                  if (!isSelected) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                    e.currentTarget.style.border = '2px solid #bfdbfe';
                                    e.currentTarget.style.background = 'transparent';
                                  }
                                }}
                              >
                                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>👷‍♀️</div>
                                  <h4 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '5px', color: '#0f172a' }}>
                                    {worker.arabicName}
                                  </h4>
                                  <p style={{ fontSize: '14px', color: '#1e293b' }}>{worker.nationality}</p>
                                </div>
                                <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#0f172a' }}>
                                  <p><strong>العمر:</strong> {worker.age} سنة</p>
                                  <p><strong>الخبرة:</strong> {worker.experience || 0} سنوات</p>
                                  {worker.skills && worker.skills.length > 0 && (
                                    <p><strong>المهارات:</strong> {worker.skills.slice(0, 2).join(', ')}</p>
                                  )}
                                </div>
                              </GlassCard>
                            ))
                        : housemaidsList
                            .filter(h => h.nationality === selectedCountry && h.isActive !== false && h.status !== 'inactive')
                            .map((housemaid) => (
                              <GlassCard
                                key={housemaid._id || housemaid.id}
                                onClick={() => {
                                  setSelectedHousemaid(housemaid);
                                  setSelectedWorker(null);
                                }}
                                style={{
                                  padding: '20px',
                                  cursor: 'pointer',
                                  border: selectedHousemaid?._id === housemaid._id || selectedHousemaid?.id === housemaid.id
                                    ? '3px solid #0a2851'
                                    : '2px solid #bfdbfe',
                                  background: selectedHousemaid?._id === housemaid._id || selectedHousemaid?.id === housemaid.id
                                    ? 'rgba(10, 40, 81, 0.1)'
                                    : 'transparent',
                                  transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                  const isSelected = selectedHousemaid?._id === housemaid._id || selectedHousemaid?.id === housemaid.id;
                                  if (!isSelected) {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(37, 150, 190, 0.25)';
                                    e.currentTarget.style.border = '2px solid #3b82f6';
                                    e.currentTarget.style.background = 'rgba(37, 150, 190, 0.05)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  const isSelected = selectedHousemaid?._id === housemaid._id || selectedHousemaid?.id === housemaid.id;
                                  if (!isSelected) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                    e.currentTarget.style.border = '2px solid #bfdbfe';
                                    e.currentTarget.style.background = 'transparent';
                                  }
                                }}
                              >
                                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>👔</div>
                                  <h4 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '5px', color: '#0f172a' }}>
                                    {housemaid.arabicName}
                                  </h4>
                                  <p style={{ fontSize: '14px', color: '#1e293b' }}>{housemaid.nationality}</p>
                                </div>
                                <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#0f172a' }}>
                                  <p><strong>العمر:</strong> {housemaid.age} سنة</p>
                                  <p><strong>الخبرة:</strong> {housemaid.experience || 0} سنوات</p>
                                  <p><strong>نوع العقد:</strong> {housemaid.contractType === 'monthly' ? 'شهري' : 'سنوي'}</p>
                                  {housemaid.skills && housemaid.skills.length > 0 && (
                                    <p><strong>المهارات:</strong> {housemaid.skills.slice(0, 2).join(', ')}</p>
                                  )}
                                </div>
                              </GlassCard>
                            ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Service Details */}
            {currentStep === 4 && (
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '30px', textAlign: 'center', color: '#0f172a' }}>
                  ماذا تحتاج؟
                </h2>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700, color: '#0f172a' }}>
                    نوع الخدمة
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    {[
                      { value: 'comprehensive', label: 'تنظيف شامل', icon: '🏠' },
                      { value: 'normal', label: 'عادي', icon: '🧹' },
                      { value: 'quick', label: 'سريع', icon: '⚡' },
                    ].map((type) => (
                      <GlassCard
                        key={type.value}
                        onClick={() => setValue('serviceType', type.value)}
                        style={{
                          padding: '20px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: serviceType === type.value ? '2px solid #0a2851' : '1.5px solid #bfdbfe',
                          background: serviceType === type.value ? 'rgba(10, 40, 81, 0.1)' : 'transparent',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (serviceType !== type.value) {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 150, 190, 0.2)';
                            e.currentTarget.style.border = '1.5px solid #3b82f6';
                            e.currentTarget.style.background = 'rgba(37, 150, 190, 0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (serviceType !== type.value) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '';
                            e.currentTarget.style.border = '1.5px solid #bfdbfe';
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>{type.icon}</div>
                        <p style={{ fontWeight: 700, color: '#0f172a' }}>{type.label}</p>
                      </GlassCard>
                    ))}
                  </div>
                  {errors.serviceType && (
                    <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                      {errors.serviceType.message}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700, color: '#0f172a' }}>
                    عدد الغرف
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <GlassButton
                      type="button"
                      onClick={() => setValue('rooms', Math.max(1, rooms - 1))}
                    >
                      -
                    </GlassButton>
                    <input
                      type="number"
                      className="glass-input"
                      style={{ width: '100px', textAlign: 'center' }}
                      value={rooms}
                      {...register('rooms', { valueAsNumber: true })}
                      onChange={(e) => setValue('rooms', parseInt(e.target.value) || 1)}
                    />
                    <GlassButton
                      type="button"
                      onClick={() => setValue('rooms', Math.min(20, rooms + 1))}
                    >
                      +
                    </GlassButton>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700, color: '#0f172a' }}>
                    عدد العاملات: {workers}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={workers}
                    {...register('workers', { valueAsNumber: true })}
                    onChange={(e) => setValue('workers', parseInt(e.target.value))}
                    style={{ width: '100%', height: '8px', borderRadius: '5px' }}
                  />
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700, color: '#0f172a' }}>
                    التاريخ
                  </label>
                  <input
                    type="date"
                    className="glass-input"
                    {...register('date', { valueAsDate: true })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.date && (
                    <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700, color: '#0f172a' }}>
                    الوقت
                  </label>
                  <input
                    type="time"
                    className="glass-input"
                    {...register('time')}
                  />
                  {errors.time && (
                    <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                      {errors.time.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Address */}
            {currentStep === 5 && (
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '30px', textAlign: 'center', color: '#0f172a' }}>
                  أين نأتي إليك؟
                </h2>
                <div style={{ marginBottom: '20px' }}>
                  <Map 
                    center={mapPosition}
                    zoom={13}
                    markerPosition={mapPosition}
                    onMarkerClick={(position) => {
                      setMapPosition(position);
                      setValue('latitude', position[0]);
                      setValue('longitude', position[1]);
                    }}
                    height="300px"
                  />
                </div>
                <div className="glass-input-group">
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="العنوان التفصيلي"
                    {...register('address')}
                  />
                  <span className="icon">📍</span>
                  {errors.address && (
                    <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="glass-input-group">
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="رقم الشقة/الفيلا"
                    {...register('apartment')}
                  />
                </div>
                <div className="glass-input-group">
                  <select 
                    className="glass-select" 
                    {...register('city')}
                    onChange={(e) => {
                      const city = e.target.value;
                      const cityCoords = {
                        riyadh: [24.7136, 46.6753],
                        jeddah: [21.4858, 39.1925],
                        dammam: [26.4207, 50.0888],
                        khobar: [26.2794, 50.2080],
                      };
                      if (cityCoords[city]) {
                        setMapPosition(cityCoords[city]);
                        setValue('latitude', cityCoords[city][0]);
                        setValue('longitude', cityCoords[city][1]);
                      }
                    }}
                  >
                    <option value="">اختر المدينة</option>
                    <option value="riyadh">الرياض</option>
                    <option value="jeddah">جدة</option>
                    <option value="dammam">الدمام</option>
                    <option value="khobar">الخبر</option>
                  </select>
                  {errors.city && (
                    <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="glass-input-group">
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="الحي"
                    {...register('district')}
                  />
                  {errors.district && (
                    <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                      {errors.district.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Confirmation */}
            {currentStep === 6 && (
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '30px', textAlign: 'center', color: '#0f172a' }}>
                  ملاحظات إضافية
                </h2>
                <textarea
                  className="glass-textarea"
                  placeholder="أي ملاحظات إضافية..."
                  {...register('notes')}
                />
                <div style={{ margin: '30px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div className="glass-checkbox">
                      <input type="checkbox" {...register('hasPets')} />
                      <span className="checkmark"></span>
                    </div>
                    <span>لدي حيوانات أليفة</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div className="glass-checkbox">
                      <input type="checkbox" {...register('specialCleaning')} />
                      <span className="checkmark"></span>
                    </div>
                    <span>مواد تنظيف خاصة</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div className="glass-checkbox">
                      <input type="checkbox" {...register('spareKey')} />
                      <span className="checkmark"></span>
                    </div>
                    <span>مفتاح احتياطي متاح</span>
                  </label>
                </div>

                <GlassCard style={{ padding: '30px', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#0f172a' }}>ملخص الطلب</h3>
                  <div style={{ lineHeight: '2', color: '#0f172a' }}>
                    <p><strong>الاسم:</strong> {watch('fullName')}</p>
                    <p><strong>الهاتف:</strong> {watch('phone')}</p>
                    <p><strong>نوع الخدمة المطلوبة:</strong> {serviceCategory === 'worker' ? 'عاملة (مرة أو مرتين في الشهر)' : 'مساعدة (بعقد شهري/سنوي)'}</p>
                    {selectedCountry && <p><strong>البلد المختار:</strong> {selectedCountry}</p>}
                    {selectedWorker && (
                      <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(10, 40, 81, 0.05)', borderRadius: '10px' }}>
                        <p><strong>العاملة المختارة:</strong></p>
                        <p>الاسم: {selectedWorker.arabicName}</p>
                        <p>الجنسية: {selectedWorker.nationality}</p>
                        <p>العمر: {selectedWorker.age} سنة</p>
                        <p>الخبرة: {selectedWorker.experience || 0} سنوات</p>
                      </div>
                    )}
                    {selectedHousemaid && (
                      <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(10, 40, 81, 0.05)', borderRadius: '10px' }}>
                        <p><strong>المساعدة المختارة:</strong></p>
                        <p>الاسم: {selectedHousemaid.arabicName}</p>
                        <p>الجنسية: {selectedHousemaid.nationality}</p>
                        <p>العمر: {selectedHousemaid.age} سنة</p>
                        <p>الخبرة: {selectedHousemaid.experience || 0} سنوات</p>
                        <p>نوع العقد: {selectedHousemaid.contractType === 'monthly' ? 'شهري' : 'سنوي'}</p>
                      </div>
                    )}
                    <p style={{ marginTop: '20px' }}><strong>نوع الخدمة:</strong> {
                      watch('serviceType') === 'comprehensive' ? 'تنظيف شامل' :
                      watch('serviceType') === 'normal' ? 'عادي' : 'سريع'
                    }</p>
                    <p><strong>عدد الغرف:</strong> {rooms}</p>
                    <p><strong>عدد العاملات:</strong> {workers}</p>
                    <p><strong>التاريخ:</strong> {watch('date') ? new Date(watch('date')).toLocaleDateString('ar-SA', { calendar: 'gregory' }) : ''}</p>
                    <p><strong>الوقت:</strong> {watch('time')}</p>
                    <p><strong>العنوان:</strong> {watch('address')}</p>
                    <p><strong>المدينة:</strong> {watch('city')}</p>
                    <p><strong>الحي:</strong> {watch('district')}                    </p>
                  </div>
                </GlassCard>

                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                  <div className="glass-checkbox">
                    <input type="checkbox" {...register('agreeToTerms')} />
                    <span className="checkmark"></span>
                  </div>
                  <span>أوافق على الشروط والأحكام</span>
                </label>
                {errors.agreeToTerms && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.agreeToTerms.message}
                  </p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              {currentStep > 1 && (
                <GlassButton type="button" variant="secondary" onClick={prevStep}>
                  السابق
                </GlassButton>
              )}
              <div style={{ marginLeft: 'auto' }}>
                {currentStep < 6 ? (
                  <GlassButton type="button" onClick={nextStep}>
                    التالي
                  </GlassButton>
                ) : (
                  <GlassButton type="submit">
                    إرسال الطلب
                  </GlassButton>
                )}
              </div>
            </div>
          </form>
        </GlassCard>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={() => {}} size="small">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981 0%, rgba(10, 40, 81, 0.6) 50%, #0a2851 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            fontSize: '60px',
            animation: 'glassPulse 2s ease-in-out infinite',
          }}>
            ✓
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '20px', color: '#0f172a' }}>
            تم استلام طلبك بنجاح!
          </h2>
          <p style={{ fontSize: '18px', color: '#1e293b', marginBottom: '20px', fontWeight: 500 }}>
            رقم الطلب:
          </p>
          <p style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#0a2851',
            marginBottom: '30px',
          }}>
            {orderNumber}
          </p>
          <p style={{ color: '#1e293b', marginBottom: '30px', fontWeight: 500 }}>
            سنتواصل معك قريباً
          </p>
          <GlassButton onClick={() => navigate('/')}>
            العودة للرئيسية
          </GlassButton>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default ServiceRequest;

