
import React, { useState } from "react";
import TopNav2 from "../components/TopNav2";
import { useNavigate, useLocation } from "react-router-dom";

const paperStyle = {
  background: "#fff",
  border: "1.5px solid #e0c7e7",
  borderRadius: 18,
  boxShadow: "0 4px 24px 0 rgba(112,19,108,0.10)",
  padding: "36px 40px 40px 40px",
  maxWidth: 900,
  margin: "36px auto 40px auto",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const JudgeWorkDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // รับข้อมูล mock จาก state (จริงควร fetch ตาม id)
  const work = location.state?.work || {
    topic: "หัวข้ออิสระ: แสงสุริยันผสานฟ้าพาใจฝัน",
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
  };
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");

  // poemLines เป็น array 12 วรรค (หรือมากกว่า)
  const poemLines = Array.isArray(work.poem) ? work.poem : work.poem.split(/\r?\n/).filter(Boolean);

  // แบ่งกลอนเป็น 2 คอลัมน์แนวตั้ง (เลขคี่ซ้าย เลขคู่ขวา)
  const leftCol = [];
  const rightCol = [];
  for (let i = 0; i < poemLines.length; i += 2) {
    leftCol.push(poemLines[i] || "");
    rightCol.push(poemLines[i + 1] || "");
  }

  const handleSubmitScore = () => {
    alert(`ให้คะแนน ${score} และคอมเมนต์: ${comment}`);
    navigate(-1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb' }}>
      <TopNav2 />
      <div style={paperStyle}>
       
        <div style={{ marginBottom: 18, color: '#70136C', fontWeight: 600, fontSize: '1.13rem' }}>{work.topic || work.title}</div>
        <div style={{ marginBottom: 18, color: '#555', fontSize: '1.08rem' }}>
          
          
        </div>
        {/* กรอบกลอน 2 คอลัมน์ */}
        <div
          style={{
            border: '2px solid #e0c7e7',
            borderRadius: 8,
            padding: 24,
            background: '#fcf7fd',
            marginTop: 8,
            marginBottom: 24,
            maxWidth: 900,
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0 16px',
              justifyItems: 'stretch',
              alignItems: 'center',
              minHeight: 240,
            }}
          >
            {/* ซ้าย: เลขคี่, ขวา: เลขคู่ */}
            {leftCol.map((left, i) => (
              <React.Fragment key={i}>
                {/* ซ้าย */}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{
                    flex: 1,
                    width: '100%',
                    minWidth: '120px',
                    borderBottom: '1.5px solid #e0c7e7',
                    minHeight: 32,
                    fontSize: '1.05rem',
                    textAlign: 'left',
                    padding: '8px 6px',
                    marginBottom: 0,
                    color: left ? '#70136C' : '#bbb',
                    letterSpacing: 0.01,
                    background: 'transparent',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                  }}>{left}</div>
                </div>
                {/* ขวา */}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{
                    flex: 1,
                    width: '100%',
                    minWidth: '120px',
                    borderBottom: '1.5px solid #e0c7e7',
                    minHeight: 32,
                    fontSize: '1.05rem',
                    textAlign: 'left',
                    padding: '8px 6px',
                    marginBottom: 0,
                    color: rightCol[i] ? '#70136C' : '#bbb',
                    letterSpacing: 0.01,
                    background: 'transparent',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                  }}>{rightCol[i]}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* ฟอร์มให้คะแนน/คอมเมนต์ */}
        <div style={{ width: '100%', maxWidth: 500, margin: '0 auto 0 auto' }}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 500, color: '#70136C', marginBottom: 6, display: 'block' }}>คะแนนที่ให้ (เต็ม 10)</label>
            <input
              type="number"
              min={0}
              max={10}
              value={score}
              onChange={e => setScore(e.target.value)}
              style={{ width: 80, padding: '7px 10px', borderRadius: 7, border: '1.5px solid #e0c7e7', fontSize: '1.05rem', background: '#f7f7fb', color: '#222', fontWeight: 500, marginRight: 8 }}
            />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontWeight: 500, color: '#70136C', marginBottom: 6, display: 'block' }}>คอมเมนต์สำหรับผลงานนี้</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{ width: '100%', minHeight: 60, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0c7e7', fontSize: '1.05rem', background: '#f7f7fb', color: '#222' }}
              placeholder="แสดงความคิดเห็น..."
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              style={{ background: '#1abc9c', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer' }}
              onClick={handleSubmitScore}
            >
              ยืนยันคะแนน
            </button>
            <button
              style={{ background: '#fff', color: '#70136C', border: '2px solid #70136C', borderRadius: 8, padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer' }}
              onClick={() => navigate(-1)}
            >
              ย้อนกลับ
            </button>
            <button
              style={{ background: '#6c5ce7', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer' }}
              onClick={() => {
                // mock ข้อมูลผลงานถัดไป
                const nextWork = {
                  topic: "หัวข้ออิสระ: กลอนรักสิ่งแวดล้อม",
                  poem: [
                    "รักสิ่งแวดล้อมคือรักโลกของเรา",
                    "ปลูกต้นไม้ให้ร่มเงาแก่ชีวิต",
                    "น้ำใสไหลเย็นเป็นมิตร",
                    "อากาศดีทุกวันด้วยใจเรา",
                    "ร่วมมือกันสร้างสรรค์สิ่งดี",
                    "รักษ์โลกนี้ให้สดใสเสมอ",
                    "ลดขยะพลาสติกไม่ละเลย",
                    "เพื่อโลกสวยงามตลอดไป",
                    "ปลูกจิตสำนึกให้เด็กไทย",
                    "อนุรักษ์ไว้ให้รุ่นต่อไป",
                    "ร่วมใจรักษ์สิ่งแวดล้อม",
                    "เพื่อโลกนี้สดใสตลอดกาล",
                  ],
                  level: "มัธยม",
                  name: "-",
                  title: "กลอนรักสิ่งแวดล้อม",
                };
                navigate('/judge-work-detail', { state: { work: nextWork } });
              }}
            >
              ไปผลงานถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeWorkDetail;
