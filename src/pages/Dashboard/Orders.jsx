import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import Modal from '../../components/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderById, deleteOrderById, confirmOrderById } from '../../store/slices/ordersSlice';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { sidebarWidth } = useSelector((state) => state.theme);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Fetch orders from API
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const displayOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      order._id?.toLowerCase().includes(search) ||
      order.customerName?.toLowerCase().includes(search) ||
      order.customerPhone?.includes(search) ||
      order.orderNumber?.toLowerCase().includes(search)
    );
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'قيد الانتظار', class: 'badge-pending' },
      confirmed: { label: 'مؤكد', class: 'badge-confirmed' },
      'in-progress': { label: 'جاري التنفيذ', class: 'badge-in-progress' },
      done: { label: 'مكتمل', class: 'badge-done' },
      cancelled: { label: 'ملغي', class: 'badge-cancelled' },
    };
    return badges[status] || badges.pending;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsEditMode(false);
    setShowDetailsModal(true);
    // Reset form with order data
    reset({
      status: order.status,
      date: order.date instanceof Date ? order.date : new Date(order.date),
      time: order.time,
      workers: order.workers,
      amount: order.amount,
    });
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsEditMode(true);
    setShowDetailsModal(true);
    reset({
      status: order.status,
      date: order.date instanceof Date ? order.date : new Date(order.date),
      time: order.time,
      workers: order.workers,
      amount: order.amount,
    });
  };

        const handleDelete = async (orderId) => {
          if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
            const result = await dispatch(deleteOrderById(orderId));
            if (deleteOrderById.fulfilled.match(result)) {
              if (selectedOrder?._id === orderId || selectedOrder?.id === orderId) {
                setShowDetailsModal(false);
                setSelectedOrder(null);
              }
              alert('تم حذف الطلب بنجاح!');
            } else {
              alert(result.payload || 'حدث خطأ أثناء حذف الطلب');
            }
          }
        };

        const onSubmitEdit = async (data) => {
          if (selectedOrder) {
            const orderId = selectedOrder._id || selectedOrder.id;
            const orderData = {
              ...data,
              date: data.date instanceof Date ? data.date.toISOString() : data.date,
            };
            const result = await dispatch(updateOrderById({ id: orderId, orderData }));
            if (updateOrderById.fulfilled.match(result)) {
              setShowDetailsModal(false);
              setIsEditMode(false);
              setSelectedOrder(null);
              alert('تم تحديث الطلب بنجاح!');
            } else {
              alert(result.payload || 'حدث خطأ أثناء تحديث الطلب');
            }
          }
        };

  const getServiceTypeLabel = (type) => {
    const types = {
      comprehensive: 'تنظيف شامل',
      normal: 'تنظيف عادي',
      quick: 'تنظيف سريع',
    };
    return types[type] || type;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('ar-SA', { calendar: 'gregory' });
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
        marginRight: window.innerWidth <= 1024 ? '0' : `${sidebarWidth}px`,
        paddingTop: '80px',
        transition: 'margin-right 0.3s ease',
      }}>
        <TopBar 
          pageTitle="إدارة الطلبات" 
          onSearch={handleSearch}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div style={{ padding: '40px', flex: 1 }}>
          {/* Filters */}
          <div className="dashboard-chart-card" style={{ marginBottom: '30px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}>
              <input
                type="text"
                placeholder="ابحث بالاسم أو رقم الطلب..."
                style={{
                  padding: '12px 16px',
                  background: 'rgba(30, 58, 95, 0.4)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  outline: 'none',
                }}
              />
              <select style={{
                padding: '12px 16px',
                background: 'rgba(30, 58, 95, 0.4)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                color: 'rgba(255, 255, 255, 0.9)',
                outline: 'none',
              }}>
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="confirmed">مؤكد</option>
                <option value="in-progress">جاري التنفيذ</option>
                <option value="done">مكتمل</option>
              </select>
              <input 
                type="date" 
                style={{
                  padding: '12px 16px',
                  background: 'rgba(30, 58, 95, 0.4)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  outline: 'none',
                }}
              />
              <button style={{
                padding: '12px 24px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
                e.currentTarget.style.background = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = '#3b82f6';
              }}
              >تصفية</button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="dashboard-table-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>تاريخ الإنشاء</th>
                    <th>العميل</th>
                    <th>الهاتف</th>
                    <th>الخدمة</th>
                    <th>التاريخ</th>
                    <th>الوقت</th>
                    <th>العاملات</th>
                    <th>الحالة</th>
                    <th>المبلغ</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {displayOrders.map((order) => {
                    const status = getStatusBadge(order.status);
                    return (
                      <tr key={order._id || order.id} style={{ cursor: 'pointer' }}>
                              <td onClick={() => handleViewDetails(order)}>{order.orderNumber || order._id || order.id}</td>
                        <td onClick={() => handleViewDetails(order)}>{formatDate(order.createdAt || order.date)}</td>
                        <td onClick={() => handleViewDetails(order)}>{order.fullName || order.customer}</td>
                        <td onClick={() => handleViewDetails(order)}>{order.phone}</td>
                        <td onClick={() => handleViewDetails(order)}>{getServiceTypeLabel(order.serviceType || order.service)}</td>
                        <td onClick={() => handleViewDetails(order)}>{formatDate(order.date)}</td>
                        <td onClick={() => handleViewDetails(order)}>{order.time}</td>
                        <td onClick={() => handleViewDetails(order)}>{order.workers}</td>
                        <td onClick={() => handleViewDetails(order)}>
                          <span className={`glass-badge ${status.class}`}>
                            {status.label}
                          </span>
                        </td>
                        <td onClick={() => handleViewDetails(order)}>{order.amount || 0} ريال</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                              onClick={() => handleViewDetails(order)}
                              style={{
                                background: 'rgba(37, 150, 190, 0.2)',
                                border: '1px solid rgba(37, 150, 190, 0.4)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                color: 'rgba(37, 150, 190, 1)',
                                fontWeight: 600,
                                transition: 'all 0.3s',
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(37, 150, 190, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(37, 150, 190, 0.2)';
                              }}
                            >
                              عرض
                            </button>
                            <button 
                              onClick={() => handleEdit(order)}
                              style={{
                                background: 'rgba(255, 255, 255, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                color: '#000000',
                                fontWeight: 600,
                                transition: 'all 0.3s',
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
                                    onClick={() => handleDelete(order._id || order.id)}
                              style={{
                                background: 'rgba(244, 67, 54, 0.2)',
                                border: '1px solid rgba(244, 67, 54, 0.4)',
                                borderRadius: '8px',
                                padding: '8px 12px',
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details/Edit Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => {
        setShowDetailsModal(false);
        setIsEditMode(false);
        setSelectedOrder(null);
      }} size="large">
        {selectedOrder && (
          <div style={{ padding: '40px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '30px' }}>
                    {isEditMode ? 'تعديل الطلب' : 'تفاصيل الطلب'} #{selectedOrder.orderNumber || selectedOrder._id || selectedOrder.id}
                  </h2>
            
            {isEditMode ? (
              <form onSubmit={handleSubmit(onSubmitEdit)}>
                <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                  <GlassCard style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>معلومات العميل</h3>
                    <p style={{ marginBottom: '10px' }}><strong>الاسم:</strong> {selectedOrder.fullName || selectedOrder.customer}</p>
                    <p><strong>الهاتف:</strong> {selectedOrder.phone}</p>
                    {selectedOrder.email && <p><strong>البريد:</strong> {selectedOrder.email}</p>}
                  </GlassCard>

                  <GlassCard style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>تفاصيل الخدمة</h3>
                    <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>نوع الخدمة</label>
                      <p>{getServiceTypeLabel(selectedOrder.serviceType || selectedOrder.service)}</p>
                    </div>
                    <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>الحالة</label>
                      <select className="glass-select" {...register('status', { required: true })}>
                        <option value="pending">قيد الانتظار</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="in-progress">جاري التنفيذ</option>
                        <option value="done">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </div>
                    <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>التاريخ</label>
                      <input
                        type="date"
                        className="glass-input"
                        {...register('date', { required: true, valueAsDate: true })}
                      />
                    </div>
                    <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>الوقت</label>
                      <input
                        type="time"
                        className="glass-input"
                        {...register('time', { required: true })}
                      />
                    </div>
                    <div className="glass-input-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>عدد العاملات</label>
                      <input
                        type="number"
                        className="glass-input"
                        min="1"
                        max="5"
                        {...register('workers', { required: true, valueAsNumber: true })}
                      />
                    </div>
                    <div className="glass-input-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>المبلغ (ريال)</label>
                      <input
                        type="number"
                        className="glass-input"
                        min="0"
                        {...register('amount', { required: true, valueAsNumber: true })}
                      />
                    </div>
                  </GlassCard>

                  {selectedOrder.address && (
                    <GlassCard style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>العنوان</h3>
                      <p><strong>المدينة:</strong> {selectedOrder.city === 'riyadh' ? 'الرياض' : selectedOrder.city === 'jeddah' ? 'جدة' : selectedOrder.city === 'dammam' ? 'الدمام' : selectedOrder.city === 'khobar' ? 'الخبر' : selectedOrder.city}</p>
                      <p><strong>العنوان:</strong> {selectedOrder.address}</p>
                      {selectedOrder.district && <p><strong>الحي:</strong> {selectedOrder.district}</p>}
                      {selectedOrder.apartment && <p><strong>رقم الشقة:</strong> {selectedOrder.apartment}</p>}
                    </GlassCard>
                  )}
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
            ) : (
              <>
                <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                  <GlassCard style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>معلومات العميل</h3>
                    <p style={{ marginBottom: '10px' }}><strong>الاسم:</strong> {selectedOrder.fullName || selectedOrder.customer}</p>
                    <p style={{ marginBottom: '10px' }}><strong>الهاتف:</strong> {selectedOrder.phone}</p>
                    {selectedOrder.email && <p><strong>البريد:</strong> {selectedOrder.email}</p>}
                  </GlassCard>
                  <GlassCard style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>تفاصيل الخدمة</h3>
                    <p style={{ marginBottom: '10px' }}><strong>نوع الخدمة:</strong> {getServiceTypeLabel(selectedOrder.serviceType || selectedOrder.service)}</p>
                    <p style={{ marginBottom: '10px' }}><strong>الحالة:</strong> 
                      <span className={`glass-badge ${getStatusBadge(selectedOrder.status).class}`} style={{ marginRight: '10px' }}>
                        {getStatusBadge(selectedOrder.status).label}
                      </span>
                    </p>
                    <p style={{ marginBottom: '10px' }}><strong>عدد العاملات:</strong> {selectedOrder.workers}</p>
                    <p style={{ marginBottom: '10px' }}><strong>التاريخ:</strong> {formatDate(selectedOrder.date)}</p>
                    <p style={{ marginBottom: '10px' }}><strong>الوقت:</strong> {selectedOrder.time}</p>
                    <p><strong>المبلغ:</strong> {selectedOrder.amount || 0} ريال</p>
                  </GlassCard>
                  {selectedOrder.address && (
                    <GlassCard style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>العنوان</h3>
                      <p style={{ marginBottom: '10px' }}><strong>المدينة:</strong> {selectedOrder.city === 'riyadh' ? 'الرياض' : selectedOrder.city === 'jeddah' ? 'جدة' : selectedOrder.city === 'dammam' ? 'الدمام' : selectedOrder.city === 'khobar' ? 'الخبر' : selectedOrder.city}</p>
                      <p style={{ marginBottom: '10px' }}><strong>العنوان:</strong> {selectedOrder.address}</p>
                      {selectedOrder.district && <p style={{ marginBottom: '10px' }}><strong>الحي:</strong> {selectedOrder.district}</p>}
                      {selectedOrder.apartment && <p><strong>رقم الشقة:</strong> {selectedOrder.apartment}</p>}
                    </GlassCard>
                  )}
                  {selectedOrder.notes && (
                    <GlassCard style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>ملاحظات</h3>
                      <p>{selectedOrder.notes}</p>
                    </GlassCard>
                  )}
                  {selectedOrder.selectedWorkerId && (
                    <GlassCard style={{ padding: '20px', background: 'rgba(37, 150, 190, 0.15)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>العاملة المختارة</h3>
                      {typeof selectedOrder.selectedWorkerId === 'object' ? (
                        <>
                          <p style={{ marginBottom: '10px' }}><strong>الاسم:</strong> {selectedOrder.selectedWorkerId.arabicName || selectedOrder.selectedWorkerId.name || 'غير محدد'}</p>
                          <p style={{ marginBottom: '10px' }}><strong>رقم الهاتف:</strong> {selectedOrder.selectedWorkerId.phone || 'غير محدد'}</p>
                          <p style={{ marginBottom: '10px' }}><strong>الحالة:</strong> {selectedOrder.selectedWorkerId.status === 'available' ? '✅ متاحة' : selectedOrder.selectedWorkerId.status === 'busy' ? '⏳ مشغولة' : selectedOrder.selectedWorkerId.status}</p>
                          <p style={{ marginBottom: '10px' }}><strong>نوع العقد:</strong> {
                            selectedOrder.selectedWorkerId.contractType === 'hourly' ? '⏰ بالساعة' :
                            selectedOrder.selectedWorkerId.contractType === 'daily' ? '📅 باليوم' :
                            selectedOrder.selectedWorkerId.contractType === 'monthly' ? '📅 عقد شهري' :
                            selectedOrder.selectedWorkerId.contractType === 'yearly' ? '📆 عقد سنوي' : 'غير محدد'
                          }</p>
                          {selectedOrder.selectedWorkerId.skills && selectedOrder.selectedWorkerId.skills.length > 0 && (
                            <p><strong>المهارات:</strong> {selectedOrder.selectedWorkerId.skills.join('، ')}</p>
                          )}
                        </>
                      ) : (
                        <p>جارٍ تحميل بيانات العاملة...</p>
                      )}
                      {selectedOrder.whatsappSent && (
                        <p style={{ marginTop: '15px', color: '#4caf50', fontWeight: 600 }}>✅ تم إرسال بيانات العاملة على واتساب</p>
                      )}
                    </GlassCard>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <GlassButton onClick={() => setIsEditMode(true)}>تعديل الطلب</GlassButton>
                  {selectedOrder.status !== 'confirmed' && !selectedOrder.whatsappSent && (
                    <GlassButton 
                      variant="secondary"
                      onClick={async () => {
                        if (window.confirm('هل تريد قبول الطلب وإرسال رسالة تأكيد على واتساب العميل؟')) {
                          const result = await dispatch(confirmOrderById(selectedOrder._id || selectedOrder.id));
                          if (confirmOrderById.fulfilled.match(result)) {
                            alert('✅ تم قبول الطلب وإرسال رسالة التأكيد على واتساب العميل!');
                            setSelectedOrder(result.payload);
                            dispatch(fetchOrders());
                          } else {
                            alert(result.payload || 'حدث خطأ أثناء قبول الطلب');
                          }
                        }
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                        border: '2px solid #4caf50',
                      }}
                    >
                      ✅ قبول الطلب وإرسال واتساب
                    </GlassButton>
                  )}
                  {selectedOrder.status === 'confirmed' && selectedOrder.whatsappSent && (
                    <GlassButton variant="secondary" disabled style={{ opacity: 0.6 }}>
                      ✅ تم القبول وإرسال واتساب
                    </GlassButton>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;

