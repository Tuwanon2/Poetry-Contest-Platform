import { useNavigate, Link } from 'react-router-dom'; // 1. อย่าลืม import Link
import { useState } from 'react';
import './AuthHeader.css';

export default function AuthHeader() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('TH');

  return (
    <header className="auth-header">
      {/* ฝั่งซ้าย: ปุ่มย้อนกลับ */}
      <div className="header-left">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      {/* 2. แก้ตรงนี้: ใช้ Link ครอบแทน div และใส่ to="/" */}
      <Link to="/" className="header-center">
        <div className="logo-circle">
          <img src="/logo.png" alt="KLON Logo" />
        </div>
        <span className="brand-name">Poetry Contest Platform</span>
      </Link>

      {/* ฝั่งขวา: เปลี่ยนภาษา */}
      <div className="header-right">
        <div className="lang-switch">
          <button 
            className={`lang-btn ${lang === 'TH' ? 'active' : ''}`} 
            onClick={() => setLang('TH')}
          >
            TH
          </button>
          <span className="divider">|</span>
          <button 
            className={`lang-btn ${lang === 'EN' ? 'active' : ''}`} 
            onClick={() => setLang('EN')}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}