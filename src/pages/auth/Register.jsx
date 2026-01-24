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

  // State สำหรับควบคุมการแสดงรหัสผ่าน
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // สไตล์สำหรับปุ่มกดดูรหัสผ่าน
  const toggleBtnStyle = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center'
  };

  // สไตล์สำหรับ Wrapper ของ Input เพื่อให้จัดตำแหน่งปุ่มได้
  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
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

          {/* ส่วนรหัสผ่าน */}
          <div className="auth-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <div style={inputWrapperStyle}>
              <input
                id="password"
                type={showPassword ? "text" : "password"} // เปลี่ยน type ตาม state
                name="password"
                placeholder="อย่างน้อย 6 ตัวอักษร"
                value={form.password}
                onChange={handleChange}
                required
                style={{ width: '100%', paddingRight: '40px' }} // เพิ่ม padding ขวาไม่ให้ข้อความทับไอคอน
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={toggleBtnStyle}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  // ไอคอนตาเปิด (SVG)
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  // ไอคอนตาปิด (SVG)
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
          </div>

          {/* ส่วนยืนยันรหัสผ่าน */}
          <div className="auth-group">
            <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
            <div style={inputWrapperStyle}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} // เปลี่ยน type ตาม state
                name="confirmPassword"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={toggleBtnStyle}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
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