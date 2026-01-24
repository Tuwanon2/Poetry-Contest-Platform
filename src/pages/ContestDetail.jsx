import React, { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../App.css';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const ContestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests/${id}`);
        setContest(response.data);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching contest:', err);
        setError('ไม่สามารถโหลดข้อมูลการประกวดได้');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContest();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTimeRemaining = (endDate) => {
    if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
    
    const now = new Date();
    const end = new Date(endDate);
    
    if (isNaN(end.getTime())) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
    
    const diff = end - now;
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false,
    };
  };

  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (contest && (contest.end_date || contest.EndDate)) {
      const endDate = contest.end_date || contest.EndDate;
      const initialTime = calculateTimeRemaining(endDate);
      setTimeRemaining(initialTime);
      
      const interval = setInterval(() => {
        const newTime = calculateTimeRemaining(endDate);
        setTimeRemaining(newTime);
        if (newTime.isExpired) clearInterval(interval);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [contest]);

  if (loading) {
    return (
      <>
        <TopNav />
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <p style={{ color: '#00796b', fontSize: '1.2rem' }}>กำลังโหลดข้อมูล...</p>
        </div>
      </>
    );
  }

  if (error || !contest) {
    return (
      <>
        <TopNav />
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <p style={{ color: '#d32f2f', fontSize: '1.2rem' }}>{error || 'ไม่พบข้อมูลการประกวด'}</p>
        </div>
      </>
    );
  }

  const levels = contest.levels || [];
  // สร้างรายการระดับชั้นสำหรับการแสดงผล
  const levelList = levels.map(l => l.level_name || l.name || '').filter(Boolean);

  let posterUrl = null;
  if (contest.poster_url || contest.PosterURL) {
    const posterPath = contest.poster_url || contest.PosterURL;
    if (posterPath.startsWith('http')) {
      posterUrl = posterPath;
    } else {
      posterUrl = `http://localhost:8080${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
    }
  }

  return (
    <>
      <TopNav />
      {/* Container หลัก จัด Layout เหมือนเว็บทั่วไป */}
      <div style={{ width: '100vw', maxWidth: '100vw', background: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
        
        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', padding: '20px', boxSizing: 'border-box' }}>
          
          {/* --- Main Content (Left Side) --- */}
          <div style={{ flex: 3, background: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            
            {/* Header: Title */}
            <h1 style={{ color: "#00796b", fontWeight: 500, fontSize: 28, marginBottom: 15, marginTop: 0 }}>
              {contest.title || contest.Title}
            </h1>

            {/* Deadline Text */}
            <div style={{ fontSize: 16, color: '#333', marginBottom: 20 }}>
               {timeRemaining.isExpired ? (
                  <span style={{ color: '#d32f2f' }}>ปิดรับผลงานแล้ว (สิ้นสุดเมื่อ {formatDate(contest.end_date || contest.EndDate)})</span>
               ) : (
                  <span>เปิดรับผลงานถึงวันที่ {formatDate(contest.end_date || contest.EndDate)}</span>
               )}
            </div>

            {/* Countdown Timer Bar (ตามรูปที่ 1) */}
            {!timeRemaining.isExpired && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                borderTop: '1px solid #eee', 
                borderBottom: '1px solid #eee', 
                padding: '15px 0', 
                marginBottom: '30px' 
              }}>
                {[
                  { val: timeRemaining.days, label: 'วัน' },
                  { val: timeRemaining.hours, label: 'ชั่วโมง' },
                  { val: timeRemaining.minutes, label: 'นาที' },
                  { val: timeRemaining.seconds, label: 'วินาที' }
                ].map((item, idx) => (
                  <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ color: '#e65100', fontSize: '24px', fontWeight: 'bold' }}>
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Poster Section (ตามรูปที่ 1) */}
            <div style={{ width: '100%', minHeight: '300px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', borderRadius: '4px' }}>
              {posterUrl ? (
                <img 
                  src={posterUrl} 
                  alt="Poster" 
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex'; // Show fallback text
                  }}
                />
              ) : null}
              {/* Fallback Text (แสดงเมื่อไม่มีรูป หรือรูปเสีย) */}
              <div style={{ display: posterUrl ? 'none' : 'flex', color: '#9e9e9e', fontSize: '18px' }}>
                ไม่พบรูปโปสเตอร์
              </div>
            </div>

            {/* เนื้อหา: รายละเอียด */}
            {(contest.description || contest.Description) && (
              <section style={{ marginBottom: 30 }}>
                <h2 style={{ color: "#00796b", fontSize: 18, borderBottom: '1px solid #eee', paddingBottom: 10 }}>รายละเอียด</h2>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: '#333', whiteSpace: 'pre-wrap' }}>
                  {contest.description || contest.Description}
                </div>
              </section>
            )}

            {/* เนื้อหา: กติกาการประกวด */}
            {levels.some(l => l.rules) && (
              <section style={{ marginBottom: 30 }}>
                <h2 style={{ color: "#00796b", fontSize: 18, borderBottom: '1px solid #eee', paddingBottom: 10 }}>กติกาการประกวด</h2>
                {levels.map((level, idx) => (
                  level.rules && (
                    <div key={idx} style={{ marginBottom: 15 }}>
                      {levels.length > 1 && <h4 style={{ margin: '10px 0', color: '#004d40' }}>{level.level_name || level.name}</h4>}
                      <div style={{ fontSize: 15, lineHeight: 1.6, color: '#333', whiteSpace: 'pre-wrap' }}>{level.rules}</div>
                    </div>
                  )
                ))}
              </section>
            )}

            {/* เนื้อหา: รางวัล */}
            {levels.some(l => l.prizes) && (
              <section style={{ marginBottom: 30 }}>
                <h2 style={{ color: "#00796b", fontSize: 18, borderBottom: '1px solid #eee', paddingBottom: 10 }}>รางวัล</h2>
                {levels.map((level, idx) => {
                  if (!level.prizes) return null;
                  const prizes = typeof level.prizes === 'string' ? JSON.parse(level.prizes) : level.prizes;
                  return (
                    <div key={idx} style={{ marginBottom: 15 }}>
                      {levels.length > 1 && <h4 style={{ margin: '10px 0', color: '#004d40' }}>{level.level_name || level.name}</h4>}
                      <ul style={{ paddingLeft: 20 }}>
                        {Array.isArray(prizes) ? (
                          prizes.map((p, i) => <li key={i} style={{ marginBottom: 5 }}>{p}</li>)
                        ) : (
                          <li>{JSON.stringify(prizes)}</li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </section>
            )}

          </div>

          {/* --- Sidebar (Right Side - ตามรูปที่ 2) --- */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
              
              {/* คุณสมบัติผู้สมัคร */}
              <h3 style={{ fontSize: 18, color: '#333', marginTop: 0, marginBottom: 15 }}>คุณสมบัติผู้สมัคร</h3>
              <ul style={{ paddingLeft: 20, color: '#00796b', fontWeight: 500, margin: 0 }}>
                {levelList.length > 0 ? (
                  levelList.map((name, index) => (
                    <li key={index} style={{ marginBottom: 8 }}>{name}</li>
                  ))
                ) : (
                  <li>ไม่จำกัดคุณสมบัติ</li>
                )}
              </ul>

            </div>
          </div>

        </div>
      </div>

      {/* --- Sticky Footer Button --- */}
      <div 
        style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '15px 0',
            background: 'linear-gradient(to top, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none', // Click-through background area
            zIndex: 1000
        }}
      >
        <button
            disabled={timeRemaining.isExpired}
            style={{
                pointerEvents: 'auto',
                padding: '12px 50px',
                background: timeRemaining.isExpired ? '#9e9e9e' : 'linear-gradient(45deg, #70136C, #8e24aa)',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: timeRemaining.isExpired ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => !timeRemaining.isExpired && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => !timeRemaining.isExpired && (e.currentTarget.style.transform = 'scale(1)')}
            onClick={async () => {
              if (timeRemaining.isExpired) return;
              
              const user = localStorage.getItem('user') || sessionStorage.getItem('user');
              if (!user) {
                alert('กรุณาเข้าสู่ระบบก่อนสมัครเข้าประกวด');
                navigate('/login');
                return;
              }
              
              const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
              if (userId) {
                try {
                  const response = await axios.get(`${API_BASE_URL}/submissions/user/${userId}`);
                  const submissions = response.data || [];
                  const existing = submissions.find(sub => sub.competition_id === parseInt(id));
                  
                  if (existing) {
                    if (window.confirm('คุณส่งผลงานแล้ว ต้องการดูสถานะหรือไม่?')) {
                      navigate('/my-works');
                    }
                    return;
                  }
                } catch (err) { /* ignore */ }
              }
              
              navigate(`/submit-competition/${id}`);
            }}
        >
            {timeRemaining.isExpired ? 'ปิดรับสมัครแล้ว' : 'สมัครเข้าประกวดนี้'}
        </button>
      </div>
    </>
  );
};

export default ContestDetail;