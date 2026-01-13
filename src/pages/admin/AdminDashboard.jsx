import React, { useState } from "react";
import "../../styles/AdminDashboard.css";

/* ────────────────────────── ICONS COMPONENTS (SVG) ────────────────────────── */
// สร้าง Component สำหรับไอคอนเพื่อความเป็นระเบียบและไม่ต้องลง Library เพิ่ม
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    dashboard: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />,
    trophy: <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />,
    users: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />,
    scale: <path d="M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-2-9c-4.97 0-9 4.03-9 9H0l4 5.98.02.02L8.02 12H5c0-3.87 3.13-7 7-7s7 3.13 7 7h-3l3.98 6 .02-.02L24 12h-3c0-4.97-4.03-9-9-9z" />,
    shield: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />,
    file: <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />,
    settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.04.64.09.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />,
    bell: <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />,
    search: <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />,
    refresh: <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
    trash: <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>,
    person: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>,
    tie: <path d="M6 2l4 4 4-4 2 4-6 16L4 6z" />,
    // ⭐ [เพิ่มใหม่] ไอคอน Logout
    logout: <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  };

  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      fill={color} 
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};

/* ────────────────────────── MAIN DASHBOARD CONTAINER ────────────────────────── */
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  // ⭐ [เพิ่มใหม่] ฟังก์ชันสำหรับออกจากระบบ
  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
       // เปลี่ยน path ตรงนี้เป็นหน้า Login ของคุณ
       window.location.href = "/login"; 
    }
  };

  return (
    <div className="dashboard-container">
      {/* ส่ง Props onLogout ไปให้ TopNav */}
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

/* ────────────────────────── NAV & SIDEBAR ────────────────────────── */
// รับ Props onLogout มาใช้งาน
function TopNav({ onLogout }) {
  return (
    <div className="top-nav">
      <div className="nav-left">
        <span className="nav-title">Competition Admin Pro</span>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 10, opacity: 0.5 }}>
                <Icon name="search" size={16} />
            </span>
            <input type="text" placeholder="ค้นหาข้อมูลในระบบ..." className="nav-search" style={{ paddingLeft: 35 }} />
        </div>
      </div>
      <div className="nav-right">
        <div className="nav-notification" title="แจ้งเตือน">
           <Icon name="bell" size={20} color="#555" />
           <span className="badge-dot"></span>
        </div>
        <div className="nav-avatar">AD</div>
        
        {/* ⭐ [เพิ่มใหม่] ปุ่ม Logout */}
        <button 
          onClick={onLogout}
          style={{
            marginLeft: 15,
            border: "1px solid #e74c3c",
            background: "transparent",
            color: "#e74c3c",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s"
          }}
          // ใส่ลูกเล่น Mouse Over แบบ Inline (หรือจะไปทำใน CSS ก็ได้)
          onMouseOver={(e) => {
             e.currentTarget.style.background = "#e74c3c";
             e.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(e) => {
             e.currentTarget.style.background = "transparent";
             e.currentTarget.style.color = "#e74c3c";
          }}
        >
          <Icon name="logout" size={16} />
          <span>Logout</span>
        </button>

      </div>
    </div>
  );
}

function Sidebar({ active, setActive }) {
  const items = [
    { key: "overview", label: "ภาพรวม (Dashboard)", icon: "dashboard" },
    { key: "competitions", label: "รายการประกวด", icon: "trophy" },
    { key: "users", label: "ผู้ส่งเข้าประกวด", icon: "users" },
    { key: "judges", label: "จัดการกรรมการ", icon: "scale" },
    { key: "moderation", label: "ตรวจสอบเนื้อหา", icon: "shield" },
    { key: "logs", label: "ประวัติระบบ (Logs)", icon: "file" },
    { key: "settings", label: "ตั้งค่า", icon: "settings" },
  ];

  return (
    <div className="sidebar">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => setActive(item.key)}
          className={`sidebar-btn ${active === item.key ? "active" : ""}`}
        >
          <span style={{ marginRight: 10, display: "flex", alignItems: "center" }}>
            <Icon name={item.icon} size={18} />
          </span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────── 1. OVERVIEW SECTION ────────────────────────── */
function OverviewSection() {
  const [teamMembers, setTeamMembers] = useState([
    { email: "admin@contest.com", role: "ผู้ดูแลระบบ", password: "••••••" },
    { email: "manager_1@contest.com", role: "ผู้จัดการประกวด", password: "••••••" },
    { email: "manager_2@contest.com", role: "ผู้จัดการประกวด", password: "••••••" },
    { email: "assist_1@contest.com", role: "ผู้ช่วยจัดการประกวด", password: "••••••" },
    { email: "assist_2@contest.com", role: "ผู้ช่วยจัดการประกวด", password: "••••••" },
  ]);
  const [showModal, setShowModal] = useState(false);

  const managerCount = teamMembers.filter(m => m.role === "ผู้จัดการประกวด").length;
  const assistantCount = teamMembers.filter(m => m.role === "ผู้ช่วยจัดการประกวด").length;

  const stats = [
    { title: "รายการประกวด", value: 12, unit: "โครงการ", iconName: "trophy", color: "#8e44ad" },
    { title: "ผู้ส่งผลงาน", value: 1250, unit: "คน", iconName: "users", color: "#2980b9" },
    { title: "กรรมการตัดสิน", value: 8, unit: "ท่าน", iconName: "scale", color: "#27ae60" },
    { title: "ผู้จัดการประกวด", value: managerCount, unit: "คน", iconName: "person", color: "#d35400" },
    { title: "ผู้ช่วยจัดการฯ", value: assistantCount, unit: "คน", iconName: "file", color: "#f39c12" },
  ];

  const handleSaveNewMember = (newMember) => {
    setTeamMembers([...teamMembers, newMember]);
    setShowModal(false);
    alert(`สร้างบัญชีสำเร็จ!\nEmail: ${newMember.email}\nRole: ${newMember.role}`);
  };

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case "ผู้ดูแลระบบ": return { background: "#333", color: "#fff" };
      case "ผู้จัดการประกวด": return { background: "#d35400", color: "#fff" };
      case "ผู้ช่วยจัดการประกวด": return { background: "#f39c12", color: "#fff" };
      default: return { background: "#eee", color: "#333" };
    }
  };

  return (
    <div className="fade-in">
      <h2 className="section-header">ภาพรวมระบบจัดการประกวด</h2>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px", 
        marginBottom: "20px" 
      }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${s.color}` }}>
            <span className="stat-title">{s.title}</span>
            <div className="stat-value-container">
              <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 14, color: "#888", marginLeft: 5 }}>{s.unit}</span>
            </div>
            <div style={{ position: "absolute", right: 20, top: 20, opacity: 0.15 }}>
                <Icon name={s.iconName} size={32} color={s.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, alignItems: "center" }}>
            <div>
                <h3 className="sub-header" style={{ margin: 0 }}>ทีมงานดูแลระบบ</h3>
                <small style={{ color: "#888" }}>รวม Admin, ผู้จัดการ และผู้ช่วย</small>
            </div>
            <button className="btn-primary" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => setShowModal(true)}>
                + เพิ่มทีมงาน
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>อีเมล</th>
                <th>ตำแหน่ง</th>
                <th>รหัสผ่าน</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m, i) => (
                <tr key={i}>
                  <td>{m.email}</td>
                  <td>
                    <span className="badge-gray" style={getRoleBadgeStyle(m.role)}>
                        {m.role}
                    </span>
                  </td>
                  <td style={{ fontFamily: "monospace", color: "#666" }}>{m.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 className="sub-header" style={{ marginTop: 0 }}>กิจกรรมล่าสุด (System Logs)</h3>
          <ul className="log-list">
            <li>[12:01] <b>Admin</b> อนุมัติหัวข้อประกวดใหม่ "Hackathon 2025"</li>
            <li>[11:45] <b>System</b> ตรวจพบสแปมจาก User_99 (Auto-ban)</li>
            <li>[10:30] <b>Judge_Wanna</b> ให้คะแนนรอบชิงชนะเลิศ</li>
            <li>[09:15] <b>New User</b> สมัครสมาชิกใหม่เข้าระบบ</li>
          </ul>
        </div>
      </div>

      {showModal && <AddMemberModal onClose={() => setShowModal(false)} onSave={handleSaveNewMember} />}
    </div>
  );
}

/* ────────────────────────── 2. COMPETITIONS SECTION ────────────────────────── */
function CompetitionsSection() {
  const [contests, setContests] = useState([
    {
      id: 1,
      name: "การประกวดกลอนวันแม่",
      status: "open",
      category: "กลอนสุภาพ",
      levels: ["มัธยมศึกษา", "อุดมศึกษา"],
    },
    {
      id: 2,
      name: "การประกวดกลอนวันภาษาไทย",
      status: "closed",
      category: "กาพย์ยานี 11",
      levels: ["ประชาชนทั่วไป"],
    },
  ]);

  const toggleStatus = (id) => {
    setContests(
      contests.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "open" ? "closed" : "open" }
          : c
      )
    );
  };

  return (
    <div className="fade-in">
      <div className="section-header">จัดการการประกวด</div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ชื่อการประกวด</th>
              <th>สถานะ</th>
              <th>หมวดหมู่</th>
              <th>ระดับที่เปิดรับสมัคร</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest) => (
              <tr key={contest.id}>
                <td style={{ fontWeight: "bold" }}>{contest.name}</td>
                <td>
                  {contest.status === "open" ? (
                    <span className="badge-gray" style={{ background: "#dcfce7", color: "#166534" }}>
                      เปิดรับสมัคร
                    </span>
                  ) : (
                    <span className="badge-gray" style={{ background: "#fee2e2", color: "#991b1b" }}>
                      ปิดรับสมัคร
                    </span>
                  )}
                </td>
                <td>{contest.category}</td>
                <td>{contest.levels.join(", ")}</td>
                <td>
                  <button
                    className="btn-text"
                    style={{ color: "#2980b9" }}
                    onClick={() => toggleStatus(contest.id)}
                  >
                    เปลี่ยนสถานะ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ────────────────────────── 3. USERS SECTION ────────────────────────── */
function UsersSection() {
  const [users, setUsers] = useState([
    { id: 101, name: "Somchai Jaidee", email: "somchai@email.com", joined: "2024-01-15", status: "Active" },
    { id: 102, name: "Alice Wonderland", email: "alice@email.com", joined: "2024-02-10", status: "Banned" },
    { id: 103, name: "Kittiphong P.", email: "kitti@email.com", joined: "2024-02-12", status: "Active" },
  ]);

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Banned" : "Active" } : u));
  };

  return (
    <div className="fade-in">
      <h2 className="section-header">ผู้ส่งเข้าประกวด (Contestants)</h2>
      <div className="card">
        <div style={{ marginBottom: 15, display: "flex", gap: 10 }}>
          <input className="form-input" placeholder="ค้นหาผู้ใช้งาน..." style={{ marginBottom: 0, width: 300 }} />
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อ-สกุล</th>
              <th>อีเมล</th>
              <th>วันที่สมัคร</th>
              <th>สถานะ</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.joined}</td>
                <td>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4, fontSize: 12,
                    background: u.status === "Active" ? "#e8f8f5" : "#fbe9e7",
                    color: u.status === "Active" ? "#27ae60" : "#c0392b"
                  }}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-text"
                    style={{ color: u.status === "Active" ? "#c0392b" : "#27ae60", fontWeight: "bold" }}
                    onClick={() => toggleStatus(u.id)}
                  >
                    {u.status === "Active" ? "ระงับบัญชี" : "ปลดแบน"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ────────────────────────── 4. JUDGES SECTION ────────────────────────── */
function JudgesSection() {
  const judges = [
    { id: 1, name: "ดร. สมศักดิ์", expertise: "เทคโนโลยี AI", contests: 2 },
    { id: 2, name: "อ. วรรณา", expertise: "ศิลปะและการออกแบบ", contests: 5 },
    { id: 3, name: "คุณ โต๋", expertise: "ดนตรี", contests: 1 },
  ];

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="section-header" style={{ margin: 0 }}>จัดการกรรมการ (Judges)</h2>
        <button className="btn-primary">+ เพิ่มกรรมการ</button>
      </div>

      <div className="grid-2">
        {judges.map(j => (
          <div key={j.id} className="card" style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
               <Icon name="person" size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 5px 0" }}>{j.name}</h4>
              <div style={{ fontSize: 13, color: "#666" }}>ความเชี่ยวชาญ: {j.expertise}</div>
              <div style={{ fontSize: 13, color: "#666" }}>ตัดสินโครงการอยู่: {j.contests} รายการ</div>
            </div>
            <button className="btn-text" style={{ color: "#2980b9" }}>ตั้งค่า</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────── 5. MODERATION SECTION ────────────────────────── */
function ModerationSection() {
  const [reports, setReports] = useState([
    { id: 1, type: "Comment", content: "ฝากร้านหน่อยค่ะ สนใจแอดไลน์...", reporter: "user_05", reason: "Spam/โฆษณา" },
    { id: 2, type: "Post", content: "ผลงานนี้ก๊อปปี้มาจากเว็บ...", reporter: "user_11", reason: "ลิขสิทธิ์" },
  ]);

  const handleAction = (id) => {
    setReports(reports.filter(r => r.id !== id));
  };

  return (
    <div className="fade-in">
      <h2 className="section-header">ตรวจสอบเนื้อหา (Moderation Queue)</h2>
      {reports.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "#888", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Icon name="check" size={40} color="#27ae60" />
            <div>ไม่มีรายการรอตรวจสอบ</div>
        </div>
      ) : (
        reports.map(r => (
          <div key={r.id} className="card" style={{ marginBottom: 15, borderLeft: "4px solid #f39c12" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold", color: "#f39c12", display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="shield" size={14} /> รายงาน: {r.reason}
              </span>
              <span style={{ fontSize: 12, color: "#888" }}>แจ้งโดย: {r.reporter}</span>
            </div>
            <div style={{ background: "#f9f9f9", padding: 10, borderRadius: 5, margin: "10px 0", fontStyle: "italic" }}>
              "{r.content}"
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ background: "#27ae60" }} onClick={() => handleAction(r.id)}>
                <span style={{ marginRight: 5 }}><Icon name="check" size={14} /></span>
                เนื้อหาปลอดภัย (Keep)
              </button>
              <button className="btn-primary" style={{ background: "#c0392b" }} onClick={() => handleAction(r.id)}>
                <span style={{ marginRight: 5 }}><Icon name="trash" size={14} /></span>
                ลบเนื้อหา (Delete)
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ────────────────────────── 6. LOGS SECTION ────────────────────────── */
function LogsSection() {
  const logs = [
    { time: "2025-01-20 14:30", actor: "Admin", action: "Updated Competition ID #4" },
    { time: "2025-01-20 14:28", actor: "System", action: "Backup Database Successful" },
    { time: "2025-01-20 13:15", actor: "Judge_01", action: "Submitted Score for Contestant #99" },
    { time: "2025-01-20 12:00", actor: "User_55", action: "Login Failed (3 attempts)" },
  ];

  return (
    <div className="fade-in">
      <h2 className="section-header">ประวัติการทำงานของระบบ (System Logs)</h2>
      <div className="card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead style={{ background: "#eee" }}>
            <tr>
              <th style={{ width: 200 }}>Timestamp</th>
              <th style={{ width: 150 }}>User</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ color: "#666", fontSize: 13 }}>{log.time}</td>
                <td style={{ fontWeight: "bold" }}>{log.actor}</td>
                <td>{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ────────────────────────── 7. SETTINGS SECTION ────────────────────────── */
function SettingsSection() {
  const handleSave = () => alert("บันทึกการตั้งค่าเรียบร้อยแล้ว!");

  return (
    <div className="fade-in">
      <h2 className="section-header">ตั้งค่าระบบ (Settings)</h2>
      <div className="card" style={{ maxWidth: 600 }}>
        <h3 className="sub-header" style={{ marginTop: 0 }}>ข้อมูลทั่วไป</h3>
        <div className="form-group">
          <label>ชื่อเว็บไซต์ / แพลตฟอร์ม</label>
          <input className="form-input" defaultValue="Competition Platform 2025" />
        </div>
        <div className="form-group">
          <label>อีเมลติดต่อผู้ดูแลระบบ</label>
          <input className="form-input" defaultValue="admin@contest.com" />
        </div>

        <h3 className="sub-header">การตั้งค่าความปลอดภัย</h3>
        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" id="maint" />
          <label htmlFor="maint">เปิดโหมดปิดปรับปรุง (Maintenance Mode)</label>
        </div>
        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" id="regis" defaultChecked />
          <label htmlFor="regis">อนุญาตให้ผู้ใช้ใหม่สมัครสมาชิก</label>
        </div>

        <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #eee" }}>
          <button className="btn-primary" onClick={handleSave}>บันทึกการเปลี่ยนแปลง</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── HELPERS: MODALS ────────────────────────── */
function AddMemberModal({ onClose, onSave }) {
  const [data, setData] = useState({ email: "", role: "ผู้จัดการประกวด", password: "" });

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setData({ ...data, password: pass });
  };

  const handleSaveClick = () => {
    if(!data.email || !data.password) {
      alert("กรุณากรอกอีเมลและกดปุ่มเจนรหัสผ่าน");
      return;
    }
    onSave(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">เพิ่มทีมงาน / สร้าง User ใหม่</div>
        
        <div className="form-group">
          <label>อีเมล</label>
          <input 
            className="form-input" 
            placeholder="example@contest.com" 
            value={data.email}
            onChange={e => setData({...data, email: e.target.value})} 
          />
        </div>

        <div className="form-group">
          <label>ตำแหน่ง (Role)</label>
          <select 
            className="form-select" 
            value={data.role}
            onChange={e => setData({...data, role: e.target.value})}
          >
            <option value="ผู้จัดการประกวด">ผู้จัดการประกวด (Contest Manager)</option>
            <option value="ผู้ช่วยจัดการประกวด">ผู้ช่วยจัดการประกวด (Assistant Manager)</option>
            <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ (Administrator)</option>
          </select>
        </div>

        <div className="form-group">
          <label>รหัสผ่าน</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input 
              className="form-input" 
              placeholder="กดปุ่มเพื่อเจนรหัส" 
              value={data.password} 
              readOnly 
              style={{ background: "#f5f5f5", color: "#333", fontWeight: "bold" }}
            />
            <button 
              className="btn-primary" 
              style={{ background: "#8e44ad", whiteSpace: "nowrap" }}
              onClick={generatePassword}
            >
              <span style={{ marginRight: 5 }}><Icon name="refresh" size={14} /></span>
              เจนรหัส
            </button>
          </div>
          <small style={{ color: "#888" }}>กดปุ่มเพื่อสร้างรหัสผ่านอัตโนมัติสำหรับ User นี้</small>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>ยกเลิก</button>
          <button className="btn-save" onClick={handleSaveClick}>สร้าง User</button>
        </div>
      </div>
    </div>
  );
}