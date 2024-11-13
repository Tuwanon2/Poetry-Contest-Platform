import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BannerCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <Link to="/product/Edeeabd1-da23-4ce2-b4aa-5ed00994e2b1"> {/* ลิงก์ไปยังหน้า ProductDetail ของ Slide 1 */}
          <img
            className="d-block w-100"
            src="/assets/images/Slide_1.png"
            alt="First slide"
            style={{ maxWidth: '100%', height: '90%', margin: '0 auto' }} // ปรับขนาดภาพ
          />
        </Link>
      </Carousel.Item>

      <Carousel.Item>
        <Link to="/product/a9544191-026e-4839-b625-8aed6a28ab2a"> {/* ลิงก์ไปยังหน้า ProductDetail ของ Slide 2 */}
          <img
            className="d-block w-100"
            src="/assets/images/Slide_2.gif"
            alt="Second slide"
            style={{ maxWidth: '100%', height: 'auto', margin: '0 auto' }} // ปรับขนาดภาพ
          />
        </Link>
      </Carousel.Item>


      <Carousel.Item>
        <Link to="/product/B05ca5ca-7f55-4626-b1bb-3f17881f39ea"> {/* ลิงก์ไปยังหน้า ProductDetail ของ Slide 3 */}
          <img
            className="d-block w-100"
            src="/assets/images/Slide_3.png"
            alt="Third slide"
            style={{ maxWidth: '100%', height: 'auto', margin: '0 auto' }} // ปรับขนาดภาพ
          />
        </Link>
      </Carousel.Item>

    <Carousel.Item>
        <Link to="/product/3ea67d69-fe39-4e9c-9fea-63babe288a43"> {/* ลิงก์ไปยังหน้า ProductDetail ของ Slide 4 */}
          <img
            className="d-block w-100"
            src="/assets/images/Slide_4.gif"
            alt="Forth slide"
            style={{ maxWidth: '100%', height: 'auto', margin: '0 auto' }} // ปรับขนาดภาพ
          />
        </Link>
      </Carousel.Item>
    </Carousel>
  );
};

export default BannerCarousel;
