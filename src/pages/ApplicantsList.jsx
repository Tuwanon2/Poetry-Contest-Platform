import React from 'react';

export default function ApplicantsList() {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#009688', margin: 0 }}>ผู้สมัครเข้าประกวด</h2>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: '#f4f5f7', color: '#222' }}>
              <th style={thStyle}>ชื่อผู้สมัคร</th>
              <th style={thStyle}>ระดับที่สมัคร</th>
              <th style={thStyle}>ชื่อกลอน</th>
              <th style={thStyle}>สถานะไฟล์ยืนยัน</th>
              <th style={thStyle}>วันที่สมัคร</th>
              <th style={thStyle}>ดูรายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {/* Mock data */}
            <tr>
              <td style={tdStyle}>สมชาย ใจดี</td>
              <td style={tdStyle}>มัธยม</td>
              <td style={tdStyle}>กลอนรักโลก</td>
              <td style={tdStyle}><span style={{ color: '#00b8a9', fontWeight: 600 }}>✔</span></td>
              <td style={tdStyle}>2025-12-03</td>
              <td style={tdStyle}><button style={actionBtn}>ดูรายละเอียด</button></td>
            </tr>
            <tr>
              <td style={tdStyle}>สายใจ ดีงาม</td>
              <td style={tdStyle}>ประถม</td>
              <td style={tdStyle}>กลอนสิ่งแวดล้อม</td>
              <td style={tdStyle}><span style={{ color: '#ff9800', fontWeight: 600 }}>รออัปโหลด</span></td>
              <td style={tdStyle}>2025-12-02</td>
              <td style={tdStyle}><button style={actionBtn}>ดูรายละเอียด</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = { padding: '12px 8px', fontWeight: 600, borderBottom: '1.5px solid #e0e0e0', textAlign: 'left' };
const tdStyle = { padding: '10px 8px', borderBottom: '1px solid #f4f5f7', color: '#222' };
const actionBtn = { background: '#e6fffb', color: '#009688', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, cursor: 'pointer', fontSize: 14 };
