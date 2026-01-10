import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeAdminButton.css';

export default function HomeAdminButton({ sidebar }) {
  const navigate = useNavigate();

  if (sidebar) {
    return (
      <button
        className="home-admin-btn sidebar"
        onClick={() => navigate('/admin')}
      >
        เข้าสู่หน้าผู้ดูแลระบบ
      </button>
    );
  }

  return (
    <div className="home-admin-wrapper">
      <button
        className="home-admin-btn main"
        onClick={() => navigate('/admin')}
      >
        เข้าสู่หน้าผู้ดูแลระบบ
      </button>
    </div>
  );
}
