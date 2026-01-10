import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SidebarHome.css';

const menu = [
  {
    label: 'ดูภาพรวมการประกวด',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
        <rect x="7" y="10" width="2" height="2" rx="1" fill="currentColor"/>
        <rect x="11" y="10" width="2" height="2" rx="1" fill="currentColor"/>
        <rect x="15" y="10" width="2" height="2" rx="1" fill="currentColor"/>
      </svg>
    ),
    to: '/competitions-overview',
  },
  {
    label: 'เข้าสู่หน้าผู้ดูแลระบบ',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    to: '/admin',
  },
  {
    label: 'กรรมการให้คะแนน',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 12h8M8 16h8M8 8h8" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    to: '/judge-scoring',
  },
];

export default function SidebarHome({ open = true, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (to) => {
    navigate(to);
    setOpen && setOpen(false); // ✅ เปลี่ยนหน้าแล้วปิด sidebar
  };

  return (
    <>
      {/* ปุ่ม hamburger */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setOpen && setOpen(o => !o)}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="5" y="8" width="18" height="2.5" rx="1.2" fill="#70136C"/>
          <rect x="5" y="13" width="18" height="2.5" rx="1.2" fill="#70136C"/>
          <rect x="5" y="18" width="18" height="2.5" rx="1.2" fill="#70136C"/>
        </svg>
      </button>

      {/* Overlay (คลิกแล้วปิด) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.25)',
            zIndex: 90,
          }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar-home clean ${open ? 'open' : 'closed'}`}>
        <nav className="sidebar-menu">
          {menu.map((item, idx) => {
            const isActive = location.pathname === item.to;
            return (
              <React.Fragment key={item.label}>
                <button
                  className={`sidebar-menu-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavigate(item.to)}
                >
                  <span className="sidebar-menu-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </button>
                {idx !== menu.length - 1 && <div className="sidebar-divider" />}
              </React.Fragment>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-divider" />
          <button
            className="sidebar-menu-btn create-btn"
            onClick={() => handleNavigate('/create-competition')}
          >
            <span className="sidebar-menu-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/>
                <rect x="11" y="4" width="2" height="16" rx="1" fill="currentColor"/>
              </svg>
            </span>
            <span className="sidebar-label">สร้างการประกวด</span>
          </button>
        </div>
      </aside>
    </>
  );
}
