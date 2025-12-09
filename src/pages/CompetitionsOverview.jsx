import React from "react";

import TopNav2 from "../components/TopNav2";
import SidebarNav from "../components/SidebarNav";
import { SidebarNavContext } from "../components/SidebarNavContext";

export default function CompetitionsOverview() {
    // ====== FILE VERIFICATION TABLE STATE ======
    const [verifyRows, setVerifyRows] = React.useState([
      { id: 1, name: 'สมชาย ใจดี', phone: '0812345678', email: 'somchai@email.com', file: 'cert_somchai.pdf' },
      { id: 2, name: 'สุดารัตน์ สวยงาม', phone: '0898765432', email: 'sudarat@email.com', file: 'cert_sudarat.pdf' },
      { id: 3, name: 'John Doe', phone: '0911112222', email: 'john@email.com', file: 'cert_john.pdf' },
    ]);

    const handleVerify = (id) => {
      setVerifyRows(verifyRows.filter(row => row.id !== id));
    };
  const [sidebarPage, setSidebarPage] = React.useState("overview");

  const [isOpen] = React.useState(true);
  const [desc] = React.useState("ประกวดเรื่องสั้นฉันทลักษณ์ ครั้งที่ 7 “ป้องโลกด้วยกอด กอดโลกด้วยกลอน”");
  const deadline = "31 ธ.ค. 2568";

  // ====== STYLE VARIABLES ======
  const statCardModernStyle = {
    background: "#fff",
    border: "2px solid #e0c7e7",
    borderRadius: 16,
    padding: "20px 24px",
    boxShadow: "0 2px 10px rgba(112,19,108,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };

  const manageCardStyle = {
    background: "#fff",
    border: "2px solid #e0c7e7",
    marginBottom: 10,
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(112,19,108,0.06)",
    padding: "24px 18px",
    minHeight: 180,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };

  const manageTitleStyle = {
    fontWeight: 700,
    fontSize: "1.12rem",
    color: "#70136C",
    marginBottom: 10,
  };

  const manageListStyle = {
    color: "#444",
    fontSize: "1.04rem",
    margin: 0,
    padding: "0 0 0 18px",
    lineHeight: 1.7,
  };

  // ====== MAIN PAGE ======
  return (
    <SidebarNavContext.Provider value={{ sidebarPage, setSidebarPage }}>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fb" }}>
        <SidebarNav current={sidebarPage} onNavigate={setSidebarPage} />

        <div style={{ flex: 1, marginLeft: 220, minHeight: "100vh" }}>
          <TopNav2 />

          <div style={{ width: "100%", background: "transparent" }}>
            <div
              style={{
                fontSize: "1.18rem",
                fontWeight: 600,
                color: "#6c5ce7",
                margin: "8px 0 4px 0",
                paddingLeft: 32,
                letterSpacing: "-0.5px",
                textAlign: "left",
              }}
            >
              Overview
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div style={{ padding: '24px 24px 32px 24px', maxWidth: 900, margin: "0 auto" }}>
            {/* ==================== OVERVIEW PAGE ==================== */}
            {sidebarPage === "overview" && (
              <>
                {/* HEADER */}
                <div
                  style={{
                    background: "#fff",
                    border: "2px solid #e0c7e7",
                    borderRadius: 16,
                    boxShadow: "0 2px 12px rgba(112,19,108,0.06)",
                    padding: "16px 22px 12px 22px",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      flexWrap: "wrap",
                      marginBottom: 8,
                    }}
                  >
                    <h2
                      style={{
                        color: "#70136C",
                        fontWeight: 800,
                        fontSize: "1.55rem",
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      {desc}
                    </h2>

                    <span
                      style={{
                        background: isOpen ? "#1abc9c" : "#e06c6c",
                        color: "#fff",
                        borderRadius: 8,
                        padding: "6px 18px",
                        fontWeight: 700,
                        fontSize: "1.08rem",
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        boxShadow: isOpen ? '0 2px 8px 0 rgba(26,188,156,0.10)' : undefined,
                      }}
                    >
                      <span role="img" aria-label="announce" style={{ fontSize: '1.1rem' }}>{isOpen ? "📢" : "❌"}</span>
                      {isOpen ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
                    </span>
                  </div>

                  <div
                    style={{
                      color: "#70136C",
                      fontWeight: 500,
                      fontSize: "1.04rem",
                      display: "flex",
                      gap: 24,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#f7f7fb',
                        borderRadius: 8,
                        padding: '4px 12px',
                        cursor: 'pointer',
                        border: '1.5px solid #e0c7e7',
                        transition: 'background 0.15s, border 0.15s',
                      }}
                      title="แก้ไขวัน Deadline"
                      onClick={() => alert('แก้ไขวัน Deadline (mockup)')}
                      onMouseOver={e => {
                        e.currentTarget.style.background = '#eae6fa';
                        e.currentTarget.style.border = '1.5px solid #6c5ce7';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = '#f7f7fb';
                        e.currentTarget.style.border = '1.5px solid #e0c7e7';
                      }}
                    >
                     
                      Deadline: {deadline}
                      <span style={{ fontSize: '1.08rem', color: '#6c5ce7', marginLeft: 2 }} title="แก้ไข"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8 2.8c-.4-.4-1-.4-1.4 0l-7 7V13h3.2l7-7c.4-.4.4-1 0-1.4l-1.8-1.8zm-8.8 9.2V13h1.2l7-7-1.2-1.2-7 7z" fill="#6c5ce7"/></svg></span>
                    </span>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #e6e6e6', margin: '0 0 16px 0' }} />
                {/* SECTION: ภาพรวมผู้สมัคร */}
                <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#6c5ce7', margin: '0 0 6px 2px', letterSpacing: '-0.5px' }}>
                  ภาพรวมผู้สมัคร
                </div>
                <div style={{ borderBottom: '1px solid #e6e6e6', margin: '0 0 10px 0' }} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 18,
                    marginBottom: 18,
                  }}
                >
                  {/* ผู้สมัครทั้งหมด */}
                  <div
                    style={{
                      ...statCardModernStyle,
                      cursor: 'pointer',
                      border: '2px solid #6c5ce7',
                      boxShadow: '0 4px 16px rgba(112,19,108,0.10)',
                      transform: 'scale(1)',
                    }}
                    onClick={() => alert('ดูรายชื่อผู้สมัครทั้งหมด (mockup)')}
                    onMouseOver={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(112,19,108,0.18)';
                      e.currentTarget.style.border = '2.5px solid #4b2e83';
                      e.currentTarget.style.transform = 'scale(1.045) translateY(-6px)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(112,19,108,0.10)';
                      e.currentTarget.style.border = '2px solid #6c5ce7';
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    }}
                                      onMouseOver={e => {
                                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,184,148,0.18)';
                                        e.currentTarget.style.border = '2.5px solid #00b894';
                                        e.currentTarget.style.transform = 'scale(1.045) translateY(-6px)';
                                      }}
                                      onMouseOut={e => {
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,184,148,0.10)';
                                        e.currentTarget.style.border = '2px solid #00b894';
                                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                      }}
                                      onMouseOver={e => {
                                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(9,132,227,0.18)';
                                        e.currentTarget.style.border = '2.5px solid #0984e3';
                                        e.currentTarget.style.transform = 'scale(1.045) translateY(-6px)';
                                      }}
                                      onMouseOut={e => {
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(9,132,227,0.10)';
                                        e.currentTarget.style.border = '2px solid #0984e3';
                                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                      }}
                  >
                    <span style={{ fontSize: "1.04rem", color: "#222", fontWeight: 600 }}>
                      ผู้สมัครทั้งหมด
                    </span>
                    <div style={{ fontSize: 36, fontWeight: 700, color: "#222" }}>32</div>
                    <div style={{ fontSize: '0.98rem', color: '#6c5ce7', fontWeight: 500, marginTop: 6 }}>
                      สมัครวันนี้ <span style={{ fontWeight: 700, color: '#00b894' }}>4</span> คน
                    </div>
                    <div style={{ marginTop: 10 }}>
                     
                    </div>
                  </div>
                  {/* ผู้สมัครระดับประถม */}
                  <div
                    style={{
                      ...statCardModernStyle,
                      cursor: 'pointer',
                      border: '2px solid #00b894',
                      boxShadow: '0 4px 16px rgba(0,184,148,0.10)',
                      transform: 'scale(1)',
                    }}
                    onClick={() => alert('ดูรายชื่อผู้สมัครระดับประถม (mockup)')}
                    onMouseOver={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,184,148,0.18)';
                      e.currentTarget.style.border = '2.5px solid #00b894';
                      e.currentTarget.style.transform = 'scale(1.045)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,184,148,0.10)';
                      e.currentTarget.style.border = '2px solid #00b894';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span style={{ fontSize: "1.04rem", color: "#00b894", fontWeight: 600 }}>
                      ระดับประถม
                    </span>
                    <div style={{ fontSize: 36, fontWeight: 700, color: "#00b894" }}>18</div>
                    <div style={{ fontSize: '0.98rem', color: '#6c5ce7', fontWeight: 500, marginTop: 6 }}>
                      สมัครวันนี้ <span style={{ fontWeight: 700, color: '#00b894' }}>2</span> คน
                    </div>
                  </div>
                  {/* ผู้สมัครระดับมัธยม */}
                  <div
                    style={{
                      ...statCardModernStyle,
                      cursor: 'pointer',
                      border: '2px solid #0984e3',
                      boxShadow: '0 4px 16px rgba(9,132,227,0.10)',
                      transform: 'scale(1)',
                    }}
                    onClick={() => alert('ดูรายชื่อผู้สมัครระดับมัธยม (mockup)')}
                    onMouseOver={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(9,132,227,0.18)';
                      e.currentTarget.style.border = '2.5px solid #0984e3';
                      e.currentTarget.style.transform = 'scale(1.045)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(9,132,227,0.10)';
                      e.currentTarget.style.border = '2px solid #0984e3';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span style={{ fontSize: "1.04rem", color: "#0984e3", fontWeight: 600 }}>
                      ระดับมัธยม
                    </span>
                    <div style={{ fontSize: 36, fontWeight: 700, color: "#0984e3" }}>14</div>
                    <div style={{ fontSize: '0.98rem', color: '#6c5ce7', fontWeight: 500, marginTop: 6 }}>
                      สมัครวันนี้ <span style={{ fontWeight: 700, color: '#0984e3' }}>2</span> คน
                    </div>
                  </div>
                </div>

                {/* FILE VERIFICATION TABLE SECTION */}
                <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#6c5ce7', margin: '0 0 6px 2px', letterSpacing: '-0.5px' }}>
                  ตรวจสอบไฟล์รับรองการเป็นนักเรียนนักศึกษา
                </div>
                <div style={{ borderBottom: '1px solid #e6e6e6', margin: '0 0 10px 0' }} />
                <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(112,19,108,0.04)', border: '1.5px solid #e0e6ef', padding: '12px 16px', marginBottom: 18 }}>
                  {verifyRows.length === 0 ? (
                    <div style={{ color: '#1abc9c', fontWeight: 500, fontSize: '1.08rem', margin: '18px 0' }}>✅ ตรวจสอบไฟล์ครบแล้ว</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                      <thead>
                        <tr style={{ background: '#f7e7fa', color: '#70136C' }}>
                          <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>ชื่อ</th>
                          <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>เบอร์โทร</th>
                          <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>อีเมล</th>
                          <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>ไฟล์รับรอง</th>
                          <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>ตรวจสอบ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verifyRows.map(row => (
                          <tr key={row.id}>
                            <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>{row.name}</td>
                            <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>{row.phone}</td>
                            <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>{row.email}</td>
                            <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>
                              <a href={'#'} style={{ color: '#6c5ce7', textDecoration: 'underline', fontWeight: 500 }}>{row.file}</a>
                            </td>
                            <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7', textAlign: 'center' }}>
                              <button onClick={() => handleVerify(row.id)} style={{ background: '#1abc9c', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}>✓ ยืนยันถูกต้อง</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {/* ...กล่อง Management ทั้ง 3 ถูกลบออกตามคำขอ... */}
                {/* RECENT ACTIVITIES SECTION */}
                
                
              </>
            )}

            {/* ==================== EDIT PAGE ==================== */}
            {sidebarPage === "edit" && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 40,
                  minHeight: 400,
                  boxShadow: "0 2px 12px rgba(112,19,108,0.06)",
                  border: "2px solid #e0c7e7",
                  maxWidth: 900,
                  margin: '0 auto',
                }}
              >
                <h2 style={{ color: "#70136C", fontWeight: 700, fontSize: "1.3rem", marginBottom: 24 }}>
                  แก้ไขข้อมูลการประกวด
                </h2>
                {/* ฟอร์ม mockup เหมือนในรูป (CreateCompetition) เป๊ะๆ ไม่เอาผู้ช่วยและกรรมการ */}
                <form style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {/* ชื่อการประกวด */}
                  <div>
                    <label style={{ fontWeight: 600, color: '#70136C', marginBottom: 6, display: 'block' }}>ชื่อการประกวด</label>
                    <input type="text" value="ประกวดเรื่องสั้นฉันทลักษณ์ ครั้งที่ 7 “ป้องโลกด้วยกอด กอดโลกด้วยกลอน”" readOnly style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0c7e7', fontSize: '1.08rem', background: '#f7f7fb', color: '#222', fontWeight: 500 }} />
                  </div>
                  {/* เลือกระดับการแข่งขัน (Card style) */}
                  <div>
                    <label style={{ fontWeight: 600, color: '#70136C', marginBottom: 8, display: 'block' }}>เลือกระดับการแข่งขัน</label>
                    <div style={{ display: 'flex', gap: 18 }}>
                      <div style={{ flex: 1, border: '2px solid #70136C', borderRadius: 14, padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, background: '#f6e7f5', minWidth: 0, boxShadow: '0 2px 8px rgba(112,19,108,0.15)' }}>
                        <span style={{ fontSize: 26, color: '#70136C' }}>🎒</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#70136C' }}>ประถม</span>
                      </div>
                      <div style={{ flex: 1, border: '2px solid #70136C', borderRadius: 14, padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, background: '#f6e7f5', minWidth: 0, boxShadow: '0 2px 8px rgba(112,19,108,0.15)' }}>
                        <span style={{ fontSize: 26, color: '#70136C' }}>🎓</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#70136C' }}>มัธยม</span>
                      </div>
                      <div style={{ flex: 1, border: '2px solid #e5e7eb', borderRadius: 14, padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, background: '#fff', minWidth: 0 }}>
                        <span style={{ fontSize: 26, color: '#222' }}>🏛️</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#222' }}>มหาวิทยาลัย</span>
                      </div>
                      <div style={{ flex: 1, border: '2px solid #e5e7eb', borderRadius: 14, padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, background: '#fff', minWidth: 0 }}>
                        <span style={{ fontSize: 26, color: '#222' }}>👥</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#222' }}>ประชาชนทั่วไป</span>
                      </div>
                    </div>
                  </div>
                  {/* อัปโหลดโปสเตอร์ประกวด */}
                  <div>
                    <label style={{ fontWeight: 600, color: '#70136C', marginBottom: 8, display: 'block' }}>อัปโหลดโปสเตอร์ประกวดได้เลย</label>
                    <div style={{ border: '2px dashed #cccccc', borderRadius: 12, padding: '40px 20px', textAlign: 'center', color: '#555', background: '#fafafa' }}>
                      <p style={{ marginBottom: 20, color: '#888' }}>เลือกไฟล์รูป jpg หรือ png</p>
                      <button style={{ padding: '10px 24px', borderRadius: 8, background: '#70136C', color: '#fff', border: 'none', cursor: 'pointer' }}>แก้ไขรูป poster</button>
                      <div style={{ marginTop: 20, fontSize: '0.95rem' }}>📄 hug.jpg</div>
                    </div>
                  </div>
                  {/* วันที่เปิดรับสมัคร / วันที่ปิดรับสมัคร */}
                  <div style={{ display: 'flex', gap: 18 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#70136C', marginBottom: 6, display: 'block' }}>วันที่เปิดรับสมัคร</label>
                      <input type="text" value="12/01/2025" readOnly style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0c7e7', fontSize: '1.08rem', background: '#f7f7fb', color: '#222', fontWeight: 500 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, color: '#70136C', marginBottom: 6, display: 'block' }}>วันที่ปิดรับสมัคร</label>
                      <input type="text" value="12/31/2025" readOnly style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0c7e7', fontSize: '1.08rem', background: '#f7f7fb', color: '#222', fontWeight: 500 }} />
                    </div>
                  </div>
                  {/* ระดับประถม: หัวข้อ/รายละเอียด/วัตถุประสงค์/กติกา/รางวัล */}
                  <div style={{ marginTop: 18 }}>
                    <div style={{ fontWeight: 700, color: '#70136C', fontSize: '1.18rem', marginBottom: 10 }}>ระดับประถม</div>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                      <button style={{ background: '#70136C', color: '#fff', borderRadius: 8, border: 'none', padding: '6px 18px', fontWeight: 500 }}>หัวข้ออิสระ</button>
                      <button style={{ background: '#f6e7f5', color: '#70136C', borderRadius: 8, border: 'none', padding: '6px 18px', fontWeight: 500 }}>หัวข้อบังคับ</button>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontWeight: 500, color: '#70136C', marginBottom: 6, display: 'block' }}>รายละเอียดการประกวด</label>
                      <textarea placeholder="กรอกรายละเอียด..." readOnly style={{ width: '100%', minHeight: 80, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0c7e7', fontSize: '1.08rem', background: '#f7f7fb', color: '#222' }} />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontWeight: 500, color: '#70136C', marginBottom: 6, display: 'block' }}>วัตถุประสงค์ของการจัดประกวด</label>
                      <textarea placeholder="กรอกวัตถุประสงค์..." readOnly style={{ width: '100%', minHeight: 80, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0c7e7', fontSize: '1.08rem', background: '#f7f7fb', color: '#222' }} />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontWeight: 500, color: '#70136C', marginBottom: 6, display: 'block' }}>เงื่อนไข/กติกาการส่งผลงาน</label>
                      <textarea placeholder="กรอกเงื่อนไขหรือกติกา..." readOnly style={{ width: '100%', minHeight: 80, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0c7e7', fontSize: '1.08rem', background: '#f7f7fb', color: '#222' }} />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontWeight: 500, color: '#70136C', marginBottom: 6, display: 'block' }}>รางวัล</label>
                      <input type="text" placeholder="- รางวัลที่ 1: ..." readOnly style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0c7e7', fontSize: '1.08rem', background: '#f7f7fb', color: '#222' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" readOnly /> <span>เพิ่มช่องกรอกรางวัล</span>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* ==================== MANAGE PAGE ==================== */}
            {sidebarPage === "manage" && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 40,
                  minHeight: 400,
                  boxShadow: "0 2px 12px rgba(112,19,108,0.06)",
                  border: "2px solid #e0c7e7",
                  maxWidth: 900,
                  margin: '0 auto',
                }}
              >
                <h2 style={{ color: "#70136C", fontWeight: 700, fontSize: "1.3rem", marginBottom: 18 }}>
                  จัดการกรรมการและผู้ช่วยจัดการประกวด
                </h2>
                <div style={{ background: '#f8e9ff', borderRadius: 10, padding: '16px 20px', color: '#70136C', marginBottom: 24, fontSize: '1.04rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22 }}>💡</span>
                  <span>คุณสามารถเชิญกรรมการผ่านอีเมลหรือสร้างบัญชีกรรมการใหม่ได้ หากต้องการให้มีผู้ช่วยจัดการประกวด คุณสามารถเพิ่มได้จากปุ่มด้านบน</span>
                </div>
                {/* เพิ่มผู้ช่วยจัดการประกวด */}
                <div style={{ background: '#faf6ff', borderRadius: 12, padding: '18px 20px', marginBottom: 28, border: '1.5px solid #e0c7e7' }}>
                  <div style={{ fontWeight: 600, color: '#70136C', marginBottom: 12 }}>เพิ่มผู้ช่วยจัดการประกวด</div>
                  <button style={{ border: '2px solid #70136C', color: '#70136C', background: '#fff', borderRadius: 8, padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer', marginBottom: 12 }}>+ เพิ่มผู้ช่วยจัดการประกวด</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                    <thead>
                      <tr style={{ background: '#f7e7fa', color: '#70136C' }}>
                        <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>ชื่อ</th>
                        <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>อีเมล</th>
                        <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>สิทธิ์</th>
                        <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>สถานะ</th>
                        <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>นางสาว B</td>
                        <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>b@email.com</td>
                        <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>กำหนดเอง</td>
                        <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7', color: '#f39c12', fontWeight: 500 }}><span style={{ fontSize: 16, marginRight: 4 }}>✉️</span>รอรับเชิญ</td>
                        <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>
                          <span style={{ color: '#70136C', cursor: 'pointer', marginRight: 16 }}>แก้ไข</span>
                          <span style={{ color: '#e74c3c', cursor: 'pointer' }}>ลบ</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* กรรมการ */}
                <div style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1.5px solid #e0c7e7' }}>
                  <div style={{ fontWeight: 600, color: '#70136C', marginBottom: 12 }}>กรรมการ</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                    <div style={{ fontWeight: 500, color: '#70136C' }}>คะแนนเต็มที่กรรมการสามารถให้ได้</div>
                    <input type="number" value="10" readOnly style={{ width: 80, padding: '7px 10px', borderRadius: 7, border: '1.5px solid #e0c7e7', fontSize: '1.05rem', background: '#f7f7fb', color: '#222', fontWeight: 500, marginRight: 8 }} />
                    <span style={{ color: '#888', fontSize: '0.98rem' }}>(กำหนดคะแนนเต็มสำหรับการตัดสิน)</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <button style={{ background: '#70136C', color: '#fff', borderRadius: 8, border: 'none', padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer' }}>+ เพิ่มกรรมการ</button>
                    <button style={{ background: '#fff', color: '#70136C', border: '2px solid #70136C', borderRadius: 8, padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer' }}>+ สร้างบัญชีกรรมการ</button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                    <thead>
                      <tr style={{ background: '#f7e7fa', color: '#70136C' }}>
                        <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>ชื่อ</th>
                        <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>อีเมล</th>
                        <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>เบอร์โทร</th>
                        <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>สถานะ</th>
                        <th style={{ padding: '10px 8px', border: 'none', fontWeight: 600 }}>การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>นาย A</td>
                        <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>a@email.com</td>
                        <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>-</td>
                        <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7', color: '#1abc9c', fontWeight: 500 }}><span style={{ fontSize: 16, marginRight: 4 }}>✔</span>ยืนยันแล้ว</td>
                        <td style={{ padding: '10px 8px', borderTop: '1.5px solid #e0c7e7' }}>
                          <span style={{ color: '#70136C', cursor: 'pointer', marginRight: 16 }}>แก้ไข</span>
                          <span style={{ color: '#e74c3c', cursor: 'pointer' }}>ลบ</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== EXPORT PAGE ==================== */}
            {sidebarPage === "export" && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 40,
                  minHeight: 400,
                  boxShadow: "0 2px 12px rgba(112,19,108,0.06)",
                  border: "2px solid #e0c7e7",
                  maxWidth: 900,
                  margin: '0 auto',
                }}
              >
                <h2 style={{ color: "#70136C", fontWeight: 700, fontSize: "1.3rem", marginBottom: 24 }}>
                  ส่งออกข้อมูล (Export Data)
                </h2>
                {/* 1. Applicants Data */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{ fontWeight: 600, color: '#6c5ce7', fontSize: '1.12rem', marginBottom: 8 }}>1) ข้อมูลผู้สมัคร (Applicants Data)</div>
                  <div style={{ color: '#444', marginBottom: 10, fontSize: '1.04rem' }}>
                    รายชื่อผู้สมัครทั้งหมด, ข้อมูลติดต่อ (อีเมล/เบอร์โทร/โรงเรียน/จังหวัด), ระดับการประกวด, วันที่สมัคร, สถานะการยืนยัน, หมายเลขผู้สมัคร (Applicant ID)<br/>
                    <span style={{ color: '#888' }}>เหมาะสำหรับกรรมการ/ผู้ดูแลเพื่อนำไปตรวจสอบหรือจัดเรียงข้อมูล</span>
                  </div>
                  <button style={{ background: '#70136C', color: '#fff', borderRadius: 8, border: 'none', padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer', marginRight: 10 }}>ดาวน์โหลด Excel</button>
                  <button style={{ background: '#fff', color: '#70136C', border: '2px solid #70136C', borderRadius: 8, padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer' }}>ดาวน์โหลด CSV</button>
                  <div style={{ marginTop: 10, color: '#888', fontSize: '0.98rem' }}>
                    ตัวอย่างคอลัมน์: Applicant ID, ชื่อ, อีเมล, เบอร์โทร, โรงเรียน, จังหวัด, ระดับ, วันที่สมัคร, สถานะยืนยัน
                  </div>
                </div>
                {/* 2. Submitted Works */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{ fontWeight: 600, color: '#6c5ce7', fontSize: '1.12rem', marginBottom: 8 }}>2) ข้อมูลผลงาน (Submitted Works)</div>
                  <div style={{ color: '#444', marginBottom: 10, fontSize: '1.04rem' }}>
                    ดาวน์โหลด ZIP ไฟล์ผลงานครบทุกชิ้น หรือ ZIP ตามระดับชั้น (เช่น Primary.zip, Secondary.zip)<br/>
                    <span style={{ color: '#888' }}>รวม Metadata: Title, ชื่อผู้ส่ง, วันที่ส่ง, สถานะผลงาน</span>
                  </div>
                  <button style={{ background: '#70136C', color: '#fff', borderRadius: 8, border: 'none', padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer', marginRight: 10 }}>ดาวน์โหลด ZIP ทั้งหมด</button>
                  <button style={{ background: '#fff', color: '#70136C', border: '2px solid #70136C', borderRadius: 8, padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer', marginRight: 10 }}>Primary.zip</button>
                  <button style={{ background: '#fff', color: '#70136C', border: '2px solid #70136C', borderRadius: 8, padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer' }}>Secondary.zip</button>
                  <div style={{ marginTop: 10, color: '#888', fontSize: '0.98rem' }}>
                    ตัวอย่างคอลัมน์ Metadata: ชื่อไฟล์, Title, ชื่อผู้ส่ง, วันที่ส่ง, สถานะผลงาน (ผ่าน/รอพิจารณา)
                  </div>
                </div>
                {/* 3. Judges Scoring Data */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{ fontWeight: 600, color: '#6c5ce7', fontSize: '1.12rem', marginBottom: 8 }}>3) คะแนนกรรมการ (Judges Scoring Data)</div>
                  <div style={{ color: '#444', marginBottom: 10, fontSize: '1.04rem' }}>
                    Export คะแนนกรรมการเป็น Excel: ชื่อกรรมการ, ชื่อผลงาน, คะแนนเต็ม/คะแนนที่ให้, หมวดคะแนน, ความคิดเห็น, คะแนนรวม, อันดับ
                    <br/><span style={{ color: '#888' }}>ใช้ประกาศผล + ตรวจสอบความโปร่งใส</span>
                  </div>
                  <button style={{ background: '#70136C', color: '#fff', borderRadius: 8, border: 'none', padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer' }}>ดาวน์โหลด Excel</button>
                  <div style={{ marginTop: 10, color: '#888', fontSize: '0.98rem' }}>
                    ตัวอย่างคอลัมน์: ชื่อกรรมการ, ชื่อผลงาน, คะแนนเต็ม, คะแนนที่ให้, หมวดคะแนน, ความคิดเห็น, คะแนนรวม, อันดับ
                  </div>
                </div>
                {/* 4. Summary Report */}
                <div>
                  <div style={{ fontWeight: 600, color: '#6c5ce7', fontSize: '1.12rem', marginBottom: 8 }}>4) รายงานสรุปผล (Summary Report)</div>
                  <div style={{ color: '#444', marginBottom: 10, fontSize: '1.04rem' }}>
                    ไฟล์สรุปแบบ Excel หรือ PDF: จำนวนผู้สมัคร, จำนวนผลงาน, จำนวนผลงานที่ครบถ้วน, ค่าเฉลี่ยคะแนน, ผลงานที่ได้คะแนนสูงสุด, กราฟสรุปคะแนน (optional)
                  </div>
                  <button style={{ background: '#70136C', color: '#fff', borderRadius: 8, border: 'none', padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer', marginRight: 10 }}>ดาวน์โหลด Excel</button>
                  <button style={{ background: '#fff', color: '#70136C', border: '2px solid #70136C', borderRadius: 8, padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer' }}>ดาวน์โหลด PDF</button>
                  <div style={{ marginTop: 10, color: '#888', fontSize: '0.98rem' }}>
                    ตัวอย่าง: จำนวนผู้สมัคร, ผลงานที่ได้คะแนนสูงสุด, ค่าเฉลี่ยคะแนน, กราฟ (ถ้ามี)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarNavContext.Provider>
  );
}
