import React, { useState } from 'react';

const sidebarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: 220,
  background: '#813a7dff', // ม่วงอ่อนกว่า TopNav
  borderRight: '1.5px solid #813a7dff',
  boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 24,
};


const buttonStyle = {
  background: 'rgba(255,255,255,0)',
  border: 'none',
  color: '#fff',
  fontWeight: 500,
  fontSize: 15,
  textAlign: 'left',
  padding: '10px 24px 10px 18px',
  cursor: 'pointer',
  borderRadius: 12,
  marginBottom: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  transition: 'background 0.15s, color 0.15s',
  opacity: 0.92,
};

const activeButtonStyle = {
  ...buttonStyle,
  background: '#fff',
  color: '#7c2fa0',
  fontWeight: 700,
  boxShadow: '0 2px 8px 0 rgba(112,19,108,0.10)',
};

const iconStyle = {
  fontSize: 20,
  marginRight: 0,
  display: 'inline-block',
  color: 'inherit',
  filter: 'drop-shadow(0 0 1px #fff8) drop-shadow(0 0 2px #2d1846)',
};

const toggleBtnStyle = {
  position: 'absolute',
  top: 18,
  right: -18,
  width: 36,
  height: 36,
  background: '#fff',
  border: '1.5px solid #e0c7e7',
  borderRadius: '50%',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 101,
};

export default function SidebarNav({ current, onNavigate }) {
  const navItems = [
    { key: 'overview', label: 'ภาพรวม', icon: '📊' },
    { key: 'submissions', label: 'ผลงานที่ส่งเข้าประกวด', icon: '📝' },
    { key: 'edit', label: 'แก้ไขการประกวด', icon: '✏️' },
  ];
  return (
    <div style={sidebarStyle}>
      <div style={{ marginTop: 54 }}>
        {navItems.map(item => (
          <button
            key={item.key}
            style={current === item.key ? activeButtonStyle : buttonStyle}
            onClick={() => onNavigate(item.key)}
          >
            <span style={iconStyle}>{item.icon}</span>
            {item.label}
            
          </button>
        ))}
      </div>
    </div>
  );
}
