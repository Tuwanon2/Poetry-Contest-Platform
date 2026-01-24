import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../../config/supabase';
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

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      
    } catch (err) {
      setError(err.message || 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Client-side validation
    if (!form.email || !form.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่านให้ครบ');
      return;
    }

    try {
      setLoading(true);
      const payload = { Username: form.email, Password: form.password };
      const res = await axios.post('http://localhost:8080/api/v1/auth/login', payload);
      // ตัวอย่าง: บันทึก user / token ตาม response แล้วไปหน้าแรก
      const user = res.data?.user;
      const username = user?.Username || user?.username || form.email;
      const userRole = user?.role || user?.Role || '';
      const userId = user?.id || user?.ID || user?.user_id || user?.UserID;
      const storage = form.remember ? window.localStorage : window.sessionStorage;
      try {
        storage.setItem('username', username);
        if (userId) storage.setItem('user_id', userId.toString());
        if (user) storage.setItem('user', JSON.stringify(user));
        if (res.data?.token) storage.setItem('token', res.data.token);
        // Trigger storage event for TopNav to update
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.warn('storage write failed', err);
      }
      // Redirect based on role
      if (userRole.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'ไม่สามารถเข้าสู่ระบบได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <AuthHeader />
    <main className="auth-container">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
        aria-label="Login Form"
        noValidate
      >
        <h2>เข้าสู่ระบบ</h2>

        {/* Error Message */}
        {error && <div className="auth-error" role="alert">{error}</div>}

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

        <button type="submit" disabled={loading}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <span>หรือ</span>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          className="google-login-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          เข้าสู่ระบบด้วย Google
        </button>

        <p className="auth-footer">
          ยังไม่มีบัญชี? <Link to="/register">ลงทะเบียน</Link>
        </p>
      </form>
    </main>
    </>
  );
};

export default Login;
