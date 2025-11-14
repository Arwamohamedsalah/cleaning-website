import React from 'react';
import '../styles/glassmorphism.css';

const Loader = ({ size = 50 }) => {
  return (
    <div
      className="glass-card"
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px auto',
      }}
    >
      <div
        style={{
          width: size * 0.6,
          height: size * 0.6,
          border: '3px solid rgba(255, 154, 139, 0.3)',
          borderTop: '3px solid rgba(37, 150, 190, 1)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;

