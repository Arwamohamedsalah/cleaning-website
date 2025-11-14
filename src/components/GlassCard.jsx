import React from 'react';
import '../styles/glassmorphism.css';

const GlassCard = ({ children, className = '', onClick, style }) => {
  return (
    <div
      className={`glass-card ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;

