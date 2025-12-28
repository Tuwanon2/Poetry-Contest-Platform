import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeAdminButton({ sidebar }) {
  const navigate = useNavigate();
  if (sidebar) {
    return (
      <button
        className="sidebar-btn teal"
        style={{ marginBottom: 0 }}
        onClick={() => navigate('/admin')}
      >
        เข้าสู่หน้าผู้ดูแลระบบ
      </button>
    );
  }
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '48px 0 0 0' }}>
      <button
        onClick={() => navigate('/admin')}
        style={{
          background: '#00b8a9',
          color: '#fff',
          fontWeight: 600,
          fontSize: '1.1rem',
          border: 'none',
          borderRadius: 12,
          padding: '16px 48px',
          boxShadow: '0 2px 8px rgba(0,184,169,0.08)',
          cursor: 'pointer',
          letterSpacing: 0.5,
          transition: 'background 0.18s',
        }}
        onMouseOver={e => e.currentTarget.style.background = '#009688'}
        onMouseOut={e => e.currentTarget.style.background = '#00b8a9'}
      >
        เข้าสู่หน้าผู้ดูแลระบบ
      </button>
    </div>
  );
}
