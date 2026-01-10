import React, { useState } from 'react';
import SidebarHome from '../components/SidebarHome';
import TopNav from '../components/TopNav';

/* 🔹 ข้อมูลการแข่งขัน */
const competitions = [
  {
    id: 1,
    name: 'ป้องโลกด้วยกอด กอดโลกด้วยกลอน ครั้งที่ 7',
    status: 'finished',
    image: '/images/contest7.jpg',
    description: 'การประกวดบทร้อยกรองเพื่อสร้างจิตสำนึกด้านสิ่งแวดล้อม ผ่านพลังของภาษาไทย',
    organizer: 'คณะศิลปศาสตร์',
    date: '1 ม.ค. – 30 มี.ค. 2567',
    location: 'ออนไลน์'
  },
  {
    id: 2,
    name: 'กลอนรักเยาวชน ครั้งที่ 3',
    status: 'finished',
    image: '/images/contest3.jpg',
    description: 'เวทีแสดงพลังความคิดสร้างสรรค์ของเยาวชนด้านบทกลอน',
    organizer: 'สำนักวัฒนธรรม',
    date: '10 ก.พ. – 20 เม.ย. 2567',
    location: 'ออนไลน์'
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
  const [activeCategory, setActiveCategory] = useState('นักเรียน');
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  const selectedContest = competitions.find(c => c.id === selectedCompetition);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
      <SidebarHome open={sidebarOpen} setOpen={setSidebarOpen} />

      <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 0 }}>
        <TopNav />

        <div style={{ maxWidth: 1100, margin: '30px auto', padding: '0 24px' }}>

          {/* 🔽 เลือกการแข่งขัน */}
          <h3>เลือกการแข่งขันที่ต้องการดูผล</h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
            gap: 20,
            marginBottom: 40
          }}>
            {competitions.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCompetition(c.id)}
                style={{
                  cursor: 'pointer',
                  background: '#FFF',
                  borderRadius: 18,
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,.08)'
                }}
              >
                <img src={c.image} alt={c.name}
                  style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <div style={{ padding: 16 }}>
                  <h4>{c.name}</h4>
                  <p style={{ fontSize: 13, color: '#666' }}>การแข่งขันสิ้นสุดแล้ว</p>
                </div>
              </div>
            ))}
          </div>

          {!selectedContest && (
            <div style={{
              textAlign: 'center',
              padding: 60,
              background: '#FFF',
              borderRadius: 20,
              border: '1px dashed #DDD'
            }}>
              กรุณาเลือกการแข่งขันเพื่อดูผล
            </div>
          )}

          {selectedContest && (
            <>
              {/* รายละเอียดการแข่งขัน */}
              <img src={selectedContest.image}
                alt={selectedContest.name}
                style={{
                  width: '100%',
                  height: 360,
                  objectFit: 'cover',
                  borderRadius: 24,
                  marginBottom: 30
                }} />

              <div style={{ background: '#FFF', padding: 30, borderRadius: 20 }}>
                <h1 style={{ color: '#70136C' }}>{selectedContest.name}</h1>
                <p>{selectedContest.description}</p>
                <p><b>ผู้จัด:</b> {selectedContest.organizer}</p>
                <p><b>ระยะเวลา:</b> {selectedContest.date}</p>
                <p><b>สถานที่:</b> {selectedContest.location}</p>
              </div>

              {/* 📢 ประกาศผู้ชนะ */}
              <div style={{
                marginTop: 50,
                marginBottom: 30,
                textAlign: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#70136C'
              }}>
                ประกาศผลผู้ชนะการแข่งขัน
              </div>

              {/* Podium */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gap: 24
              }}>
                <WinnerCard winner={winners[1]} />
                <WinnerCard winner={winners[0]} main />
                <WinnerCard winner={winners[2]} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* 🔹 การ์ดผู้ชนะ */
const WinnerCard = ({ winner, main }) => (
  <div style={{
    background: '#FFF',
    borderRadius: 20,
    padding: 20,
    textAlign: 'center',
    boxShadow: main
      ? '0 15px 35px rgba(112,19,108,.2)'
      : '0 4px 15px rgba(0,0,0,.08)',
    border: main ? '3px solid #FFD700' : 'none'
  }}>
    <img
      src={winner.image}
      alt={winner.name}
      style={{
        width: 90,
        height: 90,
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: 10
      }}
    />
    <h3>{winner.name}</h3>
    <div style={{ color: '#70136C', fontWeight: 600 }}>{winner.prize}</div>
    <div style={{ fontSize: 13, color: '#777' }}>{winner.school}</div>
  </div>
);

export default CompetitionResults;
