import React, { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../App.css';
const API_BASE_URL = 'http://localhost:8080/api/v1';

const ContestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- States ---
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State สำหรับเช็คขนาดหน้าจอ (Responsive)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;

  // State สำหรับ Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // --- Effects ---

  // 1. Check Window Size
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Fetch API
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests/${id}`);
        console.log('🔍 Contest Detail API Response:', response.data);
        setContest(response.data);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching contest:', err);
        setError('ไม่สามารถโหลดข้อมูลการประกวดได้');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchContest();
  }, [id]);

  // 3. Countdown Logic
  useEffect(() => {
    if (!contest) return;
    
    const calculateTime = () => {
      const endDate = contest.end_date || contest.EndDate;
      if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      
      const now = new Date().getTime();
      const target = new Date(endDate).getTime();
      const distance = target - now;

      if (distance > 0) {
        return {
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTime());
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  // --- Helper Functions ---
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const padNumber = (num) => String(num).padStart(2, '0');

  // --- Loading / Error Views ---
  if (loading) {
    return (
      <>
        <TopNav />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontFamily: '"Sarabun", sans-serif' }}>
          <p style={{ color: '#00796b', fontSize: '1.2rem' }}>กำลังโหลดข้อมูล...</p>
        </div>
      </>
    );
  }

  if (error || !contest) {
    return (
      <>
        <TopNav />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontFamily: '"Sarabun", sans-serif' }}>
          <p style={{ color: '#d32f2f', fontSize: '1.2rem' }}>{error || 'ไม่พบข้อมูลการประกวด'}</p>
        </div>
      </>
    );
  }

  // --- Data Preparation ---
  const levels = contest.levels || [];
  const levelNames = levels.map(l => l.level_name || l.name || '').filter(Boolean).join(', ') || 'ทุกระดับ';
  
  let posterUrl = '/assets/images/hug.jpg';
  if (contest.poster_url || contest.PosterURL) {
    const posterPath = contest.poster_url || contest.PosterURL;
    posterUrl = posterPath.startsWith('http') ? posterPath : `http://localhost:8080${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
  }

  return (
    <>
      <TopNav />
      {/* Main Container */}
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '1440px', 
          margin: '0 auto',   
          background: '#fff', 
          minHeight: '100vh', 
          fontFamily: '"Sarabun", sans-serif', 
          display: 'flex', 
          flexWrap: 'wrap', 
          paddingTop: isMobile ? 10 : 20,
          paddingBottom: 100 // Padding for Sticky Footer
        }}
      >
        
        {/* Left: Main Content */}
        <div style={{ 
            flex: isMobile ? '1 1 100%' : '3 1 700px', 
            minWidth: 0, 
            padding: isMobile ? '0 16px 30px 16px' : '0 24px 40px 24px' 
        }}>
            <div>
              {/* Header Title */}
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ 
                    color: "#00796b", 
                    margin: 0, 
                    fontSize: isMobile ? '24px' : '28px', 
                    fontWeight: 600, 
                    lineHeight: 1.3 
                }}>
                  {contest.title || contest.Title}
                </h1>
                <div style={{ fontSize: '16px', color: '#444', marginTop: 10 }}>
                  <span style={{ fontWeight: 600 }}>ปิดรับผลงาน:</span> {formatDate(contest.end_date || contest.EndDate)}
                </div>
              </div>

              {/* Countdown Bar */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: isMobile ? 10 : 20,
                background: '#f9f9f9',
                border: '1px solid #eee',
                borderRadius: 8,
                padding: '15px', 
                marginBottom: 20 
              }}>
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds }
                ].map((item, idx) => (
                  <div key={idx} style={{ textAlign: 'center', minWidth: isMobile ? 50 : 60 }}>
                    <div style={{ color: '#d84315', fontWeight: 700, fontSize: isMobile ? '20px' : '24px', lineHeight: 1 }}>
                      {padNumber(item.value)}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px', marginTop: 4, textTransform: 'uppercase' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Poster Image */}
              <div style={{ width: '100%', marginBottom: 25, borderRadius: 8, overflow: 'hidden', border: '1px solid #eee', background: '#f5f5f5' }}>
                 <img 
                    src={posterUrl} 
                    alt="โปสเตอร์ประกวด" 
                    style={{ width: "100%", maxHeight: 450, objectFit: "contain", display: 'block' }} 
                    onError={(e) => { 
                      if (e.target.src !== `${window.location.origin}/assets/images/hug.jpg`) {
                        e.target.src = '/assets/images/hug.jpg'; 
                      }
                    }}
                 />
              </div>

              {/* Dynamic Content Sections */}
              <div style={{ padding: '0' }}>
                {(contest.purpose || contest.Purpose) && (
                  <section style={{ marginBottom: 30 }}>
                    <h2 style={{ color: "#00695c", fontSize: '18px', borderBottom: '2px solid #b2dfdb', paddingBottom: 8, marginBottom: 12 }}>แนวคิด/วัตถุประสงค์</h2>
                    <div style={{ paddingLeft: 10, color: "#333", fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {contest.purpose || contest.Purpose}
                    </div>
                  </section>
                )}

                {(contest.description || contest.Description) && (
                  <section style={{ marginBottom: 30 }}>
                    <h2 style={{ color: "#00695c", fontSize: '18px', borderBottom: '2px solid #b2dfdb', paddingBottom: 8, marginBottom: 12 }}>รายละเอียด</h2>
                    <div style={{ paddingLeft: 10, color: "#333", fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {contest.description || contest.Description}
                    </div>
                  </section>
                )}

                {/* Rules Section (Dynamic from Levels) */}
                {levels.length > 0 && levels.some(l => l.rules) && (
                  <section style={{ marginBottom: 30 }}>
                    <h2 style={{ color: "#00695c", fontSize: '18px', borderBottom: '2px solid #b2dfdb', paddingBottom: 8, marginBottom: 12 }}>กติกาการประกวด</h2>
                    {levels.map((level, idx) => (
                      level.rules && (
                        <div key={idx} style={{ marginBottom: 15 }}>
                          {levels.length > 1 && (
                            <h3 style={{ color: "#00796b", fontSize: '16px', marginBottom: 6, fontWeight: 600 }}>
                              {level.level_name || level.name}
                            </h3>
                          )}
                          <div style={{ paddingLeft: 10, color: "#333", fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {level.rules}
                          </div>
                        </div>
                      )
                    ))}
                  </section>
                )}

                {/* Prizes Section (Dynamic from Levels) */}
                {levels.length > 0 && levels.some(l => l.prizes) && (
                  <section style={{ marginBottom: 30 }}>
                    <h2 style={{ color: "#00695c", fontSize: '18px', borderBottom: '2px solid #b2dfdb', paddingBottom: 8, marginBottom: 12 }}>รางวัล</h2>
                    {levels.map((level, idx) => {
                      if (!level.prizes) return null;
                      let prizes = [];
                      try {
                        prizes = typeof level.prizes === 'string' ? JSON.parse(level.prizes) : level.prizes;
                      } catch (e) {
                        prizes = [level.prizes];
                      }

                      return (
                        <div key={idx} style={{ marginBottom: 15 }}>
                          {levels.length > 1 && (
                            <h3 style={{ color: "#00796b", fontSize: '16px', marginBottom: 6, fontWeight: 600 }}>
                              {level.level_name || level.name}
                            </h3>
                          )}
                          <ul style={{ paddingLeft: 25, color: "#333", fontSize: '15px', lineHeight: 1.6 }}>
                            {Array.isArray(prizes) ? (
                              prizes.map((prize, i) => <li key={i}>{prize}</li>)
                            ) : (
                              <li>{String(prizes)}</li>
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

        {/* Right: Sidebar */}
        <div style={{ 
            flex: isMobile ? '1 1 100%' : '1 1 280px', 
            padding: isMobile ? '0 16px 24px 16px' : '0 24px 24px 24px' 
        }}>
          <div style={{ 
            background: '#fafbfc', 
            border: '1px solid #e0e0e0', 
            borderRadius: 8, 
            padding: '20px',
            position: isMobile ? 'static' : 'sticky',
            top: 20 
          }}>
            <h2 style={{ fontSize: '16px', color: '#222', fontWeight: 700, marginBottom: 15, borderBottom: '1px solid #ddd', paddingBottom: 10 }}>
              คุณสมบัติผู้สมัคร
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
               <li style={{ color: '#00796b', fontSize: '14px', display: 'flex', alignItems: 'flex-start' }}>
                 <span style={{ marginRight: 8, fontSize: 18, lineHeight: 1 }}>•</span> 
                 <span>{levelNames || 'ทุกคนสามารถสมัครได้'}</span>
               </li>
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
            style={{
                pointerEvents: 'auto', // Button is clickable
                padding: isMobile ? '12px 30px' : '14px 45px',
                background: 'linear-gradient(45deg, #70136C, #8e24aa)',
                color: '#fff',
                border: 'none',
                borderRadius: 50,
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                boxShadow: '0 6px 25px rgba(112, 19, 108, 0.4)',
                transition: 'all 0.25s ease',
                minWidth: isMobile ? '80%' : '260px',
                maxWidth: '400px'
            }}
            onMouseOver={(e) => { 
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; 
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(112, 19, 108, 0.5)'; 
            }}
            onMouseOut={(e) => { 
                e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(112, 19, 108, 0.4)'; 
            }}
            onClick={() => navigate(`/submit-competition/${id}`)}
        >
            สมัครเข้าประกวดนี้
        </button>
      </div>

    </>
  );
};

export default ContestDetail;