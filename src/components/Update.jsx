import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Update = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const storedOrderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    if (storedOrderDetails && !orderDetails) {
      setOrderDetails(storedOrderDetails);
      setShippingAddress(storedOrderDetails.address);
    }
  }, []);

  useEffect(() => {
    if (orderDetails) {
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    }
  }, [orderDetails]);

  if (!orderDetails || !shippingAddress) {
    return <a href="/assets/images/namo_loading.gif"></a>;
  }

  const orderTime = new Date(orderDetails.orderTime); // กำหนดวันที่และเวลา

  const { items, subtotal, discountPercentage, totalShipping, grandTotal, paymentMethod } = orderDetails;

  const groupedItems = items.reduce((stores, item) => {
    const store = item.seller_id || 'ไม่ระบุชื่อร้าน';
    if (!stores[store]) {
      stores[store] = [];
    }
    stores[store].push(item);
    return stores;
  }, {});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const handleStatusUpdate = () => {
    navigate('/upstatus');
  };

  const handleShippingDetails = () => {
    navigate('/ShippingDetails');
  };

  return (
    <Container className="my-5">
      <Row className="mb-4 justify-content-center">
        <Col xs="auto">
          <button className="custom-fade-button"  onClick={() => navigate('/Ship1')}>
            ที่ต้องจัดส่ง
          </button>
        </Col>
        <Col xs="auto">
          <span style={{ borderLeft: '1px solid black', height: '100%' }} />
        </Col>
        <Col xs="auto">
          <button className="custom-fade-button" onClick={() => navigate('/Ship2')}>
            ประวัติการสั่งซื้อ
          </button>
        </Col>
      </Row>

      {/* Button "ข้อมูลการจัดส่ง" with order time */}
      <Row className="mb-4">
        <Col>
          <Button 
            variant="primary" 
            className="w-100 text-start" 
            onClick={() => navigate('/Delivery')}
            style={{ display: 'block', width: '100%', fontSize: '1.3rem', padding: '12px', color: '#CC0066', backgroundColor: 'white', border: '2px solid #CC0066' }} 
          >
            <h3>ข้อมูลการจัดส่ง</h3>
            <h6>วันเวลาที่สั่งสินค้า: {orderTime.toLocaleString('th-TH')}</h6>
            <h6>ตรวจสอบสถานะการสั่งซื้อที่นี่</h6>
          </Button>
        </Col>
      </Row>

      {/* Address details */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h3>ที่อยู่สำหรับจัดส่ง</h3>
              <p>{`${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''} │ ${shippingAddress.phone || ''}`}</p>
              <p>
                {`${shippingAddress.company || ''}, ${shippingAddress.address || ''}, ${shippingAddress.subDistrict || ''}, ${shippingAddress.street || ''}, 
                ${shippingAddress.district || ''}, ${shippingAddress.province || ''}, ${shippingAddress.country || ''} ${shippingAddress.postalCode || ''}`}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order summary */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h3>รายละเอียดการสั่งซื้อ</h3>
            </Card.Header>
            <Card.Body>
              {Object.keys(groupedItems).map((storeId, index) => (
                <div key={index}>
                  <Row className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                    <Col sm={1} style={{ paddingLeft: '0' }}>
                      <Image
                        src={getSellerImage(storeId)}
                        alt={sellerNames[storeId] || 'Seller'}
                        rounded
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col sm={11} style={{ paddingLeft: '10px' }}>
                      <h5>{sellerNames[storeId] || 'ไม่ระบุชื่อร้าน'}</h5>
                    </Col>
                  </Row>

                  {groupedItems[storeId].map((item, itemIndex) => (
                    <Row key={itemIndex} className="mb-3">
                      <Col sm={2}>
                        <Image
                          src={item.images?.[0]?.image_url || '/assets/placeholder.jpg'}
                          alt={item.name}
                          rounded
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      </Col>
                      <Col sm={10}>
                        <h4>{item.name}</h4>
                        <Row>
                          <Col sm={8}>
                            <strong style={{ fontSize: '1.2rem' }}>{formatCurrency(item.price)} x {item.quantity}</strong>
                          </Col>
                          <Col sm={4} className="text-end">
                            <strong style={{ fontSize: '1.2rem' }}>{formatCurrency(item.price * item.quantity)}</strong>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order totals */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h3>สรุปยอดการชำระเงิน</h3>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={8}>ยอดรวมสินค้า</Col>
                <Col sm={4} className="text-end">{formatCurrency(subtotal)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={8}>ส่วนลด ({discountPercentage}%)</Col>
                <Col sm={4} className="text-end">{formatCurrency((subtotal * discountPercentage) / 100)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={8}>ค่าส่งสินค้า</Col>
                <Col sm={4} className="text-end">{formatCurrency(totalShipping)}</Col>
              </Row>
              <hr />
              <Row>
                <Col sm={8}><strong>ยอดรวมสุทธิ</strong></Col>
                <Col sm={4} className="text-end"><strong>{formatCurrency(grandTotal)}</strong></Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payment method */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h3>วิธีการชำระเงิน</h3>
            </Card.Header>
            <Card.Body>
              <p>{paymentMethod}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Update;
