import React from 'react';

export default function ContestList() {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#009688', margin: 0 }}>รายการประกวดทั้งหมด</h2>
        <button style={{ background: '#00b8a9', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,184,169,0.08)' }}>
          + สร้างการประกวดใหม่
        </button>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: '#f4f5f7', color: '#222' }}>
              <th style={thStyle}>ชื่อประกวด</th>
              <th style={thStyle}>ระดับที่เปิดรับ</th>
              <th style={thStyle}>วันที่เปิด</th>
              <th style={thStyle}>วันที่ปิด</th>
              <th style={thStyle}>จำนวนผู้สมัคร</th>
              <th style={thStyle}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {/* Mock data */}
            <tr>
              <td style={tdStyle}>กลอนสิ่งแวดล้อม</td>
              <td style={tdStyle}>ประถม, มัธยม</td>
              <td style={tdStyle}>2025-12-01</td>
              <td style={tdStyle}>2025-12-31</td>
              <td style={tdStyle}>120</td>
              <td style={tdStyle}>
                <button style={actionBtn}>แก้ไข</button>
                <button style={actionBtn}>ปิดรับ</button>
                <button style={actionBtn}>ดูผู้สมัคร</button>
              </td>
            </tr>
            <tr>
              <td style={tdStyle}>กลอนรักชาติ</td>
              <td style={tdStyle}>มัธยม</td>
              <td style={tdStyle}>2025-11-01</td>
              <td style={tdStyle}>2025-11-30</td>
              <td style={tdStyle}>80</td>
              <td style={tdStyle}>
                <button style={actionBtn}>แก้ไข</button>
                <button style={actionBtn}>ปิดรับ</button>
                <button style={actionBtn}>ดูผู้สมัคร</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = { padding: '12px 8px', fontWeight: 600, borderBottom: '1.5px solid #e0e0e0', textAlign: 'left' };
const tdStyle = { padding: '10px 8px', borderBottom: '1px solid #f4f5f7', color: '#222' };
const actionBtn = { background: '#e6fffb', color: '#009688', border: 'none', borderRadius: 6, padding: '6px 14px', marginRight: 6, fontWeight: 500, cursor: 'pointer', fontSize: 14 };
