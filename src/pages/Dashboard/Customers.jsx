import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import Modal from '../../components/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCustomers, createCustomer, updateCustomerById, deleteCustomerById } from '../../store/slices/customersSlice';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customers);
  const { sidebarWidth } = useSelector((state) => state.theme);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Fetch customers from API
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const displayCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.phone?.includes(search) ||
      customer.email?.toLowerCase().includes(search)
    );
  });

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsEditMode(false);
    setShowDetailsModal(true);
    reset({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
    });
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsEditMode(false);
    setIsAddMode(true);
    setShowDetailsModal(true);
    reset({
      name: '',
      phone: '',
      email: '',
      address: '',
    });
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsEditMode(true);
    setIsAddMode(false);
    setShowDetailsModal(true);
    reset({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
    });
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      const result = await dispatch(deleteCustomerById(customerId));
      if (deleteCustomerById.fulfilled.match(result)) {
        if (selectedCustomer?._id === customerId || selectedCustomer?.id === customerId) {
          setShowDetailsModal(false);
          setSelectedCustomer(null);
        }
        alert('تم حذف العميل بنجاح!');
      } else {
        alert(result.payload || 'حدث خطأ أثناء حذف العميل');
      }
    }
  };

  const onSubmitAdd = async (data) => {
    const result = await dispatch(createCustomer(data));
    if (createCustomer.fulfilled.match(result)) {
      setShowDetailsModal(false);
      setIsAddMode(false);
      setSelectedCustomer(null);
      alert('تم إضافة العميل بنجاح!');
    } else {
      alert(result.payload || 'حدث خطأ أثناء إضافة العميل');
    }
  };

  const onSubmitEdit = async (data) => {
    if (selectedCustomer) {
      const customerId = selectedCustomer._id || selectedCustomer.id;
      const result = await dispatch(updateCustomerById({ id: customerId, customerData: data }));
      if (updateCustomerById.fulfilled.match(result)) {
        setShowDetailsModal(false);
        setIsEditMode(false);
        setIsAddMode(false);
        setSelectedCustomer(null);
        alert('تم تحديث بيانات العميل بنجاح!');
      } else {
        alert(result.payload || 'حدث خطأ أثناء تحديث العميل');
      }
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
          pageTitle="إدارة العملاء" 
          onSearch={handleSearch}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div style={{ padding: '40px', flex: 1 }}>
          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <GlassButton
              onClick={handleAddNew}
              style={{
                background: 'linear-gradient(135deg, rgba(10, 40, 81, 1) 0%, rgba(10, 40, 81, 0.9) 50%, rgba(10, 40, 81, 1) 100%)',
                color: 'white',
                fontWeight: 700,
                padding: '12px 24px',
                fontSize: '16px',
              }}
            >
              ➕ إضافة عميل جديد
            </GlassButton>
          </div>
          {displayCustomers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '24px', color: '#0f172a', fontWeight: 600 }}>
                لا يوجد عملاء بعد
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '30px',
              justifyContent: 'center',
            }} className="cards-grid">
              {displayCustomers.map((customer) => (
              <div key={customer._id || customer.id} className="dashboard-stats-card" style={{ padding: '30px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(37, 150, 190, 0.9) 0%, rgba(37, 150, 190, 0.8) 25%, rgba(37, 150, 190, 0.7) 50%, rgba(29, 120, 152, 0.8) 75%, rgba(22, 90, 114, 0.9) 100%)',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  color: 'white',
                }}>
                  {customer.name && customer.name.length > 0 ? customer.name[0] : '?'}
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px', color: '#0f172a', letterSpacing: '-0.3px' }}>
                  {customer.name}
                </h3>
                <p style={{ color: '#334155', marginBottom: '5px', fontWeight: 600, fontSize: '15px' }}>📞 {customer.phone}</p>
                <p style={{ color: '#334155', marginBottom: '20px', fontWeight: 600, fontSize: '15px' }}>📧 {customer.email}</p>
                <div style={{ padding: '15px', marginBottom: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <p style={{ color: '#0f172a', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>عدد الطلبات: {customer.orders || 0}</p>
                  <p style={{ color: '#0f172a', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>آخر طلب: {customer.lastOrder || 'لا يوجد'}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleViewDetails(customer);
                    }}
                    style={{
                      background: '#3b82f6',
                      border: '1px solid #3b82f6',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      color: '#ffffff',
                      fontWeight: 600,
                      transition: 'all 0.3s',
                      position: 'relative',
                      zIndex: 10,
                      pointerEvents: 'auto',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#2563eb';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#3b82f6';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    عرض
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(customer);
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      color: '#0f172a',
                      fontWeight: 600,
                      transition: 'all 0.3s',
                      position: 'relative',
                      zIndex: 10,
                      pointerEvents: 'auto',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f1f5f9';
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#ffffff';
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    تعديل
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(customer._id || customer.id);
                    }}
                    style={{
                      background: 'rgba(244, 67, 54, 0.2)',
                      border: '1px solid rgba(244, 67, 54, 0.4)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      color: '#f44336',
                      fontWeight: 600,
                      transition: 'all 0.3s',
                      position: 'relative',
                      zIndex: 10,
                      pointerEvents: 'auto',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(244, 67, 54, 0.3)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(244, 67, 54, 0.2)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Details/Edit/Add Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => {
        setShowDetailsModal(false);
        setIsEditMode(false);
        setIsAddMode(false);
        setSelectedCustomer(null);
        reset();
      }} size="large">
        <div style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '30px', color: '#0f172a' }}>
            {isAddMode ? 'إضافة عميل جديد' : isEditMode ? 'تعديل بيانات العميل' : 'تفاصيل العميل'}
          </h2>
          
          {isAddMode ? (
            <form onSubmit={handleSubmit(onSubmitAdd)}>
              <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                <GlassCard style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: '#0f172a' }}>المعلومات الشخصية</h3>
                  <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>الاسم *</label>
                    <input
                      type="text"
                      className="glass-input"
                      {...register('name', { required: 'الاسم مطلوب', minLength: { value: 3, message: 'الاسم يجب أن يكون 3 أحرف على الأقل' } })}
                    />
                    {errors.name && <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>{errors.name.message}</p>}
                  </div>
                  <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>رقم الهاتف *</label>
                    <input
                      type="tel"
                      className="glass-input"
                      {...register('phone', { required: 'رقم الهاتف مطلوب', minLength: { value: 7, message: 'رقم الهاتف يجب أن يكون 7 أرقام على الأقل' }, maxLength: { value: 20, message: 'رقم الهاتف يجب أن يكون 20 رقم على الأكثر' }, pattern: { value: /^[\+]?[0-9\s\-\(\)]{7,20}$/, message: 'رقم الهاتف غير صحيح' } })}
                    />
                    {errors.phone && <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>{errors.phone.message}</p>}
                  </div>
                  <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="glass-input"
                      {...register('email', { pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'البريد الإلكتروني غير صحيح' } })}
                    />
                    {errors.email && <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>{errors.email.message}</p>}
                  </div>
                  <div className="glass-input-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>العنوان</label>
                    <input
                      type="text"
                      className="glass-input"
                      {...register('address')}
                    />
                  </div>
                </GlassCard>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <GlassButton type="submit">إضافة العميل</GlassButton>
                <GlassButton 
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setIsAddMode(false);
                    reset();
                  }}
                >
                  إلغاء
                </GlassButton>
              </div>
            </form>
          ) : isEditMode ? (
              <form onSubmit={handleSubmit(onSubmitEdit)}>
                <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                  <GlassCard style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>المعلومات الشخصية</h3>
                    <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>الاسم</label>
                      <input
                        type="text"
                        className="glass-input"
                        {...register('name', { required: 'الاسم مطلوب', minLength: { value: 3, message: 'الاسم يجب أن يكون 3 أحرف على الأقل' } })}
                      />
                      {errors.name && <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>{errors.name.message}</p>}
                    </div>
                    <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>رقم الهاتف</label>
                      <input
                        type="tel"
                        className="glass-input"
                        {...register('phone', { required: 'رقم الهاتف مطلوب', minLength: { value: 7, message: 'رقم الهاتف يجب أن يكون 7 أرقام على الأقل' }, maxLength: { value: 20, message: 'رقم الهاتف يجب أن يكون 20 رقم على الأكثر' }, pattern: { value: /^[\+]?[0-9\s\-\(\)]{7,20}$/, message: 'رقم الهاتف غير صحيح' } })}
                      />
                      {errors.phone && <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>{errors.phone.message}</p>}
                    </div>
                    <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>البريد الإلكتروني</label>
                      <input
                        type="email"
                        className="glass-input"
                        {...register('email', { pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'البريد الإلكتروني غير صحيح' } })}
                      />
                      {errors.email && <p style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>{errors.email.message}</p>}
                    </div>
                    <div className="glass-input-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>العنوان</label>
                      <input
                        type="text"
                        className="glass-input"
                        {...register('address')}
                      />
                    </div>
                  </GlassCard>
                  <GlassCard style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>الإحصائيات</h3>
                    <p style={{ marginBottom: '10px' }}><strong>عدد الطلبات:</strong> {selectedCustomer.orders || 0}</p>
                    <p style={{ marginBottom: '10px' }}><strong>آخر طلب:</strong> {selectedCustomer.lastOrder || 'لا يوجد'}</p>
                  </GlassCard>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <GlassButton type="submit">حفظ التعديلات</GlassButton>
                  <GlassButton 
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditMode(false)}
                  >
                    إلغاء
                  </GlassButton>
                </div>
              </form>
          ) : selectedCustomer ? (
            <>
              <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                <GlassCard style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: '#0f172a' }}>المعلومات الشخصية</h3>
                  <p style={{ marginBottom: '10px', color: '#0f172a' }}><strong>الاسم:</strong> {selectedCustomer.name}</p>
                  <p style={{ marginBottom: '10px', color: '#0f172a' }}><strong>رقم الهاتف:</strong> {selectedCustomer.phone}</p>
                    {selectedCustomer.email && <p style={{ marginBottom: '10px' }}><strong>البريد الإلكتروني:</strong> {selectedCustomer.email}</p>}
                    {selectedCustomer.address && <p><strong>العنوان:</strong> {selectedCustomer.address}</p>}
                  </GlassCard>
                  <GlassCard style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>الإحصائيات</h3>
                    <p style={{ marginBottom: '10px' }}><strong>عدد الطلبات:</strong> {selectedCustomer.orders || 0}</p>
                    <p style={{ marginBottom: '10px' }}><strong>آخر طلب:</strong> {selectedCustomer.lastOrder || 'لا يوجد'}</p>
                  </GlassCard>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <GlassButton onClick={() => setIsEditMode(true)}>تعديل البيانات</GlassButton>
                  <GlassButton variant="secondary">عرض الطلبات</GlassButton>
                </div>
              </>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default Customers;

