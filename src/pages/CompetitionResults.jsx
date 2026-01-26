import React, { useState } from 'react';
// เอา import SidebarHome ออกแล้ว
import TopNav from '../components/TopNav'; 

/* 🔹 Competition Data */
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

/* 🔹 Winner Data */
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
  // ลบ state sidebarOpen ออก
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  const selectedContest = competitions.find(c => c.id === selectedCompetition);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
      {/* ลบ <SidebarHome /> ออกแล้ว */}

      <div style={{ 
        flex: 1, 
        marginLeft: 0, // ปรับเป็น 0 เพราะไม่มี Sidebar
        transition: '0.3s' 
      }}>
        <TopNav />

        <div style={{ maxWidth: 1100, margin: '30px auto', padding: '0 24px' }}>

          {/* 🔽 Select Competition */}
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
                  boxShadow: '0 4px 15px rgba(0,0,0,.08)',
                  border: selectedCompetition === c.id ? '2px solid #70136C' : 'none'
                }}
              >
                <img src={c.image} alt={c.name}
                  style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <div style={{ padding: 16 }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>{c.name}</h4>
                  <p style={{ fontSize: 13, color: '#666', margin: 0 }}>การแข่งขันสิ้นสุดแล้ว</p>
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
              กรุณาเลือกการแข่งขันด้านบนเพื่อดูผลรางวัล
            </div>
          )}

          {selectedContest && (
            <>
              {/* Competition Details */}
              <div style={{ background: '#FFF', padding: 30, borderRadius: 20, marginBottom: 40 }}>
                <h1 style={{ color: '#70136C', marginTop: 0 }}>{selectedContest.name}</h1>
                <p>{selectedContest.description}</p>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 20, color: '#555' }}>
                    <span><b>ผู้จัด:</b> {selectedContest.organizer}</span>
                    <span><b>ระยะเวลา:</b> {selectedContest.date}</span>
                    <span><b>สถานที่:</b> {selectedContest.location}</span>
                </div>
              </div>

              {/* 📢 Winners Announcement */}
              <div style={{
                marginBottom: 30,
                textAlign: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#70136C'
              }}>
                🏆 ประกาศผลผู้ชนะการแข่งขัน
              </div>

              {/* Podium */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: 24,
                flexWrap: 'wrap'
              }}>
                {/* 2nd Place */}
                <div style={{ order: 1 }}>
                     <WinnerCard winner={winners[1]} />
                </div>
                {/* 1st Place */}
                <div style={{ order: 2, marginBottom: 40 }}>
                     <WinnerCard winner={winners[0]} main />
                </div>
                {/* 3rd Place */}
                <div style={{ order: 3 }}>
                     <WinnerCard winner={winners[2]} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* 🔹 Winner Card Component */
const WinnerCard = ({ winner, main }) => (
  <div style={{
    background: '#FFF',
    borderRadius: 20,
    padding: 20,
    textAlign: 'center',
    width: main ? 280 : 240,
    boxShadow: main
      ? '0 15px 35px rgba(112,19,108,.2)'
      : '0 4px 15px rgba(0,0,0,.08)',
    border: main ? '3px solid #FFD700' : '1px solid #EEE',
    position: 'relative',
    top: main ? -20 : 0
  }}>
    <img
      src={winner.image}
      alt={winner.name}
      style={{
        width: main ? 120 : 90,
        height: main ? 120 : 90,
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: 15,
        border: '4px solid #F9FAFB'
      }}
    />
    <h3 style={{ margin: '0 0 5px 0', fontSize: main ? '1.2rem' : '1rem' }}>{winner.name}</h3>
    <div style={{ color: '#70136C', fontWeight: 700, marginBottom: 5 }}>{winner.prize}</div>
    <div style={{ fontSize: 13, color: '#777' }}>{winner.school}</div>
  </div>
);

export default CompetitionResults;