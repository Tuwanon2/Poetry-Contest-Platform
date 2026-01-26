import React, { useState } from 'react';
import TopNav from '../../components/TopNav';
import '../../components/ActivitiesList.css';

const About = () => {
  return (
    <div className="about-layout">
      <div
        className="about-main"
      >
        <TopNav />

        <div className="about-container">

          {/* Header */}
          <div className="about-header">
            <h1>เกี่ยวกับเรา</h1>
            <p>แพลตฟอร์มบริหารจัดการการส่งบทร้อยกรองประกวด</p>
          </div>

          <Section
            title="วิสัยทัศน์"
            content="มุ่งพัฒนาแพลตฟอร์มดิจิทัลเพื่อส่งเสริมการใช้ภาษาไทยอย่างสร้างสรรค์ 
            และเปิดโอกาสให้ทุกคนสามารถเข้าร่วมกิจกรรมการประกวดบทร้อยกรองได้อย่างเท่าเทียม"
          />

          <Section
            title="พันธกิจ"
            content={
              <ul className="mission-list">
                <li>อำนวยความสะดวกในการส่งผลงานบทร้อยกรองผ่านระบบออนไลน์</li>
                <li>เพิ่มความโปร่งใสในการตัดสินและประกาศผลการแข่งขัน</li>
                <li>สร้างพื้นที่เรียนรู้และแลกเปลี่ยนผลงานด้านวรรณศิลป์</li>
              </ul>
            }
          />

          <Section
            title="กลุ่มเป้าหมาย"
            content="นักเรียน นิสิตนักศึกษา และประชาชนทั่วไปที่สนใจการแต่งกลอนและวรรณกรรมไทย"
          />

          <Section
            title="ทีมพัฒนา"
            content={
              <div className="team-grid">
                {['Frontend Developer', 'Backend Developer', 'UX/UI Designer'].map((role, i) => (
                  <div key={i} className="team-card">
                    <div className="team-avatar"></div>
                    <h4>{role}</h4>
                    <p>ทีมพัฒนาระบบแพลตฟอร์ม</p>
                  </div>
                ))}
              </div>
            }
          />

          <div className="contact-box">
            <h3>ติดต่อเรา</h3>
            <p>อีเมล: poetrycontest@example.com</p>
            <p>โทรศัพท์: 02-123-4567</p>
          </div>

        </div>
      </div>
    </div>
  );
};

const Section = ({ title, content }) => (
  <div className="section-box">
    <h2>{title}</h2>
    <div className="section-content">{content}</div>
  </div>
);

export default About;