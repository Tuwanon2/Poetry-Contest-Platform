import React from 'react';
import TopNav from '../components/TopNav'; // ส่วนแสดง Navigation Bar
import TopMenu from '../components/TopMenu'; // ส่วนแสดงเมนูด้านบน
import Footer from '../components/Footer'; 
import ToShipPage from '../components/ToShipPage';

const Ship1 = () => {
  return (
    <div>
      <TopNav /> {/* ส่วนค้นหาจะอยู่ใน TopNav */}
      <TopMenu />
      <ToShipPage />
      <Footer />
    </div>
  );
};

export default Ship1;
