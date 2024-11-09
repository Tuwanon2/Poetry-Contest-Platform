import React from 'react';
import { Carousel } from 'react-bootstrap';

const BannerCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/images/Slide_1.png"
          alt="First slide"
          style={{ maxWidth: '80%', height: 'auto', margin: '0 auto' }} // ปรับขนาดภาพ
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/images/Slide_2.gif"
          alt="Second slide"
          style={{ maxWidth: '80%', height: 'auto', margin: '0 auto' }} // ปรับขนาดภาพ
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/images/Slide_1.png"
          alt="Third slide"
          style={{ maxWidth: '80%', height: 'auto', margin: '0 auto' }} // ปรับขนาดภาพ
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default BannerCarousel;
  