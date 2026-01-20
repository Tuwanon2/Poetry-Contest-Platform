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

  // ✅ เพิ่มส่วนนี้: ประกาศ state isMobile และตรวจสอบขนาดหน้าจอ
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // ✅ จบส่วนที่เพิ่ม

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests/${id}`);
        console.log('🔍 Contest Detail API Response:', response.data);
        console.log('📋 Available keys:', Object.keys(response.data));
        console.log('📅 Start date field:', response.data.start_date, response.data.StartDate);
        console.log('📅 End date field:', response.data.end_date, response.data.EndDate);
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
    if (!endDate) {
      console.log('⚠️ No endDate provided');
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
    }
    
    const now = new Date();
    // แปลง endDate ให้เป็น Date object
    let end = new Date(endDate);
    
    // ตรวจสอบว่า Date object ถูกต้องหรือไม่
    if (isNaN(end.getTime())) {
      console.error('❌ Invalid date:', endDate);
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
    }
    
    console.log('⏰ Calculating time:', { now: now.toISOString(), end: end.toISOString() });
    
    const diff = end - now;
    
    if (diff <= 0) {
      console.log('⏰ Contest expired');
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    
    const result = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false,
    };
    
    console.log('⏰ Time remaining:', result);
    return result;
  };

  const getContestStatus = () => {
    if (!contest) return 'loading';
    const now = new Date();
    const startDate = new Date(contest.start_date || contest.StartDate);
    const endDate = new Date(contest.end_date || contest.EndDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'closed';
    return 'open';
  };

  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (contest && (contest.end_date || contest.EndDate)) {
      const endDate = contest.end_date || contest.EndDate;
      
      console.log('📅 Contest data:', {
        title: contest.title || contest.Title,
        start_date: contest.start_date || contest.StartDate,
        end_date: endDate,
        full_contest: contest
      });
      
      // คำนวณทันที
      const initialTime = calculateTimeRemaining(endDate);
      setTimeRemaining(initialTime);
      
      // ตั้ง interval เพื่ออัพเดตทุกวินาที
      const interval = setInterval(() => {
        const newTime = calculateTimeRemaining(endDate);
        setTimeRemaining(newTime);
        
        // ถ้าหมดเวลาแล้ว ให้หยุด interval
        if (newTime.isExpired) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      console.warn('⚠️ No contest or end_date available');
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
  const levelNames = levels.map(l => l.level_name || l.name || '').filter(Boolean).join(', ') || 'ทุกระดับ';
  
  // จัดการ poster URL
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
      <div style={{ width: '100vw', maxWidth: '100vw', margin: 0, background: '#fff', borderRadius: 0, boxShadow: 'none', padding: 0, display: 'flex', flexDirection: 'row', minHeight: '100vh', fontSize: '15px' }}>
        {/* Main Content */}
        <div style={{ flex: 2, minWidth: 0, padding: '0 0 18px 0' }}>
          <div style={{ width: '100%', background: '#fff', borderRadius: 0, boxShadow: 'none', padding: 0 }}>
            <div style={{ padding: '18px 18px 0 18px' }}>
              <div style={{ color: "#00796b", fontWeight: 400, fontSize: 24, marginBottom: 10, textAlign: 'left', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 400, fontSize: 24 }}>
                  {contest.title || contest.Title}
                </span>
              </div>
              <div style={{ textAlign: 'left', fontSize: 15, color: '#222', margin: '14px 0 6px 0', fontWeight: 400 }}>
                {timeRemaining.isExpired ? (
                  <span style={{ color: '#d32f2f', fontWeight: 600 }}>
                    หมดเวลารับสมัครแล้ว (ปิดรับเมื่อ {formatDate(contest.end_date || contest.EndDate)})
                  </span>
                ) : (
                  <>
                    เปิดรับผลงานถึงวันที่ {formatDate(contest.end_date || contest.EndDate)}
                  </>
                )}
              </div>
              {!timeRemaining.isExpired && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0', padding: '7px 0 5px 0', marginBottom: 6 }}>
                  {[String(timeRemaining.days).padStart(2, '0'), String(timeRemaining.hours).padStart(2, '0'), String(timeRemaining.minutes).padStart(2, '0'), String(timeRemaining.seconds).padStart(2, '0')].map((num, idx) => (
                    <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ color: timeRemaining.days === 0 && timeRemaining.hours < 24 ? '#d32f2f' : '#d84315', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>{num}</div>
                      <div style={{ color: '#444', fontSize: 11, marginTop: 1 }}>
                        {['วัน', 'ชั่วโมง', 'นาที', 'วินาที'][idx]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {timeRemaining.isExpired && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0', padding: '12px 0', marginBottom: 6, background: '#ffebee' }}>
                  <div style={{ color: '#d32f2f', fontWeight: 600, fontSize: 15 }}>
                    ⏰ การประกวดนี้ปิดรับสมัครแล้ว
                  </div>
                </div>
              )}
            </div>
            {posterUrl ? (
              <img 
                src={posterUrl} 
                alt="โปสเตอร์การประกวด" 
                style={{ width: "100%", maxHeight: 320, objectFit: "contain", borderRadius: 0, margin: 0, background: '#e0f2f1', display: 'block' }}
                onError={(e) => { 
                  console.log('❌ Poster failed to load:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div style={{ width: "100%", height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', color: '#999', fontSize: 14 }}>
                ไม่พบรูปโปสเตอร์
              </div>
            )}
            <div style={{ padding: '18px' }}>
              {(contest.purpose || contest.Purpose) && (
                <section style={{ marginBottom: 24 }}>
                  <h2 style={{ color: "#00695c", fontSize: 16, marginBottom: 6 }}>แนวคิด/วัตถุประสงค์</h2>
                  <div style={{ paddingLeft: 16, color: "#333", fontSize: 13, whiteSpace: 'pre-wrap' }}>
                    {contest.purpose || contest.Purpose}
                  </div>
                </section>
              )}
              
              {(contest.description || contest.Description) && (
                <section style={{ marginBottom: 24 }}>
                  <h2 style={{ color: "#00695c", fontSize: 16, marginBottom: 6 }}>รายละเอียด</h2>
                  <div style={{ paddingLeft: 16, color: "#333", fontSize: 13, whiteSpace: 'pre-wrap' }}>
                    {contest.description || contest.Description}
                  </div>
                </section>
              )}

              {levels.length > 0 && levels.some(l => l.rules) && (
                <section style={{ marginBottom: 24 }}>
                  <h2 style={{ color: "#00695c", fontSize: 16, marginBottom: 6 }}>กติกาการประกวด</h2>
                  {levels.map((level, idx) => (
                    level.rules && (
                      <div key={idx} style={{ marginBottom: 12 }}>
                        {levels.length > 1 && (
                          <h3 style={{ color: "#00796b", fontSize: 14, marginBottom: 4, fontWeight: 600 }}>
                            {level.level_name || level.name}
                          </h3>
                        )}
                        <div style={{ paddingLeft: 16, color: "#333", fontSize: 13, whiteSpace: 'pre-wrap' }}>
                          {level.rules}
                        </div>
                      </div>
                    )
                  ))}
                </section>
              )}

              {levels.length > 0 && levels.some(l => l.prizes) && (
                <section style={{ marginBottom: 24 }}>
                  <h2 style={{ color: "#00695c", fontSize: 16, marginBottom: 6 }}>รางวัล</h2>
                  {levels.map((level, idx) => {
                    if (!level.prizes) return null;
                    const prizes = typeof level.prizes === 'string' ? JSON.parse(level.prizes) : level.prizes;
                    return (
                      <div key={idx} style={{ marginBottom: 12 }}>
                        {levels.length > 1 && (
                          <h3 style={{ color: "#00796b", fontSize: 14, marginBottom: 4, fontWeight: 600 }}>
                            {level.level_name || level.name}
                          </h3>
                        )}
                        <ul style={{ paddingLeft: 16, color: "#333", fontSize: 13 }}>
                          {Array.isArray(prizes) ? (
                            prizes.map((prize, i) => (
                              <li key={i}>{prize}</li>
                            ))
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
          </div>
        </div>
        {/* Sidebar */}
        <div style={{ flex: 1, minWidth: 220, maxWidth: 280, borderLeft: '1px solid #eee', background: '#fafbfc', padding: '18px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <h2 style={{ fontSize: 15, color: '#222', fontWeight: 700, marginBottom: 8 }}>คุณสมบัติผู้สมัคร</h2>
            <ul style={{ color: '#009688', fontSize: 12, margin: 0, paddingLeft: 12, fontWeight: 500 }}>
              {levelNames ? (
                <li>{levelNames}</li>
              ) : (
                <li>ทุกคนสามารถสมัครได้</li>
              )}
            </ul>
          </div>
        </div>

      </div>

      {/* --- Sticky Footer Button (Transparent Floating) --- */}
      <div 
        style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'transparent', 
            boxShadow: 'none',
            border: 'none',
            backdropFilter: 'none',
            padding: isMobile ? '15px 0' : '20px 0',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none' // Click-through empty space
        }}
      >
        <button
            disabled={timeRemaining.isExpired}
            style={{
                pointerEvents: 'auto', // Button is clickable
                padding: isMobile ? '12px 30px' : '14px 45px',
                background: timeRemaining.isExpired ? '#ccc' : 'linear-gradient(45deg, #70136C, #8e24aa)',
                color: '#fff',
                border: 'none',
                borderRadius: 50,
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: timeRemaining.isExpired ? 'not-allowed' : 'pointer',
                boxShadow: timeRemaining.isExpired ? 'none' : '0 6px 25px rgba(112, 19, 108, 0.4)',
                transition: 'all 0.25s ease',
                minWidth: isMobile ? '80%' : '260px',
                maxWidth: '400px',
                opacity: timeRemaining.isExpired ? 0.6 : 1,
            }}
            onMouseOver={(e) => { 
                if (!timeRemaining.isExpired) {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; 
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(112, 19, 108, 0.5)'; 
                }
            }}
            onMouseOut={(e) => { 
                if (!timeRemaining.isExpired) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(112, 19, 108, 0.4)'; 
                }
            }}
            onClick={async () => {
              if (timeRemaining.isExpired) {
                alert('การประกวดนี้ปิดรับสมัครแล้ว');
                return;
              }
              
              // 1. เช็ค login
              const user = localStorage.getItem('user') || sessionStorage.getItem('user');
              if (!user) {
                alert('กรุณาเข้าสู่ระบบก่อนสมัครเข้าประกวด');
                navigate('/login');
                return;
              }
              
              // 2. เช็คว่าเคยส่งการประกวดนี้หรือยัง
              const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
              if (userId) {
                try {
                  const response = await axios.get(`${API_BASE_URL}/submissions/user/${userId}`);
                  const submissions = response.data || [];
                  
                  // เช็คว่ามี submission ของการประกวดนี้หรือไม่
                  const existingSubmission = submissions.find(
                    sub => sub.competition_id === parseInt(id)
                  );
                  
                  if (existingSubmission) {
                    const confirmView = window.confirm(
                      'คุณเคยส่งผลงานเข้าประกวดนี้แล้ว คุณต้องการดูสถานะการส่งประกวดของคุณหรือไม่?'
                    );
                    
                    if (confirmView) {
                      navigate('/my-works');
                    }
                    return;
                  }
                } catch (err) {
                  console.error('Error checking submissions:', err);
                  // ถ้า error ก็ให้ไปต่อได้
                }
              }
              
              // 3. ถ้าไม่เคยส่ง ให้ไปหน้าส่งผลงาน
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