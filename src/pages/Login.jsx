import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

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

      // 🔒 ตัวอย่าง (เชื่อม backend ภายหลัง)
      // await api.post('/login', form);

      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
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
  );
};

export default Login;
