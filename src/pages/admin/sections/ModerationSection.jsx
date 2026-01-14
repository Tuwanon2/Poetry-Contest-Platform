import React, { useState } from "react";
import Icon from "../../../components/Icon";

export default function ModerationSection() {
  const [reports, setReports] = useState([
    { id: 1, content: "ฝากร้านหน่อยค่ะ สนใจแอดไลน์...", reporter: "user_05", reason: "Spam/โฆษณา" },
  ]);

  const handleAction = (id) => setReports(reports.filter(r => r.id !== id));

  return (
    <div className="fade-in">
      <h2 className="section-header">ตรวจสอบเนื้อหา</h2>
      {reports.length === 0 ? <div className="card" style={{ textAlign: "center", padding: 40 }}>ไม่มีรายการรอตรวจสอบ</div> : 
        reports.map(r => (
          <div key={r.id} className="card" style={{ marginBottom: 15, borderLeft: "4px solid #f39c12" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold", color: "#f39c12" }}>รายงาน: {r.reason}</span>
            </div>
            <div style={{ background: "#f9f9f9", padding: 10, borderRadius: 5, margin: "10px 0" }}>"{r.content}"</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ background: "#27ae60" }} onClick={() => handleAction(r.id)}> <Icon name="check" size={14}/> Keep</button>
              <button className="btn-primary" style={{ background: "#c0392b" }} onClick={() => handleAction(r.id)}> <Icon name="trash" size={14}/> Delete</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}