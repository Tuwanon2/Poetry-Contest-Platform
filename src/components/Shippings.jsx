import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import '../App.css';

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
};

const Shippings = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);

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
    return <div>Loading...</div>;
  }

  const { items, subtotal, discountPercentage, totalShipping, grandTotal, paymentMethod } = orderDetails;

  const groupedItems = items.reduce((stores, item) => {
    const store = item.seller_id || 'ไม่ระบุชื่อร้าน';
    if (!stores[store]) {
      stores[store] = [];
    }
    stores[store].push(item);
    return stores;
  }, {});

  // ตรวจสอบว่า product_id นำหน้าด้วยตัวเลขหรือไม่
  const checkProductIdStartWithNumber = (productId) => {
    if (productId && typeof productId === 'string') {
      const startsWithNumber = /^[0-9]/.test(productId.trim()); // ตรวจสอบว่า product_id เริ่มต้นด้วยตัวเลข
      console.log('Checking product_id:', productId, 'Starts with number:', startsWithNumber); // พิมพ์ค่าตรวจสอบ
      return startsWithNumber;
    }
    return false;
  };
  
  
  

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <center><h1>รายละเอียดการสั่งซื้อ</h1></center>
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

                  {groupedItems[storeId].map((item, itemIndex) => {
  console.log('Product ID:', item.product_id); // ตรวจสอบค่าของ product_id ที่ส่งมา
  const deliveryMessage = checkProductIdStartWithNumber(item.product_id)
    ? 'จะได้รับภายใน 270 วัน'
    : 'จะได้รับภายใน 1-2 วัน';

  return (
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
        <Row>
          <Col sm={12}>
            <small>{deliveryMessage}</small>
          </Col>
        </Row>
      </Col>
    </Row>
  );
})}



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
                <Col sm={8}>ค่าจัดส่ง</Col>
                <Col sm={4} className="text-end">{formatCurrency(totalShipping)}</Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col sm={8}><strong>ยอดชำระทั้งหมด</strong></Col>
                <Col sm={4} className="text-end"><strong>{formatCurrency(grandTotal)}</strong></Col>
              </Row>

              <Row className="mb-3">
                <Col sm={8}>วิธีการชำระเงิน</Col>
                <Col sm={4} className="text-end">{paymentMethod || 'ไม่ระบุ'}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Shippings;
