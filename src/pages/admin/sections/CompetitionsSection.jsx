import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompetitionsSection() {
  const navigate = useNavigate();

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

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleStatus = (id) => {
    setContests(
      contests.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "open" ? "closed" : "open" }
          : c
      )
    );
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="fade-in">
      <div className="section-header">จัดการการประกวด</div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>ชื่อการประกวด</th>
              <th>สถานะ</th>
              <th>หมวดหมู่</th>
              <th>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {contests.map((contest) => (
              <tr
                key={contest.id}
                style={{
                  background: selectedIds.includes(contest.id)
                    ? "#f0f9ff"
                    : "transparent",
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(contest.id)}
                    onChange={() => toggleSelect(contest.id)}
                  />
                </td>

                {/* ✅ คลิกแล้วไป CompetitionsOverview */}
                <td
                  style={{
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: "#1d4ed8",
                  }}
                  onClick={() => navigate("/competitions-overview")}
                >
                  {contest.name}
                </td>

                <td>
                  <span
                    className="badge-gray"
                    style={{
                      background:
                        contest.status === "open"
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        contest.status === "open"
                          ? "#166534"
                          : "#991b1b",
                    }}
                  >
                    {contest.status === "open"
                      ? "เปิดรับสมัคร"
                      : "ปิดรับสมัคร"}
                  </span>
                </td>

                <td>{contest.category}</td>

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

        {selectedIds.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 14 }}>
            เลือกแล้ว {selectedIds.length} รายการ
          </div>
        )}
      </div>
    </div>
  );
}
