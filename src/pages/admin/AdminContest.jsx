import React, { useState } from "react";

export default function AdminContest() {
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
    <div className="main-content fade-in">
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
                <td>{contest.name}</td>

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
