import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 

const Payment = () => {
  const navigate = useNavigate();  
  const [order, setOrder] = useState({
    items: [],
    total: 0
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [address, setAddress] = useState({});
  const [discountPercentage, setDiscountPercentage] = useState(3); 
  const [subtotal, setSubtotal] = useState(0);  

  const isDiscountApplicable = (percentage) => {
    if (percentage === 3) return true;
    if (percentage === 5) return subtotal >= 1500;
    if (percentage === 10) return subtotal >= 4000;
    return false;
  };

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
      '940256ba-a9de-4aa9-bad8-604468cb6af3': '/assets/images/TIME_TO_PLAY.png',
      '494d4f06-225c-463e-bd8a-6c9caabc1fc4': '/assets/images/Towertactic.png',
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': '/assets/images/DiceCUP.jpg',
    };
    return images[sellerId] || '/assets/default_image.png';
  };
  
  const getSellerName = (sellerId) => {
    return sellerNames[sellerId] || 'Unknown';
  };
  const placeholderImage = '../assets/images/placeholder.jpg';
  const groupItemsByStore = (items) => {
    return items.reduce((stores, item) => {
      const store = item.seller_id || 'ไม่ระบุชื่อร้าน'; 
      if (!stores[store]) {
        stores[store] = [];
      }
      stores[store].push(item);
      return stores;
    }, {});
  };

  const calculateShippingCost = (storeItems) => {
    return storeItems.length > 0 ? 45 : 0;
  };
  const isAddressValid = () => {
    return address.firstName && address.lastName && address.phone && address.address && address.district && address.province && address.postalCode;
  };
  
  const handleConfirmPayment = () => {
    if (!isAddressValid()) {
      alert('กรุณากรอกที่อยู่ให้ครบถ้วนก่อนทำการสั่งซื้อ');
      return;
    }
    localStorage.removeItem('cart');
    alert('การชำระเงินเสร็จสมบูรณ์');
    navigate('/');
  };
  
  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem('cart'));
    if (storedOrder) {
      const total = storedOrder.reduce((acc, product) => acc + product.price * (product.quantity || 1), 0);
      setOrder({ items: storedOrder, total: total });
      setSubtotal(total);
    }

    const storedAddress = JSON.parse(localStorage.getItem('address'));
    if (storedAddress) {
      setAddress(storedAddress);
    }
  }, []);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleDiscountChange = (e) => {
    setDiscountPercentage(Number(e.target.value));
  };



  const handleNavigateToChooseAddress = () => {
    navigate('/EditAddress');
  };

  const groupedItems = groupItemsByStore(order.items);

  const calculateGrandTotal = () => {
    const discount = (subtotal * discountPercentage) / 100;
    const shippingCosts = Object.keys(groupedItems).map(storeId => calculateShippingCost(groupedItems[storeId]));
    const totalShipping = shippingCosts.reduce((acc, cost) => acc + cost, 0);
    const grandTotal = (subtotal - discount) + totalShipping;
    return grandTotal;
  };

  const totalShipping = Object.keys(groupedItems).map(storeId => calculateShippingCost(groupedItems[storeId])).reduce((acc, cost) => acc + cost, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const grandTotal = calculateGrandTotal();

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <center><h1>สรุปรายการสั่งซื้อ</h1></center>
      </Row>

      {/* ส่วนแสดงที่อยู่ */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body style={{ position: 'relative' }}>
              <h3>ที่อยู่สำหรับจัดส่ง</h3>
              {address.firstName ? (
                <div>
                  <p>{address.firstName} {address.lastName} │ {address.phone}</p>
                  <p>{address.company}, {address.address}, {address.subDistrict}, {address.street}, {address.district}, {address.province}, {address.country} {address.postalCode}</p>
                </div>
              ) : (
                <p>กรุณากรอกที่อยู่ในการจัดส่ง</p>
              )}

              <Button 
                variant="primary" 
                onClick={handleNavigateToChooseAddress} 
                style={{ position: 'absolute', bottom: '20px', right: '10px' }}
              >
                แก้ไขที่อยู่
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ส่วนแสดงรายละเอียดสินค้า */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h3>รายละเอียดการสั่งซื้อ</h3>
            </Card.Header>
            <Card.Body>
              {Object.keys(groupedItems).map((storeId, index) => (
                <div key={index}>
                  {/* แสดงโลโก้และชื่อร้าน */}
                  <Row className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                    <Col sm={1} style={{ paddingLeft: '0' }}>
                      {/* แสดงโลโก้ร้าน */}
                      <Image
                        src={getSellerImage(storeId)}  // เรียกฟังก์ชันเพื่อดึงโลโก้ร้าน
                        rounded
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col sm={11} style={{ paddingLeft: '10px' }}>
                      {/* แสดงชื่อร้าน */}
                      <h5>{getSellerName(storeId)}</h5>
                    </Col>
                  </Row>

                  {/* รายการสินค้าของร้านนี้ */}
                  {groupedItems[storeId].map((item, itemIndex) => (
                    <Row key={itemIndex} className="mb-3">
                      <Col sm={2}>
                        {/* แสดงรูปสินค้า */}
                        <Image
                          src={item.images?.[0]?.image_url || placeholderImage}
                          rounded
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = placeholderImage; }}
                        />
                      </Col>
                      <Col sm={10}>
                        {/* แสดงชื่อสินค้า */}
                        <h4>{item.name}</h4>
                        <Row>
                          <Col sm={8}>
                            {/* แสดงราคาและจำนวน */}
                            <strong style={{ fontSize: '1.2rem' }}>฿{item.price} x {item.quantity}</strong>
                          </Col>
                          <Col sm={4} className="text-end">
                            {/* แสดงราคารวม */}
                            <strong style={{ fontSize: '1.2rem' }}>฿{item.price * item.quantity}</strong>
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
              
      {/* ส่วนเลือกส่วนลด */}
      <Row className="mb-4">
        <Col>
          <Card>
          <Card.Body>
              <h3>เลือกส่วนลด</h3>
              <Form.Group controlId="discountSelect">
                <Form.Label>เลือกรหัสส่วนลด (%)</Form.Label>
                <Form.Control 
                  as="select" 
                  value={discountPercentage} 
                  onChange={handleDiscountChange}>
                  <option value={3} disabled={!isDiscountApplicable(3)}>3% (ทุกยอดสั่งซื้อ)</option>
                  <option value={5} disabled={!isDiscountApplicable(5)}>5% (เมื่อยอดเกิน 1,500 บาท)</option>
                  <option value={10} disabled={!isDiscountApplicable(10)}>10% (เมื่อยอดเกิน 4,000 บาท)</option>
                </Form.Control>
                {!isDiscountApplicable(discountPercentage) && (
                  <p className="text-danger mt-2">ยอดสั่งซื้อไม่ถึงเกณฑ์ในการใช้ส่วนลด {discountPercentage}%</p>
                )}
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
                
      {/* ส่วนสรุปยอดการชำระเงิน */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h3>สรุปยอดการชำระเงิน</h3>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={8}>ยอดรวมสินค้า</Col>
                <Col sm={4} className="text-end">฿{subtotal}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={8}>ส่วนลด ({discountPercentage}%)</Col>
                <Col sm={4} className="text-end">฿{discountAmount.toFixed(2)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={8}>ค่าจัดส่ง</Col>
                <Col sm={4} className="text-end">฿{totalShipping}</Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col sm={8}><strong>ยอดชำระทั้งหมด</strong></Col>
                <Col sm={4} className="text-end"><strong>฿{grandTotal.toFixed(2)}</strong></Col>
              </Row>
              <Card>
            <Card.Body>
              <h3>เลือกวิธีการชำระเงิน</h3>
              <Form>
                <Form.Check 
                  type="radio" 
                  label="บัตรเครดิต" 
                  name="paymentMethod" 
                  value="creditCard" 
                  checked={paymentMethod === 'creditCard'} 
                  onChange={handlePaymentMethodChange} 
                />
                <Form.Check 
                  type="radio" 
                  label="โอนเงินผ่านธนาคาร" 
                  name="paymentMethod" 
                  value="bankTransfer" 
                  checked={paymentMethod === 'bankTransfer'} 
                  onChange={handlePaymentMethodChange} 
                />
                <Form.Check 
                  type="radio" 
                  label="เก็บเงินปลายทาง" 
                  name="paymentMethod" 
                  value="cashOnDelivery" 
                  checked={paymentMethod === 'cashOnDelivery'} 
                  onChange={handlePaymentMethodChange} 
                />
              </Form>
            </Card.Body>
          </Card>
          <Button 
  variant="primary" 
  onClick={handleConfirmPayment} 
  disabled={!isAddressValid()}
>
  ยืนยันการชำระเงิน
</Button>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
