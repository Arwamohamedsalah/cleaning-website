import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import Modal from '../../components/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkers, createWorker, updateWorkerById, deleteWorkerById } from '../../store/slices/workersSlice';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const Workers = () => {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);
  const dispatch = useDispatch();
  const { workers } = useSelector((state) => state.workers);
  const { sidebarWidth } = useSelector((state) => state.theme);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  // Fetch workers from API
  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Filter only workers (hourly/daily contracts), not assistants
  const workersOnly = workers.filter(worker => 
    worker.isActive !== false && 
    worker.status !== 'inactive' &&
    (worker.contractType === 'hourly' || worker.contractType === 'daily' || !worker.contractType)
  );

  const displayWorkers = workersOnly.filter(worker => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      worker.arabicName?.toLowerCase().includes(search) ||
      worker.englishName?.toLowerCase().includes(search) ||
      worker.phone?.includes(search) ||
      worker.nationality?.toLowerCase().includes(search)
    );
  });

  const selectedSkills = watch('skills') || [];

  const getStatusBadge = (status) => {
    const badges = {
      available: { label: '✅ متاحة', color: '#4caf50' },
      busy: { label: '⏳ مشغولة', color: '#ff9800' },
      vacation: { label: '🏖 إجازة', color: '#2196f3' },
    };
    return badges[status] || badges.available;
  };

  const handleViewDetails = (worker) => {
    setSelectedWorker(worker);
    setIsEditMode(false);
    setShowDetailsModal(true);
    reset({
      arabicName: worker.arabicName || worker.name,
      englishName: worker.englishName || '',
      nationality: worker.nationality,
      age: worker.age,
      phone: worker.phone || '',
      experience: worker.experience,
      price: worker.price,
      status: worker.status,
      skills: worker.skills || [],
      languages: worker.languages || [],
    });
  };

  const handleEdit = (worker) => {
    setSelectedWorker(worker);
    setIsEditMode(true);
    setIsAddMode(false);
    setShowDetailsModal(true);
    setUploadedPhotos(worker.photos || []);
    setPhotoPreview(worker.photos || []);
    reset({
      arabicName: worker.arabicName || worker.name,
      englishName: worker.englishName || '',
      nationality: worker.nationality,
      age: worker.age,
      phone: worker.phone || '',
      experience: worker.experience,
      price: worker.price,
      status: worker.status,
      skills: worker.skills || [],
      languages: worker.languages || [],
      photos: worker.photos || [],
    });
  };

        const handleDelete = async (workerId) => {
          if (window.confirm('هل أنت متأكد من حذف هذه العاملة؟')) {
            const result = await dispatch(deleteWorkerById(workerId));
            if (deleteWorkerById.fulfilled.match(result)) {
              if (selectedWorker?._id === workerId || selectedWorker?.id === workerId) {
                setShowDetailsModal(false);
                setSelectedWorker(null);
              }
              alert('تم حذف العاملة بنجاح!');
            } else {
              alert(result.payload || 'حدث خطأ أثناء حذف العاملة');
            }
          }
        };

        const onSubmitEdit = async (data) => {
          if (selectedWorker) {
            const workerId = selectedWorker._id || selectedWorker.id;
            const workerData = {
              ...data,
              name: data.arabicName, // Keep backward compatibility
              contractType: 'hourly', // Default for workers
              photos: uploadedPhotos,
            };
            const result = await dispatch(updateWorkerById({ id: workerId, workerData }));
            if (updateWorkerById.fulfilled.match(result)) {
              setShowDetailsModal(false);
              setIsEditMode(false);
              setSelectedWorker(null);
              setUploadedPhotos([]);
              setPhotoPreview([]);
              reset();
              dispatch(fetchWorkers()); // Refresh the list
              alert('تم تحديث بيانات العاملة بنجاح!');
            } else {
              alert(result.payload || 'حدث خطأ أثناء تحديث العاملة');
            }
          }
        };

        const handleAddNew = () => {
          setIsAddMode(true);
          setIsEditMode(false);
          setSelectedWorker(null);
          setShowDetailsModal(true);
          setUploadedPhotos([]);
          setPhotoPreview([]);
          reset({
            arabicName: '',
            englishName: '',
            nationality: '',
            age: '',
            phone: '',
            experience: 0,
            price: null,
            status: 'available',
            skills: [],
            languages: [],
            contractType: 'hourly', // Default for workers
            photos: [],
          });
        };

        // Function to compress image
        const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.65) => {
          return new Promise((resolve, reject) => {
            // Check file size first (max 10MB before compression)
            if (file.size > 10 * 1024 * 1024) {
              console.warn('⚠️ Image is very large, will be heavily compressed:', file.size / 1024 / 1024, 'MB');
            }
            
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
              const img = new Image();
              img.src = event.target.result;
              img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                  if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                  }
                } else {
                  if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                  }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                // Improve image quality during resize
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64 with compression
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                
                // Log compression info
                const originalSize = file.size;
                const compressedSize = (compressedBase64.length * 3) / 4; // Approximate base64 size
                const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
                console.log(`📸 Compressed: ${width}x${height}, ${(compressedSize / 1024).toFixed(2)}KB (${compressionRatio}% reduction)`);
                
                resolve(compressedBase64);
              };
              img.onerror = reject;
            };
            reader.onerror = reject;
          });
        };

        const handlePhotoUpload = async (e) => {
          const files = Array.from(e.target.files);
          if (files.length === 0) return;

          for (const file of files) {
            if (file.type.startsWith('image/')) {
              try {
                // Compress image before converting to base64
                const compressedBase64 = await compressImage(file);
                setUploadedPhotos(prev => [...prev, compressedBase64]);
                setPhotoPreview(prev => [...prev, compressedBase64]);
              } catch (error) {
                console.error('Error compressing image:', error);
                // Fallback to original if compression fails
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result;
                  setUploadedPhotos(prev => [...prev, base64String]);
                  setPhotoPreview(prev => [...prev, base64String]);
                };
                reader.readAsDataURL(file);
              }
            }
          }
        };

        const removePhoto = (index) => {
          setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
          setPhotoPreview(prev => prev.filter((_, i) => i !== index));
        };

        const onSubmitAdd = async (data) => {
          const workerData = {
            ...data,
            name: data.arabicName,
            contractType: 'hourly', // Default for workers
            totalOrders: 0,
            isActive: true,
            photos: uploadedPhotos,
          };
          const result = await dispatch(createWorker(workerData));
          if (createWorker.fulfilled.match(result)) {
            setShowDetailsModal(false);
            setIsAddMode(false);
            setUploadedPhotos([]);
            setPhotoPreview([]);
            reset();
            dispatch(fetchWorkers()); // Refresh the list
            alert('تم إضافة العاملة بنجاح!');
          } else {
            alert(result.payload || 'حدث خطأ أثناء إضافة العاملة');
          }
        };

  const allSkills = [
    'طبخ', 'كوي', 'أطفال', 'تنظيف متقدم', 'تنظيف عادي', 'تنظيف سريع', 
    'تنظيف المطبخ', 'تنظيف الحمامات', 'تنظيف شامل', 'ترتيب', 
    'غسيل ملابس', 'كوي ملابس', 'تنظيف النوافذ', 'تنظيف السجاد', 
    'تنظيف الأثاث', 'تنظيف الأرضيات', 'تنظيف الجدران', 'تنظيف المرايا',
    'رعاية المسنين', 'رعاية المرضى', 'طبخ عربي', 'طبخ غربي', 
    'طبخ آسيوي', 'خبز ومعجنات', 'إعداد وجبات', 'تنظيم المنزل',
    'غسيل الصحون', 'تنظيف الأجهزة', 'تنظيف الثلاجة', 'تنظيف الفرن',
    'تنظيف الحديقة', 'ري النباتات', 'رعاية الحيوانات الأليفة', 'قيادة',
    'خياطة', 'إصلاح ملابس', 'تنظيف السيارات', 'مساعدة في التسوق'
  ];
  const allLanguages = ['عربي', 'إنجليزي', 'أردو', 'فلبيني'];

  const toggleSkill = (skill) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    setValue('skills', newSkills);
  };

  const toggleLanguage = (language) => {
    const currentLanguages = watch('languages') || [];
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];
    setValue('languages', newLanguages);
  };

  // Generate stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
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
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="dashboard-content-area" style={{ 
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: isMobile ? '0' : `${sidebarWidth}px`,
        paddingTop: '80px',
        transition: 'margin-left 0.3s ease',
      }}>
        <TopBar 
          pageTitle="إدارة العاملات" 
          onSearch={handleSearch}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div style={{ padding: '40px', flex: 1 }}>
          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <GlassButton
              onClick={handleAddNew}
              style={{
                background: 'linear-gradient(135deg, #0a2851 0%, #0a2851 50%, #0a2851 100%)',
                color: 'white',
                fontWeight: 700,
                padding: '12px 24px',
                fontSize: '16px',
              }}
            >
              ➕ إضافة عاملة جديدة
            </GlassButton>
          </div>
          <div className="cards-grid-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '30px',
            justifyContent: 'center',
          }}>
            {displayWorkers.map((worker) => {
              const status = getStatusBadge(worker.status);
              const workerName = worker.arabicName || worker.name;
              const workerPhoto = worker.photos && worker.photos.length > 0 ? worker.photos[0] : null;
              return (
                <GlassCard key={worker._id || worker.id} style={{ padding: '30px', textAlign: 'center' }}>
                  <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: workerPhoto 
                      ? 'transparent' 
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '60px',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    overflow: 'hidden',
                    border: workerPhoto ? '4px solid #3b82f6' : 'none',
                  }}>
                    {workerPhoto ? (
                      <img 
                        src={workerPhoto} 
                        alt={workerName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      workerName[0] || '👷‍♀'
                    )}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px', color: '#0f172a', letterSpacing: '-0.3px' }}>
                    {workerName}
                  </h3>
                  <p style={{ color: '#334155', marginBottom: '10px', fontWeight: 600, fontSize: '15px' }}>
                    {worker.nationality} | {worker.age} سنة
                  </p>
                  <p style={{ marginBottom: '10px', color: '#0f172a', fontWeight: 600, fontSize: '15px' }}>
                  </p>
                  <p style={{ color: '#334155', marginBottom: '10px', fontWeight: 600, fontSize: '15px' }}>
                    📊 {worker.orders || 0} طلب مكتمل
                  </p>
                  <p style={{ color: '#334155', marginBottom: '15px', fontWeight: 600, fontSize: '15px' }}>
                    🕐 خبرة {worker.experience || 0} سنوات
                  </p>
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ fontSize: '15px', marginBottom: '8px', color: '#0f172a', fontWeight: 700 }}>المهارات:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                      {(worker.skills || []).map((skill, i) => (
                        <span key={i} style={{
                          background: '#f1f5f9',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: '#0f172a',
                          fontWeight: 600,
                          border: '1px solid #e5e7eb',
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p style={{ color: status.color, fontWeight: 700, marginBottom: '20px' }}>
                    {status.label}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button 
                      onClick={() => handleViewDetails(worker)}
                      style={{
                        background: '#3b82f6',
                        border: '1px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        color: '#ffffff',
                        fontWeight: 600,
                        transition: 'all 0.3s',
                        fontSize: '14px',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#3b82f6';
                      }}
                    >
                      عرض
                    </button>
                    <button 
                      onClick={() => handleEdit(worker)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        color: '#0f172a',
                        fontWeight: 600,
                        transition: 'all 0.3s',
                        fontSize: '14px',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                      }}
                    >
                      تعديل
                    </button>
                        <button
                          onClick={() => handleDelete(worker._id || worker.id)}
                      style={{
                        background: 'rgba(244, 67, 54, 0.2)',
                        border: '1px solid rgba(244, 67, 54, 0.4)',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        color: '#f44336',
                        fontWeight: 600,
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(244, 67, 54, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(244, 67, 54, 0.2)';
                      }}
                    >
                      حذف
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details/Edit/Add Modal */}
      {showDetailsModal && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setIsEditMode(false);
            setIsAddMode(false);
            setSelectedWorker(null);
            reset();
          }}
          title={isAddMode ? 'إضافة عاملة جديدة' : isEditMode ? 'تعديل بيانات العاملة' : 'تفاصيل العاملة'}
        >
          {isAddMode ? (
            <form onSubmit={handleSubmit(onSubmitAdd)}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#FFFFFF', fontWeight: 700 }}>الاسم بالعربي *</label>
                    <input
                      {...register('arabicName', { required: 'الاسم بالعربي مطلوب' })}
                      className="glass-input"
                      style={{ width: '100%', padding: '10px' }}
                    />
                    {errors.arabicName && <p style={{ color: '#f44336', fontSize: '12px', marginTop: '5px' }}>{errors.arabicName.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#FFFFFF', fontWeight: 700 }}>الاسم بالإنجليزي</label>
                    <input
                      {...register('englishName')}
                      className="glass-input"
                      style={{ width: '100%', padding: '10px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#FFFFFF', fontWeight: 700 }}>الجنسية *</label>
                    <input
                      {...register('nationality', { required: 'الجنسية مطلوبة' })}
                      className="glass-input"
                      style={{ width: '100%', padding: '10px' }}
                    />
                    {errors.nationality && <p style={{ color: '#f44336', fontSize: '12px', marginTop: '5px' }}>{errors.nationality.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#FFFFFF', fontWeight: 700 }}>العمر *</label>
                    <input
                      type="number"
                      {...register('age', { required: 'العمر مطلوب', min: { value: 18, message: 'العمر يجب أن يكون 18 سنة على الأقل' }, max: { value: 65, message: 'العمر يجب أن يكون 65 سنة على الأكثر' } })}
                      className="glass-input"
                      style={{ width: '100%', padding: '10px' }}
                    />
                    {errors.age && <p style={{ color: '#f44336', fontSize: '12px', marginTop: '5px' }}>{errors.age.message}</p>}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#FFFFFF', fontWeight: 700 }}>رقم الهاتف *</label>
                  <input
                    {...register('phone', { required: 'رقم الهاتف مطلوب' })}
                    className="glass-input"
                    style={{ width: '100%', padding: '10px' }}
                  />
                  {errors.phone && <p style={{ color: '#f44336', fontSize: '12px', marginTop: '5px' }}>{errors.phone.message}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#FFFFFF', fontWeight: 700 }}>سنوات الخبرة</label>
                    <input
                      type="number"
                      {...register('experience', { min: 0 })}
                      className="glass-input"
                      style={{ width: '100%', padding: '10px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#FFFFFF', fontWeight: 700 }}>السعر ($)</label>
                    <input
                      type="number"
                      {...register('price', { min: 0 })}
                      className="glass-input"
                      style={{ width: '100%', padding: '10px' }}
                      placeholder="اتركه فارغاً لاستخدام السعر الافتراضي"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#FFFFFF', fontWeight: 700 }}>الحالة</label>
                    <select
                      {...register('status')}
                      className="glass-select"
                      style={{ width: '100%', padding: '10px' }}
                    >
                      <option value="available">✅ متاحة</option>
                      <option value="busy">⏳ مشغولة</option>
                      <option value="vacation">🏖 إجازة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: '#FFFFFF', fontWeight: 700 }}>المهارات</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {allSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: selectedSkills.includes(skill) ? '2px solid rgba(10, 40, 81, 1)' : '2px solid rgba(10, 40, 81, 0.3)',
                          background: selectedSkills.includes(skill) ? 'rgba(10, 40, 81, 0.2)' : 'transparent',
                          color: selectedSkills.includes(skill) ? '#FFFFFF' : '#FFFFFF',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: '#FFFFFF', fontWeight: 700 }}>اللغات</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {allLanguages.map((language) => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => toggleLanguage(language)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: (watch('languages') || []).includes(language) ? '2px solid rgba(10, 40, 81, 1)' : '2px solid rgba(10, 40, 81, 0.3)',
                          background: (watch('languages') || []).includes(language) ? 'rgba(10, 40, 81, 0.2)' : 'transparent',
                          color: (watch('languages') || []).includes(language) ? '#FFFFFF' : '#FFFFFF',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: '#FFFFFF', fontWeight: 700 }}>الصور</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    style={{ 
                      width: '100%', 
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      marginBottom: '15px',
                    }}
                  />
                  {photoPreview.length > 0 && (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                      gap: '10px', 
                      marginTop: '15px' 
                    }}>
                      {photoPreview.map((photo, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img 
                            src={photo} 
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              background: 'rgba(244, 67, 54, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <GlassButton
                    type="button"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setIsAddMode(false);
                      setUploadedPhotos([]);
                      setPhotoPreview([]);
                      reset();
                    }}
                    style={{ background: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }}
                  >
                    إلغاء
                  </GlassButton>
                  <GlassButton
                    type="submit"
                    style={{ background: 'linear-gradient(135deg, #0a2851 0%, #0a2851 50%, #0a2851 100%)', color: 'white' }}
                  >
                    إضافة
                  </GlassButton>
                </div>
              </div>
            </form>
          ) : isEditMode ? (
            <form onSubmit={handleSubmit(onSubmitEdit)}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#FFFFFF' }}>
                    الاسم بالعربي *
                  </label>
                  <input
                    {...register('arabicName', { required: 'الاسم بالعربي مطلوب' })}
                    className="glass-input"
                    style={{ width: '100%' }}
                  />
                  {errors.arabicName && (
                    <span style={{ color: '#f44336', fontSize: '12px' }}>{errors.arabicName.message}</span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#FFFFFF' }}>
                    الاسم بالإنجليزي
                  </label>
                  <input
                    {...register('englishName')}
                    className="glass-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#FFFFFF' }}>
                    الجنسية *
                  </label>
                  <input
                    {...register('nationality', { required: 'الجنسية مطلوبة' })}
                    className="glass-input"
                    style={{ width: '100%' }}
                  />
                  {errors.nationality && (
                    <span style={{ color: '#f44336', fontSize: '12px' }}>{errors.nationality.message}</span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#FFFFFF' }}>
                      العمر *
                    </label>
                    <input
                      type="number"
                      {...register('age', { required: 'العمر مطلوب', min: 18, max: 65 })}
                      className="glass-input"
                      style={{ width: '100%' }}
                    />
                    {errors.age && (
                      <span style={{ color: '#f44336', fontSize: '12px' }}>{errors.age.message}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#FFFFFF' }}>
                      سنوات الخبرة
                    </label>
                    <input
                      type="number"
                      {...register('experience', { min: 0 })}
                      className="glass-input"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#FFFFFF' }}>
                      السعر ($)
                    </label>
                    <input
                      type="number"
                      {...register('price', { min: 0 })}
                      className="glass-input"
                      style={{ width: '100%' }}
                      placeholder="اتركه فارغاً لاستخدام السعر الافتراضي"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#FFFFFF' }}>
                    رقم الهاتف *
                  </label>
                  <input
                    {...register('phone', { required: 'رقم الهاتف مطلوب' })}
                    className="glass-input"
                    style={{ width: '100%' }}
                  />
                  {errors.phone && (
                    <span style={{ color: '#f44336', fontSize: '12px' }}>{errors.phone.message}</span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#FFFFFF' }}>
                    الحالة
                  </label>
                  <select
                    {...register('status')}
                    className="glass-select"
                    style={{ width: '100%' }}
                  >
                    <option value="available">متاحة</option>
                    <option value="busy">مشغولة</option>
                    <option value="vacation">إجازة</option>
                    <option value="inactive">غير نشطة</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#FFFFFF' }}>
                    المهارات
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {allSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: selectedSkills.includes(skill)
                            ? '2px solid rgba(10, 40, 81, 1)'
                            : '1px solid rgba(10, 40, 81, 0.3)',
                          background: selectedSkills.includes(skill)
                            ? 'rgba(10, 40, 81, 0.2)'
                            : 'transparent',
                          color: selectedSkills.includes(skill) ? '#FFFFFF' : '#FFFFFF',
                          cursor: 'pointer',
                          fontWeight: selectedSkills.includes(skill) ? 600 : 500,
                          transition: 'all 0.3s',
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#FFFFFF' }}>
                    اللغات
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {allLanguages.map((language) => {
                      const currentLanguages = watch('languages') || [];
                      const isSelected = currentLanguages.includes(language);
                      return (
                        <button
                          key={language}
                          type="button"
                          onClick={() => toggleLanguage(language)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: isSelected
                              ? '2px solid rgba(10, 40, 81, 1)'
                              : '1px solid rgba(10, 40, 81, 0.3)',
                            background: isSelected
                              ? 'rgba(10, 40, 81, 0.2)'
                              : 'transparent',
                            color: isSelected ? '#FFFFFF' : '#FFFFFF',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 600 : 500,
                            transition: 'all 0.3s',
                          }}
                        >
                          {language}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: '#FFFFFF', fontWeight: 700 }}>الصور</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    style={{ 
                      width: '100%', 
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      marginBottom: '15px',
                    }}
                  />
                  {photoPreview.length > 0 && (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                      gap: '10px', 
                      marginTop: '15px' 
                    }}>
                      {photoPreview.map((photo, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img 
                            src={photo} 
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              background: 'rgba(244, 67, 54, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setIsEditMode(false);
                      setSelectedWorker(null);
                      reset();
                    }}
                    className="glass-button glass-button-secondary"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="glass-button">
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </form>
          ) : selectedWorker ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {(() => {
                const status = getStatusBadge(selectedWorker.status);
                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <p style={{ color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>الاسم بالعربي</p>
                        <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>{selectedWorker.arabicName || selectedWorker.name}</p>
                      </div>
                      <div>
                        <p style={{ color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>الاسم بالإنجليزي</p>
                        <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>{selectedWorker.englishName || '-'}</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <p style={{ color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>الجنسية</p>
                        <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>{selectedWorker.nationality}</p>
                      </div>
                      <div>
                        <p style={{ color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>العمر</p>
                        <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>{selectedWorker.age} سنة</p>
                      </div>
                    </div>

                    <div>
                      <p style={{ color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>رقم الهاتف</p>
                      <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>{selectedWorker.phone}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <p style={{ color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>نوع العقد</p>
                        <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>
                          {selectedWorker.contractType === 'hourly' ? '⏰ بالساعة' : 
                           selectedWorker.contractType === 'daily' ? '📅 باليوم' : 
                           selectedWorker.contractType || 'غير محدد'}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>الحالة</p>
                        <p style={{ color: status.color, fontWeight: 700, fontSize: '16px' }}>{status.label}</p>
                      </div>
                    </div>

                    <div>
                      <p style={{ color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>سنوات الخبرة</p>
                      <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>{selectedWorker.experience || 0} سنوات</p>
                    </div>


                    <div>
                      <p style={{ color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>عدد الطلبات المكتملة</p>
                      <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>{selectedWorker.totalOrders || selectedWorker.orders || 0}</p>
                    </div>

                    <div>
                      <p style={{ color: '#FFFFFF', marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>المهارات</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(selectedWorker.skills || []).map((skill, i) => (
                          <span key={i} style={{
                            background: 'rgba(10, 40, 81, 0.2)',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            fontSize: '13px',
                            color: '#FFFFFF',
                            fontWeight: 600,
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p style={{ color: '#FFFFFF', marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>اللغات</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(selectedWorker.languages || []).map((language, i) => (
                          <span key={i} style={{
                            background: 'rgba(10, 40, 81, 0.2)',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            fontSize: '13px',
                            color: '#FFFFFF',
                            fontWeight: 600,
                          }}>
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedWorker.photos && selectedWorker.photos.length > 0 && (
                      <div>
                        <p style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '14px', fontWeight: 700 }}>الصور</p>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                          gap: '15px' 
                        }}>
                          {selectedWorker.photos.map((photo, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                              <img 
                                src={photo} 
                                alt={`Photo ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '150px',
                                  objectFit: 'cover',
                                  borderRadius: '12px',
                                  border: '2px solid rgba(255, 255, 255, 0.3)',
                                  cursor: 'pointer',
                                }}
                                onClick={() => window.open(photo, '_blank')}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setSelectedWorker(null);
                          reset();
                        }}
                        className="glass-button glass-button-secondary"
                      >
                        إغلاق
                      </button>
                      <button
                        onClick={() => handleEdit(selectedWorker)}
                        className="glass-button"
                      >
                        تعديل
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : null}
        </Modal>
      )}
    </div>
  );
};

export default Workers;

