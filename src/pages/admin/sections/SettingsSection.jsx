import React, { useState } from "react";

export default function SettingsSection() {
  const [settings, setSettings] = useState({
    siteName: "Poem Competition Platform",
    siteDescription: "ระบบบริหารจัดการการประกวดบทร้อยกรองออนไลน์",
    contactEmail: "admin@example.com",

    allowRegister: true,
    allowSubmission: true,
    requireEmailVerification: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    console.log("SAVE SETTINGS:", settings);
    alert("บันทึกการตั้งค่าเรียบร้อย");
    // TODO: call API เช่น POST /api/admin/settings
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>⚙️ การตั้งค่าระบบ</h2>

      {/* ===== ตั้งค่าทั่วไป ===== */}
      <section style={sectionStyle}>
        <h3 style={sectionTitle}>ตั้งค่าทั่วไป</h3>

        <label style={labelStyle}>ชื่อเว็บไซต์</label>
        <input
          type="text"
          name="siteName"
          value={settings.siteName}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>คำอธิบายระบบ</label>
        <textarea
          name="siteDescription"
          value={settings.siteDescription}
          onChange={handleChange}
          rows={3}
          style={textareaStyle}
        />

        <label style={labelStyle}>อีเมลติดต่อผู้ดูแล</label>
        <input
          type="email"
          name="contactEmail"
          value={settings.contactEmail}
          onChange={handleChange}
          style={inputStyle}
        />
      </section>

      {/* ===== ตั้งค่าการใช้งานระบบ ===== */}
      <section style={sectionStyle}>
        <h3 style={sectionTitle}>การใช้งานระบบ</h3>

        <Toggle
          label="เปิดให้สมัครสมาชิก"
          name="allowRegister"
          checked={settings.allowRegister}
          onChange={handleChange}
        />

        <Toggle
          label="เปิดให้ส่งผลงานประกวด"
          name="allowSubmission"
          checked={settings.allowSubmission}
          onChange={handleChange}
        />

        <Toggle
          label="บังคับยืนยันอีเมลก่อนใช้งาน"
          name="requireEmailVerification"
          checked={settings.requireEmailVerification}
          onChange={handleChange}
        />
      </section>

      <div style={{ textAlign: "right", marginTop: 24 }}>
        <button style={saveButtonStyle} onClick={handleSave}>
          💾 บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
}

/* ===== Toggle Component ===== */
function Toggle({ label, name, checked, onChange }) {
  return (
    <label style={toggleRow}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        style={{ marginRight: 10 }}
      />
      {label}
    </label>
  );
}

/* ===== Styles ===== */
const containerStyle = {
  background: "#fff",
  padding: 32,
  borderRadius: 16,
  maxWidth: 800,
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

const titleStyle = {
  fontSize: "1.9rem",
  marginBottom: 24,
};

const sectionStyle = {
  marginBottom: 28,
};

const sectionTitle = {
  fontSize: "1.3rem",
  marginBottom: 16,
  color: "#70136C",
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  marginBottom: 16,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
};

const toggleRow = {
  display: "flex",
  alignItems: "center",
  marginBottom: 12,
  fontSize: "1.05rem",
};

const saveButtonStyle = {
  background: "#70136C",
  color: "#fff",
  border: "none",
  padding: "10px 28px",
  borderRadius: 999,
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
};
