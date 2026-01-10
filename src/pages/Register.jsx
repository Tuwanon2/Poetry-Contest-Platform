import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (form.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>ลงทะเบียน</h2>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-group">
          <label htmlFor="firstName">ชื่อ</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            placeholder="กรอกชื่อ"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-group">
          <label htmlFor="lastName">นามสกุล</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="กรอกนามสกุล"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-group">
          <label htmlFor="email">อีเมล</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-group">
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-group">
          <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
        </button>

        <p className="auth-footer">
          มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
