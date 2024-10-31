// src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>ME MART</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor libero id, in gravida.</p>
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
              Email: <a href="mailto:Boardgame@gmail.com" className="text-white">me-mart@memartmail.com</a> <br/>
              Phone: +1 1123 456 780
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
