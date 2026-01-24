import React, { useEffect } from 'react';

const ContestFilters = ({ 
  filterStatus, setFilterStatus, 
  filterTopic, setFilterTopic, 
  filterPoetry, setFilterPoetry, 
  onReset
  // ลบ prop resultCount ออกแล้ว
}) => {

  // 1. บังคับให้เป็น "เปิดรับสมัคร" ทันทีที่โหลดหน้าเว็บ
  useEffect(() => {
    setFilterStatus('open');
    // eslint-disable-next-line
  }, []);

  // 2. ฟังก์ชันสำหรับปุ่ม Reset
  const handleResetClick = () => {
    if (onReset) onReset(); 
    setFilterStatus('open'); 
  };

  const selectStyle = {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    color: '#5a0f56',
    fontWeight: '500',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    minWidth: '140px'
  };

  const poetryOptions = [
    { label: "กลอนแปด", value: "กลอนแปด" },
    { label: "กาพย์ยานี 11", value: "กาพย์ยานี 11" },
    { label: "กาพย์ฉบัง 16", value: "กาพย์ฉบัง 16" },
    { label: "โคลงสี่สุภาพ", value: "โคลงสี่สุภาพ" },
    { label: "สักวา", value: "สักวา" },
    { label: "อินทรวิเชียรฉันท์", value: "อินทรวิเชียรฉันท์" },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      flexWrap: 'wrap', 
      justifyContent: 'flex-end', // จัดทุกอย่างชิดขวา
      marginBottom: '20px', 
      alignItems: 'flex-end' 
    }}>
      
      {/* --- ลบส่วนแสดงจำนวนรายการออกแล้ว --- */}

      {/* 1. ตัวกรองสถานะ */}
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px', paddingLeft: '4px' }}>สถานะ</div>
        <select 
          style={selectStyle} 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">ทั้งหมด</option>
          <option value="open">เปิดรับสมัคร</option>
          <option value="finished">ปิดรับสมัคร</option>
        </select>
      </div>

      {/* 2. ตัวกรองรูปแบบหัวข้อ */}
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px', paddingLeft: '4px' }}>รูปแบบหัวข้อ</div>
        <select 
          style={selectStyle} 
          value={filterTopic} 
          onChange={(e) => setFilterTopic(e.target.value)}
        >
          <option value="all">ทั้งหมด</option>
          <option value="หัวข้ออิสระ">หัวข้ออิสระ</option>
          <option value="หัวข้อบังคับ">หัวข้อบังคับ</option>
        </select>
      </div>

      {/* 3. ตัวกรองประเภทกลอน */}
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px', paddingLeft: '4px' }}>ประเภทกลอน</div>
        <select 
          style={selectStyle} 
          value={filterPoetry} 
          onChange={(e) => setFilterPoetry(e.target.value)}
        >
          <option value="all">ทั้งหมด</option>
          {poetryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* ปุ่มรีเซ็ต */}
      <button 
        onClick={handleResetClick} 
        style={{ 
          padding: '6px 16px', 
          borderRadius: '20px', 
          border: '1px solid #ddd', 
          background: '#fff', 
          color: '#666', 
          cursor: 'pointer', 
          height: '35px', 
          fontSize: '13px', 
          fontWeight: 600 
        }}
      >
        ล้างค่า
      </button>
    </div>
  );
};

export default ContestFilters;