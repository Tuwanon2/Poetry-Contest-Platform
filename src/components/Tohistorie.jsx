import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ToHistorie = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  console.log('Orders:', orders); // ดูว่ามีการเปลี่ยนแปลงของ state orders หรือไม่

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('ordersHistory')) || [];
    console.log(storedOrders);  // ดูว่าได้ข้อมูลมาถูกต้องหรือไม่
    setOrders(storedOrders);
  }, []);

  const updateOrdersHistory = (newOrder) => {
    const currentOrders = JSON.parse(localStorage.getItem('ordersHistory')) || [];
    currentOrders.push(newOrder); // เพิ่มคำสั่งซื้อใหม่
    localStorage.setItem('ordersHistory', JSON.stringify(currentOrders)); // อัปเดตใน localStorage
    setOrders(currentOrders); // อัปเดต state เพื่อให้ UI แสดงผลทันที
  };

  return (
    <Container className="my-5">
      <Row className="mb-4 justify-content-center">
        <Col xs="auto">
          <Button variant="link" onClick={() => navigate('/Ship1')}>
            ที่ต้องจัดส่ง
          </Button>
        </Col>
        <Col xs="auto">
          <span style={{ borderLeft: '1px solid black', height: '100%' }} />
        </Col>
        <Col xs="auto">
          <Button variant="link" onClick={() => navigate('/Ship2')}>
            ประวัติการสั่งซื้อ
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              // ตรวจสอบว่า order และ storeLogo ไม่เป็น null ก่อน
              order && order.storeLogo ? (
                <Card key={index} className="mb-4">
                  <Card.Body>
                    <Row>
                      <Col md={2}>
                        {/* ตรวจสอบว่า storeLogo มีค่าหรือไม่ */}
                        <Image
                          src={order.storeLogo || 'https://via.placeholder.com/100'} // ใช้ภาพ placeholder ถ้าไม่มี storeLogo
                          alt="โลโก้ร้าน"
                          className="store-logo"
                          fluid
                        />
                      </Col>
                      <Col md={8}>
                        <h5>{order.storeName || 'ไม่ระบุชื่อร้าน'}</h5>
                        <p>{order.productName || 'ไม่ระบุชื่อสินค้า'}</p>
                        <p>
                          {order.price || 'ไม่ระบุราคา'} x {order.quantity || '0'}
                        </p>
                      </Col>
                      <Col md={2} className="text-end">
                        <p>{order.totalPrice || 'ไม่ระบุราคา'}</p>
                        <p>{order.status === 'delivered' ? 'จัดส่งสำเร็จ' : 'กำลังจัดส่ง'}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ) : null // ถ้าไม่มีข้อมูลให้ข้าม
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>ไม่มีคำสั่งซื้อ</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ToHistorie;
