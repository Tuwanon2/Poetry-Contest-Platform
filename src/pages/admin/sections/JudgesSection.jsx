import React from "react";
import Icon from "../../../components/Icon";

export default function JudgesSection() {
  const judges = [
    { id: 1, name: "ดร. สมศักดิ์", expertise: "เทคโนโลยี AI", contests: 2 },
    { id: 2, name: "อ. วรรณา", expertise: "ศิลปะและการออกแบบ", contests: 5 },
  ];

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 className="section-header">จัดการกรรมการ (Judges)</h2>
        <button className="btn-primary">+ เพิ่มกรรมการ</button>
      </div>
      <div className="grid-2">
        {judges.map(j => (
          <div key={j.id} className="card" style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <Icon name="person" size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 5px 0" }}>{j.name}</h4>
              <div style={{ fontSize: 13, color: "#666" }}>ความเชี่ยวชาญ: {j.expertise}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}