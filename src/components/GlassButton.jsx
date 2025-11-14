import React from 'react';
import '../styles/glassmorphism.css';

const GlassButton = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) => {
  const buttonClass = variant === 'secondary' 
    ? 'glass-button glass-button-secondary' 
    : 'glass-button';
  
  return (
    <button
      type={type}
      className={`${buttonClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;

