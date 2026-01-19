import React, { useState } from 'react';
import SidebarHome from '../components/SidebarHome';
import TopNav from '../components/TopNav';

/* ข้อมูลจำลอง */
const universityActivities = [
  {
    id: 1,
    title: 'การประกวดสุนทรพจน์และกวีนิพนธ์ "เสียงคนรุ่นใหม่"',
    type: 'ประเภทเดี่ยว',
    qualification: 'นิสิตนักศึกษาระดับปริญญาตรี',
    dateRange: 'วันนี้ - 31 ต.ค. 2568',
    image: '/assets/images/story.jpg', 
    status: 'open',
    description: 'เวทีสำหรับคนรุ่นใหม่ที่ต้องการปล่อยของ ผ่านบทกลอนที่สะท้อนสังคม',
    organizer: 'คณะมนุษยศาสตร์',
    location: 'ส่งผลงานออนไลน์',
    topicType: 'หัวข้ออิสระ',
    poetryType: 'กลอนแปด' 
  },
  {
    id: 2,
    title: 'โครงการประกวดบทกวีนิพนธ์ อุดมศึกษาครั้งที่ 3',
    type: 'ประเภททีม 3 คน',
    qualification: 'นิสิตนักศึกษาทุกชั้นปี',
    dateRange: '15 ส.ค. - 15 ต.ค. 2568',
    image: '/assets/images/poetry.jpg',
    status: 'open',
    description: 'สืบสานภาษาไทยผ่านบทกวีอันทรงคุณค่าในรูปแบบโคลงสี่สุภาพ',
    organizer: 'ศูนย์ศิลปวัฒนธรรม',
    location: 'หอศิลป์มหาวิทยาลัย',
    topicType: 'หัวข้อบังคับ',
    poetryType: 'โคลงสี่สุภาพ'
  },
  {
    id: 3,
    title: 'การแข่งขันแต่งคำประพันธ์บูชาครู',
    type: 'ประเภทเดี่ยว',
    qualification: 'นิสิตนักศึกษา และประชาชนทั่วไป',
    dateRange: 'วันนี้ - 30 พ.ย. 2568',
    image: null, 
    status: 'finished',
    description: 'ประชันความสามารถด้านฉันทลักษณ์ไทย',
    organizer: 'ภาควิชาภาษาไทย',
    location: 'ออนไลน์',
    topicType: 'หัวข้อบังคับ',
    poetryType: 'อินทรวิเชียรฉันท์'
  },
  {
    id: 4,
    title: 'ลานกวี: ธรรมชาติรังสรรค์',
    type: 'ประเภทคู่',
    qualification: 'นิสิตนักศึกษา',
    dateRange: '1 ก.ย. - 30 ก.ย. 2568',
    image: null,
    status: 'open',
    description: 'พรรณนาความงามของธรรมชาติผ่านกาพย์ยานี',
    organizer: 'ชมรมอนุรักษ์ธรรมชาติ',
    location: 'สวนพฤกษศาสตร์',
    topicType: 'หัวข้ออิสระ',
    poetryType: 'กาพย์ยานี 11'
  }
];

/* ข้อมูลผู้ชนะจำลอง */
const winners = [
  { rank: 1, name: 'นายวรภพ จบครบ', school: 'ม.จุฬาลงกรณ์', prize: 'รางวัลชนะเลิศ', image: '/images/winner_uni1.jpg' },
  { rank: 2, name: 'น.ส.ใจดี มีสุข', school: 'ม.ธรรมศาสตร์', prize: 'รองชนะเลิศอันดับ 1', image: '/images/winner_uni2.jpg' },
  { rank: 3, name: 'นายขยัน หมั่นเพียร', school: 'ม.เชียงใหม่', prize: 'รองชนะเลิศอันดับ 2', image: '/images/winner_uni3.jpg' }
];

const UniversityCompetitions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  // State สำหรับ Filter
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterPoetry, setFilterPoetry] = useState('all');

  const selectedContest = universityActivities.find(c => c.id === selectedCompetition);

  const getStatusBadge = (status) => {
    if (status === 'finished') return { text: 'ประกาศผลแล้ว', bg: '#6c757d' };
    return { text: 'เปิดรับสมัคร', bg: '#198754' };
  };

  const filteredActivities = universityActivities.filter(c => {
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchTopic = filterTopic === 'all' || c.topicType === filterTopic;
    const matchPoetry = filterPoetry === 'all' || c.poetryType === filterPoetry;
    return matchStatus && matchTopic && matchPoetry;
  });

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');
          body, button, input, div, select, h1, h2, h3, p { font-family: 'Kanit', sans-serif !important; }
          
          /* ปรับ CSS ให้เล็กลง */
          .custom-select {
            padding: 6px 14px; /* ลด Padding */
            border-radius: 20px;
            border: 1px solid #ddd;
            color: #5a0f56;
            font-weight: 500;
            font-size: 14px; /* ลดขนาดตัวอักษร */
            outline: none;
            cursor: pointer;
            background-color: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            min-width: 140px; /* ลดความกว้าง */
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
                <h2 style={{ 
                  textAlign: 'center', 
                  color: '#5a0f56', 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  marginBottom: '30px' 
                }}>
                  การประกวดระดับนักศึกษา
                </h2>

                {/* ✅ Filter Bar ปรับปรุงใหม่ */}
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  flexWrap: 'wrap', 
                  justifyContent: 'flex-end', /* ย้ายไปขวา */
                  marginBottom: '20px',
                  padding: '10px 0', /* เอาพื้นหลังออก หรือลดขนาด */
                  alignItems: 'flex-end'
                }}>
                  {/* แสดงจำนวนผลลัพธ์ทางซ้าย (Optional: ถ้าต้องการให้ดูสมดุล) */}
                  <div style={{ marginRight: 'auto', fontSize: '14px', color: '#888', alignSelf: 'center' }}>
                     ผลการค้นหา {filteredActivities.length} รายการ
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px', paddingLeft: '4px' }}>สถานะ</div>
                    <select className="custom-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="all">ทั้งหมด</option>
                      <option value="open">เปิดรับสมัคร</option>
                      <option value="finished">ประกาศผลแล้ว</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px', paddingLeft: '4px' }}>รูปแบบหัวข้อ</div>
                    <select className="custom-select" value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}>
                      <option value="all">ทั้งหมด</option>
                      <option value="หัวข้ออิสระ">หัวข้ออิสระ</option>
                      <option value="หัวข้อบังคับ">หัวข้อบังคับ</option>
                    </select>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px', paddingLeft: '4px' }}>ประเภทคำประพันธ์</div>
                    <select className="custom-select" value={filterPoetry} onChange={(e) => setFilterPoetry(e.target.value)}>
                      <option value="all">ทั้งหมด</option>
                      <option value="กลอนแปด">กลอนแปด</option>
                      <option value="กาพย์ยานี 11">กาพย์ยานี 11</option>
                      <option value="กาพย์ฉบัง 16">กาพย์ฉบัง 16</option>
                      <option value="โคลงสี่สุภาพ">โคลงสี่สุภาพ</option>
                      <option value="สักวา">สักวา</option>
                      <option value="ดอกสร้อย">ดอกสร้อย</option>
                      <option value="อินทรวิเชียรฉันท์">อินทรวิเชียรฉันท์</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => { setFilterStatus('all'); setFilterTopic('all'); setFilterPoetry('all'); }}
                    style={{ 
                        padding: '6px 16px', 
                        borderRadius: '20px', 
                        border: '1px solid #ddd', 
                        background: '#fff', 
                        color: '#666', 
                        cursor: 'pointer', 
                        height: '35px', /* ความสูงเท่า input โดยประมาณ */
                        fontSize: '13px',
                        fontWeight: 600 
                    }}
                  >
                    ล้างค่า
                  </button>
                </div>

                {/* Grid Layout */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '30px',
                }}>
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map(activity => {
                       const badge = getStatusBadge(activity.status);
                       return (
                        <div
                          key={activity.id}
                          onClick={() => setSelectedCompetition(activity.id)}
                          style={{
                            background: '#fff',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            border: '1px solid #f1f1f1',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(90, 15, 86, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                          }}
                        >
                          <div style={{ position: 'relative', height: '220px', backgroundColor: '#e9ecef' }}>
                            {activity.image ? (
                              <img src={activity.image} alt={activity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', flexDirection: 'column' }}>
                                <span>ไม่มีรูปภาพ</span>
                              </div>
                            )}
                            <div style={{ position: 'absolute', top: '15px', right: '15px', background: badge.bg, color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                              {badge.text}
                            </div>
                          </div>

                          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#000', marginBottom: '16px', minHeight: '54px', lineHeight: '1.4' }}>
                              {activity.title}
                            </h3>
                            <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.8' }}>
                              <div style={{ display: 'flex', marginBottom: '4px' }}>
                                <span style={{ fontWeight: '600', minWidth: '85px', color: '#5a0f56' }}>ประเภท:</span>
                                <span>{activity.poetryType}</span>
                              </div>
                              <div style={{ display: 'flex', marginBottom: '4px' }}>
                                <span style={{ fontWeight: '600', minWidth: '85px', color: '#5a0f56' }}>คุณสมบัติ:</span>
                                <span>{activity.qualification}</span>
                              </div>
                              <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px dashed #ddd' }} />
                              <div style={{ display: 'flex' }}>
                                <span style={{ fontWeight: '600', minWidth: '85px' }}>ระยะเวลา:</span>
                                <span style={{ color: '#a01b68', fontWeight: '700' }}>{activity.dateRange}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                       );
                    })
                  ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#999', background: '#f9f9f9', borderRadius: '16px' }}>
                       ไม่พบรายการที่ค้นหา
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* หน้า Detail View เหมือนเดิม */
              <>
                <button 
                  onClick={() => setSelectedCompetition(null)}
                  style={{ marginBottom: 20, padding: '10px 24px', cursor: 'pointer', border: 'none', background: '#f1f1f1', borderRadius: 30, fontWeight: 600, color: '#555' }}
                >
                  ← กลับหน้ารวม
                </button>

                <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                   <div style={{ width: '100%', maxWidth: 400, borderRadius: 20, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                      {selectedContest.image ? (
                        <img src={selectedContest.image} alt={selectedContest.title} style={{ width: '100%', display: 'block' }} />
                      ) : (
                        <div style={{ height: 300, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ไม่มีรูปภาพ</div>
                      )}
                   </div>
                   
                   <div style={{ flex: 1 }}>
                      <h1 style={{ color: '#5a0f56', marginTop: 0, fontWeight: 700, fontSize: '2rem' }}>{selectedContest.title}</h1>
                      
                      <div style={{ display: 'flex', gap: 10, margin: '15px 0 25px' }}>
                        <span style={{ background: '#f3e5f5', color: '#5a0f56', padding: '6px 14px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>{selectedContest.topicType}</span>
                        <span style={{ background: '#f3e5f5', color: '#5a0f56', padding: '6px 14px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>{selectedContest.poetryType}</span>
                      </div>

                      <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.6 }}>{selectedContest.description}</p>
                      
                      <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #eee', marginTop: '20px' }}>
                        <p style={{ margin: '8px 0' }}><b>ผู้จัด:</b> {selectedContest.organizer}</p>
                        <p style={{ margin: '8px 0' }}><b>คุณสมบัติ:</b> {selectedContest.qualification}</p>
                        <p style={{ margin: '8px 0' }}><b>ระยะเวลา:</b> <span style={{ color: '#a01b68', fontWeight: 'bold' }}>{selectedContest.dateRange}</span></p>
                        <p style={{ margin: '8px 0' }}><b>สถานที่:</b> {selectedContest.location}</p>
                      </div>
                   </div>
                </div>

                <div style={{ marginTop: 80, textAlign: 'center' }}>
                  <h2 style={{ color: '#5a0f56', fontSize: '2rem', fontWeight: 700 }}>ทำเนียบผู้ชนะ</h2>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', marginTop: '40px', flexWrap: 'wrap' }}>
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

const WinnerCard = ({ winner, main, height }) => (
  <div style={{
    width: 250, height: height || 250, background: '#FFF', borderRadius: '20px 20px 0 0',
    padding: '20px', textAlign: 'center',
    boxShadow: main ? '0 -10px 30px rgba(90, 15, 86, 0.15)' : '0 -4px 15px rgba(0,0,0,0.05)',
    border: main ? '2px solid #FFD700' : '1px solid #eee',
    position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
  }}>
    <div style={{ width: main ? 100 : 80, height: main ? 100 : 80, borderRadius: '50%', overflow: 'hidden', marginBottom: 15, border: '3px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <img src={winner.image} alt={winner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <h3 style={{ margin: '0 0 5px 0', fontSize: main ? '18px' : '16px', fontWeight: 600 }}>{winner.name}</h3>
    <span style={{ color: '#5a0f56', fontWeight: '700', fontSize: '14px' }}>{winner.prize}</span>
    <span style={{ color: '#888', fontSize: '13px', marginTop: 5 }}>{winner.school}</span>
    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '10px', background: main ? '#FFD700' : (winner.rank === 2 ? '#C0C0C0' : '#CD7F32') }} />
  </div>
);

export default UniversityCompetitions;