import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
// FloatingShapes removed for neutral design
import { loginSchema } from '../schemas/validationSchemas';
import { loginUser } from '../store/slices/authSlice';
import '../styles/globals.css';
import '../styles/glassmorphism.css';
import '../styles/dashboard.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const rememberMe = watch('rememberMe');

  // استرجاع البيانات المحفوظة عند تحميل الصفحة
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedUsername && savedPassword && savedRememberMe) {
      setValue('username', savedUsername);
      setValue('password', savedPassword);
      setValue('rememberMe', true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const result = await dispatch(loginUser({
        username: data.username,
        password: data.password,
      }));

      if (loginUser.fulfilled.match(result)) {
        // حفظ البيانات إذا تم تفعيل "تذكرني"
        if (data.rememberMe) {
          localStorage.setItem('rememberedUsername', data.username);
          localStorage.setItem('rememberedPassword', data.password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          // حذف البيانات المحفوظة إذا لم يتم تفعيل "تذكرني"
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberMe');
        }
        navigate('/dashboard');
      } else {
        setError('root', {
          type: 'manual',
          message: result.payload || 'اسم المستخدم أو كلمة المرور غير صحيحة',
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'حدث خطأ أثناء تسجيل الدخول',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <div className="dashboard-container" style={{
      minHeight: '100vh',
      paddingTop: '100px',
      background: '#ffffff',
    }}>
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
      <Navbar />
      
      <div style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          padding: window.innerWidth <= 768 ? '40px 24px' : '50px 40px',
          position: 'relative',
          zIndex: 10,
          background: '#ffffff',
          borderRadius: '32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <img 
              src="/img/logo.jpg" 
              alt="Ard El Baraka Logo" 
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'contain',
                borderRadius: '16px',
                margin: '0 auto 20px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              }}
            />
            <div style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#0f172a',
              marginBottom: '8px',
              lineHeight: '1.2',
              letterSpacing: '-0.5px',
            }}>
              Ard El Baraka
            </div>
            <div style={{
              fontSize: '14px',
              color: '#ebd573',
              fontWeight: 600,
              letterSpacing: '1px',
              marginBottom: '20px',
            }}>
              M a n p o w e r
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 800,
              marginBottom: '10px',
              color: '#0f172a',
              letterSpacing: '-0.5px',
            }}>
              تسجيل الدخول
            </h1>
            <p style={{ color: '#64748b', fontWeight: 500 }}>لوحة التحكم الإدارية</p>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            style={{ position: 'relative', zIndex: 10 }}
            noValidate
          >
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '10px',
              }}>
                البريد الإلكتروني أو اسم المستخدم *
              </label>
              <input
                type="text"
                placeholder="أدخل البريد الإلكتروني أو اسم المستخدم"
                autoComplete="username"
                {...register('username')}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  fontSize: '16px',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'all 0.3s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0f172a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(15, 23, 42, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.username && (
                <p style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>
                  {errors.username.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '10px',
              }}>
                كلمة المرور *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="أدخل كلمة المرور"
                  autoComplete="current-password"
                  {...register('password')}
                  style={{
                    width: '100%',
                    padding: '14px 50px 14px 18px',
                    fontSize: '16px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'all 0.3s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0f172a';
                    e.target.style.boxShadow = '0 0 0 3px rgba(15, 23, 42, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    fontSize: '20px',
                  }}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  style={{
                    width: '18px',
                    height: '18px',
                    marginLeft: '10px',
                    cursor: 'pointer',
                    accentColor: '#0f172a',
                  }}
                />
                <span style={{ color: '#334155', fontWeight: 500 }}>تذكرني</span>
              </label>
            </div>

            {errors.root && (
              <div style={{
                background: 'rgba(220, 38, 38, 0.06)',
                border: '1px solid rgba(220, 38, 38, 0.4)',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px',
                color: '#dc2626',
                textAlign: 'center',
                fontWeight: 500,
              }}>
                {errors.root.message}
              </div>
            )}

            <GlassButton
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                fontWeight: 700,
                background: loading ? '#94a3b8' : '#ffffff',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: loading ? '1px solid #cbd5e1' : '1px solid rgba(15, 23, 42, 0.2)',
                color: '#0f172a',
                boxShadow: loading ? 'none' : '0 8px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  جاري تسجيل الدخول...
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </GlassButton>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

