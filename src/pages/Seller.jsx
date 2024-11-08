import React from 'react';
import TopNav from '../components/TopNav'; // ส่วนแสดง Navigation Bar
import TopMenu from '../components/TopMenu'; // ส่วนแสดงเมนูด้านบน
import Footer from '../components/Footer'; // ส่วนแสดง Footer
import Seller1  from '../components/Seller1';

const Seller = () => {
  return (
    <div>
      <TopNav /> {/* ส่วนค้นหาจะอยู่ใน TopNav */}
      <TopMenu />
      <Seller1/>
      <Footer />

    </div>
  );
};

export default Seller;
