import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthHeader from '../../components/AuthHeader';

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
      const storage = form.remember ? window.localStorage : window.sessionStorage;
      try {
        storage.setItem('username', username);
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

        <p className="auth-footer">
          ยังไม่มีบัญชี? <Link to="/register">ลงทะเบียน</Link>
        </p>
      </form>
    </main>
    </>
  );
};

export default Login;
