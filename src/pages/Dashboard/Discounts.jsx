import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import Modal from '../../components/Modal';
import { discountsAPI } from '../../services/api';
import { useSelector } from 'react-redux';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const { sidebarWidth } = useSelector((state) => state.theme);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  // Fetch discounts from API
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await discountsAPI.getAll({ activeOnly: 'false' });
      if (response.success) {
        setDiscounts(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
      alert('حدث خطأ أثناء تحميل الخصومات');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const displayDiscounts = discounts.filter(discount => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      discount.title?.toLowerCase().includes(search) ||
      discount.description?.toLowerCase().includes(search) ||
      discount._id?.toLowerCase().includes(search)
    );
  });

  const getStatusBadge = (discount) => {
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);

    if (!discount.isActive) {
      return { label: '❌ غير نشط', color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.1)' };
    }

    if (now < startDate) {
      return { label: '⏳ قادم', color: '#2196f3', bg: 'rgba(33, 150, 243, 0.1)' };
    }

    if (now > endDate) {
      return { label: '⏰ منتهي', color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.1)' };
    }

    if (discount.maxUses && discount.currentUses >= discount.maxUses) {
      return { label: '🔒 مستنفذ', color: '#f44336', bg: 'rgba(244, 67, 54, 0.1)' };
    }

    return { label: '✅ نشط', color: '#4caf50', bg: 'rgba(76, 175, 80, 0.1)' };
  };

  const formatDiscountValue = (discount) => {
    if (discount.discountType === 'percentage') {
      return `${discount.discountValue}%`;
    } else {
      return `${discount.discountValue}$`;
    }
  };

  const handleViewDetails = (discount) => {
    setSelectedDiscount(discount);
    setIsEditMode(false);
    setIsAddMode(false);
    setShowDetailsModal(true);
    reset({
      title: discount.title || '',
      description: discount.description || '',
      discountType: discount.discountType || 'percentage',
      discountValue: discount.discountValue || 0,
      startDate: discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
      endDate: discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : '',
      isActive: discount.isActive !== false,
      targetType: discount.targetType || 'assistants',
      minContractDuration: discount.minContractDuration || null,
      maxUses: discount.maxUses || null,
    });
  };

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setIsEditMode(true);
    setIsAddMode(false);
    setShowDetailsModal(true);
    reset({
      title: discount.title || '',
      description: discount.description || '',
      discountType: discount.discountType || 'percentage',
      discountValue: discount.discountValue || 0,
      startDate: discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
      endDate: discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : '',
      isActive: discount.isActive !== false,
      targetType: discount.targetType || 'assistants',
      minContractDuration: discount.minContractDuration || null,
      maxUses: discount.maxUses || null,
    });
  };

  const handleAddNew = () => {
    setIsAddMode(true);
    setIsEditMode(false);
    setSelectedDiscount(null);
    setShowDetailsModal(true);
    reset({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      startDate: '',
      endDate: '',
      isActive: true,
      targetType: 'assistants',
      minContractDuration: null,
      maxUses: null,
    });
  };

  const handleDelete = async (discountId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الخصم؟')) {
      try {
        const response = await discountsAPI.delete(discountId);
        if (response.success) {
          if (selectedDiscount?._id === discountId || selectedDiscount?.id === discountId) {
            setShowDetailsModal(false);
            setSelectedDiscount(null);
          }
          alert('تم حذف الخصم بنجاح!');
          fetchDiscounts();
        } else {
          alert(response.message || 'حدث خطأ أثناء حذف الخصم');
        }
      } catch (error) {
        alert('حدث خطأ أثناء حذف الخصم: ' + error.message);
      }
    }
  };

  const onSubmitAdd = async (data) => {
    try {
      const discountData = {
        ...data,
        discountValue: parseFloat(data.discountValue),
        minContractDuration: data.minContractDuration ? parseInt(data.minContractDuration) : null,
        maxUses: data.maxUses ? parseInt(data.maxUses) : null,
      };
      const response = await discountsAPI.create(discountData);
      if (response.success) {
        setShowDetailsModal(false);
        setIsAddMode(false);
        reset();
        fetchDiscounts();
        alert('تم إضافة الخصم بنجاح!');
      } else {
        alert(response.message || 'حدث خطأ أثناء إضافة الخصم');
      }
    } catch (error) {
      alert('حدث خطأ أثناء إضافة الخصم: ' + error.message);
    }
  };

  const onSubmitEdit = async (data) => {
    if (!selectedDiscount) return;
    try {
      const discountData = {
        ...data,
        discountValue: parseFloat(data.discountValue),
        minContractDuration: data.minContractDuration ? parseInt(data.minContractDuration) : null,
        maxUses: data.maxUses ? parseInt(data.maxUses) : null,
      };
      const response = await discountsAPI.update(selectedDiscount._id || selectedDiscount.id, discountData);
      if (response.success) {
        setShowDetailsModal(false);
        setIsEditMode(false);
        setSelectedDiscount(null);
        reset();
        fetchDiscounts();
        alert('تم تحديث الخصم بنجاح!');
      } else {
        alert(response.message || 'حدث خطأ أثناء تحديث الخصم');
      }
    } catch (error) {
      alert('حدث خطأ أثناء تحديث الخصم: ' + error.message);
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
        marginRight: isMobile ? '0' : `${sidebarWidth}px`,
        paddingTop: '80px',
        transition: 'margin-right 0.3s ease',
      }}>
        <TopBar 
          pageTitle="إدارة الخصومات" 
          onSearch={handleSearch}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div style={{ padding: '40px', flex: 1 }}>
          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <GlassButton
              onClick={handleAddNew}
              style={{
                background: '#374dbe',
                color: '#ffffff',
                fontWeight: 700,
                padding: '12px 24px',
                fontSize: '16px',
                border: 'none',
              }}
            >
              ➕ إضافة خصم جديد
            </GlassButton>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '24px', color: '#334155', fontWeight: 600 }}>جاري التحميل...</div>
            </div>
          ) : displayDiscounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '24px', color: '#334155', fontWeight: 600 }}>لا توجد خصومات مسجلة حالياً</div>
            </div>
          ) : (
            <div className="cards-grid-container" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '30px',
              justifyContent: 'center',
            }}>
              {displayDiscounts.map((discount) => {
                const status = getStatusBadge(discount);
                return (
                  <GlassCard key={discount._id || discount.id} style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>
                          {discount.title}
                        </h3>
                        {discount.description && (
                          <p style={{ color: '#64748b', marginBottom: '15px', fontSize: '14px', lineHeight: 1.6 }}>
                            {discount.description}
                          </p>
                        )}
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        background: status.bg,
                        color: status.color,
                        fontSize: '12px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}>
                        {status.label}
                      </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '32px', fontWeight: 900, color: '#3b82f6' }}>
                          {formatDiscountValue(discount)}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '14px' }}>
                          {discount.discountType === 'percentage' ? 'خصم' : 'خصم ثابت'}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '15px', fontSize: '14px', color: '#64748b' }}>
                      <div style={{ marginBottom: '5px' }}>
                        <strong style={{ color: '#0f172a' }}>الهدف:</strong> {
                          discount.targetType === 'assistants' ? 'الاستقدام' :
                          discount.targetType === 'workers' ? 'العاملات' : 'الكل'
                        }
                      </div>
                      <div style={{ marginBottom: '5px' }}>
                        <strong style={{ color: '#0f172a' }}>من:</strong> {new Date(discount.startDate).toLocaleDateString('ar-SA', { calendar: 'gregory' })}
                      </div>
                      <div style={{ marginBottom: '5px' }}>
                        <strong style={{ color: '#0f172a' }}>إلى:</strong> {new Date(discount.endDate).toLocaleDateString('ar-SA', { calendar: 'gregory' })}
                      </div>
                      {discount.maxUses && (
                        <div>
                          <strong style={{ color: '#0f172a' }}>الاستخدامات:</strong> {discount.currentUses} / {discount.maxUses}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                      <button
                        onClick={() => handleViewDetails(discount)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: '#f1f5f9',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#0f172a',
                          fontWeight: 600,
                          fontSize: '14px',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#e2e8f0';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#f1f5f9';
                        }}
                      >
                        عرض
                      </button>
                      <button
                        onClick={() => handleEdit(discount)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: '#374dbe',
                          border: '1px solid #374dbe',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '14px',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#2d3fa0';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#374dbe';
                          e.target.style.color = '#ffffff';
                        }}
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(discount._id || discount.id)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: 'rgba(244, 67, 54, 0.1)',
                          border: '1px solid rgba(244, 67, 54, 0.3)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#f44336',
                          fontWeight: 600,
                          fontSize: '14px',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(244, 67, 54, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(244, 67, 54, 0.1)';
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
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
            setSelectedDiscount(null);
            reset();
          }}
          title={isAddMode ? 'إضافة خصم جديد' : isEditMode ? 'تعديل الخصم' : 'تفاصيل الخصم'}
        >
          {isAddMode || isEditMode ? (
            <form onSubmit={handleSubmit(isAddMode ? onSubmitAdd : onSubmitEdit)}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>
                    العنوان *
                  </label>
                  <input
                    {...register('title', { required: 'العنوان مطلوب' })}
                    className="glass-input"
                    style={{ width: '100%' }}
                  />
                  {errors.title && (
                    <span style={{ color: '#f44336', fontSize: '12px' }}>{errors.title.message}</span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>
                    الوصف
                  </label>
                  <textarea
                    {...register('description')}
                    className="glass-input"
                    style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>
                      نوع الخصم *
                    </label>
                    <select
                      {...register('discountType', { required: 'نوع الخصم مطلوب' })}
                      className="glass-select"
                      style={{ width: '100%' }}
                    >
                      <option value="percentage">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت ($)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>
                      قيمة الخصم *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('discountValue', { 
                        required: 'قيمة الخصم مطلوبة',
                        min: { value: 0, message: 'القيمة يجب أن تكون أكبر من 0' },
                        validate: (value) => {
                          const type = watch('discountType');
                          if (type === 'percentage' && value > 100) {
                            return 'النسبة لا يمكن أن تكون أكثر من 100%';
                          }
                          return true;
                        }
                      })}
                      className="glass-input"
                      style={{ width: '100%' }}
                    />
                    {errors.discountValue && (
                      <span style={{ color: '#f44336', fontSize: '12px' }}>{errors.discountValue.message}</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>
                      تاريخ البدء *
                    </label>
                    <input
                      type="date"
                      {...register('startDate', { required: 'تاريخ البدء مطلوب' })}
                      className="glass-input"
                      style={{ width: '100%' }}
                    />
                    {errors.startDate && (
                      <span style={{ color: '#f44336', fontSize: '12px' }}>{errors.startDate.message}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>
                      تاريخ الانتهاء *
                    </label>
                    <input
                      type="date"
                      {...register('endDate', { required: 'تاريخ الانتهاء مطلوب' })}
                      className="glass-input"
                      style={{ width: '100%' }}
                    />
                    {errors.endDate && (
                      <span style={{ color: '#f44336', fontSize: '12px' }}>{errors.endDate.message}</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>
                      نوع الخدمة المستهدفة
                    </label>
                    <select
                      {...register('targetType')}
                      className="glass-select"
                      style={{ width: '100%' }}
                    >
                      <option value="assistants">الاستقدام</option>
                      <option value="workers">العاملات</option>
                      <option value="all">الكل</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>
                      الحالة
                    </label>
                    <select
                      {...register('isActive')}
                      className="glass-select"
                      style={{ width: '100%' }}
                    >
                      <option value={true}>نشط</option>
                      <option value={false}>غير نشط</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>
                      الحد الأدنى لمدة العقد (شهور)
                    </label>
                    <input
                      type="number"
                      {...register('minContractDuration')}
                      className="glass-input"
                      style={{ width: '100%' }}
                      placeholder="اتركه فارغاً للجميع"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a' }}>
                      الحد الأقصى للاستخدامات
                    </label>
                    <input
                      type="number"
                      {...register('maxUses')}
                      className="glass-input"
                      style={{ width: '100%' }}
                      placeholder="اتركه فارغاً لغير محدود"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <GlassButton
                    type="button"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setIsAddMode(false);
                      setIsEditMode(false);
                      setSelectedDiscount(null);
                      reset();
                    }}
                    style={{ background: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }}
                  >
                    إلغاء
                  </GlassButton>
                  <GlassButton
                    type="submit"
                    style={{ background: '#374dbe', color: '#ffffff', border: 'none' }}
                  >
                    {isAddMode ? 'إضافة' : 'حفظ التغييرات'}
                  </GlassButton>
                </div>
              </div>
            </form>
          ) : selectedDiscount ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <p style={{ color: '#0f172a', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>العنوان</p>
                <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>{selectedDiscount.title}</p>
              </div>

              {selectedDiscount.description && (
                <div>
                  <p style={{ color: '#0f172a', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>الوصف</p>
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>{selectedDiscount.description}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <p style={{ color: '#0f172a', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>نوع الخصم</p>
                  <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>
                    {selectedDiscount.discountType === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#0f172a', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>قيمة الخصم</p>
                  <p style={{ color: '#3b82f6', fontWeight: 900, fontSize: '24px' }}>
                    {formatDiscountValue(selectedDiscount)}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <p style={{ color: '#0f172a', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>تاريخ البدء</p>
                  <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>
                    {new Date(selectedDiscount.startDate).toLocaleDateString('ar-SA', { calendar: 'gregory' })}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#0f172a', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>تاريخ الانتهاء</p>
                  <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>
                    {new Date(selectedDiscount.endDate).toLocaleDateString('ar-SA', { calendar: 'gregory' })}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <p style={{ color: '#0f172a', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>نوع الخدمة</p>
                  <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>
                    {selectedDiscount.targetType === 'assistants' ? 'الاستقدام' :
                     selectedDiscount.targetType === 'workers' ? 'العاملات' : 'الكل'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#0f172a', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>الحالة</p>
                  <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>
                    {selectedDiscount.isActive ? '✅ نشط' : '❌ غير نشط'}
                  </p>
                </div>
              </div>

              {selectedDiscount.minContractDuration && (
                <div>
                  <p style={{ color: '#0f172a', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>الحد الأدنى لمدة العقد</p>
                  <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>
                    {selectedDiscount.minContractDuration} شهر
                  </p>
                </div>
              )}

              {selectedDiscount.maxUses && (
                <div>
                  <p style={{ color: '#0f172a', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>الاستخدامات</p>
                  <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>
                    {selectedDiscount.currentUses || 0} / {selectedDiscount.maxUses}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDiscount(null);
                    reset();
                  }}
                  className="glass-button glass-button-secondary"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => handleEdit(selectedDiscount)}
                  className="glass-button"
                >
                  تعديل
                </button>
              </div>
            </div>
          ) : null}
        </Modal>
      )}
    </div>
  );
};

export default Discounts;

