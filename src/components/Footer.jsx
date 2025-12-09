// src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className=" text-white py-4" style={{backgroundColor:'#70136C'}}>
      <Container>
        <Row>
          <Col md={4}>
            <h5>NAMO BOARDGAME</h5>
            <p>รวมร้านบอร์ดเกมชื่อดังทั่วประเทศ</p>
          </Col>
          <Col md={2}>
            <h5>About Us</h5>
            <ul className="list-unstyled">
              <li>บอร์ดเกมส์</li>
              <li>ร้านของเรา</li>
              <li>เงื่อนไขและข้อตกลง</li>
              <li>นโยบายความเป็นส่วนตัว</li>
            </ul>
          </Col>
          <Col md={2}>
            <h5>Customer Care</h5>
            <ul className="list-unstyled">
              <li>Help Center</li>
              <li>How to Buy</li>
              <li>Track Your Order</li>
              <li>Returns & Refunds</li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>
              Silpakon University<br/>
              Email: <a href="jaikla_t@silpakorn.edu" className="text-white">jaikla_t@silpakorn.edu</a> <br/>
              Phone: 0886524782
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
