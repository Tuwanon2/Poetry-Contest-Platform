import React, { useState } from "react";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="dashboard-container">
      <TopNav />

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

/* ────────────────────────── Top Navigation ────────────────────────── */
function TopNav() {
  return (
    <div className="top-nav">
      <div className="nav-left">
        <span className="nav-title">Admin</span>
        <input type="text" placeholder="ค้นหา..." className="nav-search" />
      </div>

      <div className="nav-right">
        <span className="nav-notification">🔔</span>
        <div className="nav-avatar">A</div>
      </div>
    </div>
  );
}

/* ────────────────────────── Sidebar ────────────────────────── */
function Sidebar({ active, setActive }) {
  const items = [
    { key: "overview", label: "Dashboard" },
    { key: "competitions", label: "Competitions" },
    { key: "users", label: "Users" },
    { key: "judges", label: "Judges & Staff" },
    { key: "moderation", label: "Moderation" },
    { key: "logs", label: "System Logs" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="sidebar">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => setActive(item.key)}
          className={`sidebar-btn ${active === item.key ? "active" : ""}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────── Overview (อัปเดต: แยกนับ Admin/Mod/Staff) ────────────────────────── */
function OverviewSection() {
  // 1. Mock Data: ใส่ข้อมูลให้หลากหลายเพื่อทดสอบการนับแยกประเภท
  const [admins, setAdmins] = useState([
    { email: "admin_main@gmail.com", role: "ผู้ดูแลระบบ", ip: "192.168.1.10" },
    { email: "admin_sec@gmail.com", role: "ผู้ดูแลระบบ", ip: "192.168.1.11" },
    { email: "manager_01@gmail.com", role: "ผู้ตรวจสอบ", ip: "192.168.1.15" },
    { email: "staff_help@gmail.com", role: "เจ้าหน้าที่", ip: "192.168.1.20" },
    { email: "staff_support@gmail.com", role: "เจ้าหน้าที่", ip: "192.168.1.22" },
  ]);

  const [showModal, setShowModal] = useState(false);

  // 2. Logic การคำนวณจำนวนคนแต่ละประเภท (แยกชัดเจน)
  const totalAdmins = admins.filter(a => a.role === "ผู้ดูแลระบบ").length; // นับเฉพาะ Admin
  const totalModerators = admins.filter(a => a.role === "ผู้ตรวจสอบ").length; // นับเฉพาะ Moderator
  const totalStaff = admins.filter(a => a.role === "เจ้าหน้าที่").length;     // นับเฉพาะ Staff
  const totalJudges = 15; // Mock กรรมการ

  const handleSaveNewAdmin = (newAdmin) => {
    setAdmins([...admins, newAdmin]);
    setShowModal(false);
  };

  // 3. อัปเดตข้อมูลใน Stats Cards แถวบนสุด
  const stats = [
    { title: "ผู้ดูแลระบบ (Admin)", value: totalAdmins, icon: "👑" },       // ช่อง 1
    { title: "ผู้จัดการ (Mod)", value: totalModerators, icon: "🛡️" },     // ช่อง 2
    { title: "เจ้าหน้าที่ (Staff)", value: totalStaff, icon: "⚡" },         // ช่อง 3
    { title: "กรรมการ (Judge)", value: totalJudges, icon: "🧑‍⚖️" },        // ช่อง 4
    
    // ข้อมูลแถวล่าง
    { title: "ผู้สมัครแข่งขัน", value: "380", icon: "👥" },
    { title: "การประกวดทั้งหมด", value: "12", icon: "🏆" },
  ];

  const health = [
    { label: "API", status: "ออนไลน์", color: "#1abc9c" },
    { label: "Backend", status: "ออนไลน์", color: "#1abc9c" },
    { label: "Storage", status: "ออนไลน์", color: "#1abc9c" },
    { label: "พื้นที่ที่ใช้ไป", status: "2.4 GB", color: "#70136C" },
    { label: "อัตรา Error ล่าสุด", status: "0.2%", color: "#e67e22" },
    { label: "อีเมลที่รอส่ง", status: "5 ฉบับ", color: "#e67e22" },
  ];

  const securityAlerts = [
    "พบการพยายามเข้าสู่ระบบผิดพลาดหลายครั้ง (admin_main)",
    "มีการ export ข้อมูลสำคัญโดย manager_01",
    "พบการเข้าสู่ระบบจาก IP ผิดปกติ: 192.168.1.99",
  ];

  const logs = [
    "[12:01] เพิ่มประกวดใหม่: 'กลอนรักชิงแชมป์ประเทศไทย 2025' โดย admin_main",
    "[11:45] เพิ่มกรรมการ: 'สมชาย ใจดี' โดย admin_main",
    "[11:30] เปลี่ยนสิทธิ์ผู้ใช้: 'staff_help' เป็น เจ้าหน้าที่",
  ];

  const dbStats = { dbSize: "1.2 GB", fileCount: 542 };

  return (
    <div>
      <h2 className="section-header">ภาพรวมระบบ</h2>

      {/* KPI Cards: แถวบน 4 ใบ (Admin, Mod, Staff, Judges) */}
      <div className="grid-4">
        {stats.slice(0, 4).map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>
      
      {/* KPI Cards: แถวล่าง 2 ใบ */}
      <div className="grid-2" style={{ marginTop: '20px' }}>
        {stats.slice(4).map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>

      {/* Platform Health */}
      <h3 className="sub-header">สถานะ Platform</h3>
      <div className="card health-container">
        {health.map((h, i) => (
          <div key={i} className="health-badge" style={{ color: h.color }}>
            {h.label}: <b>{h.status}</b>
          </div>
        ))}
      </div>

      {/* Security & User List */}
      <h3 className="sub-header">ทีมงานจัดการประกวด</h3>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 600, color: "#70136C" }}>
            รายชื่อผู้ดูแล & เจ้าหน้าที่
          </div>
          <button 
            className="btn-primary" 
            style={{ fontSize: 13, padding: '4px 12px' }}
            onClick={() => setShowModal(true)}
          >
            + เพิ่มทีมงาน
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>อีเมล (Gmail)</th>
              <th>ตำแหน่ง (Role)</th>
              <th>IP ล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a, i) => (
              <tr key={i}>
                <td>{a.email}</td>
                <td>
                  {/* แยกสีตาม Role เพื่อความชัดเจน */}
                  <span style={{ 
                    fontWeight: 600,
                    color: a.role === 'ผู้ดูแลระบบ' ? '#c0392b' : 
                           (a.role === 'ผู้ตรวจสอบ' ? '#d35400' : '#2980b9')
                  }}>
                    {a.role}
                  </span>
                </td>
                <td>{a.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 18, marginBottom: 6, fontWeight: 600, color: "#e74c3c" }}>
          แจ้งเตือนความปลอดภัย
        </div>
        <ul className="alert-list">
          {securityAlerts.map((alert, i) => (
            <li key={i}>{alert}</li>
          ))}
        </ul>
      </div>

      {/* Logs */}
      <h3 className="sub-header">สรุป Log ระบบ</h3>
      <div className="card">
        <ul className="log-list">
          {logs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <h3 className="sub-header">ปุ่มลัด</h3>
      <div className="quick-actions">
        <button className="btn-primary">➕ สร้างประกวดใหม่</button>
        <button className="btn-primary">🧑‍⚖️ เชิญกรรมการ</button>
        <button className="btn-primary">🛡️ แก้ไขสิทธิ์ผู้ใช้</button>
        <button className="btn-primary">💾 กู้คืนข้อมูลจาก Backup</button>
      </div>

      {/* Data & Backups */}
      <h3 className="sub-header">ข้อมูล & การสำรองข้อมูล</h3>
      <div className="card backup-section">
        <div style={{ fontWeight: 600, color: "#70136C", fontSize: 15 }}>
          ขนาดฐานข้อมูล: <b>{dbStats.dbSize}</b>
          <br />
          จำนวนไฟล์ที่เก็บ: <b>{dbStats.fileCount}</b>
        </div>
        <button className="btn-primary">สำรองข้อมูลเดี๋ยวนี้</button>
        <button className="btn-primary">Export ข้อมูลระบบ</button>
      </div>

      {/* Graphs */}
      <div className="grid-2">
        <GraphCard />
        <RecentActivityCard />
      </div>

      {/* --- เรียกใช้ Modal --- */}
      {showModal && (
        <AddAdminModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSaveNewAdmin} 
        />
      )}
    </div>
  );
}

/* ──────────────── Component Modal เพิ่ม Gmail & Password ──────────────── */
function AddAdminModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "ผู้ดูแลระบบ",
  });

  // ฟังก์ชันสุ่มรหัสผ่าน
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: pass }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      return alert("กรุณากรอก Email และ Password");
    }
    
    // ส่งข้อมูลกลับ (Mock IP ให้ด้วย)
    onSave({
      email: formData.email,
      role: formData.role,
      ip: "127.0.0.1 (New)", 
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">เพิ่มบัญชีผู้ดูแลใหม่</div>
        
        {/* ช่องกรอก Email */}
        <div className="form-group">
          <label>Gmail / Email ผู้ใช้งาน</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            autoFocus
          />
        </div>

        {/* ช่องกรอก Password พร้อมปุ่มสุ่ม */}
        <div className="form-group">
          <label>สร้างรหัสผ่าน (Password)</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text" 
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="ตั้งรหัสผ่าน..."
            />
            <button 
              onClick={generatePassword}
              style={{
                whiteSpace: 'nowrap',
                padding: '0 12px',
                background: '#e0c7e7',
                border: 'none',
                borderRadius: '8px',
                color: '#70136C',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              สุ่มรหัส
            </button>
          </div>
        </div>

        {/* เลือกสิทธิ์ */}
        <div className="form-group">
          <label>ระดับสิทธิ์ (Role)</label>
          <select
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ (Admin)</option>
            <option value="ผู้ตรวจสอบ">ผู้ตรวจสอบ (Moderator)</option>
            <option value="เจ้าหน้าที่">เจ้าหน้าที่ (Staff)</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>ยกเลิก</button>
          <button className="btn-save" onClick={handleSubmit}>บันทึกและสร้างบัญชี</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── Sections อื่นๆ (คงเดิม) ────────────────────────── */
function CompetitionsSection() {
  return (
    <div>
      <h2 className="section-header">จัดการการประกวด</h2>
      <div className="card">
        <button className="btn-primary" style={{ marginBottom: 18 }}>
          สร้างการประกวดใหม่
        </button>
        <div style={{ fontWeight: 600, color: "#222", marginBottom: 10 }}>
          รายการการประกวด (mock):
        </div>
        <ul className="content-list">
          <li>
            กลอนรักชิงแชมป์ประเทศไทย 2025{" "}
            <span style={{ color: "#1abc9c" }}>[Active]</span>
          </li>
          <li>
            ประกวดกลอนเยาวชน 2025{" "}
            <span style={{ color: "#e67e22" }}>[Draft]</span>
          </li>
          <li>
            กลอนสร้างสรรค์สิ่งแวดล้อม{" "}
            <span style={{ color: "#e74c3c" }}>[Closed]</span>
          </li>
        </ul>
        <div style={{ marginTop: 18, color: "#888", fontSize: 13 }}>
          [ ดู/แก้ไข/ลบ/ดู logs ]
        </div>
      </div>
    </div>
  );
}

function UsersSection() {
  return (
    <div>
      <h2 className="section-header">จัดการผู้ใช้</h2>
      <div className="card">
        <div style={{ fontWeight: 600, color: "#222", marginBottom: 10 }}>
          หมวดผู้ใช้:
        </div>
        <ul className="content-list">
          <li>ผู้สมัคร (Participants)</li>
          <li>ผู้ช่วย (Staff)</li>
          <li>กรรมการ (Judges)</li>
          <li>ผู้ดูแลระบบ (Admins)</li>
        </ul>
        <div style={{ marginTop: 18, color: "#888", fontSize: 13 }}>
          [ เพิ่ม/ลบ/disable/reset password/เปลี่ยน role/ค้นหา/export ]
        </div>
      </div>
    </div>
  );
}

function JudgesSection() {
  return (
    <div>
      <h2 className="section-header">Judges & Staff Tools</h2>
      <div className="card">
        <ul className="content-list">
          <li>ส่งคำเชิญกรรมการ</li>
          <li>ตั้งสิทธิแต่ละ role</li>
          <li>จัดทีมกรรมการ</li>
          <li>ดูสถานะการให้คะแนน</li>
        </ul>
      </div>
    </div>
  );
}

function ModerationSection() {
  return (
    <div>
      <h2 className="section-header">Content Moderation</h2>
      <div className="card">
        <ul className="content-list">
          <li>ตรวจโพสต์/เนื้อหา/ผลงานที่รายงาน</li>
          <li>แบน/ลบผลงาน</li>
        </ul>
      </div>
    </div>
  );
}

function LogsSection() {
  return (
    <div>
      <h2 className="section-header">System Logs</h2>
      <div className="card">
        <ul className="content-list">
          <li>ดู log การกระทำทั้งหมด</li>
          <li>export logs</li>
        </ul>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div>
      <h2 className="section-header">System Settings</h2>
      <div className="card">
        <ul className="content-list">
          <li>ชื่อเว็บไซต์ / โลโก้ / สีธีม</li>
          <li>Email setting (SMTP)</li>
          <li>API keys</li>
          <li>Backup & Restore</li>
          <li>ตั้งค่าความปลอดภัย (2FA / IP whitelist)</li>
        </ul>
      </div>
    </div>
  );
}

/* ────────────────────────── Shared Components ────────────────────────── */
function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <span className="stat-title">{title}</span>
      <div className="stat-value-container">
        <span className="stat-value">{value}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
    </div>
  );
}

function GraphCard() {
  const bars = [50, 80, 65, 100, 40, 75, 92];

  return (
    <div className="card graph-container">
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
          marginBottom: 14,
          color: "#70136C",
        }}
      >
        สถิติผู้สมัครรายวัน
      </div>

      <div className="graph-bars-wrapper">
        {bars.map((h, i) => (
          <div
            key={i}
            className="graph-bar"
            style={{ height: h * 0.7 }}
          />
        ))}
      </div>

      <p className="graph-footer">[ ข้อมูลจำลองเพื่อแสดงผล ]</p>
    </div>
  );
}

function RecentActivityCard() {
  return (
    <div className="card">
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
          marginBottom: 10,
          color: "#70136C",
          textAlign: "center",
        }}
      >
        กิจกรรมล่าสุดในระบบ
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13, lineHeight: "1.6" }}>
        <li>• ผู้สมัครใหม่เข้าระบบ: <b>สมชาย ใจดี</b></li>
        <li>• อัปโหลดผลงานใหม่: <b>กลอนรักษ์โลก</b></li>
        <li>• กรรมการให้คะแนนผลงาน: <b>8.5</b></li>
        <li>• ปิดรับสมัครการประกวด: <b>กลอนสิ่งแวดล้อม</b></li>
      </ul>
    </div>
  );
}