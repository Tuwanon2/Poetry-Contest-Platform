import React from 'react';
import TopNav from '../components/TopNav'; // ส่วนแสดง Navigation Bar
import TopMenu from '../components/TopMenu'; // ส่วนแสดงเมนูด้านบน
import Footer from '../components/Footer'; // ส่วนแสดง Footer

const Contact = () => {
  return (
    <div>
      <TopNav /> {/* ส่วนค้นหาจะอยู่ใน TopNav */}
      <TopMenu />

      {/* เนื้อหาของหน้า Contact */}
      <div className="container my-5">
        <h2 className="text-center">ติดต่อเรา</h2>
        
        
        {/* แสดงเบอร์โทร */}
        <div className="text-center">
          <h3 style={{ fontSize: '2.5rem' }}>088-652-4782</h3>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
