import React from 'react';
import TopNav from '../components/TopNav'; // ส่วนแสดง Navigation Bar
import TopMenu from '../components/TopMenu'; // ส่วนแสดงเมนูด้านบน
import Footer from '../components/Footer'; 
import Tohistorie from '../components/Tohistorie';

const Ship2 = () => {
  return (
    <div>
      <TopNav /> {/* ส่วนค้นหาจะอยู่ใน TopNav */}
      <TopMenu />
      <Tohistorie />
      <Footer />
    </div>
  );
};

export default Ship2;
