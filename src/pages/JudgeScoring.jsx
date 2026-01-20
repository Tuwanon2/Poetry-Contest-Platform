import React, { useState } from "react";
import TopNav from "../components/TopNav";
import { useNavigate } from "react-router-dom";

// Mock data
const judgeInfo = {
  contestName: "กลอนรักชิงแชมป์ประเทศไทย 2025",
  deadline: "10 ม.ค. 2569",
  totalWorks: 42,
  checked: 12,
  remain: 30,
};

const workStats = [
  { status: "ยังไม่ตรวจ", color: "#6c5ce7", bg: "#f6e7f5", count: 18, btn: "เริ่มตรวจ", btnColor: "#6c5ce7" },
  { status: "ตรวจแล้ว", color: "#1abc9c", bg: "#e6faf7", count: 20, btn: "ดูผลคะแนน", btnColor: "#1abc9c" },
  { status: "รอแก้ไข", color: "#f39c12", bg: "#fff7e6", count: 4, btn: "ตรวจซ้ำ", btnColor: "#f39c12" },
];

const mockWorks = [
  {
    id: 1,
    topic: "หัวข้ออิสระ: แสงสุริยันผสานฟ้าพาใจฝัน",
    status: "ยังไม่ตรวจ",
    statusColor: "#e74c3c",
    poem: [
      "แสงสุริยันผสานฟ้าพาใจฝัน",
      "ลมเช้าพัดเบิกวันอันผ่องใส",
      "พฤกษ์พนาพรายพจน์งดงามไกล",
      "แต้มวิไลกลางหทัยให้ชื่นชม",
      "ยินเสียงนกพรมก้องประคองจิต",
      "เหมือนเตือนคิดตามวิถีที่เหมาะสม",
      "ทุกก้าวย่างสร้างหวังดังสายลม",
      "นำพากลมเกลียวชีวีให้ดีงาม",
      "แม้วันวานผ่านไปไม่หวนกลับ",
      "ยังประดับเรื่องราวที่งอกงาม",
      "ก่อพลังหวังใหม่ให้เติมตาม",
      "เพื่อก้าวข้ามพายุใจไม่ท้อเลย",
    ],
    level: "มัธยม",
    name: "-",
    title: "แสงสุริยันผสานฟ้าพาใจฝัน",
  },
  { id: 2, topic: "หัวข้อบังคับ: ป้องโลกด้วยกอด", status: "ตรวจแล้ว", statusColor: "#1abc9c", poem: "กอดกันไว้ให้แน่น\nเพื่อโลกจะได้ปลอดภัย\n..." },
  { id: 3, topic: "หัวข้ออิสระ: กลอนรักสิ่งแวดล้อม", status: "รอแก้ไข", statusColor: "#f39c12", poem: "รักสิ่งแวดล้อม\nคือรักโลกของเรา\n..." },
];


const JudgeScoring = () => {
  const [filterContest, setFilterContest] = useState("กลอนรักชิงแชมป์ประเทศไทย 2025");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  // Alert mockup
  const alertMsg = "❗ มีผลงานที่ยังไม่ตรวจอีก 18 ชิ้น | ⏰ Deadline เหลืออีก 2 วัน";

  const handleOpenWork = (work) => {
    navigate('/judge-work-detail', { state: { work } });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb' }}>
      <TopNav />
      {/* ALERTS */}
      <div style={{ background: '#fffbe6', color: '#e67e22', fontWeight: 600, fontSize: '1.08rem', padding: '12px 0', textAlign: 'center', borderBottom: '1.5px solid #ffe0b2' }}>
        {alertMsg}
      </div>
      <div style={{ maxWidth: 900, margin: '24px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(112,19,108,0.06)', padding: 32, border: '2px solid #e0c7e7' }}>
        {/* FILTER: เลือกการประกวด */}
        <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ fontWeight: 500, color: '#70136C', marginRight: 8 }}>เลือกการประกวด:</label>
          <select value={filterContest} onChange={e => setFilterContest(e.target.value)} style={{ padding: '7px 16px', borderRadius: 7, border: '1.5px solid #e0c7e7', fontSize: '1.08rem', minWidth: 220 }}>
            <option value="กลอนรักชิงแชมป์ประเทศไทย 2025">กลอนรักชิงแชมป์ประเทศไทย 2025</option>
            <option value="ประกวดกลอนเยาวชน 2025">ประกวดกลอนเยาวชน 2025</option>
            <option value="กลอนสร้างสรรค์สิ่งแวดล้อม">กลอนสร้างสรรค์สิ่งแวดล้อม</option>
          </select>
        </div>
        {/* HEADER SUMMARY */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#70136C', fontWeight: 700, fontSize: '1.35rem', marginBottom: 10 }}>{judgeInfo.contestName}</h2>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', fontSize: '1.08rem', marginBottom: 6 }}>
            <span style={{ color: '#6c5ce7', fontWeight: 600 }}><span role="img" aria-label="clock">⏰</span> Deadline: {judgeInfo.deadline}</span>
          </div>
        </div>
        {/* TO-DO CARDS */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 32, flexWrap: 'wrap' }}>
          {workStats.map((card, idx) => (
            <div key={idx} style={{ flex: 1, minWidth: 220, background: card.bg, borderRadius: 14, boxShadow: '0 2px 10px rgba(112,19,108,0.08)', border: `2px solid ${card.color}`, padding: '22px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.18s' }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(112,19,108,0.18)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(112,19,108,0.08)'}
            >
              <div style={{ fontWeight: 700, color: card.color, fontSize: '1.12rem', marginBottom: 8 }}>{card.status}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: card.color, marginBottom: 8 }}>{card.count}</div>
              <button style={{ background: card.btnColor, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer', marginTop: 8 }}>{card.btn}</button>
            </div>
          ))}
        </div>
        {/* FILTER SECTION */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontWeight: 500, color: '#70136C', marginRight: 8 }}>ระดับ:</label>
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ padding: '6px 14px', borderRadius: 7, border: '1.5px solid #e0c7e7', fontSize: '1.05rem' }}>
              <option value="">ทั้งหมด</option>
              <option value="ประถม">ประถม</option>
              <option value="มัธยม">มัธยม</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500, color: '#70136C', marginRight: 8 }}>สถานะ:</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '6px 14px', borderRadius: 7, border: '1.5px solid #e0c7e7', fontSize: '1.05rem' }}>
              <option value="">ทั้งหมด</option>
              <option value="ยังไม่ตรวจ">ยังไม่ตรวจ</option>
              <option value="ตรวจแล้ว">ตรวจแล้ว</option>
              <option value="รอแก้ไข">รอแก้ไข</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500, color: '#70136C', marginRight: 8 }}>เรียงตาม:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '6px 14px', borderRadius: 7, border: '1.5px solid #e0c7e7', fontSize: '1.05rem' }}>
              <option value="">วันที่ส่ง</option>
              <option value="หมายเลขสมัคร">หมายเลขสมัคร</option>
              <option value="คะแนน">คะแนน</option>
            </select>
          </div>
          <button style={{ background: '#fff', color: '#1abc9c', border: '2px solid #1abc9c', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer' }}>ดูคู่มือกรรมการ</button>
        </div>
        {/* WORK LIST SECTION: ยังไม่ตรวจ */}
        <div style={{ marginBottom: 10, fontWeight: 700, color: '#6c5ce7', fontSize: '1.13rem' }}>งานที่ยังไม่ตรวจ</div>
        <div style={{ borderBottom: '1px solid #e6e6e6', marginBottom: 18 }} />
        <div>
          {mockWorks
            .filter(w => w.status === 'ยังไม่ตรวจ')
            .map((work, idx) => (
              <div key={work.id} style={{ display: 'flex', alignItems: 'center', background: '#f7f7fb', borderRadius: 10, padding: '14px 18px', marginBottom: 12, boxShadow: '0 2px 8px rgba(112,19,108,0.04)', border: '1.5px solid #e0c7e7' }}>
                <div style={{ flex: 1, fontWeight: 600, color: '#222', fontSize: '1.08rem' }}>{idx + 1}</div>
                <div style={{ flex: 2, color: '#6c5ce7', fontWeight: 500 }}>{work.topic}</div>
                <div style={{ flex: 1, fontWeight: 600, color: work.statusColor, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>❗</span> ยังไม่ตรวจ
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <button style={{ background: '#6c5ce7', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleOpenWork(work)}>ตรวจ</button>
                </div>
              </div>
            ))}
        </div>
        {/* WORK LIST SECTION: ตรวจเสร็จแล้ว */}
        <div style={{ margin: '32px 0 10px 0', fontWeight: 700, color: '#1abc9c', fontSize: '1.13rem' }}>งานที่ตรวจเสร็จแล้ว</div>
        <div style={{ borderBottom: '1px solid #e6e6e6', marginBottom: 18 }} />
        <div>
          {mockWorks
            .filter(w => w.status === 'ตรวจแล้ว')
            .map((work, idx) => (
              <div key={work.id} style={{ display: 'flex', alignItems: 'center', background: '#e6faf7', borderRadius: 10, padding: '14px 18px', marginBottom: 12, boxShadow: '0 2px 8px rgba(112,19,108,0.04)', border: '1.5px solid #1abc9c' }}>
                <div style={{ flex: 1, fontWeight: 600, color: '#222', fontSize: '1.08rem' }}>{idx + 1}</div>
                <div style={{ flex: 2, color: '#6c5ce7', fontWeight: 500 }}>{work.topic}</div>
                <div style={{ flex: 1, fontWeight: 600, color: work.statusColor, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>✔</span> ตรวจแล้ว
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <button style={{ background: '#1abc9c', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 500, cursor: 'pointer' }}>ดูคะแนน</button>
                </div>
              </div>
            ))}
        </div>

       
      </div>
    </div>
  );
};

export default JudgeScoring;
