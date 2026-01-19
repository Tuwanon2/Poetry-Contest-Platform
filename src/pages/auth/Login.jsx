import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ❌ ลบบรรทัดนี้ออก: import { GoogleLogin } from '@react-oauth/google';
import AuthHeader from '../../components/AuthHeader';
import '../../App.css';
import '../../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // ===============================
  //  MOCKUP: Normal Login
  // ===============================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่านให้ครบ (Mockup)');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      console.log('--- Mock Login Normal Success ---');
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  // ===============================
  //  MOCKUP: Google Login Button Click
  // ===============================
  const handleGoogleMockClick = () => {
      setLoading(true);
      
      // จำลองการกดปุ่ม Google
      setTimeout(() => {
          console.log('--- Mock Google Login Success ---');
          setLoading(false);
          navigate('/');
      }, 1000);
  };

  return (
    <>
    <AuthHeader />
    <main className="auth-container">
      <div className="auth-card" aria-label="Login Form"> 
        
        <h2>เข้าสู่ระบบ</h2>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
            <div className="auth-group">
            <label htmlFor="email">อีเมล</label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
            />
            </div>

            <div className="auth-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
            />
            </div>

            <div className="auth-options">
            <label className="remember-me">
                <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                />
                จดจำฉัน
            </label>

            <Link to="/forgot-password" className="forgot-link">
                ลืมรหัสผ่าน?
            </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
        </form>

        <div className="auth-divider">
            <span>หรือ</span>
        </div>

        {/* สร้างปุ่ม Google เอง (Fake Button) 
            เพื่อหลีกเลี่ยง Error Provider และดูแค่ความสวยงาม
        */}
        <div className="google-btn-wrapper">
            <button 
                type="button" 
                className="google-btn-custom" 
                onClick={handleGoogleMockClick}
                disabled={loading}
            >
                <img 
                    src="https://www.svgrepo.com/show/475656/google-color.svg" 
                    alt="Google Logo" 
                    width="18" 
                    height="18" 
                />
                <span>ดำเนินการต่อด้วย Google</span>
            </button>
        </div>

        <p className="auth-footer">
          ยังไม่มีบัญชี? <Link to="/register">ลงทะเบียน</Link>
        </p>
      </div>
    </main>
    </>
  );
};

export default Login;