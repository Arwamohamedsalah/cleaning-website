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
          background: 'linear-gradient(135deg, rgba(37, 150, 190, 0.25) 0%, rgba(37, 150, 190, 0.3) 50%, rgba(37, 150, 190, 0.2) 100%)',
          border: '2px solid rgba(37, 150, 190, 0.6)',
          padding: '30px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 154, 139, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
        >
          ×
        </button>
        {title && (
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#FFFFFF',
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

