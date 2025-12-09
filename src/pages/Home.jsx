import React, { useState, useEffect } from 'react';
import HomeAdminButton from '../components/HomeAdminButton';
import TopNav from '../components/TopNav';
// import TopMenu from '../components/TopMenu'; // <-- ไม่ต้อง import ถ้าไม่ใช้
import BannerCarousel from '../components/BannerCarousel';
import ActivitiesList from '../components/ActivitiesList';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';

const Home = () => {
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const firstVisit = localStorage.getItem('firstVisit');
    if (!firstVisit) {
      setShowLoading(true);
      localStorage.setItem('firstVisit', 'true');
      setTimeout(() => setShowLoading(false), 5000);
    }
  }, []);

  const location = useLocation();

  let filterCategory = null;
  if (location.pathname === '/competition/student') filterCategory = 'นักเรียน';
  if (location.pathname === '/competition/university') filterCategory = 'นิสิต';
  if (location.pathname === '/competition/general') filterCategory = 'ประชาชนทั่วไป';

  return (
    <div>
      {showLoading && <LoadingPage />}

      {!showLoading && (
        <>
          <TopNav />

          {/* <TopMenu />  <-- คอมเมนต์ออกเพื่อไม่ให้แสดง */}

          {/* 🔥 Banner ตรงกลาง + กว้างพอดี */}
          <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 24px' }}>
            <BannerCarousel />
          </div>

          {/* Activities */}
          <ActivitiesList filterCategory={filterCategory} />

          {/* Floating Social Icons */}
          <div className="elgy-tooltip-container">
            {/* ...โค้ด Social Icons เหมือนเดิม... */}
          </div>

          {/* Button to go to CreateCompetition page (bottom) */}
          <div style={{ textAlign: 'center', margin: '2.5rem 0 1.5rem 0' }}>
            <button
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                background: '#009688',
                color: '#fff',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
              onClick={() => window.location.href = '/create-competition'}
            >
              สร้างการประกวด
            </button>
          </div>
          {/* ปุ่มไปหน้าภาพรวมการประกวด */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 48, marginBottom: 24 }}>
            <button
              onClick={() => navigate('/competitions-overview')}
              style={{
                background: '#70136C',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                padding: '14px 38px',
                fontSize: '1.15rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(112,19,108,0.08)',
                cursor: 'pointer',
                letterSpacing: 0.5,
                transition: 'background 0.18s, box-shadow 0.18s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#4b0c47'}
              onMouseOut={e => e.currentTarget.style.background = '#70136C'}
            >
              ดูภาพรวมการประกวด
            </button>
          </div>
          <HomeAdminButton />

          {/* ปุ่มกรรมการให้คะแนน */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 18, marginBottom: 32 }}>
            <button
              onClick={() => navigate('/judge-scoring')}
              style={{
                background: '#1abc9c',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                padding: '14px 38px',
                fontSize: '1.15rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(26,188,156,0.08)',
                cursor: 'pointer',
                letterSpacing: 0.5,
                transition: 'background 0.18s, box-shadow 0.18s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#159c85'}
              onMouseOut={e => e.currentTarget.style.background = '#1abc9c'}
            >
              กรรมการให้คะแนน
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
