import { useNavigate, Link } from 'react-router-dom';
import './AuthHeader.css';

export default function AuthHeader() {
  const navigate = useNavigate();
  // ลบ useState และ state ของภาษาออกแล้ว

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

      {/* ตรงกลาง: โลโก้ */}
      <Link to="/" className="header-center">
        <div className="logo-circle">
          <img src="/logo.png" alt="KLON Logo" />
        </div>
        <span className="brand-name">Poetry Contest Platform</span>
      </Link>

      {/* ฝั่งขวา: ลบส่วน TH/EN ออกไปแล้ว */}
      {/* หากต้องการให้ Layout สมดุล อาจจะใส่ div เปล่าไว้ หรือจัดการด้วย CSS */}
      <div className="header-right"></div> 
    </header>
  );
}