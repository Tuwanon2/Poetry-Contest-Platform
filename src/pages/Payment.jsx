import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import TopNav from '../components/TopNav';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';

const Payment = () => {
  const location = useLocation();
  const [order, setOrder] = useState({
    items: [],
    shippingCost: 0,
    total: 0,
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [finalTotal, setFinalTotal] = useState(0);

  const placeholderImage = "/assets/images/placeholder.jpg"; // Placeholder image

  useEffect(() => {
    const { state } = location; // เข้าถึง location.state
    
    if (state) {
      const { items, shippingCost, total } = state;
      setOrder({
        items,
        shippingCost,
        total,
      });
    } else {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const total = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const shippingCost = 180; // ค่าขนส่งเริ่มต้น

      setOrder({
        items: storedCart,
        shippingCost,
        total: total + shippingCost, // รวมค่าขนส่ง
      });
    }
  }, [location.state]);

  // คำนวณยอดรวมหลังเลือกวิธีการชำระเงิน
  useEffect(() => {
    let updatedTotal = order.total;
    
    if (paymentMethod === 'cashOnDelivery') {
      updatedTotal += 50; // ค่าธรรมเนียมการชำระเงินปลายทาง
    } else if (paymentMethod === 'bankTransfer') {
      updatedTotal += 20; // ค่าธรรมเนียมการโอนผ่านธนาคาร
    }
    
    setFinalTotal(updatedTotal);
  }, [paymentMethod, order.total]);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleConfirmPayment = () => {
    alert(`การชำระเงินเสร็จสมบูรณ์ ด้วยวิธีการ: ${paymentMethod}`);
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
                {order.items.length > 0 ? (
                  order.items.map((item) => (
                    <Row key={item.id} className="mb-3">
                      <Col sm={4}>
                        <img
                          src={item.image_url || placeholderImage}
                          alt={item.name}
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                      </Col>
                      <Col sm={4}>
                        <strong>{item.name}</strong> x {item.quantity}
                      </Col>
                      <Col sm={4} className="text-end">
                        ฿{item.price * item.quantity}
                      </Col>
                    </Row>
                  ))
                ) : (
                  <p>ไม่มีข้อมูลสินค้า</p>
                )}
                <Row>
                  <Col sm={8}>
                    <strong>ค่าจัดส่ง</strong>
                  </Col>
                  <Col sm={4} className="text-end">
                    ฿{order.shippingCost}
                  </Col>
                </Row>
                <Row>
                  <Col sm={8}>
                    <strong>ยอดรวม</strong>
                  </Col>
                  <Col sm={4} className="text-end">
                    <strong>฿{finalTotal}</strong>
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
