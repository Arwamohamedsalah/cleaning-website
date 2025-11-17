import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import Modal from '../../components/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchApplications, updateApplicationById, acceptApplicationById, rejectApplicationById, deleteApplicationById } from '../../store/slices/applicationsSlice';
import { createWorker } from '../../store/slices/workersSlice';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';

const Applications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.applications);
  const { sidebarWidth } = useSelector((state) => state.theme);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch applications from API
  useEffect(() => {
    dispatch(fetchApplications({ status: activeTab === 'all' ? undefined : activeTab }));
  }, [dispatch, activeTab]);

  const displayApplications = applications;

  const filteredApplications = displayApplications.filter(app => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const matchesSearch = !searchTerm || 
      app.arabicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleAccept = async (application) => {
    if (window.confirm('هل أنت متأكد من قبول هذه الطلبية؟')) {
      const applicationId = application._id || application.id;
      const result = await dispatch(acceptApplicationById(applicationId));
      if (acceptApplicationById.fulfilled.match(result)) {
        setShowDetailsModal(false);
        alert('تم قبول الطلبية وإضافة العاملة بنجاح!');
        dispatch(fetchApplications({ status: activeTab === 'all' ? undefined : activeTab }));
      } else {
        alert(result.payload || 'حدث خطأ أثناء قبول الطلبية');
      }
    }
  };

  const handleReject = async (application) => {
    if (window.confirm('هل أنت متأكد من رفض هذه الطلبية؟')) {
      const applicationId = application._id || application.id;
      const result = await dispatch(rejectApplicationById(applicationId));
      if (rejectApplicationById.fulfilled.match(result)) {
        setShowDetailsModal(false);
        alert('تم رفض الطلبية');
        dispatch(fetchApplications({ status: activeTab === 'all' ? undefined : activeTab }));
      } else {
        alert(result.payload || 'حدث خطأ أثناء رفض الطلبية');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'under-review': { label: 'قيد المراجعة', class: 'badge-pending', color: '#ff9800' },
      'accepted': { label: 'مقبولة', class: 'badge-confirmed', color: '#4caf50' },
      'rejected': { label: 'مرفوضة', class: 'badge-cancelled', color: '#f44336' },
    };
    return badges[status] || badges['under-review'];
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('ar-SA', { calendar: 'gregory' });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />
      <div className="dashboard-content-area" style={{ 
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: isMobile ? '0' : `${sidebarWidth || 280}px`,
        paddingTop: '80px',
        transition: 'margin-left 0.3s ease',
      }}>
        <TopBar 
          pageTitle="طلبات التوظيف"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div style={{ padding: '40px', flex: 1 }}>
          {/* Tabs */}
          <GlassCard style={{ padding: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'الكل' },
                { id: 'under-review', label: 'قيد المراجعة' },
                { id: 'accepted', label: 'مقبولة' },
                { id: 'rejected', label: 'مرفوضة' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: activeTab === tab.id
                      ? 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #6366F1 100%)'
                      : 'rgba(255, 255, 255, 0.3)',
                    color: activeTab === tab.id ? 'white' : '#000000',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Search and Filters */}
          <GlassCard style={{ padding: '30px', marginBottom: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center' }}>
              <input
                type="text"
                className="glass-input"
                placeholder="ابحث بالاسم أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </GlassCard>

          {/* Applications Table */}
          <GlassCard style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
              قائمة الطلبات ({filteredApplications.length})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>التاريخ</th>
                    <th>الاسم</th>
                    <th>الجنسية</th>
                    <th>العمر</th>
                    <th>الهاتف</th>
                    <th>الخبرة</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => {
                    const status = getStatusBadge(app.status);
                    return (
                      <tr key={app._id || app.id}>
                        <td>{index + 1}</td>
                        <td>{formatDate(app.createdAt)}</td>
                        <td>{app.arabicName || app.englishName}</td>
                        <td>{app.nationality}</td>
                        <td>{app.age || calculateAge(app.birthDate)} سنة</td>
                        <td>{app.phone}</td>
                        <td>{app.experience || 0} سنوات</td>
                        <td>
                          <span className={`glass-badge ${status.class}`}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              onClick={() => handleViewDetails(app)}
                              style={{
                                background: 'rgba(139, 92, 246, 0.2)',
                                border: '1px solid rgba(139, 92, 246, 0.4)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                color: '#8B5CF6',
                                fontWeight: 600,
                                fontSize: '14px',
                              }}
                            >
                              عرض
                            </button>
                            <button
                              onClick={() => handleDelete(app._id || app.id)}
                              style={{
                                background: 'rgba(244, 67, 54, 0.2)',
                                border: '1px solid rgba(244, 67, 54, 0.4)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                color: '#f44336',
                                fontWeight: 600,
                                fontSize: '14px',
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
          </GlassCard>
        </div>
      </div>

      {/* Application Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => {
        setShowDetailsModal(false);
        setSelectedApplication(null);
      }} size="xlarge">
        {selectedApplication && (
          <div style={{ padding: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '30px' }}>
                    تفاصيل طلب التوظيف #{selectedApplication.applicationNumber || selectedApplication._id || selectedApplication.id}
                  </h2>

            <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
              {/* Photos */}
              {selectedApplication.photos && selectedApplication.photos.length > 0 && (
                <GlassCard style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>الصور</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                    {selectedApplication.photos.map((photo, i) => (
                      <div key={i} style={{
                        width: '100%',
                        height: '150px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                      }}>
                        <span style={{ fontSize: '48px' }}>📷</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Personal Info */}
              <GlassCard style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>المعلومات الشخصية</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <p><strong>الاسم بالعربي:</strong> {selectedApplication.arabicName}</p>
                  <p><strong>الاسم بالإنجليزي:</strong> {selectedApplication.englishName}</p>
                  <p><strong>الجنسية:</strong> {selectedApplication.nationality}</p>
                  <p><strong>العمر:</strong> {selectedApplication.age || calculateAge(selectedApplication.birthDate)} سنة</p>
                  <p><strong>رقم الهاتف:</strong> {selectedApplication.phone}</p>
                  <p><strong>رقم الهوية/الإقامة:</strong> {selectedApplication.idNumber}</p>
                  <p><strong>تاريخ الميلاد:</strong> {formatDate(selectedApplication.birthDate)}</p>
                  <p><strong>الحالة الاجتماعية:</strong> {selectedApplication.maritalStatus}</p>
                </div>
              </GlassCard>

              {/* Work Info */}
              <GlassCard style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>معلومات العمل</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                  <p><strong>نوع العقد:</strong> {
                    selectedApplication.contractType === 'daily' ? 'يومي' :
                    selectedApplication.contractType === 'monthly' ? 'شهري' :
                    selectedApplication.contractType === 'yearly' ? 'سنوي' : selectedApplication.contractType
                  }</p>
                  <p><strong>الخبرة:</strong> {selectedApplication.experience || 0} سنوات</p>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '10px' }}>المهارات:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(selectedApplication.skills || []).map((skill, i) => (
                      <span key={i} style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: '#8B5CF6',
                        fontWeight: 500,
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '10px' }}>اللغات:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(selectedApplication.languages || []).map((lang, i) => (
                      <span key={i} style={{
                        background: 'rgba(255, 255, 255, 0.3)',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: '#000000',
                        fontWeight: 500,
                      }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Notes */}
              {selectedApplication.notes && (
                <GlassCard style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>ملاحظات</h3>
                  <p>{selectedApplication.notes}</p>
                </GlassCard>
              )}
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {selectedApplication.status === 'under-review' && (
                <>
                  <GlassButton
                    onClick={() => handleAccept(selectedApplication)}
                    style={{
                      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    }}
                  >
                    قبول الطلبية
                  </GlassButton>
                  <GlassButton
                    onClick={() => handleReject(selectedApplication)}
                    variant="secondary"
                    style={{
                      background: 'rgba(244, 67, 54, 0.2)',
                      border: '1px solid rgba(244, 67, 54, 0.4)',
                      color: '#f44336',
                    }}
                  >
                    رفض الطلبية
                  </GlassButton>
                </>
              )}
              <GlassButton
                variant="secondary"
                onClick={() => window.open(`https://wa.me/${selectedApplication.phone?.replace(/^0/, '966')}`, '_blank')}
              >
                اتصال واتساب
              </GlassButton>
              <GlassButton
                variant="secondary"
                onClick={() => window.location.href = `tel:${selectedApplication.phone}`}
              >
                اتصال هاتفي
              </GlassButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Applications;

