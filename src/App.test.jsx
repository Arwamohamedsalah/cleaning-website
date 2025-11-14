// Test file to verify React is working
import React from 'react';

const TestApp = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8E0 25%, #F0E6FF 50%, #E0F7F4 100%)',
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        padding: '40px',
        borderRadius: '24px',
        border: '1.5px solid rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #FF9A8B 0%, #70D6C0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🧹 نظام إدارة خدمات التنظيف
        </h1>
        <p style={{ fontSize: '20px', color: '#666', marginBottom: '30px' }}>
          React يعمل بنجاح! ✅
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          إذا رأيت هذه الرسالة، فالمشروع يعمل بشكل صحيح
        </p>
      </div>
    </div>
  );
};

export default TestApp;

