import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import TopNav from '../components/TopNav';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';

const Payment = () => {
  const [order, setOrder] = useState({
    items: [
      { id: 1, name: 'Product 1', price: 1000, quantity: 1 },
      { id: 2, name: 'Product 2', price: 1000, quantity: 1 }
    ],
    shippingCost: 180,
    tax: 800,
    total: 4180
  });

  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleConfirmPayment = () => {
    alert('การชำระเงินเสร็จสมบูรณ์');
    // Logic for confirming payment (เช่น การส่งข้อมูลไปยัง API)
  };

  return (
    <div>
      <TopNav />
      <TopMenu />

      <Container className="my-5">
        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h4>สรุปรายการสั่งซื้อ</h4>
              </Card.Header>
              <Card.Body>
                {order.items.map((item) => (
                  <Row key={item.id} className="mb-3">
                    <Col sm={8}>
                      <strong>{item.name}</strong> x {item.quantity}
                    </Col>
                    <Col sm={4} className="text-end">
                      ฿{item.price * item.quantity}
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col sm={8}>
                    <strong>ยอดรวม</strong>
                  </Col>
                  <Col sm={4} className="text-end">
                    <strong>฿{order.total}</strong>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h4>เลือกวิธีการชำระเงิน</h4>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Check
                    type="radio"
                    label="บัตรเครดิต"
                    value="creditCard"
                    checked={paymentMethod === 'creditCard'}
                    onChange={handlePaymentMethodChange}
                  />
                  <Form.Check
                    type="radio"
                    label="โอนเงินผ่านธนาคาร"
                    value="bankTransfer"
                    checked={paymentMethod === 'bankTransfer'}
                    onChange={handlePaymentMethodChange}
                  />
                  <Form.Check
                    type="radio"
                    label="การชำระเงินปลายทาง"
                    value="cashOnDelivery"
                    checked={paymentMethod === 'cashOnDelivery'}
                    onChange={handlePaymentMethodChange}
                  />
                </Form>
                <Button
                  variant="primary"
                  onClick={handleConfirmPayment}
                  style={{ width: '100%', fontSize: '18px', padding: '10px 20px', marginTop: '20px' }}
                >
                  ยืนยันการชำระเงิน
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Payment;
