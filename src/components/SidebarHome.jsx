
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SidebarHome.css';
import HomeAdminButton from './HomeAdminButton';

const menu = [
  {
    label: 'ดูภาพรวมการประกวด',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" stroke="#70136C" strokeWidth="2"/><rect x="7" y="10" width="2" height="2" rx="1" fill="#70136C"/><rect x="11" y="10" width="2" height="2" rx="1" fill="#70136C"/><rect x="15" y="10" width="2" height="2" rx="1" fill="#70136C"/></svg>
    ),
    to: '/competitions-overview',
    color: 'purple',
  },
  {
    label: 'เข้าสู่หน้าผู้ดูแลระบบ',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#009688" strokeWidth="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="#70136C" strokeWidth="2"/></svg>
    ),
    to: '/admin',
    color: 'teal',
    admin: true,
  },
  {
    label: 'กรรมการให้คะแนน',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#1abc9c" strokeWidth="2"/><path d="M8 12h8M8 16h8M8 8h8" stroke="#70136C" strokeWidth="2"/></svg>
    ),
    to: '/judge-scoring',
    color: 'teal',
  },
];

export default function SidebarHome({ open = true, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <button className="sidebar-toggle-btn" onClick={() => setOpen && setOpen(o => !o)} aria-label="toggle sidebar">
        {/* Hamburger icon */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="5" y="8" width="18" height="2.5" rx="1.2" fill="#70136C"/><rect x="5" y="13" width="18" height="2.5" rx="1.2" fill="#70136C"/><rect x="5" y="18" width="18" height="2.5" rx="1.2" fill="#70136C"/></svg>
      </button>
      <aside className={`sidebar-home clean${open ? '' : ' closed'}`}>
        <nav className="sidebar-menu">
          {menu.map((item, idx) => (
            <React.Fragment key={item.label}>
              <button
                className={`sidebar-menu-btn ${item.color} ${location.pathname === item.to ? 'active' : ''}`}
                onClick={() => navigate(item.to)}
              >
                <span className="sidebar-menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
              {idx !== menu.length - 1 && <div className="sidebar-divider" />}
            </React.Fragment>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-divider" style={{ margin: '18px 0 18px 0' }} />
          <button
            className="sidebar-menu-btn create"
            onClick={() => navigate('/create-competition')}
          >
            <span className="sidebar-menu-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" rx="1" fill="#fff"/><rect x="11" y="4" width="2" height="16" rx="1" fill="#fff"/></svg>
            </span>
            <span>สร้างการประกวด</span>
          </button>
        </div>
      </aside>
    </>
  );
}
