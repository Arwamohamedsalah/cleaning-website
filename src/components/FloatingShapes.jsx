import React from 'react';
import '../styles/globals.css';

const FloatingShapes = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden', 
      zIndex: 0,
      top: 0,
      left: 0,
      pointerEvents: 'none'
    }}>
      {/* Purple/Mauve Shape 1 */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)',
          filter: 'blur(120px)',
          top: '10%',
          right: '10%',
          animation: 'float 80s ease-in-out infinite',
        }}
      />
      
      {/* Purple/Mauve Shape 2 */}
      <div
        style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(59, 130, 246, 0.15) 100%)',
          filter: 'blur(140px)',
          bottom: '10%',
          left: '10%',
          animation: 'float 100s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />
      
      {/* Indigo/Purple Shape 3 */}
      <div
        style={{
          position: 'absolute',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)',
          filter: 'blur(110px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'float 90s ease-in-out infinite',
          animationDelay: '4s',
        }}
      />
      
      {/* Smaller Accent Shapes */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(59, 130, 246, 0.1) 100%)',
          filter: 'blur(80px)',
          top: '20%',
          left: '20%',
          animation: 'float 70s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(59, 130, 246, 0.1) 100%)',
          filter: 'blur(100px)',
          bottom: '20%',
          right: '20%',
          animation: 'float 85s ease-in-out infinite',
          animationDelay: '3s',
        }}
      />
    </div>
  );
};

export default FloatingShapes;

