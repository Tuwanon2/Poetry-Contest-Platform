import React, { useState } from "react";
import "../../styles/AdminDashboard.css";
import Icon from "../../components/Icon";
import '../../App.css';
// Import Sections (อันนี้ถูกต้องแล้ว ถ้าไฟล์อยู่ใน folder sections ข้างๆ กัน)
import OverviewSection from "./sections/OverviewSection";
import CompetitionsSection from "./sections/CompetitionsSection";
import UsersSection from "./sections/UsersSection";
import JudgesSection from "./sections/JudgesSection";
import ModerationSection from "./sections/ModerationSection";

// สร้าง Placeholder สำหรับ Section ที่เหลือ
const LogsSection = () => <div className="card">Logs Section Placeholder</div>;
const SettingsSection = () => <div className="card">Settings Section Placeholder</div>;

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
       window.location.href = "/login"; 
    }
  };

  return (
    <div className="dashboard-container">
      <TopNav onLogout={handleLogout} />
      <div className="dashboard-body">
        <Sidebar active={activeSection} setActive={setActiveSection} />
        <div className="main-content">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "competitions" && <CompetitionsSection />}
          {activeSection === "users" && <UsersSection />}
          {activeSection === "judges" && <JudgesSection />}
          {activeSection === "moderation" && <ModerationSection />}
          {activeSection === "logs" && <LogsSection />}
          {activeSection === "settings" && <SettingsSection />}
        </div>
      </div>
    </div>
  );
}

// Sub-components ของ Layout (TopNav & Sidebar) เก็บไว้ในไฟล์นี้ได้ หรือจะแยกก็ได้
function TopNav({ onLogout }) {
  return (
    <div className="top-nav">
      <div className="nav-left">
        <span className="nav-title">Competition Admin Pro</span>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 10, opacity: 0.5 }}><Icon name="search" size={16} /></span>
            <input type="text" placeholder="ค้นหา..." className="nav-search" style={{ paddingLeft: 35 }} />
        </div>
      </div>
      <div className="nav-right">
        <button onClick={onLogout} style={{ border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
          <Icon name="logout" size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive }) {
  const items = [
    { key: "overview", label: "ภาพรวม", icon: "dashboard" },
    { key: "competitions", label: "รายการประกวด", icon: "trophy" },
    { key: "users", label: "ผู้ส่งเข้าประกวด", icon: "users" },
    { key: "judges", label: "จัดการกรรมการ", icon: "scale" },
    { key: "moderation", label: "ตรวจสอบเนื้อหา", icon: "shield" },
    { key: "logs", label: "Logs", icon: "file" },
    { key: "settings", label: "ตั้งค่า", icon: "settings" },
  ];

  return (
    <div className="sidebar">
      {items.map((item) => (
        <button key={item.key} onClick={() => setActive(item.key)} className={`sidebar-btn ${active === item.key ? "active" : ""}`}>
          <span style={{ marginRight: 10, display: "flex" }}><Icon name={item.icon} size={18} /></span>
          {item.label}
        </button>
      ))}
    </div>
  );
}