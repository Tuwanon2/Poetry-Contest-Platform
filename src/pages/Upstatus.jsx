import React from 'react';
import TopNav from '../components/TopNav'; // ส่วนแสดง Navigation Bar
import TopMenu from '../components/TopMenu'; // ส่วนแสดงเมนูด้านบน
import Footer from '../components/Footer'; 
import Update from '../components/Update';

const Upstatus = () => {
  return (
    <div>
      <TopNav /> {/* ส่วนค้นหาจะอยู่ใน TopNav */}
      <TopMenu />
      <Update />
      <Footer />
    </div>
  );
};

export default Upstatus;
