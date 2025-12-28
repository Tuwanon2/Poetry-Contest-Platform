import React, { useState, useEffect } from 'react';
import HomeAdminButton from '../components/HomeAdminButton';
import SidebarHome from '../components/SidebarHome';
import TopNav from '../components/TopNav';
// import TopMenu from '../components/TopMenu'; // <-- ไม่ต้อง import ถ้าไม่ใช้
import BannerCarousel from '../components/BannerCarousel';
import ActivitiesList from '../components/ActivitiesList';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';

const Home = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {showLoading && <LoadingPage />}

      {!showLoading && (
        <>
          <SidebarHome open={sidebarOpen} setOpen={setSidebarOpen} />
          <div
            style={{
              flex: 1,
              marginLeft: sidebarOpen ? 240 : 0,
              minWidth: 0,
              transition: 'margin-left 0.25s cubic-bezier(.4,0,.2,1)',
            }}
          >
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
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
