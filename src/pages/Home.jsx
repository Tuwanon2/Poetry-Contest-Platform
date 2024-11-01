import React from 'react';
import TopNav from '../components/TopNav'; // ส่วนแสดง Navigation Bar
import TopMenu from '../components/TopMenu'; // ส่วนแสดงเมนูด้านบน
import BannerCarousel from '../components/BannerCarousel'; // ส่วนแสดง Banner
import NewProducts from '../components/NewProducts'; // ส่วนแสดงสินค้ามาใหม่
import Footer from '../components/Footer'; // ส่วนแสดง Footer

const Home = () => {
  return (
    <div>
      <TopNav /> {/* ส่วนค้นหาจะอยู่ใน TopNav */}
      <TopMenu />
      <BannerCarousel />
      <NewProducts /> {/* แสดงสินค้ามาใหม่ */}
      <Footer />
    </div>
  );
};

export default Home;
