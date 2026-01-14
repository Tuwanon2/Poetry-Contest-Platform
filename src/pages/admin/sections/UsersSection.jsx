import React, { useState } from "react";

export default function UsersSection() {
  const [users, setUsers] = useState([
    { id: 101, name: "Somchai Jaidee", email: "somchai@email.com", joined: "2024-01-15", status: "Active" },
    { id: 102, name: "Alice Wonderland", email: "alice@email.com", joined: "2024-02-10", status: "Banned" },
  ]);

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Banned" : "Active" } : u));
  };

  return (
    <div className="fade-in">
      <h2 className="section-header">ผู้ส่งเข้าประกวด (Contestants)</h2>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>ชื่อ-สกุล</th><th>อีเมล</th><th>สถานะ</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: u.status === "Active" ? "#e8f8f5" : "#fbe9e7", color: u.status === "Active" ? "#27ae60" : "#c0392b" }}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <button className="btn-text" style={{ color: u.status === "Active" ? "#c0392b" : "#27ae60" }} onClick={() => toggleStatus(u.id)}>
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