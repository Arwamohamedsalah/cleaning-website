import React, { useEffect } from 'react';
import GlassCard from './GlassCard';
import '../styles/glassmorphism.css';

const Modal = ({ isOpen, onClose, children, size = 'medium', title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    small: { maxWidth: '400px' },
    medium: { maxWidth: '600px' },
    large: { maxWidth: '900px' },
    xlarge: { maxWidth: '1200px' },
  };

  return (
    <div className="glass-modal-overlay" onClick={onClose}>
      <GlassCard
        className="glass-modal"
        style={{ 
          ...sizeStyles[size], 
          width: '90%',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            transition: 'all 0.2s',
          }}
        >
          ×
        </button>
        {title && (
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '20px',
            textAlign: 'center',
            paddingTop: '10px',
          }}>
            {title}
          </h2>
        )}
        {children}
      </GlassCard>
    </div>
  );
};

export default Modal;

