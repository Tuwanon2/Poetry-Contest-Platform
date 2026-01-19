import React, { useState } from 'react';
import SidebarHome from '../components/SidebarHome';
import TopNav from '../components/TopNav';

/* 🔹 ข้อมูลการแข่งขัน (ข้อมูลเดิม) */
const competitions = [
  {
    id: 1,
    name: 'ป้องโลกด้วยกอด กอดโลกด้วยกลอน ครั้งที่ 7',
    status: 'finished',
    image: '/images/contest7.jpg',
    description: 'การประกวดบทร้อยกรองเพื่อสร้างจิตสำนึกด้านสิ่งแวดล้อม ผ่านพลังของภาษาไทย',
    organizer: 'คณะศิลปศาสตร์',
    date: '1 ม.ค. – 30 มี.ค. 2567',
    location: 'ออนไลน์',
    qualification: 'นักเรียนมัธยมศึกษาตอนต้น (ม.1-3)',
    type: 'ประเภทเดี่ยว'
  },
  {
    id: 2,
    name: 'กลอนรักเยาวชน ครั้งที่ 3',
    status: 'open', // สมมติว่าเปิดอยู่เพื่อให้เห็นปุ่มเขียว
    image: '/images/contest3.jpg',
    description: 'เวทีแสดงพลังความคิดสร้างสรรค์ของเยาวชนด้านบทกลอน',
    organizer: 'สำนักวัฒนธรรม',
    date: '10 ก.พ. – 20 เม.ย. 2567',
    location: 'ออนไลน์',
    qualification: 'นักเรียนมัธยมศึกษาตอนปลาย (ม.4-6)',
    type: 'ประเภททีม 3 คน'
  },
  {
    id: 3,
    name: 'ประกวดแต่งกลอนสด หัวข้อ "โลกยุคใหม่"',
    status: 'open',
    image: '', // ไม่มีรูป
    description: 'ประชันไหวพริบปฏิภาณกวี',
    organizer: 'ชมรมวรรณศิลป์',
    date: 'วันนี้ – 15 พ.ย. 2568',
    location: 'หอประชุมใหญ่',
    qualification: 'นักเรียนมัธยมศึกษาทุกระดับชั้น',
    type: 'ประเภทเดี่ยว'
  }
];

/* 🔹 ข้อมูลผู้ชนะ */
const winners = [
  {
    rank: 1,
    name: 'จิรพัฒน์ รักภาษา',
    school: 'โรงเรียนศิลปะวิทยา',
    prize: 'รางวัลชนะเลิศ',
    image: '/images/winner1.jpg'
  },
  {
    rank: 2,
    name: 'ปิยพงษ์ มั่นคง',
    school: 'มหาวิทยาลัยนวมินทร์',
    prize: 'รองชนะเลิศอันดับ 1',
    image: '/images/winner2.jpg'
  },
  {
    rank: 3,
    name: 'รัตนาพร สอนใจ',
    school: 'ประชาชนทั่วไป',
    prize: 'รองชนะเลิศอันดับ 2',
    image: '/images/winner3.jpg'
  }
];

const CompetitionResults = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  const selectedContest = competitions.find(c => c.id === selectedCompetition);

  const getStatusBadge = (status) => {
    if (status === 'finished') {
        return { text: 'ประกาศผลแล้ว', bg: '#6c757d' }; 
    }
    // สีเขียวแบบในรูป
    return { text: 'เปิดรับสมัคร', bg: '#198754' };
  };

  return (
    <>
      {/* ✅ 1. Import Font "Kanit" เพื่อให้เหมือนในรูป */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');
          
          body, button, input, div {
            font-family: 'Kanit', sans-serif !important;
          }
        `}
      </style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#FFFFFF' }}>
        <SidebarHome open={sidebarOpen} setOpen={setSidebarOpen} />

        <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 0, transition: '0.3s' }}>
          <TopNav />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

            {!selectedContest ? (
              <>
                {/* หัวข้อสีม่วงเข้ม เหมือนในรูป */}
                <h2 style={{ 
                  textAlign: 'center', 
                  color: '#4b005e', // สีม่วงเข้ม
                  fontSize: '32px', 
                  fontWeight: '700', 
                  marginBottom: '50px' 
                }}>
                  กิจกรรมสำหรับมัธยมศึกษา
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '30px',
                }}>
                  {competitions.map(c => {
                     const badge = getStatusBadge(c.status);
                     return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCompetition(c.id)}
                        style={{
                          background: '#fff',
                          borderRadius: '12px', // มุมมนพอประมาณ
                          overflow: 'hidden',
                          boxShadow: '0 5px 20px rgba(0,0,0,0.05)', // เงาฟุ้งๆ บางๆ
                          cursor: 'pointer',
                          border: '1px solid #f0f0f0',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
                        }}
                      >
                        {/* ส่วนรูปภาพ */}
                        <div style={{ position: 'relative', height: '220px', backgroundColor: '#e9ecef' }}>
                          {c.image ? (
                            <img 
                              src={c.image} 
                              alt={c.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%', 
                                color: '#999',
                                fontSize: '18px',
                                flexDirection: 'column'
                            }}>
                                <span>ไม่มีรูปภาพ</span>
                            </div>
                          )}
                          
                          {/* Badge ปุ่มเขียวมุมขวา */}
                          <div style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: badge.bg,
                            color: 'white',
                            padding: '6px 18px',
                            borderRadius: '30px', // มนแบบแคปซูล
                            fontSize: '14px',
                            fontWeight: '500',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                          }}>
                            {badge.text}
                          </div>
                        </div>

                        {/* ส่วนเนื้อหา */}
                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          {/* ชื่อรายการ (ตัวหนา) */}
                          <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: '700', // หนาชัดเจน
                            color: '#000', 
                            marginBottom: '20px',
                            lineHeight: '1.4',
                            minHeight: '50px' // จัดระเบียบความสูง
                          }}>
                            {c.name}
                          </h3>

                          {/* รายละเอียด (Label ตัวหนา, ข้อมูลปกติ) */}
                          <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.8' }}>
                            
                            <div style={{ marginBottom: '6px' }}>
                              <span style={{ fontWeight: '700', marginRight: '6px' }}>ประเภท:</span>
                              <span>{c.type || 'ทั่วไป'}</span>
                            </div>
                            
                            <div style={{ marginBottom: '6px' }}>
                              <span style={{ fontWeight: '700', marginRight: '6px' }}>คุณสมบัติ:</span>
                              <span>{c.qualification || 'นักเรียน/นักศึกษา'}</span>
                            </div>
                            
                            <div>
                              <span style={{ fontWeight: '700', marginRight: '6px' }}>ระยะเวลา:</span>
                              {/* สีชมพูอมม่วงตามรูป */}
                              <span style={{ color: '#a01b68', fontWeight: '600' }}>{c.date}</span> 
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* ส่วนหน้ารายละเอียด (คงเดิม) */
              <>
                <button 
                  onClick={() => setSelectedCompetition(null)}
                  style={{ marginBottom: 20, padding: '8px 20px', cursor: 'pointer', border: 'none', background: '#eee', borderRadius: 30, fontWeight: 500 }}
                >
                  ← ย้อนกลับ
                </button>

                <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                   <img src={selectedContest.image} alt={selectedContest.name} 
                        style={{ width: '100%', maxWidth: 400, borderRadius: 16, objectFit: 'cover' }} />
                   
                   <div style={{ flex: 1 }}>
                      <h1 style={{ color: '#4b005e', marginTop: 0, fontWeight: 700 }}>{selectedContest.name}</h1>
                      <p style={{ fontSize: '18px', color: '#555', lineHeight: 1.6 }}>{selectedContest.description}</p>
                      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
                      <p><b>ผู้จัด:</b> {selectedContest.organizer}</p>
                      <p><b>ระยะเวลา:</b> {selectedContest.date}</p>
                      <p><b>สถานที่:</b> {selectedContest.location}</p>
                   </div>
                </div>

                <div style={{ marginTop: 60, textAlign: 'center' }}>
                  <h2 style={{ color: '#4b005e', fontSize: '28px', fontWeight: 700 }}>ประกาศผลผู้ชนะ</h2>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'flex-end', 
                    gap: '20px', 
                    marginTop: '40px',
                    flexWrap: 'wrap' 
                  }}>
                    <WinnerCard winner={winners[1]} height={260} />
                    <WinnerCard winner={winners[0]} main height={300} />
                    <WinnerCard winner={winners[2]} height={240} />
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

/* Component การ์ดผู้ชนะ */
const WinnerCard = ({ winner, main, height }) => (
  <div style={{
    width: 250,
    height: height || 250,
    background: '#FFF',
    borderRadius: '20px 20px 0 0',
    padding: '20px',
    textAlign: 'center',
    boxShadow: main 
      ? '0 -10px 30px rgba(75, 0, 94, 0.15)' 
      : '0 -4px 15px rgba(0,0,0,0.05)',
    border: main ? '2px solid #FFD700' : '1px solid #eee',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <div style={{ 
        width: main ? 100 : 80, 
        height: main ? 100 : 80, 
        borderRadius: '50%', 
        overflow: 'hidden',
        marginBottom: 15,
        border: '3px solid #fff',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
        <img src={winner.image} alt={winner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <h3 style={{ margin: '0 0 5px 0', fontSize: main ? '18px' : '16px', fontWeight: 600 }}>{winner.name}</h3>
    <span style={{ color: '#4b005e', fontWeight: '700', fontSize: '14px' }}>{winner.prize}</span>
    <span style={{ color: '#888', fontSize: '13px', marginTop: 5 }}>{winner.school}</span>
    
    <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '10px',
        background: main ? '#FFD700' : (winner.rank === 2 ? '#C0C0C0' : '#CD7F32')
    }} />
  </div>
);

export default CompetitionResults;