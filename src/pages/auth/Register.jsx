import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthHeader from '../../components/AuthHeader';
import '../../App.css';

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

  const handleSubmit = async (e) => {
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

    try {
      const payload = {
        Username: form.email,
        Password: form.password,
        FullName: `${form.firstName} ${form.lastName}`,
        Email: form.email,
        Role: 'student'
      };

      const res = await axios.post('http://localhost:8080/api/v1/auth/register', payload);

      if (res.status === 201 || res.status === 200) {
        setLoading(false);
        navigate('/login');
      } else {
        setLoading(false);
        setError('ไม่สามารถลงทะเบียนได้ ลองใหม่อีกครั้ง');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || err.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <AuthHeader />
      
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

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
          </button>

          <p className="auth-footer">
            มีบัญชีแล้ว? <Link to="/login" style={{ color: '#6a1b6a', fontWeight: 'bold' }}>เข้าสู่ระบบ</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;