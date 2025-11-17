import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import Modal from '../../components/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, updateMessageById, replyToMessage, deleteMessageById } from '../../store/slices/messagesSlice';
import '../../styles/globals.css';
import '../../styles/glassmorphism.css';
import '../../styles/dashboard.css';

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.messages);
  const { sidebarWidth } = useSelector((state) => state.theme);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch messages from API
  useEffect(() => {
    const params = {};
    if (activeFilter === 'unread') params.read = 'false';
    if (activeFilter === 'read') params.read = 'true';
    if (activeFilter === 'replied') params.replied = 'true';
    if (activeFilter === 'archived') params.archived = 'true';
    if (searchTerm) params.search = searchTerm;
    
    dispatch(fetchMessages(params));
  }, [dispatch, activeFilter, searchTerm]);

  // Mock data if Redux is empty (fallback)
  const mockMessages = [
    {
      id: 'MSG-1',
      name: 'أحمد محمد',
      email: 'ahmed@email.com',
      phone: '0501234567',
      subject: 'general',
      message: 'أريد الاستفسار عن أسعار خدمات التنظيف الشامل',
      read: false,
      replied: false,
      archived: false,
      createdAt: new Date('2025-01-15'),
    },
    {
      id: 'MSG-2',
      name: 'فاطمة علي',
      email: 'fatima@email.com',
      phone: '0502345678',
      subject: 'complaint',
      message: 'لدي شكوى بخصوص الخدمة المقدمة في آخر طلب',
      read: true,
      replied: true,
      archived: false,
      createdAt: new Date('2025-01-14'),
    },
    {
      id: 'MSG-3',
      name: 'خالد سعيد',
      email: 'khalid@email.com',
      phone: '0503456789',
      subject: 'suggestion',
      message: 'اقتراح: إضافة خدمة تنظيف السجاد',
      read: false,
      replied: false,
      archived: false,
      createdAt: new Date('2025-01-13'),
    },
  ];

  const displayMessages = messages.length > 0 ? messages : [];

  const filteredMessages = displayMessages.filter(msg => {
    const matchesFilter = activeFilter === 'all' ||
      (activeFilter === 'unread' && !msg.read && !msg.archived) ||
      (activeFilter === 'read' && msg.read && !msg.archived) ||
      (activeFilter === 'replied' && msg.replied && !msg.archived) ||
      (activeFilter === 'archived' && msg.archived);
    const matchesSearch = !searchTerm ||
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowDetailsModal(true);
    if (!message.read) {
      const messageId = message._id || message.id;
      await dispatch(updateMessageById({ id: messageId, messageData: { read: true } }));
    }
  };

  const handleReplyEmail = (message) => {
    window.location.href = `mailto:${message.email}?subject=Re: ${getSubjectLabel(message.subject)}`;
  };

  const handleReplyWhatsApp = (message) => {
    const phone = message.phone?.replace(/^0/, '966');
    const text = encodeURIComponent(`مرحباً ${message.name}، شكراً لتواصلك معنا...`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleArchive = async (message) => {
    const messageId = message._id || message.id;
    const result = await dispatch(updateMessageById({ id: messageId, messageData: { archived: true } }));
    if (updateMessageById.fulfilled.match(result)) {
      if (selectedMessage?._id === messageId || selectedMessage?.id === messageId) {
        setShowDetailsModal(false);
        setSelectedMessage(null);
      }
      alert('تم أرشفة الرسالة');
      dispatch(fetchMessages());
    } else {
      alert(result.payload || 'حدث خطأ أثناء أرشفة الرسالة');
    }
  };

  const handleUnarchive = async (message) => {
    const messageId = message._id || message.id;
    const result = await dispatch(updateMessageById({ id: messageId, messageData: { archived: false } }));
    if (updateMessageById.fulfilled.match(result)) {
      if (selectedMessage?._id === messageId || selectedMessage?.id === messageId) {
        setShowDetailsModal(false);
        setSelectedMessage(null);
      }
      alert('تم إرجاع الرسالة من الأرشيف');
      dispatch(fetchMessages());
    } else {
      alert(result.payload || 'حدث خطأ أثناء إرجاع الرسالة من الأرشيف');
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      const result = await dispatch(deleteMessageById(messageId));
      if (deleteMessageById.fulfilled.match(result)) {
        if (selectedMessage?._id === messageId || selectedMessage?.id === messageId) {
          setShowDetailsModal(false);
          setSelectedMessage(null);
        }
        alert('تم حذف الرسالة');
      } else {
        alert(result.payload || 'حدث خطأ أثناء حذف الرسالة');
      }
    }
  };

  const getSubjectLabel = (subject) => {
    const subjects = {
      general: 'استفسار عام',
      complaint: 'شكوى',
      suggestion: 'اقتراح',
      recruitment: 'طلب توظيف',
      other: 'أخرى',
    };
    return subjects[subject] || subject;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('ar-SA', { calendar: 'gregory',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = displayMessages.filter(msg => !msg.read && !msg.archived).length;

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
          pageTitle="الرسائل"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div style={{ padding: '40px', flex: 1 }}>
          {/* Filters */}
          <GlassCard style={{ 
            padding: '20px', 
            marginBottom: '30px',
            background: 'linear-gradient(135deg, rgba(17, 25, 44, 0.5) 0%, rgba(17, 25, 44, 0.4) 50%, rgba(17, 25, 44, 0.45) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
          }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[
                { id: 'all', label: 'الكل' },
                { id: 'unread', label: `غير مقروءة (${unreadCount})` },
                { id: 'read', label: 'مقروءة' },
                { id: 'replied', label: 'تم الرد عليها' },
                { id: 'archived', label: 'أرشيف' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: activeFilter === filter.id 
                      ? '2px solid rgba(59, 130, 246, 0.8)'
                      : '1px solid rgba(59, 130, 246, 0.3)',
                    background: activeFilter === filter.id
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(59, 130, 246, 1) 100%)'
                      : 'rgba(17, 25, 44, 0.4)',
                    color: activeFilter === filter.id ? '#FFFFFF' : '#FFFFFF',
                    fontWeight: activeFilter === filter.id ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: activeFilter === filter.id 
                      ? '0 4px 12px rgba(59, 130, 246, 0.4)'
                      : 'none',
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              className="glass-input"
              placeholder="ابحث في الرسائل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(17, 25, 44, 0.5)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#FFFFFF',
              }}
            />
          </GlassCard>

          {/* Messages List */}
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredMessages.length === 0 ? (
              <GlassCard style={{ 
                padding: '40px', 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(17, 25, 44, 0.4) 0%, rgba(17, 25, 44, 0.3) 50%, rgba(17, 25, 44, 0.35) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
              }}>
                <p style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600 }}>لا توجد رسائل</p>
              </GlassCard>
            ) : (
              filteredMessages.map((message) => (
                <GlassCard
                  key={message._id || message.id}
                  style={{
                    padding: '25px',
                    border: !message.read ? '2px solid rgba(59, 130, 246, 0.6)' : '1px solid rgba(59, 130, 246, 0.4)',
                    background: !message.read 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(59, 130, 246, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(17, 25, 44, 0.4) 0%, rgba(17, 25, 44, 0.3) 50%, rgba(17, 25, 44, 0.35) 100%)',
                    boxShadow: !message.read 
                      ? '0 8px 24px rgba(59, 130, 246, 0.3)'
                      : '0 4px 16px rgba(17, 25, 44, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div 
                      style={{ flex: 1, cursor: 'pointer' }}
                      onClick={() => handleViewMessage(message)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                          {message.name}
                        </h3>
                        {!message.read && (
                          <span style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#3B82F6',
                            display: 'inline-block',
                            boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)',
                          }} />
                        )}
                        {message.replied && (
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                            background: 'rgba(76, 175, 80, 0.3)',
                            color: '#4caf50',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: '1px solid rgba(76, 175, 80, 0.5)',
                          }}>
                            تم الرد
                          </span>
                        )}
                      </div>
                      <p style={{ color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 600 }}>
                        {message.email} | {message.phone}
                      </p>
                      <p style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 500, opacity: 0.9 }}>
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                      <div style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: 'rgba(59, 130, 246, 0.3)',
                        color: '#60A5FA',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: '1px solid rgba(59, 130, 246, 0.5)',
                      }}>
                        {getSubjectLabel(message.subject)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message._id || message.id);
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(244, 67, 54, 0.3)',
                          border: '1px solid rgba(244, 67, 54, 0.5)',
                          color: '#f44336',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(244, 67, 54, 0.5)';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(244, 67, 54, 0.3)';
                          e.target.style.transform = 'scale(1)';
                        }}
                        title="حذف الرسالة"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleViewMessage(message)}
                  >
                    <p style={{
                      color: '#FFFFFF',
                      lineHeight: '1.6',
                      marginTop: '15px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontWeight: 500,
                    }}>
                      {message.message}
                    </p>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Message Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => {
        setShowDetailsModal(false);
        setSelectedMessage(null);
      }} size="large">
        {selectedMessage && (
          <div style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '30px', color: '#FFFFFF' }}>
              تفاصيل الرسالة
            </h2>

            <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
              <GlassCard style={{ 
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(17, 25, 44, 0.5) 0%, rgba(17, 25, 44, 0.4) 50%, rgba(17, 25, 44, 0.45) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: '#FFFFFF' }}>معلومات المرسل</h3>
                <p style={{ marginBottom: '10px', color: '#FFFFFF' }}><strong style={{ color: '#60A5FA' }}>الاسم:</strong> {selectedMessage.name}</p>
                <p style={{ marginBottom: '10px', color: '#FFFFFF' }}><strong style={{ color: '#60A5FA' }}>البريد الإلكتروني:</strong> {selectedMessage.email}</p>
                <p style={{ marginBottom: '10px', color: '#FFFFFF' }}><strong style={{ color: '#60A5FA' }}>رقم الهاتف:</strong> {selectedMessage.phone}</p>
                <p style={{ color: '#FFFFFF' }}><strong style={{ color: '#60A5FA' }}>التاريخ:</strong> {formatDate(selectedMessage.createdAt)}</p>
              </GlassCard>

              <GlassCard style={{ 
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(17, 25, 44, 0.5) 0%, rgba(17, 25, 44, 0.4) 50%, rgba(17, 25, 44, 0.45) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: '#FFFFFF' }}>الموضوع</h3>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'rgba(59, 130, 246, 0.3)',
                  color: '#60A5FA',
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '15px',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                }}>
                  {getSubjectLabel(selectedMessage.subject)}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', marginTop: '20px', color: '#FFFFFF' }}>الرسالة</h3>
                <p style={{
                  color: '#FFFFFF',
                  lineHeight: '1.8',
                  fontSize: '16px',
                  whiteSpace: 'pre-wrap',
                  fontWeight: 500,
                }}>
                  {selectedMessage.message}
                </p>
              </GlassCard>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <GlassButton onClick={() => handleReplyEmail(selectedMessage)}>
                رد عبر البريد
              </GlassButton>
              <GlassButton
                variant="secondary"
                onClick={() => handleReplyWhatsApp(selectedMessage)}
              >
                رد عبر واتساب
              </GlassButton>
              {selectedMessage.archived ? (
                <GlassButton
                  variant="secondary"
                  onClick={() => handleUnarchive(selectedMessage)}
                  style={{
                    background: 'rgba(76, 175, 80, 0.2)',
                    border: '1px solid rgba(76, 175, 80, 0.4)',
                    color: '#4caf50',
                  }}
                >
                  إرجاع من الأرشيف
                </GlassButton>
              ) : (
                <GlassButton
                  variant="secondary"
                  onClick={() => handleArchive(selectedMessage)}
                  style={{
                    background: 'rgba(255, 193, 7, 0.2)',
                    border: '1px solid rgba(255, 193, 7, 0.4)',
                    color: '#ff9800',
                  }}
                >
                  أرشفة
                </GlassButton>
              )}
              <GlassButton
                variant="secondary"
                onClick={() => handleDelete(selectedMessage._id || selectedMessage.id)}
                style={{
                  background: 'rgba(244, 67, 54, 0.2)',
                  border: '1px solid rgba(244, 67, 54, 0.4)',
                  color: '#f44336',
                }}
              >
                حذف
              </GlassButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Messages;

