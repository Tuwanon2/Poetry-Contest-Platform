import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ToHistorie = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

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
            orders.filter(order => order.status === 'delivered').map((order, index) => (
              <Card key={index} className="mb-4">
                <Card.Body>
                  <Row>
                    <Col md={2}>
                      <Image src={order.storeLogo || 'https://via.placeholder.com/100'} alt="โลโก้ร้าน" className="store-logo" fluid />
                    </Col>
                    <Col md={8}>
                      <h5>{order.storeName}</h5>
                      <p>{order.productName}</p>
                      <p>
                        {order.price} x {order.quantity}
                      </p>
                    </Col>
                    <Col md={2} className="text-end">
                      <p>{order.totalPrice}</p>
                      <p>{order.status === 'delivered' ? 'จัดส่งสำเร็จ' : 'กำลังจัดส่ง'}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
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
