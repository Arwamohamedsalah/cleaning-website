import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../../store/slices/authSlice';
import { overviewAPI, authAPI } from '../../services/api';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sidebarWidth } = useSelector((state) => state.theme);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [profileStats, setProfileStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalWorkers: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'المسؤول',
    email: user?.email || 'admin@cleaning.com',
    phone: user?.phone || '0501234567',
    role: user?.role || 'مدير النظام',
    bio: user?.bio || 'مدير النظام في شركة خدمات التنظيف',
    joinDate: user?.joinDate || new Date('2024-01-01'),
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const result = await dispatch(updateUserProfile(formData));
      if (updateUserProfile.fulfilled.match(result)) {
        setIsEditMode(false);
        alert('تم حفظ التغييرات بنجاح!');
      } else {
        alert(result.payload || 'حدث خطأ أثناء حفظ التغييرات');
      }
    } catch (error) {
      alert('حدث خطأ أثناء حفظ التغييرات');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'المسؤول',
      email: user?.email || 'admin@cleaning.com',
      phone: user?.phone || '0501234567',
      role: user?.role || 'مدير النظام',
      bio: user?.bio || 'مدير النظام في شركة خدمات التنظيف',
      joinDate: user?.joinDate || new Date('2024-01-01'),
    });
    setIsEditMode(false);
  };

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    if (newPassword.length < 6) {
      alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    try {
      setPasswordLoading(true);
      console.log('🔐 Changing password...');
      const response = await authAPI.changePassword(currentPassword, newPassword);
      console.log('🔐 Password change response:', response);
      
      if (response.success) {
        alert('تم تغيير كلمة المرور بنجاح');
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(response.message || 'حدث خطأ أثناء تغيير كلمة المرور');
      }
    } catch (error) {
      console.error('❌ Error changing password:', error);
      alert(error.message || 'حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Load profile statistics
  useEffect(() => {
    const loadProfileStats = async () => {
      try {
        setLoading(true);
        const response = await overviewAPI.getProfileStats();
        if (response && response.success) {
          setProfileStats(response.data);
        }
      } catch (error) {
        console.error('Error loading profile stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfileStats();
  }, []);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const stats = [
    { label: 'إجمالي الطلبات', value: formatNumber(profileStats.totalOrders), icon: '📋' },
    { label: 'العملاء', value: formatNumber(profileStats.totalCustomers), icon: '👥' },
    { label: 'العاملات', value: formatNumber(profileStats.totalWorkers), icon: '👷‍♀' },
  ];

  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('ar-SA', { calendar: 'gregory',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        marginRight: isMobile ? '0' : `${sidebarWidth || 280}px`,
        paddingTop: '80px',
        transition: 'margin-right 0.3s ease',
      }}>
        <TopBar 
          pageTitle="الملف الشخصي" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div style={{ padding: isMobile ? '16px' : '40px', flex: 1, overflowY: 'auto' }}>
          {/* Profile Header */}
          <div className="dashboard-chart-card" style={{ padding: isMobile ? '20px' : '40px', marginBottom: isMobile ? '20px' : '30px' }}>
            <div style={{ display: 'flex', gap: isMobile ? '15px' : '30px', alignItems: 'start', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <div style={{
                width: isMobile ? '80px' : '120px',
                height: isMobile ? '80px' : '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 25%, #6366F1 50%, #4F46E5 75%, #4338CA 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '32px' : '48px',
                color: 'white',
                flexShrink: 0,
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
              }}>
                {formData.name?.[0] || '👤'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {isEditMode ? (
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <input
                      type="text"
                      className="dashboard-input"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="الاسم"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        color: '#0f172a',
                        outline: 'none',
                        fontSize: '15px',
                        fontWeight: 500,
                      }}
                    />
                    <textarea
                      className="dashboard-textarea"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="نبذة عنك"
                      rows={3}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        color: '#0f172a',
                        outline: 'none',
                        resize: 'vertical',
                        fontSize: '15px',
                        fontWeight: 500,
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: 800, marginBottom: '10px', color: '#0f172a', letterSpacing: '-0.3px' }}>
                      {formData.name}
                    </h2>
                    <p style={{ color: '#334155', marginBottom: '15px', fontSize: isMobile ? '14px' : '16px', fontWeight: 500, lineHeight: 1.6 }}>
                      {formData.bio}
                    </p>
                    <div style={{ display: 'flex', gap: isMobile ? '10px' : '20px', flexWrap: 'wrap' }}>
                      <p style={{ color: '#334155', fontSize: isMobile ? '13px' : '15px', fontWeight: 500 }}>
                        <strong style={{ color: '#0f172a', fontWeight: 700 }}>البريد:</strong> {formData.email}
                      </p>
                      <p style={{ color: '#334155', fontSize: isMobile ? '13px' : '15px', fontWeight: 500 }}>
                        <strong style={{ color: '#0f172a', fontWeight: 700 }}>الهاتف:</strong> {formData.phone}
                      </p>
                      <p style={{ color: '#334155', fontSize: isMobile ? '13px' : '15px', fontWeight: 500 }}>
                        <strong style={{ color: '#0f172a', fontWeight: 700 }}>تاريخ الانضمام:</strong> {formatDate(formData.joinDate)}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div>
                {isEditMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      onClick={handleSave}
                      className="dashboard-button"
                      style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.5)',
                        color: '#ffffff',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      حفظ
                    </button>
                    <button
                      onClick={handleCancel}
                      className="dashboard-button"
                      style={{
                        background: 'rgba(30, 58, 95, 0.6)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: '#ffffff',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="dashboard-button"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)',
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                      color: '#ffffff',
                      padding: isMobile ? '8px 16px' : '12px 24px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: isMobile ? '13px' : '15px',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {isMobile ? 'تعديل' : 'تعديل الملف الشخصي'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: isMobile ? '12px' : '20px', marginBottom: isMobile ? '20px' : '30px' }}>
            {stats.map((stat, index) => (
              <div key={index} className="dashboard-stats-card" style={{ padding: isMobile ? '16px' : '25px', textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '36px' : '48px', marginBottom: isMobile ? '12px' : '16px', opacity: 0.9 }}>{stat.icon}</div>
                <h3 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, marginBottom: '10px', color: '#0f172a', letterSpacing: '-0.5px' }}>
                  {stat.value}
                </h3>
                <p style={{ color: '#334155', fontSize: isMobile ? '13px' : '16px', fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Personal Information */}
          <div className="dashboard-chart-card" style={{ padding: isMobile ? '20px' : '30px', marginBottom: isMobile ? '20px' : '30px', overflow: 'visible' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '16px' : '25px' }}>
              <h3 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>المعلومات الشخصية</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: isMobile ? '12px' : '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>الاسم الكامل</label>
                {isEditMode ? (
                  <input
                    type="text"
                    className="dashboard-input"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#0f172a',
                      outline: 'none',
                      width: '100%',
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  />
                ) : (
                  <p style={{ 
                    padding: '12px 16px', 
                    background: '#f8fafc', 
                    borderRadius: '10px', 
                    color: '#0f172a',
                    border: '1px solid #e5e7eb',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}>
                    {formData.name}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>البريد الإلكتروني</label>
                {isEditMode ? (
                  <input
                    type="email"
                    className="dashboard-input"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#0f172a',
                      outline: 'none',
                      width: '100%',
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  />
                ) : (
                  <p style={{ 
                    padding: '12px 16px', 
                    background: '#f8fafc', 
                    borderRadius: '10px', 
                    color: '#0f172a',
                    border: '1px solid #e5e7eb',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}>
                    {formData.email}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>رقم الهاتف</label>
                {isEditMode ? (
                  <input
                    type="tel"
                    className="dashboard-input"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#0f172a',
                      outline: 'none',
                      width: '100%',
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  />
                ) : (
                  <p style={{ 
                    padding: '12px 16px', 
                    background: '#f8fafc', 
                    borderRadius: '10px', 
                    color: '#0f172a',
                    border: '1px solid #e5e7eb',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}>
                    {formData.phone}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>الدور</label>
                <p style={{ 
                  padding: '12px 16px', 
                  background: '#f8fafc', 
                  borderRadius: '10px', 
                  color: '#0f172a',
                  border: '1px solid #e5e7eb',
                  fontSize: '15px',
                  fontWeight: 500,
                }}>
                  {formData.role}
                </p>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>تاريخ الانضمام</label>
                <p style={{ 
                  padding: '12px 16px', 
                  background: '#f8fafc', 
                  borderRadius: '10px', 
                  color: '#0f172a',
                  border: '1px solid #e5e7eb',
                  fontSize: '15px',
                  fontWeight: 500,
                }}>
                  {formatDate(formData.joinDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="dashboard-chart-card" style={{ padding: isMobile ? '20px' : '30px', overflow: 'visible' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '16px' : '25px' }}>
              <h3 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>الأمان</h3>
            </div>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>كلمة المرور الحالية</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    className="dashboard-input"
                    placeholder="أدخل كلمة المرور الحالية"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px 45px 12px 16px',
                      color: '#0f172a',
                      outline: 'none',
                      width: '100%',
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'transparent',
                      border: 'none',
                      color: '#334155',
                      cursor: 'pointer',
                      padding: '5px',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '0.7';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '1';
                    }}
                  >
                    {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>كلمة المرور الجديدة</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    className="dashboard-input"
                    placeholder="أدخل كلمة المرور الجديدة"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px 45px 12px 16px',
                      color: '#0f172a',
                      outline: 'none',
                      width: '100%',
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'transparent',
                      border: 'none',
                      color: '#334155',
                      cursor: 'pointer',
                      padding: '5px',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '0.7';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '1';
                    }}
                  >
                    {showNewPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>تأكيد كلمة المرور</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    className="dashboard-input"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px 45px 12px 16px',
                      color: '#0f172a',
                      outline: 'none',
                      width: '100%',
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'transparent',
                      border: 'none',
                      color: '#334155',
                      cursor: 'pointer',
                      padding: '5px',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '0.7';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '1';
                    }}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="dashboard-button"
                style={{
                  background: passwordLoading 
                    ? 'rgba(139, 92, 246, 0.5)' 
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)',
                  cursor: passwordLoading ? 'not-allowed' : 'pointer',
                  opacity: passwordLoading ? 0.6 : 1,
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  transition: 'all 0.3s',
                  width: 'fit-content',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                تغيير كلمة المرور
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
