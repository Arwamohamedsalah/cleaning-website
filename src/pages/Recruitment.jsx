import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import Modal from '../components/Modal';
import { recruitmentSchema } from '../schemas/validationSchemas';
import { useDispatch } from 'react-redux';
import { createApplication } from '../store/slices/applicationsSlice';
import '../styles/globals.css';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const Recruitment = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [idPhoto, setIdPhoto] = useState(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(recruitmentSchema),
    mode: 'onChange',
  });

  const experience = watch('experience') || 0;

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length <= 7) {
      setPhotos([...photos, ...files]);
      setValue('photos', [...photos, ...files]);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setValue('photos', newPhotos);
  };

  const handleIdPhotoUpload = (e) => {
    const file = e.target.files[0];
    setIdPhoto(file);
    setValue('idPhoto', file);
  };

  const onSubmit = async (data) => {
    try {
      // Prepare application data for API
      const applicationData = {
        ...data,
        birthDate: data.birthDate instanceof Date ? data.birthDate.toISOString() : data.birthDate,
        photos: photos.map((_, i) => `photo-${i}`), // In production, upload to cloud storage
        idPhoto: idPhoto ? 'id-photo-url' : null, // In production, upload to cloud storage
      };

      const result = await dispatch(createApplication(applicationData));
      
      if (createApplication.fulfilled.match(result)) {
        setShowSuccessModal(true);
      } else {
        alert(result.payload || 'حدث خطأ أثناء إرسال طلب التوظيف');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('حدث خطأ أثناء إرسال طلب التوظيف');
    }
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
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.8) 0%, rgba(45, 74, 122, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '24px',
        margin: '40px',
        marginBottom: '60px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.4)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '20px',
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}>
            انضمي لفريقنا
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.8', fontWeight: 500 }}>
            نبحث عن عاملات محترفات ومتفانيات للانضمام لفريقنا المميز
          </p>
        </div>
      </section>

      {/* Application Form */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div className="dashboard-chart-card" style={{ padding: '40px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Info */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '30px' }}>
                المعلومات الأساسية
              </h2>
              <div className="glass-input-group">
                <input
                  type="text"
                  className="glass-input"
                  placeholder="الاسم بالعربي"
                  {...register('arabicName')}
                />
                {errors.arabicName && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.arabicName.message}
                  </p>
                )}
              </div>
              <div className="glass-input-group">
                <input
                  type="text"
                  className="glass-input"
                  placeholder="الاسم بالإنجليزي"
                  {...register('englishName')}
                />
                {errors.englishName && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.englishName.message}
                  </p>
                )}
              </div>
              <div className="glass-input-group">
                <input
                  type="date"
                  className="glass-input"
                  {...register('birthDate', { valueAsDate: true })}
                />
                {errors.birthDate && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.birthDate.message}
                  </p>
                )}
              </div>
              <div className="glass-input-group">
                <select className="glass-select" {...register('nationality')}>
                  <option value="">اختر الجنسية</option>
                  <option value="saudi">السعودية</option>
                  <option value="egyptian">مصرية</option>
                  <option value="filipino">فلبينية</option>
                  <option value="indian">هندية</option>
                  <option value="other">أخرى</option>
                </select>
                {errors.nationality && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.nationality.message}
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
                {errors.phone && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="glass-input-group">
                <input
                  type="text"
                  className="glass-input"
                  placeholder="رقم الهوية/الإقامة"
                  {...register('idNumber')}
                />
                {errors.idNumber && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.idNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Work Info */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '30px' }}>
                معلومات العمل
              </h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700 }}>
                  نوع العقد
                </label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {['daily', 'monthly', 'yearly'].map((type) => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="glass-radio">
                        <input
                          type="radio"
                          value={type}
                          {...register('contractType')}
                        />
                        <span className="radiomark"></span>
                      </div>
                      <span style={{ marginRight: '10px' }}>
                        {type === 'daily' ? 'يومي' : type === 'monthly' ? 'شهري' : 'سنوي'}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.contractType && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.contractType.message}
                  </p>
                )}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700 }}>
                  الخبرة بالسنوات: {experience}
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={experience}
                  {...register('experience', { valueAsNumber: true })}
                  onChange={(e) => setValue('experience', parseInt(e.target.value))}
                  style={{ width: '100%', height: '8px', borderRadius: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700 }}>
                  المهارات
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                  {['طبخ', 'كوي', 'رعاية أطفال', 'رعاية مسنين', 'تنظيف متقدم'].map((skill) => (
                    <label key={skill} style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="glass-checkbox">
                        <input
                          type="checkbox"
                          value={skill}
                          {...register('skills')}
                        />
                        <span className="checkmark"></span>
                      </div>
                      <span style={{ marginRight: '10px' }}>{skill}</span>
                    </label>
                  ))}
                </div>
                {errors.skills && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.skills.message}
                  </p>
                )}
              </div>
              <div className="glass-input-group">
                <select className="glass-select" multiple {...register('languages')} style={{ minHeight: '100px' }}>
                  <option value="arabic">العربية</option>
                  <option value="english">الإنجليزية</option>
                  <option value="other">أخرى</option>
                </select>
                {errors.languages && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.languages.message}
                  </p>
                )}
              </div>
              <div className="glass-input-group">
                <select className="glass-select" {...register('maritalStatus')}>
                  <option value="">اختر الحالة الاجتماعية</option>
                  <option value="single">أعزب/عزباء</option>
                  <option value="married">متزوج/متزوجة</option>
                  <option value="divorced">مطلق/مطلقة</option>
                  <option value="widowed">أرمل/أرملة</option>
                </select>
                {errors.maritalStatus && (
                  <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                    {errors.maritalStatus.message}
                  </p>
                )}
              </div>
            </div>

            {/* Photos and Documents */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '30px' }}>
                الصور والمستندات
              </h2>
              <div style={{
                border: '2px dashed rgba(255, 255, 255, 0.5)',
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
                marginBottom: '20px',
                background: 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('photos-upload').click()}
              >
                <input
                  id="photos-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📷</div>
                <p style={{ color: '#1E293B', fontWeight: 500 }}>
                  اسحبي الصور هنا أو اضغطي للاختيار (2-7 صور)
                </p>
                <p style={{ color: '#475569', fontSize: '14px', marginTop: '10px', fontWeight: 500 }}>
                  {photos.length} / 7 صور
                </p>
              </div>
              {photos.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px',
                }}>
                  {photos.map((photo, index) => (
                    <GlassCard key={index} style={{ position: 'relative', padding: '10px' }}>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          left: '5px',
                          background: 'rgba(255, 68, 68, 0.8)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '20px',
                        }}
                      >
                        ×
                      </button>
                    </GlassCard>
                  ))}
                </div>
              )}
              {errors.photos && (
                <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                  {errors.photos.message}
                </p>
              )}

              <div style={{
                border: '2px dashed rgba(255, 255, 255, 0.5)',
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
                marginTop: '30px',
                background: 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('id-upload').click()}
              >
                <input
                  id="id-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleIdPhotoUpload}
                />
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🆔</div>
                <p style={{ color: '#1E293B', fontWeight: 500 }}>
                  رفع صورة الهوية
                </p>
                {idPhoto && (
                  <p style={{ color: '#10B981', marginTop: '10px', fontWeight: 700 }}>
                    ✓ تم رفع الصورة
                  </p>
                )}
              </div>
              {errors.idPhoto && (
                <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                  {errors.idPhoto.message}
                </p>
              )}

              <div style={{
                border: '2px dashed rgba(255, 255, 255, 0.5)',
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
                marginTop: '30px',
                background: 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('cv-upload').click()}
              >
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf"
                  style={{ display: 'none' }}
                  {...register('cv')}
                />
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📄</div>
                <p style={{ color: '#1E293B', fontWeight: 500 }}>
                  رفع السيرة الذاتية PDF (اختياري)
                </p>
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '30px' }}>
                ملاحظات
              </h2>
              <textarea
                className="glass-textarea"
                placeholder="أخبرينا عن نفسك..."
                {...register('notes')}
              />
            </div>

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

            <GlassButton type="submit" style={{ width: '100%', marginTop: '20px' }}>
              إرسال الطلب
            </GlassButton>
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
            background: 'linear-gradient(135deg, #10B981 0%, rgba(37, 150, 190, 0.6) 50%, rgba(37, 150, 190, 1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            fontSize: '60px',
          }}>
            ✓
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '20px' }}>
            شكراً لتقديمك!
          </h2>
          <p style={{ color: '#1E293B', marginBottom: '30px', lineHeight: '1.8', fontWeight: 500 }}>
            سيتم مراجعة طلبك والتواصل معك خلال 48 ساعة
          </p>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📧</div>
          <GlassButton onClick={() => setShowSuccessModal(false)}>
            موافق
          </GlassButton>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default Recruitment;

