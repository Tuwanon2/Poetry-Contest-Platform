import React, { useState } from 'react';
import HomeAdminButton from '../components/HomeAdminButton';
import SidebarHome from '../components/SidebarHome';
import TopNav from '../components/TopNav';
// import TopMenu from '../components/TopMenu';
import BannerCarousel from '../components/BannerCarousel';
import ActivitiesList from '../components/ActivitiesList';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  let filterCategory = null;
  if (location.pathname === '/competition/student') filterCategory = 'นักเรียน';
  if (location.pathname === '/competition/university') filterCategory = 'นิสิต';
  if (location.pathname === '/competition/general') filterCategory = 'ประชาชนทั่วไป';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
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

        {/* 🔥 Banner */}
        <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 24px' }}>
          <BannerCarousel />
        </div>

        {/* Activities */}
        <ActivitiesList filterCategory={filterCategory} />

        {/* Floating Social Icons */}
        <div className="elgy-tooltip-container">
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default Home;
