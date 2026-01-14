import React, { useState, useEffect } from "react";
// ตรวจสอบ path ของ Icon ให้ถูกต้องตามโครงสร้างโปรเจกต์ของคุณ
// ถ้า Icon อยู่ไฟล์เดียวกับ AdminDashboard ให้แก้เป็น path ที่ถูก หรือ copy Component Icon มาใส่ในไฟล์นี้ก็ได้
import Icon from "./Icon"; 

export default function AddMemberModal({ isOpen, onClose, onSave }) {
  const [data, setData] = useState({ email: "", role: "ผู้จัดการประกวด", password: "" });

  // รีเซ็ตค่าเมื่อเปิด Modal ใหม่
  useEffect(() => {
    if (isOpen) {
      setData({ email: "", role: "ผู้จัดการประกวด", password: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        // ⭐ เพิ่ม style ตรงนี้เพื่อให้พื้นหลังเป็นสีขาว และจัด layout ให้สวยงาม
        style={{ 
            backgroundColor: "white", 
            padding: "20px", 
            borderRadius: "10px", 
            width: "100%", 
            maxWidth: "500px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}
      >
        
        <div className="modal-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
                <h3 style={{ margin: 0 }}>เพิ่มทีมงาน / สร้าง User ใหม่</h3>
                {/* ปุ่มปิด (X) */}
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: "#888" }}>
                    {/* ถ้าไม่มี icon 'x' ให้ใช้ตัวอักษร X แทนชั่วคราว หรือต้องไปเพิ่ม path ใน Component Icon */}
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}></span>
                </button>
            </div>
        </div>
        
        <div className="modal-body">
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
                <select className="form-select" value={data.role} onChange={e => setData({...data, role: e.target.value})}>
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
                        style={{ background: "#8e44ad", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "5px" }} 
                        onClick={generatePassword}
                    >
                        เจนรหัส
                    </button>
                </div>
            </div>
        </div>

        <div className="modal-actions" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="btn-cancel" onClick={onClose}>ยกเลิก</button>
          <button className="btn-save" onClick={handleSaveClick}>สร้าง User</button>
        </div>
      </div>
    </div>
  );
}