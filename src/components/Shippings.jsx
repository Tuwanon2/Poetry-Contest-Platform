import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Shipping = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // เรียกข้อมูลคำสั่งซื้อจาก localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

  const sellerNames = {
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': 'SIAM BOARDGAME',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': 'Lanlalen',
    '940256ba-a9de-4aa9-bad8-604468cb6af3': 'TIME TO PLAY',
    '494d4f06-225c-463e-bd8a-6c9caabc1fc4': 'Towertactic',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': 'DiceCUP',
  };

  const getSellerImage = (sellerId) => {
    const images = {
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': '/assets/images/SIAM_BOARDGAME.jpg',
      'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': '/assets/images/Lanlalen.jpg',
      '940256ba-a9de-4aa9-bad8-604468cb6af3': '/assets/images/TIME_TO_PLAY.jpg',
      '494d4f06-225c-463e-bd8a-6c9caabc1fc4': '/assets/images/Towertactic.jpg',
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': '/assets/images/DiceCUP.jpg',
    };
    return images[sellerId] || '/assets/default_image.png';
  };

  const getSellerName = (sellerId) => {
    return sellerNames[sellerId] || 'Unknown';
  };

  const calculateTotalPrice = (orderItems) => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Container className="my-5">
      <Row className="mb-4 justify-content-center">
        <Col xs="auto">
          {/* ปุ่มที่ต้องจัดส่ง */}
          <Button variant="link" onClick={() => navigate('/Ship1')}>
            ที่ต้องจัดส่ง
          </Button>
        </Col>
        <Col xs="auto">
          {/* เส้นขั้นระหว่างสองปุ่ม */}
          <span style={{ borderLeft: '1px solid black', height: '100%' }} />
        </Col>
        <Col xs="auto">
          {/* ปุ่มประวัติการสั่งซื้อ */}
          <Button variant="link" onClick={() => navigate('/Ship2')}>
            ประวัติการสั่งซื้อ
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          {orders.length > 0 ? (
            orders.map((order, index) => {
              const totalPrice = calculateTotalPrice(order.items); // คำนวณราคารวมทั้งหมดในคำสั่งซื้อ
              return (
                <Card key={index} className="mb-4">
                  <Card.Body>
                    <Row>
                      <Col md={2}>
                        <img
                          src={getSellerImage(order.sellerId)}
                          alt="โลโก้ร้าน"
                          className="store-logo"
                          style={{ width: '100px', height: '100px', borderRadius: '5px' }}
                        />
                      </Col>
                      <Col md={8}>
                        <h5>{getSellerName(order.sellerId)}</h5>
                        {order.items.map((item, itemIndex) => (
                          <Row key={itemIndex}>
                            <Col md={8}>
                              <p>{item.productName}</p>
                              <p>{item.quantity} x ฿{item.price}</p>
                            </Col>
                            <Col md={4} className="text-end">
                              <p>฿{item.price * item.quantity}</p>
                            </Col>
                          </Row>
                        ))}
                      </Col>
                      <Col md={2} className="text-end">
                        <p><strong>ราคารวม: ฿{totalPrice}</strong></p>
                        <p>{order.status === 'delivered' ? 'จัดส่งสำเร็จ' : 'กำลังจัดส่ง'}</p>
                      </Col>
                    </Row>
                    {order.status !== 'delivered' && (
                      <p className="text-end">คาดว่าจะได้รับสินค้าภายใน 1-3 วัน</p>
                    )}
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <p style={{ textAlign: 'center' }}>ไม่มีคำสั่งซื้อ</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Shipping;
