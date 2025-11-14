import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8E0 25%, #F0E6FF 50%, #E0F7F4 100%)',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
            padding: '40px',
            borderRadius: '24px',
            border: '1.5px solid rgba(255, 255, 255, 0.5)',
            maxWidth: '600px',
          }}>
            <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#ff4444' }}>
              ⚠️ حدث خطأ
            </h1>
            <p style={{ color: '#1E293B', marginBottom: '20px', fontWeight: 500 }}>
              {this.state.error?.message || 'حدث خطأ غير متوقع'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, rgba(37, 150, 190, 0.9) 0%, rgba(37, 150, 190, 0.8) 25%, rgba(37, 150, 190, 0.7) 50%, rgba(29, 120, 152, 0.8) 75%, rgba(22, 90, 114, 0.9) 100%)',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '16px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

