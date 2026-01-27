import React, { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa"; // เหลือไว้เฉพาะที่ใช้ในเนื้อหา (วันที่/เวลา)
import '../App.css';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const ContestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  // Responsive Check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch Data
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests/${id}`);
        setContest(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching contest:', err);
        setError('ไม่สามารถโหลดข้อมูลการประกวดได้');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchContest();
  }, [id]);

  // Date/Time Logic
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const formatTime = (dateString) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + " น.";
  };

  const calculateTimeRemaining = (endDate) => {
    if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
    const now = new Date();
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
    const diff = end - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
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
      setTimeRemaining(calculateTimeRemaining(endDate));
      const interval = setInterval(() => {
        const newTime = calculateTimeRemaining(endDate);
        setTimeRemaining(newTime);
        if (newTime.isExpired) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [contest]);

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>;
  if (error || !contest) return <div style={{textAlign:'center', padding:'50px', color:'red'}}>Error: {error}</div>;

  const levels = contest.levels || [];
  const levelList = levels.map(l => l.level_name || l.name || '').filter(Boolean);

  let posterUrl = null;
  if (contest.poster_url || contest.PosterURL) {
    const posterPath = contest.poster_url || contest.PosterURL;
    posterUrl = posterPath.startsWith('http') ? posterPath : `http://localhost:8080${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
  }

  // --- Design Variables ---
  const themePurple = "#70136c"; 
  const textDark = "#333";
  const bgGray = "#F9F9F9";

  // Card Style
  const mainCardStyle = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    border: '1px solid #eee',
    padding: '30px',
    marginBottom: '30px'
  };

  // --- Section Heading Style (แก้ไขให้เป็นเส้นขีดตรง) ---
  const sectionTitle = {
      color: themePurple,
      fontSize: '20px', // เพิ่มขนาดเล็กน้อยให้สมดุลกับเส้น
      fontWeight: 'bold',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      
      // ส่วนสร้างเส้นขีดตรงด้านหน้า
      borderLeft: `5px solid ${themePurple}`, 
      paddingLeft: '15px', // เว้นระยะจากเส้นถึงตัวหนังสือ
      lineHeight: '1.2'
  };

  const divider = <hr style={{ border: '0', borderTop: '1px solid #f0f0f0', margin: '25px 0' }} />;

  return (
    <>
      <TopNav />
      
      {/* Background */}
      <div style={{ background: bgGray, minHeight: '100vh', paddingBottom: '140px' }}>
        
        {/* Container */}
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '40px 20px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '30px', alignItems: 'flex-start' }}>
            
            {/* === LEFT COLUMN: Title & Main Content === */}
            <div style={{ flex: '7', width: '100%' }}>
                
                {/* Main Content Card */}
                <div style={mainCardStyle}>
                    
                    {/* Title */}
                    <h1 style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        color: '#000', 
                        marginBottom: '25px', 
                        marginTop: 0,
                        textAlign: 'left'
                    }}>
                        {contest.title || contest.Title}
                    </h1>

                    {/* Poster */}
                    <div style={{ background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', marginBottom: '30px' }}>
                          {posterUrl ? (
                            <img src={posterUrl} alt="Poster" style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }} />
                          ) : (
                            <span style={{ color: '#ccc', fontSize: '16px' }}>ไม่พบรูปโปสเตอร์</span>
                          )}
                    </div>

                    {/* Section: ระดับของผู้สมัคร */}
                    <div style={sectionTitle}>
                        ระดับของผู้สมัคร
                    </div>
                    <ul style={{ paddingLeft: 20, marginBottom: 0, color: '#555' }}>
                        {levelList.length > 0 ? levelList.map((l,i) => <li key={i}>{l}</li>) : <li>ทั่วไป</li>}
                    </ul>

                    {divider}

                    {/* Section: รายละเอียด */}
                    {(contest.description || contest.Description) && (
                        <>
                            <div style={sectionTitle}>
                                รายละเอียด
                            </div>
                            <div style={{ color: '#555', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                {contest.description || contest.Description}
                            </div>
                            {divider}
                        </>
                    )}

                    {/* Section: กติกา */}
                    {levels.some(l => l.rules) && (
                        <>
                            <div style={sectionTitle}>
                                กติกาการประกวด
                            </div>
                            {levels.map((l, i) => l.rules && (
                                <div key={i} style={{ marginBottom: 15 }}>
                                    {levels.length > 1 && <strong>{l.level_name}: </strong>}
                                    <span style={{ color: '#555', lineHeight: 1.6 }}>{l.rules}</span>
                                </div>
                            ))}
                            {divider}
                        </>
                    )}

                     {/* Section: รางวัล */}
                     {levels.some(l => l.prizes) && (
                        <>
                            <div style={sectionTitle}>
                                รางวัล
                            </div>
                            {levels.map((l, i) => l.prizes && (
                                <div key={i}>
                                    <ul style={{ paddingLeft: 20, color: '#555' }}>
                                        {Array.isArray(JSON.parse(JSON.stringify(l.prizes))) 
                                            ? JSON.parse(JSON.stringify(l.prizes)).map((p, idx) => <li key={idx}>{p}</li>)
                                            : <li>{l.prizes}</li>
                                        }
                                    </ul>
                                </div>
                            ))}
                        </>
                    )}

                </div>
            </div>

            {/* === RIGHT COLUMN: Sidebar Widgets === */}
            <div style={{ flex: '3', width: '100%', position: isMobile ? 'static' : 'sticky', top: '20px' }}>
                
                {/* Widget 1: Status & Timer */}
                <div style={{ ...mainCardStyle, padding: '20px' }}>
                    
                    <div style={sectionTitle}>
                        สถานะการรับสมัคร
                    </div>

                    {/* Status Badge */}
                    <div style={{ 
                        background: timeRemaining.isExpired ? '#FFEBEE' : '#E0F2F1', 
                        color: timeRemaining.isExpired ? '#C62828' : '#00695C',
                        padding: '12px', 
                        borderRadius: '6px', 
                        textAlign: 'center', 
                        fontWeight: 'bold',
                        border: `1px solid ${timeRemaining.isExpired ? '#EF9A9A' : '#80CBC4'}`,
                        marginBottom: '20px'
                    }}>
                        {timeRemaining.isExpired ? 'ปิดรับผลงาน' : 'เปิดรับผลงาน'}
                    </div>

                    {/* Date Info */}
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                        <div style={{ marginBottom: 5 }}> สิ้นสุด: {formatDate(contest.end_date || contest.EndDate)}</div>
                        <div>เวลา: {formatTime(contest.end_date || contest.EndDate)}</div>
                    </div>

                    {/* Timer */}
                    {!timeRemaining.isExpired && (
                        <div>
                             <div style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginBottom: 10 }}>เหลือเวลาอีก</div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                                {[{v:timeRemaining.days, l:'วัน'}, {v:timeRemaining.hours, l:'ชม.'}, {v:timeRemaining.minutes, l:'นาที'}, {v:timeRemaining.seconds, l:'วินาที'}].map((t, i) => (
                                    <div key={i} style={{ flex:1, background: '#FAFAFA', border:'1px solid #EEE', borderRadius: '8px', padding: '10px 0', textAlign: 'center' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: themePurple }}>{t.v}</div>
                                        <div style={{ fontSize: '11px', color: '#888' }}>{t.l}</div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>

                {/* Widget 2: Eligibility */}
                <div style={{ ...mainCardStyle, padding: '20px' }}>
                    <div style={sectionTitle}>
                        ระดับของผู้สมัคร
                    </div>
                    <ul style={{ paddingLeft: 20, marginBottom: 0, color: '#555', fontSize: '14px' }}>
                        {levelList.length > 0 ? levelList.map((l,i) => <li key={i}>{l}</li>) : <li>ไม่จำกัด</li>}
                    </ul>
                </div>

            </div>
        </div>
      </div>

      {/* === TRANSPARENT FOOTER === */}
      <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '25px 0',
          zIndex: 1000,
          background: 'linear-gradient(to top, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
          backdropFilter: 'none',
          pointerEvents: 'none'
      }}>
          <button
            disabled={timeRemaining.isExpired}
            onClick={() => {
                if(timeRemaining.isExpired) return;
                const user = localStorage.getItem('user') || sessionStorage.getItem('user');
                if(!user) { alert('กรุณาเข้าสู่ระบบ'); navigate('/login'); return; }
                navigate(`/submit-competition/${id}`);
            }}
            style={{
                pointerEvents: 'auto',
                background: timeRemaining.isExpired ? '#BDBDBD' : 'linear-gradient(90deg, #70136c 0%, #90188c 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 60px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: timeRemaining.isExpired ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(112, 19, 108, 0.4)', 
                transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => !timeRemaining.isExpired && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
              {timeRemaining.isExpired ? 'ปิดรับสมัครแล้ว' : 'สมัครเข้าประกวดนี้'}
          </button>
      </div>

    </>
  );
};

export default ContestDetail;
  