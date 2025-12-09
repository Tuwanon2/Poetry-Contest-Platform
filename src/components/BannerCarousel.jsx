import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';


// ใช้ชื่อไฟล์ใหม่สำหรับรูปที่ผู้ใช้แนบมา
const images = [
  '/assets/images/banner1.jpg', // รูปแรก (กรุณาตั้งชื่อไฟล์นี้ใน assets/images)
  '/assets/images/banner2.jpg', // รูปที่สอง (กรุณาตั้งชื่อไฟล์นี้ใน assets/images)
];

const BannerCarousel = () => (
  <div className="banner-carousel-wrapper">
    <Carousel fade interval={4000} controls={true} indicators={true} pause={false}>
      {images.map((img, idx) => (
        <Carousel.Item key={idx}>
          <img
            className="d-block w-100 banner-img"
            src={img}
            alt={`slide-${idx+1}`}
              style={{
                width: '100%',
                height: '320px',
                objectFit: 'cover',
                objectPosition: 'top',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(112,19,108,0.12)'
              }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  </div>
);

export default BannerCarousel;
