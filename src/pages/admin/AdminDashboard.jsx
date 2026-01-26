import React, { useState } from "react";
import "../../styles/AdminDashboard.css";
import Icon from "../../components/Icon";
import '../../App.css';

// Import Sections
import OverviewSection from "./sections/OverviewSection";
import CompetitionsSection from "./sections/CompetitionsSection";
import UsersSection from "./sections/UsersSection";
import JudgesSection from "./sections/JudgesSection";
import SubmissionsSection from "./sections/SubmissionsSection";
import ResultsSection from "./sections/ResultsSection";
import SettingsSection_New from "./sections/SettingsSection_New";
import LogsSection_New from "./sections/LogsSection_New";
import ReportsSection from "./sections/ReportsSection";
import ModerationSection from "./sections/ModerationSection";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      sessionStorage.clear();
      localStorage.clear();
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
          {activeSection === "submissions" && <SubmissionsSection />}
          {activeSection === "results" && <ResultsSection />}
          {activeSection === "reports" && <ReportsSection />}
          {activeSection === "moderation" && <ModerationSection />}
          {activeSection === "logs" && <LogsSection_New />}
          {activeSection === "settings" && <SettingsSection_New />}
        </div>
      </div>
    </div>
  );
}

// Sub-components
function TopNav({ onLogout }) {
  return (
    <div className="top-nav">
      <div className="nav-left">
        <span className="nav-title">🏆 ระบบจัดการการประกวดกลอน - Admin Panel</span>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 10, opacity: 0.5 }}>
              <Icon name="search" size={16} />
            </span>
            <input 
              type="text" 
              placeholder="ค้นหา..." 
              className="nav-search" 
              style={{ paddingLeft: 35 }} 
            />
        </div>
      </div>
      <div className="nav-right">
        <button 
          onClick={onLogout} 
          style={{ 
            border: "1px solid #e74c3c", 
            background: "transparent", 
            color: "#e74c3c", 
            borderRadius: "6px", 
            padding: "6px 12px", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "5px" 
          }}
        >
          <Icon name="logout" size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive }) {
  const items = [
    { key: "overview", label: "📊 ภาพรวม", icon: "dashboard" },
    { key: "competitions", label: "🏆 จัดการการประกวด", icon: "trophy" },
    { key: "submissions", label: "📝 จัดการผลงาน", icon: "file" },
    { key: "users", label: "👥 จัดการผู้ใช้", icon: "users" },
    { key: "judges", label: "⚖️ จัดการกรรมการ", icon: "scale" },
    { key: "results", label: "🏅 ตัดสินและประกาศผล", icon: "award" },
    { key: "reports", label: "📊 รายงานและสถิติ", icon: "chart" },
    { key: "moderation", label: "🛡️ ตรวจสอบเนื้อหา", icon: "shield" },
    { key: "logs", label: "📜 Logs & Audit", icon: "file" },
    { key: "settings", label: "⚙️ ตั้งค่าระบบ", icon: "settings" },
  ];

  return (
    <div className="sidebar">
      {items.map((item) => (
        <button 
          key={item.key} 
          onClick={() => setActive(item.key)} 
          className={`sidebar-btn ${active === item.key ? "active" : ""}`}
        >
          <span style={{ marginRight: 10, display: "flex" }}>
            {item.label.substring(0, 2)}
          </span>
          {item.label.substring(3)}
        </button>
      ))}
    </div>
  );
}