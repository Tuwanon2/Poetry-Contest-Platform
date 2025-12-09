// ...existing code...
import React, { useState } from "react";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f5f7",
        fontFamily: "Prompt, Inter, sans-serif",
      }}
    >
      <TopNav />

      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        <Sidebar active={activeSection} setActive={setActiveSection} />

        <div style={{ flex: 1, padding: "32px 40px 60px 40px", minWidth: 0 }}>
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
    <div
      style={{
        width: "100%",
        height: 60,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(112,19,108,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ fontWeight: 700, fontSize: 22, color: "#70136C" }}>
          Admin
        </span>

        <input
          type="text"
          placeholder="ค้นหา..."
          style={{
            border: "1.5px solid #e0e0e0",
            borderRadius: 10,
            background: "#f4f5f7",
            padding: "7px 14px",
            fontSize: 15,
            width: 180,
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ color: "#e67e22", fontWeight: 700, fontSize: 18 }}>
          🔔
        </span>

        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #70136C 60%, #70136C 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 17,
          }}
        >
          A
        </div>
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
    <div
      style={{
        width: 220,
        background: "#fff",
        borderRight: "1.5px solid #e0c7e7",
        minHeight: "calc(100vh - 60px)",
        padding: "32px 0",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => setActive(item.key)}
          style={{
            width: "100%",
            background: active === item.key ? "#f3d6f2" : "#fff",
            color: active === item.key ? "#70136C" : "#222",
            border: "none",
            borderLeft:
              active === item.key
                ? "5px solid #70136C"
                : "5px solid transparent",
            fontWeight: active === item.key ? 700 : 500,
            fontSize: 16,
            padding: "12px 24px",
            textAlign: "left",
            cursor: "pointer",
            borderRadius: "0 18px 18px 0",
            transition: "background 0.18s, color 0.18s",
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────── Overview ────────────────────────── */
function OverviewSection() {
  // Mock data for system overview
  const stats = [
    { title: "ผู้ใช้งานทั้งหมด", value: "380", icon: "👥" },
    { title: "ผู้ดูแล/เจ้าหน้าที่", value: "8", icon: "🛡️" },
    { title: "กรรมการทั้งหมด", value: "18", icon: "🧑‍⚖️" },
    { title: "จำนวนประกวดทั้งหมด", value: "12", icon: "🏆" },
    { title: "ประกวดที่กำลังเปิดอยู่", value: "3", icon: "✅" },
    { title: "ประกวดที่ปิดแล้ว", value: "9", icon: "🚫" },
  ];

  // Mock data for platform health
  const health = [
    { label: "API", status: "ออนไลน์", color: "#1abc9c" },
    { label: "Backend", status: "ออนไลน์", color: "#1abc9c" },
    { label: "Storage", status: "ออนไลน์", color: "#1abc9c" },
    { label: "พื้นที่ที่ใช้ไป", status: "2.4 GB", color: "#70136C" },
    { label: "อัตรา Error ล่าสุด", status: "0.2%", color: "#e67e22" },
    { label: "อีเมลที่รอส่ง", status: "5 ฉบับ", color: "#e67e22" },
  ];

  // Mock data for security
  const admins = [
    { name: "admin1", role: "ผู้ดูแลระบบ", ip: "192.168.1.10" },
    { name: "mod1", role: "ผู้ตรวจสอบ", ip: "192.168.1.15" },
  ];
  const securityAlerts = [
    "พบการพยายามเข้าสู่ระบบผิดพลาดหลายครั้ง (admin1)",
    "มีการ export ข้อมูลสำคัญโดย mod1",
    "พบการเข้าสู่ระบบจาก IP ผิดปกติ: 192.168.1.99",
  ];

  // Mock data for logs
  const logs = [
    "[12:01] เพิ่มประกวดใหม่: 'กลอนรักชิงแชมป์ประเทศไทย 2025' โดย admin1",
    "[11:45] เพิ่มกรรมการ: 'สมชาย ใจดี' โดย admin1",
    "[11:30] เปลี่ยนสิทธิ์ผู้ใช้: 'mod1' เป็น ผู้ตรวจสอบ",
    "[10:55] ลบประกวด: 'กลอนสร้างสรรค์สิ่งแวดล้อม' โดย mod1",
  ];

  // Mock data for data & backups
  const dbStats = {
    dbSize: "1.2 GB",
    fileCount: 542,
  };

  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: 26, color: "#70136C", marginBottom: 18 }}>ภาพรวมระบบ</h2>
      {/* Top KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 32 }}>
        {stats.slice(0, 4).map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>
      {/* Second row KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18, marginBottom: 32 }}>
        {stats.slice(4).map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>

      {/* Platform Health */}
      <h3 style={{ fontWeight: 700, fontSize: 19, color: "#70136C", marginBottom: 12 }}>สถานะ Platform</h3>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(112,19,108,0.08)", padding: "18px 18px", display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 32 }}>
        {health.map((h, i) => (
          <div key={i} style={{ minWidth: 180, color: h.color, fontWeight: 600, fontSize: 15, background: '#f8f2f7', borderRadius: 8, padding: '12px 18px', marginBottom: 8 }}>
            {h.label}: <b>{h.status}</b>
          </div>
        ))}
      </div>

      {/* Security & Permissions Overview */}
      <h3 style={{ fontWeight: 700, fontSize: 19, color: "#70136C", marginBottom: 12 }}>ความปลอดภัย & สิทธิ์การเข้าถึง</h3>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(112,19,108,0.08)", padding: "18px 18px", marginBottom: 32 }}>
        <div style={{ marginBottom: 10, fontWeight: 600, color: '#70136C' }}>ผู้ดูแลระบบ & ผู้ตรวจสอบ</div>
        <table style={{ width: '100%', fontSize: 15, marginBottom: 12 }}>
          <thead>
            <tr style={{ color: '#70136C', fontWeight: 600, background: '#f8f2f7' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>ชื่อผู้ใช้</th>
              <th style={{ padding: '6px 8px' }}>สิทธิ์</th>
              <th style={{ padding: '6px 8px' }}>IP ล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a, i) => (
              <tr key={i}>
                <td style={{ padding: '6px 8px' }}>{a.name}</td>
                <td style={{ padding: '6px 8px' }}>{a.role}</td>
                <td style={{ padding: '6px 8px' }}>{a.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginBottom: 6, fontWeight: 600, color: '#e74c3c' }}>แจ้งเตือนความปลอดภัย</div>
        <ul style={{ color: '#e74c3c', fontSize: 14, margin: 0, paddingLeft: 18 }}>
          {securityAlerts.map((alert, i) => (
            <li key={i}>{alert}</li>
          ))}
        </ul>
      </div>

      {/* System Logs Summary */}
      <h3 style={{ fontWeight: 700, fontSize: 19, color: "#70136C", marginBottom: 12 }}>สรุป Log ระบบ</h3>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(112,19,108,0.08)", padding: "18px 18px", marginBottom: 32 }}>
        <ul style={{ color: '#333', fontSize: 14, margin: 0, paddingLeft: 18 }}>
          {logs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <h3 style={{ fontWeight: 700, fontSize: 19, color: "#70136C", marginBottom: 12 }}>ปุ่มลัด</h3>
      <div style={{ display: 'flex', gap: 18, marginBottom: 32 }}>
        <button style={quickBtnStyle}>➕ สร้างประกวดใหม่</button>
        <button style={quickBtnStyle}>🧑‍⚖️ เชิญกรรมการ</button>
        <button style={quickBtnStyle}>🛡️ แก้ไขสิทธิ์ผู้ใช้</button>
        <button style={quickBtnStyle}>💾 กู้คืนข้อมูลจาก Backup</button>
      </div>

      {/* Data & Backups */}
      <h3 style={{ fontWeight: 700, fontSize: 19, color: "#70136C", marginBottom: 12 }}>ข้อมูล & การสำรองข้อมูล</h3>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(112,19,108,0.08)", padding: "18px 18px", marginBottom: 32, display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ fontWeight: 600, color: '#70136C', fontSize: 15 }}>
          ขนาดฐานข้อมูล: <b>{dbStats.dbSize}</b><br />
          จำนวนไฟล์ที่เก็บ: <b>{dbStats.fileCount}</b>
        </div>
        <button style={quickBtnStyle}>สำรองข้อมูลเดี๋ยวนี้</button>
        <button style={quickBtnStyle}>Export ข้อมูลระบบ</button>
      </div>

      {/* Example Graphs/Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        <GraphCard />
        <RecentActivityCard />
      </div>
    </div>
  );
}

const miniBtn = {
  background: '#f3d6f2',
  color: '#70136C',
  border: 'none',
  borderRadius: 7,
  padding: '4px 12px',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  marginLeft: 6,
};
const approvalBox = {
  background: '#fcf7fd',
  borderRadius: 10,
  padding: '14px 18px',
  color: '#70136C',
  fontWeight: 600,
  minWidth: 180,
  boxShadow: '0 1px 6px rgba(112,19,108,0.06)',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};
const judgeBox = {
  background: '#f8f2f7',
  borderRadius: 10,
  padding: '14px 18px',
  color: '#70136C',
  fontWeight: 600,
  minWidth: 180,
  boxShadow: '0 1px 6px rgba(112,19,108,0.06)',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};
const healthBox = {
  background: '#f4f5f7',
  borderRadius: 10,
  padding: '14px 18px',
  color: '#222',
  fontWeight: 600,
  minWidth: 180,
  boxShadow: '0 1px 6px rgba(112,19,108,0.06)',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

/* ────────────────────────── Sections ────────────────────────── */
function CompetitionsSection() {
  return (
    <div>
      <h2
        style={{
          fontWeight: 700,
          fontSize: 24,
          color: "#70136C",
          marginBottom: 18,
        }}
      >
        จัดการการประกวด
      </h2>

      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 8px rgba(112,19,108,0.08)",
          padding: "24px 28px",
          marginBottom: 24,
        }}
      >
        <button
          style={{
            background: "#70136C",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 22px",
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 18,
          }}
        >
          สร้างการประกวดใหม่
        </button>

        <div style={{ fontWeight: 600, color: "#222", marginBottom: 10 }}>
          รายการการประกวด (mock):
        </div>

        <ul style={{ paddingLeft: 18, color: "#70136C", fontWeight: 500 }}>
          <li>
            กลอนรักชิงแชมป์ประเทศไทย 2025{" "}
            <span style={{ color: "#1abc9c", marginLeft: 8 }}>[Active]</span>
          </li>
          <li>
            ประกวดกลอนเยาวชน 2025{" "}
            <span style={{ color: "#e67e22", marginLeft: 8 }}>[Draft]</span>
          </li>
          <li>
            กลอนสร้างสรรค์สิ่งแวดล้อม{" "}
            <span style={{ color: "#e74c3c", marginLeft: 8 }}>[Closed]</span>
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
      <h2 style={sectionHeader}>จัดการผู้ใช้</h2>

      <div style={sectionCard}>
        <div style={{ fontWeight: 600, color: "#222", marginBottom: 10 }}>
          หมวดผู้ใช้:
        </div>

        <ul style={{ paddingLeft: 18, color: "#70136C", fontWeight: 500 }}>
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
      <h2 style={sectionHeader}>Judges & Staff Tools</h2>

      <div style={sectionCard}>
        <ul style={{ paddingLeft: 18, color: "#70136C", fontWeight: 500 }}>
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
      <h2 style={sectionHeader}>Content Moderation</h2>

      <div style={sectionCard}>
        <ul style={{ paddingLeft: 18, color: "#70136C", fontWeight: 500 }}>
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
      <h2 style={sectionHeader}>System Logs</h2>

      <div style={sectionCard}>
        <ul style={{ paddingLeft: 18, color: "#70136C", fontWeight: 500 }}>
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
      <h2 style={sectionHeader}>System Settings</h2>

      <div style={sectionCard}>
        <ul style={{ paddingLeft: 18, color: "#70136C", fontWeight: 500 }}>
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
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "16px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        boxShadow: "0 2px 8px rgba(112,19,108,0.08)",
      }}
    >
      <span style={{ fontSize: 15, color: "#70136C", fontWeight: 600 }}>
        {title}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: "#222" }}>
          {value}
        </span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
    </div>
  );
}

function GraphCard() {
  const bars = [50, 80, 65, 100, 40, 75, 92];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "22px 18px",
        boxShadow: "0 2px 8px rgba(112,19,108,0.08)",
        minHeight: 180,
      }}
    >
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

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          height: 90,
          gap: 10,
          justifyContent: "center",
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: h * 0.7,
              background: "#70136C",
              borderRadius: 5,
            }}
          />
        ))}
      </div>

      <p
        style={{
          color: "#aaa",
          fontSize: 11,
          textAlign: "center",
          marginTop: 8,
        }}
      >
        [ ข้อมูลจำลองเพื่อแสดงผล ]
      </p>
    </div>
  );
  // Mock data for monthly stats
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const competitions = [2, 3, 1, 4, 2, 3, 5, 2, 3, 4, 2, 3];
  const uploads = [30, 45, 28, 60, 40, 55, 70, 50, 65, 80, 60, 75];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "22px 18px 18px 18px",
        boxShadow: "0 2px 8px rgba(112,19,108,0.08)",
        minHeight: 260,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: "#70136C" }}>
        กราฟสถิติระบบรายเดือน
      </div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>
        จำนวนการสร้างประกวดและอัปโหลดผลงานในแต่ละเดือน (mock)
      </div>
      {/* Chart Area */}
      <div style={{ position: 'relative', height: 140, marginBottom: 18, paddingLeft: 32, paddingRight: 12 }}>
        {/* Y Axis grid lines and labels */}
        {[80, 60, 40, 20, 0].map((y, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: 0,
            top: `${(1 - y / 80) * 100}%`,
            width: '100%',
            borderTop: '1px dashed #e0c7e7',
            color: '#bbb',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{ width: 28, textAlign: 'right', marginRight: 4 }}>{y}</span>
          </div>
        ))}
        {/* Bars for uploads */}
        <div style={{ display: 'flex', height: '100%', alignItems: 'flex-end', position: 'absolute', left: 32, right: 0, bottom: 0, top: 0, zIndex: 2 }}>
          {uploads.map((val, i) => (
            <div key={i} style={{
              width: 16,
              height: `${val / 80 * 100}%`,
              background: 'linear-gradient(135deg, #70136C 60%, #f3d6f2 100%)',
              borderRadius: 5,
              margin: '0 6px',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
              <span style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: '#70136C', fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>
        {/* Line for competitions */}
        <svg width={months.length * 28} height={140} style={{ position: 'absolute', left: 32, top: 0, pointerEvents: 'none', zIndex: 3 }}>
          <polyline
            fill="none"
            stroke="#e67e22"
            strokeWidth="3"
            points={competitions.map((val, i) => `${i * 28 + 8},${140 - (val / 6 * 120 + 10)}`).join(' ')}
          />
          {competitions.map((val, i) => (
            <circle
              key={i}
              cx={i * 28 + 8}
              cy={140 - (val / 6 * 120 + 10)}
              r={4}
              fill="#e67e22"
              stroke="#fff"
              strokeWidth={1.5}
            />
          ))}
        </svg>
        {/* X Axis labels */}
        <div style={{ position: 'absolute', left: 32, right: 0, bottom: -18, display: 'flex', width: 'calc(100% - 32px)', justifyContent: 'space-between', fontSize: 11, color: '#888' }}>
          {months.map((m, i) => (
            <span key={i} style={{ width: 28, textAlign: 'center' }}>{m}</span>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 18, fontSize: 13, color: '#555', alignItems: 'center', marginTop: 2 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 18, height: 8, background: 'linear-gradient(135deg, #70136C 60%, #f3d6f2 100%)', borderRadius: 4, display: 'inline-block' }} />
          อัปโหลดผลงาน (จำนวน)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="18" height="8"><polyline points="0,8 9,2 18,8" fill="none" stroke="#e67e22" strokeWidth="3" /></svg>
          การสร้างประกวด (จำนวน)
        </span>
      </div>
      <p style={{ color: "#aaa", fontSize: 11, textAlign: "center", marginTop: 8 }}>[ ข้อมูลจำลองเพื่อแสดงผล ]</p>
    </div>
  );
}

function RecentActivityCard() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "22px 18px",
        boxShadow: "0 2px 8px rgba(112,19,108,0.08)",
      }}
    >
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

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          fontSize: 13,
          color: "#333",
          lineHeight: "1.6",
        }}
      >
        <li>
          • ผู้สมัครใหม่เข้าระบบ: <b>สมชาย ใจดี</b>
        </li>
        <li>
          • อัปโหลดผลงานใหม่: <b>กลอนรักษ์โลก</b>
        </li>
        <li>
          • กรรมการให้คะแนนผลงาน: <b>8.5</b>
        </li>
        <li>
          • ปิดรับสมัครการประกวด: <b>กลอนสิ่งแวดล้อม</b>
        </li>
      </ul>
    </div>
  );
}

/* ────────────────────────── Shared Styles ────────────────────────── */
const sectionHeader = {
  fontWeight: 700,
  fontSize: 24,
  color: "#70136C",
  marginBottom: 18,
};

const sectionCard = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 2px 8px rgba(112,19,108,0.08)",
  padding: "24px 28px",
  marginBottom: 24,
};

const quickBtnStyle = {
  background: "#70136C",
  border: "none",
  borderRadius: 8,
  padding: "8px 18px",
  color: "#fff",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
};
