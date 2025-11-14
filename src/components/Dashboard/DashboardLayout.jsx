import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import '../../styles/dashboard.css';

/**
 * Dashboard Layout Component
 * Wrapper component that applies the dark theme design to all dashboard pages
 */
const DashboardLayout = ({ children, pageTitle, onSearch }) => {
  // Generate stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <div className="dashboard-container" style={{ display: 'flex' }}>
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
      
      <div className="dashboard-content-area" style={{ 
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <TopBar pageTitle={pageTitle} onSearch={onSearch} />
        <div style={{ padding: '40px', flex: 1 }}>
          {children}
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default DashboardLayout;

