import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import { setTheme, setSidebarWidth } from '../../store/slices/themeSlice';
import { permissionsAPI, authAPI, settingsAPI } from '../../services/api';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const Settings = () => {
  const dispatch = useDispatch();
  const { theme, sidebarWidth } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('general');
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSupervisor, setNewSupervisor] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  // Store temporary permissions changes before saving
  const [tempPermissions, setTempPermissions] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'خدمات التنظيف',
      siteLanguage: 'ar',
      timezone: 'Asia/Riyadh',
      dateFormat: 'dd/mm/yyyy',
      currency: 'SAR',
    },
    company: {
      name: 'شركة خدمات التنظيف المميزة',
      email: 'info@cleaning.com',
      phone: '0501234567',
      address: 'الرياض، المملكة العربية السعودية',
      taxNumber: '1234567890',
      commercialRegister: '9876543210',
    },
    whatsapp: {
      apiKey: '',
      phoneNumber: '966501234567',
      enabled: true,
      autoReply: true,
      replyMessage: 'شكراً لتواصلك معنا، سنرد عليك قريباً',
    },
    appearance: {
      theme: theme || 'dark',
      primaryColor: 'rgba(37, 150, 190, 1)',
      sidebarWidth: sidebarWidth || 280,
    },
  });
  const [timezones, setTimezones] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingPassword, setEditingPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await settingsAPI.getSettings();
        if (response.success && response.data) {
          setSettings(prev => ({
            ...prev,
            general: response.data.general || prev.general,
            company: response.data.company || prev.company,
            whatsapp: response.data.whatsapp || prev.whatsapp,
            appearance: {
              ...prev.appearance,
              ...response.data.appearance,
            },
          }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    const loadTimezones = async () => {
      try {
        const response = await settingsAPI.getTimezones();
        if (response.success) {
          setTimezones(response.data);
        }
      } catch (error) {
        console.error('Error loading timezones:', error);
      }
    };

    if (user?.role === 'admin') {
      loadSettings();
      loadTimezones();
    }
  }, [user]);

  // Load users when users tab is active
  useEffect(() => {
    if (activeTab === 'users' && user?.role === 'admin') {
      loadUsers();
    }
  }, [activeTab, user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getUsers();
      if (response && response.success) {
        setUsers(response.data || []);
      } else {
        console.error('Error loading users - response:', response);
        alert(response?.message || 'حدث خطأ أثناء تحميل المستخدمين');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      alert(error.message || 'حدث خطأ أثناء تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: theme || 'dark',
        sidebarWidth: sidebarWidth || 280,
      },
    }));
  }, [theme, sidebarWidth]);

  // Load supervisors when permissions tab is active
  useEffect(() => {
    if (activeTab === 'permissions' && user?.role === 'admin') {
      loadSupervisors();
    }
  }, [activeTab, user]);

  const loadSupervisors = async () => {
    try {
      setLoading(true);
      const response = await permissionsAPI.getAll();
      if (response.success) {
        setSupervisors(response.data);
      }
    } catch (error) {
      console.error('Error loading supervisors:', error);
      alert('حدث خطأ أثناء تحميل المشرفين');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupervisor = async () => {
    try {
      setLoading(true);
      const response = await authAPI.register({
        ...newSupervisor,
        role: 'supervisor',
      });
      if (response.success) {
        alert('تم إنشاء المشرف بنجاح');
        setShowCreateModal(false);
        setNewSupervisor({ name: '', email: '', password: '', phone: '' });
        loadSupervisors();
      }
    } catch (error) {
      console.error('Error creating supervisor:', error);
      alert(error.message || 'حدث خطأ أثناء إنشاء المشرف');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (supervisorId, permissionKey, value) => {
    setTempPermissions(prev => ({
      ...prev,
      [supervisorId]: {
        ...prev[supervisorId],
        [permissionKey]: value,
      },
    }));
  };

  const handleSavePermissions = async (supervisorId) => {
    try {
      setLoading(true);
      const permissionsToSave = tempPermissions[supervisorId] || {};
      const supervisor = supervisors.find(s => s._id === supervisorId);
      const finalPermissions = {
        ...supervisor.permissions,
        ...permissionsToSave,
      };
      
      const response = await permissionsAPI.updateSupervisorPermissions(supervisorId, finalPermissions);
      if (response.success) {
        alert('تم حفظ الصلاحيات بنجاح');
        // Clear temp permissions for this supervisor
        setTempPermissions(prev => {
          const newTemp = { ...prev };
          delete newTemp[supervisorId];
          return newTemp;
        });
        loadSupervisors();
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert(error.message || 'حدث خطأ أثناء حفظ الصلاحيات');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', icon: '⚙️', label: 'عام' },
    { id: 'company', icon: '🏢', label: 'معلومات الشركة' },
    { id: 'whatsapp', icon: '💬', label: 'واتساب API' },
    { id: 'users', icon: '👥', label: 'المستخدمين' },
    { id: 'permissions', icon: '🔐', label: 'صلاحيات المشرفين' },
  ];

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async (section) => {
    try {
      setLoading(true);
      const settingsToSave = {
        [section]: settings[section],
      };
      
      const response = await settingsAPI.updateSettings(settingsToSave);
      if (response.success) {
        if (section === 'appearance') {
          // Apply theme immediately
          const themeToApply = settings.appearance.theme === 'auto' ? 'light' : settings.appearance.theme;
          dispatch(setTheme(settings.appearance.theme));
          document.documentElement.setAttribute('data-theme', themeToApply);
          // Apply sidebar width immediately
          dispatch(setSidebarWidth(settings.appearance.sidebarWidth));
        }
        alert(`تم حفظ إعدادات ${section} بنجاح!`);
      } else {
        alert('حدث خطأ أثناء حفظ الإعدادات');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(error.message || 'حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (userId) => {
    if (!newPassword || newPassword.length < 6) {
      alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    try {
      setLoading(true);
      console.log('🔐 Frontend: Changing password for user:', userId, 'Password length:', newPassword.length);
      const response = await settingsAPI.updateUserPassword(userId, newPassword);
      console.log('🔐 Frontend: Password change response:', response);
      if (response.success) {
        alert('تم تحديث كلمة المرور بنجاح');
        setEditingPassword(null);
        setNewPassword('');
        setShowPassword(false);
        // Reload users to reflect changes
        await loadUsers();
      } else {
        alert(response.message || 'حدث خطأ أثناء تحديث كلمة المرور');
      }
    } catch (error) {
      console.error('❌ Frontend: Error updating password:', error);
      alert(error.message || 'حدث خطأ أثناء تحديث كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <GlassCard style={{ padding: '30px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '25px', color: '#ffffff' }}>الإعدادات العامة</h3>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>اسم الموقع</label>
          <input
            type="text"
            className="glass-input"
            value={settings.general.siteName}
            onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>اللغة</label>
          <select
            className="glass-select"
            value={settings.general.siteLanguage}
            onChange={(e) => handleInputChange('general', 'siteLanguage', e.target.value)}
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>المنطقة الزمنية</label>
          <select
            className="glass-select"
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
          >
            {timezones.length > 0 ? (
              timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))
            ) : (
              <>
                <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                <option value="Asia/Dubai">دبي (GMT+4)</option>
                <option value="Asia/Kuwait">الكويت (GMT+3)</option>
                <option value="Asia/Bahrain">البحرين (GMT+3)</option>
                <option value="Asia/Qatar">قطر (GMT+3)</option>
                <option value="Asia/Muscat">مسقط (GMT+4)</option>
                <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                <option value="Europe/London">لندن (GMT+0)</option>
                <option value="America/New_York">نيويورك (GMT-5)</option>
                <option value="Asia/Tokyo">طوكيو (GMT+9)</option>
              </>
            )}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>تنسيق التاريخ</label>
          <select
            className="glass-select"
            value={settings.general.dateFormat}
            onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
          >
            <option value="dd/mm/yyyy">يوم/شهر/سنة</option>
            <option value="mm/dd/yyyy">شهر/يوم/سنة</option>
            <option value="yyyy-mm-dd">سنة-شهر-يوم</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>العملة</label>
          <select
            className="glass-select"
            value={settings.general.currency}
            onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
          >
            <option value="SAR">ريال سعودي (ر.س)</option>
            <option value="USD">دولار ($)</option>
            <option value="EUR">يورو (€)</option>
          </select>
        </div>
        <GlassButton onClick={() => handleSave('general')}>حفظ التغييرات</GlassButton>
      </div>
    </GlassCard>
  );

  const renderCompanySettings = () => (
    <GlassCard style={{ padding: '30px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '25px', color: '#ffffff' }}>معلومات الشركة</h3>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>اسم الشركة</label>
          <input
            type="text"
            className="glass-input"
            value={settings.company.name}
            onChange={(e) => handleInputChange('company', 'name', e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>البريد الإلكتروني</label>
          <input
            type="email"
            className="glass-input"
            value={settings.company.email}
            onChange={(e) => handleInputChange('company', 'email', e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>رقم الهاتف</label>
          <input
            type="tel"
            className="glass-input"
            value={settings.company.phone}
            onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>العنوان</label>
          <textarea
            className="glass-textarea"
            value={settings.company.address}
            onChange={(e) => handleInputChange('company', 'address', e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>الرقم الضريبي</label>
          <input
            type="text"
            className="glass-input"
            value={settings.company.taxNumber}
            onChange={(e) => handleInputChange('company', 'taxNumber', e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>السجل التجاري</label>
          <input
            type="text"
            className="glass-input"
            value={settings.company.commercialRegister}
            onChange={(e) => handleInputChange('company', 'commercialRegister', e.target.value)}
          />
        </div>
        <GlassButton onClick={() => handleSave('company')}>حفظ التغييرات</GlassButton>
      </div>
    </GlassCard>
  );

  const renderWhatsAppSettings = () => (
    <GlassCard style={{ padding: '30px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '25px', color: '#ffffff' }}>إعدادات واتساب API</h3>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>مفتاح API</label>
          <input
            type="password"
            className="glass-input"
            value={settings.whatsapp.apiKey}
            onChange={(e) => handleInputChange('whatsapp', 'apiKey', e.target.value)}
            placeholder="أدخل مفتاح API"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>رقم الهاتف</label>
          <input
            type="tel"
            className="glass-input"
            value={settings.whatsapp.phoneNumber}
            onChange={(e) => handleInputChange('whatsapp', 'phoneNumber', e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="whatsapp-enabled"
            checked={settings.whatsapp.enabled}
            onChange={(e) => handleInputChange('whatsapp', 'enabled', e.target.checked)}
            className="glass-checkbox"
          />
          <label htmlFor="whatsapp-enabled" style={{ fontWeight: 600, color: '#ffffff' }}>تفعيل واتساب</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="auto-reply"
            checked={settings.whatsapp.autoReply}
            onChange={(e) => handleInputChange('whatsapp', 'autoReply', e.target.checked)}
            className="glass-checkbox"
          />
          <label htmlFor="auto-reply" style={{ fontWeight: 600, color: '#ffffff' }}>الرد التلقائي</label>
        </div>
        {settings.whatsapp.autoReply && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>رسالة الرد التلقائي</label>
            <textarea
              className="glass-textarea"
              value={settings.whatsapp.replyMessage}
              onChange={(e) => handleInputChange('whatsapp', 'replyMessage', e.target.value)}
              rows={3}
            />
          </div>
        )}
        <GlassButton onClick={() => handleSave('whatsapp')}>حفظ التغييرات</GlassButton>
      </div>
    </GlassCard>
  );

  const renderNotificationsSettings = () => (
    <GlassCard style={{ padding: '30px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '25px', color: '#ffffff' }}>إعدادات الإشعارات</h3>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px', color: '#ffffff' }}>قنوات الإشعارات</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="email-notifications"
                checked={settings.notifications.emailEnabled}
                onChange={(e) => handleInputChange('notifications', 'emailEnabled', e.target.checked)}
                className="glass-checkbox"
              />
              <label htmlFor="email-notifications" style={{ fontWeight: 600, color: '#ffffff' }}>البريد الإلكتروني</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="sms-notifications"
                checked={settings.notifications.smsEnabled}
                onChange={(e) => handleInputChange('notifications', 'smsEnabled', e.target.checked)}
                className="glass-checkbox"
              />
              <label htmlFor="sms-notifications" style={{ fontWeight: 600, color: '#ffffff' }}>رسائل SMS</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="push-notifications"
                checked={settings.notifications.pushEnabled}
                onChange={(e) => handleInputChange('notifications', 'pushEnabled', e.target.checked)}
                className="glass-checkbox"
              />
              <label htmlFor="push-notifications" style={{ fontWeight: 600, color: '#ffffff' }}>الإشعارات الفورية</label>
            </div>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px', color: '#ffffff' }}>أنواع الإشعارات</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="new-order"
                checked={settings.notifications.newOrder}
                onChange={(e) => handleInputChange('notifications', 'newOrder', e.target.checked)}
                className="glass-checkbox"
              />
              <label htmlFor="new-order" style={{ fontWeight: 600, color: '#ffffff' }}>طلبات جديدة</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="order-status"
                checked={settings.notifications.orderStatus}
                onChange={(e) => handleInputChange('notifications', 'orderStatus', e.target.checked)}
                className="glass-checkbox"
              />
              <label htmlFor="order-status" style={{ fontWeight: 600, color: '#ffffff' }}>تغيير حالة الطلب</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="new-application"
                checked={settings.notifications.newApplication}
                onChange={(e) => handleInputChange('notifications', 'newApplication', e.target.checked)}
                className="glass-checkbox"
              />
              <label htmlFor="new-application" style={{ fontWeight: 600, color: '#ffffff' }}>طلبات توظيف جديدة</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="new-message"
                checked={settings.notifications.newMessage}
                onChange={(e) => handleInputChange('notifications', 'newMessage', e.target.checked)}
                className="glass-checkbox"
              />
              <label htmlFor="new-message" style={{ fontWeight: 600, color: '#ffffff' }}>رسائل جديدة</label>
            </div>
          </div>
        </div>
        <GlassButton onClick={() => handleSave('notifications')}>حفظ التغييرات</GlassButton>
      </div>
    </GlassCard>
  );

  const renderUsersSettings = () => {
    if (loading) {
      return (
        <GlassCard style={{ padding: '30px' }}>
          <div style={{ textAlign: 'center', padding: '40px', color: '#ffffff' }}>جاري التحميل...</div>
        </GlassCard>
      );
    }

    return (
      <GlassCard style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '25px', color: '#ffffff' }}>إدارة المستخدمين</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>الدور</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    لا يوجد مستخدمين
                  </td>
                </tr>
              ) : (
                users.map((userItem) => (
                  <tr key={userItem._id}>
                    <td>{userItem.name}</td>
                    <td>{userItem.email}</td>
                    <td>{userItem.phone || 'غير محدد'}</td>
                    <td>
                      {userItem.role === 'admin' ? 'مدير' :
                       userItem.role === 'supervisor' ? 'مشرف' :
                       userItem.role === 'manager' ? 'مدير' :
                       userItem.role === 'worker' ? 'عامل' : userItem.role}
                    </td>
                    <td>
                      <span className="dashboard-badge" style={{
                        background: userItem.isActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                        color: userItem.isActive ? '#4caf50' : '#f44336',
                      }}>
                        {userItem.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td>
                      {editingPassword === userItem._id ? (
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="كلمة المرور الجديدة"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              style={{
                                padding: '5px 35px 5px 10px',
                                borderRadius: '8px',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                background: 'rgba(30, 58, 95, 0.4)',
                                color: '#ffffff',
                                outline: 'none',
                                fontSize: '12px',
                                width: '200px',
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              style={{
                                position: 'absolute',
                                right: '5px',
                                background: 'transparent',
                                border: 'none',
                                color: '#ffffff',
                                cursor: 'pointer',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.opacity = '0.7';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.opacity = '1';
                              }}
                            >
                              {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                          </div>
                          <button
                            onClick={() => handleChangePassword(userItem._id)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'rgba(76, 175, 80, 0.2)',
                              color: '#4caf50',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            حفظ
                          </button>
                          <button
                            onClick={() => {
                              setEditingPassword(null);
                              setNewPassword('');
                              setShowPassword(false);
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'rgba(244, 67, 54, 0.2)',
                              color: '#f44336',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingPassword(userItem._id)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#8B5CF6',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          تغيير كلمة المرور
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    );
  };

  const renderSecuritySettings = () => (
    <GlassCard style={{ padding: '30px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '25px', color: '#ffffff' }}>إعدادات الأمان</h3>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="two-factor"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
            className="glass-checkbox"
          />
          <label htmlFor="two-factor" style={{ fontWeight: 600, color: '#ffffff' }}>المصادقة الثنائية</label>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>انتهاء الجلسة (دقيقة)</label>
          <input
            type="number"
            className="glass-input"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
            min={5}
            max={120}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>انتهاء كلمة المرور (يوم)</label>
          <input
            type="number"
            className="glass-input"
            value={settings.security.passwordExpiry}
            onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value))}
            min={30}
            max={365}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>عدد محاولات تسجيل الدخول المسموحة</label>
          <input
            type="number"
            className="glass-input"
            value={settings.security.loginAttempts}
            onChange={(e) => handleInputChange('security', 'loginAttempts', parseInt(e.target.value))}
            min={3}
            max={10}
          />
        </div>
        <GlassButton onClick={() => handleSave('security')}>حفظ التغييرات</GlassButton>
      </div>
    </GlassCard>
  );

  const renderPermissionsSettings = () => {
    if (user?.role !== 'admin') {
      return (
        <GlassCard style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '25px', color: '#ffffff' }}>
            غير مصرح
          </h3>
          <p style={{ color: '#ffffff' }}>يجب أن تكون مديراً للوصول إلى إدارة الصلاحيات</p>
        </GlassCard>
      );
    }

    const permissionLabels = {
      overview: 'نظرة عامة',
      orders: 'الطلبات',
      customers: 'العملاء',
      workers: 'العاملات',
      assistants: 'الاستقدام',
      messages: 'الرسائل',
      reports: 'التقارير',
    };

    return (
      <div>
        <GlassCard style={{ padding: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>إدارة صلاحيات المشرفين</h3>
            <GlassButton onClick={() => setShowCreateModal(true)}>إضافة مشرف جديد</GlassButton>
          </div>

          {loading && supervisors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ffffff' }}>جاري التحميل...</div>
          ) : supervisors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ffffff' }}>لا يوجد مشرفين</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {supervisors.map((supervisor) => {
                const currentPermissions = {
                  ...supervisor.permissions,
                  ...(tempPermissions[supervisor._id] || {}),
                };
                const hasChanges = tempPermissions[supervisor._id] && Object.keys(tempPermissions[supervisor._id]).length > 0;
                
                return (
                  <GlassCard key={supervisor._id} style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '5px' }}>
                          {supervisor.name}
                        </h4>
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '3px' }}>📧 {supervisor.email}</p>
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>📞 {supervisor.phone || 'غير محدد'}</p>
                      </div>
                      <GlassButton
                        onClick={() => setSelectedSupervisor(selectedSupervisor?._id === supervisor._id ? null : supervisor)}
                        style={{ padding: '8px 16px' }}
                      >
                        {selectedSupervisor?._id === supervisor._id ? 'إخفاء الصلاحيات' : 'عرض/تعديل الصلاحيات'}
                      </GlassButton>
                    </div>

                    {selectedSupervisor?._id === supervisor._id && (
                      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                          {Object.entries(permissionLabels).map(([key, label]) => (
                            <label
                              key={key}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                padding: '10px',
                                borderRadius: '8px',
                                background: currentPermissions[key] ? 'rgba(37, 150, 190, 0.1)' : 'transparent',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={currentPermissions[key] || false}
                                onChange={(e) => handlePermissionChange(supervisor._id, key, e.target.checked)}
                                className="glass-checkbox"
                              />
                              <span style={{ fontWeight: 600, color: '#ffffff' }}>{label}</span>
                            </label>
                          ))}
                        </div>
                        {hasChanges && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                            <GlassButton
                              onClick={() => {
                                setTempPermissions(prev => {
                                  const newTemp = { ...prev };
                                  delete newTemp[supervisor._id];
                                  return newTemp;
                                });
                              }}
                              style={{ background: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }}
                            >
                              إلغاء التغييرات
                            </GlassButton>
                            <GlassButton
                              onClick={() => handleSavePermissions(supervisor._id)}
                              disabled={loading}
                            >
                              {loading ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}
                            </GlassButton>
                          </div>
                        )}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          )}
        </GlassCard>

        {showCreateModal && (
          <GlassCard style={{ padding: '30px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, maxWidth: '500px', width: '90%' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '25px', color: '#ffffff' }}>إضافة مشرف جديد</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>الاسم</label>
                <input
                  type="text"
                  className="glass-input"
                  value={newSupervisor.name}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, name: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>البريد الإلكتروني</label>
                <input
                  type="email"
                  className="glass-input"
                  value={newSupervisor.email}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, email: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>كلمة المرور</label>
                <input
                  type="password"
                  className="glass-input"
                  value={newSupervisor.password}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, password: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>رقم الهاتف</label>
                <input
                  type="tel"
                  className="glass-input"
                  value={newSupervisor.phone}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, phone: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <GlassButton onClick={handleCreateSupervisor} disabled={loading}>
                  {loading ? 'جاري الإنشاء...' : 'إنشاء'}
                </GlassButton>
                <GlassButton onClick={() => setShowCreateModal(false)} style={{ background: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }}>
                  إلغاء
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    );
  };

  const renderAppearanceSettings = () => (
    <GlassCard style={{ padding: '30px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '25px', color: '#ffffff' }}>إعدادات المظهر</h3>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>المظهر</label>
          <select
            className="glass-select"
            value={settings.appearance.theme}
            onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
          >
            <option value="light">فاتح</option>
            <option value="dark">داكن</option>
            <option value="auto">تلقائي</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>اللون الأساسي</label>
          <input
            type="color"
            value={settings.appearance.primaryColor}
            onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
            style={{ width: '100px', height: '40px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.5)', cursor: 'pointer' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>عرض السايد بار (بكسل)</label>
          <input
            type="number"
            className="glass-input"
            value={settings.appearance.sidebarWidth}
            onChange={(e) => handleInputChange('appearance', 'sidebarWidth', parseInt(e.target.value))}
            min={200}
            max={400}
          />
        </div>
        <GlassButton onClick={() => handleSave('appearance')}>حفظ التغييرات</GlassButton>
      </div>
    </GlassCard>
  );

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
        marginRight: isMobile ? '0' : `${sidebarWidth}px`,
        paddingTop: '80px',
        transition: 'margin-right 0.3s ease',
      }}>
        <TopBar 
          pageTitle="الإعدادات"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div style={{ padding: '40px', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '30px' }}>
            {/* Tabs */}
            <GlassCard style={{ padding: '20px', height: 'fit-content' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: 'none',
                      background: activeTab === tab.id
                        ? 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #6366F1 100%)'
                        : 'rgba(255, 255, 255, 0.3)',
                      color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                      fontWeight: activeTab === tab.id ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'right',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Content */}
            <div>
              {activeTab === 'general' && renderGeneralSettings()}
              {activeTab === 'company' && renderCompanySettings()}
              {activeTab === 'whatsapp' && renderWhatsAppSettings()}
              {activeTab === 'users' && renderUsersSettings()}
              {activeTab === 'permissions' && renderPermissionsSettings()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

