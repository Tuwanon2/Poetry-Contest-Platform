import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // เพิ่มการนำเข้า useNavigate


const Payment = () => {
  const navigate = useNavigate();  // สร้างตัวแปร navigate ด้วย useNavigate
  
  const [order, setOrder] = useState({
    items: [],
    total: 0
  });
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [discountPercentage, setDiscountPercentage] = useState(3); // Default 3% discount
  const [subtotal, setSubtotal] = useState(0);  // คำนวณยอดรวมก่อนหักส่วนลด

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

  const placeholderImage = 'https://via.placeholder.com/100'; // กำหนดรูป Placeholderสำหรับสินค้าที่ไม่มีรูป

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem('cart'));
    if (storedOrder) {
      const total = storedOrder.reduce((acc, product) => acc + product.price * (product.quantity || 1), 0);
      setOrder({ items: storedOrder, total: total });
      setSubtotal(total);
    }
  
    const storedAddress = JSON.parse(localStorage.getItem('address'));
    if (storedAddress) {
      console.log(storedAddress); // ตรวจสอบว่าได้ข้อมูลถูกต้องจาก localStorage หรือไม่
      setAddress(storedAddress);
    }
  }, []);
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleConfirmPayment = () => {
    localStorage.removeItem('cart');
    alert('การชำระเงินเสร็จสมบูรณ์');
    navigate('/');
  };

  const handleNavigateToChooseAddress = () => {
    navigate('/EditAddress'); // นำทางไปหน้า ChooseAddress
  };

  // ฟังก์ชันเพื่อจัดกลุ่มสินค้าแต่ละร้าน
  const groupItemsByStore = (items) => {
    return items.reduce((stores, item) => {
      const store = item.seller_id || 'ไม่ระบุชื่อร้าน'; // ใช้ seller_id แทน storeName
      if (!stores[store]) {
        stores[store] = [];
      }
      stores[store].push(item);
      return stores;
    }, {});
  };
      
  



  const applyDiscount = (percentage) => {
    if (isDiscountApplicable(percentage)) {
      setDiscountPercentage(percentage);
    } else {
      alert(`ส่วนลด ${percentage}% ไม่สามารถใช้ได้`);
    }
  };
    const calculateGrandTotal = () => {
        const discount = (subtotal * discountPercentage) / 100;
        const shippingCosts = Object.keys(groupedItems).map(storeId => calculateShippingCost(groupedItems[storeId]));
        const totalShipping = shippingCosts.reduce((acc, cost) => acc + cost, 0);
        const grandTotal = subtotal - discount + totalShipping;
        return grandTotal;
      };

    
  // คำนวณค่าส่งสำหรับแต่ละร้าน
  const calculateShippingCost = (storeItems) => {
    return storeItems.length > 0 ? 45 : 0; // ร้านละ 45 บาท
  };

  const groupedItems = groupItemsByStore(order.items);

  // คำนวณค่าส่งรวมและยอดรวมทั้งหมด
  const shippingCosts = Object.keys(groupedItems).map(storeId => calculateShippingCost(groupedItems[storeId]));
  const totalShipping = shippingCosts.reduce((acc, cost) => acc + cost, 0);
  const grandTotal = order.total + totalShipping;

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
        {address.firstName && address.lastName && address.phone ? (
  <div>
    {/* ชื่อ-นามสกุล │ เบอร์โทรศัพท์ */}
    <p>
      {address.firstName} {address.lastName} │ {address.phone}
    </p>

    {/* ที่อยู่ */}
    <p>
    {address.company && address.company + ','} {address.address && address.address + ','} 
    {address.subDistrict && address.subDistrict + ','} {address.street && address.street + ','} <br />
    {address.district && address.district + ','} {address.province && address.province + ','} 
    {address.country && address.country} {address.postalCode && address.postalCode}
</p>

  </div>
) : (
  <p>กรุณากรอกที่อยู่ในการจัดส่ง</p> // กรณีไม่มีข้อมูล
)}


        {/* ปุ่มเลือกที่อยู่ */}
        <Button 
          variant="primary" 
          onClick={handleNavigateToChooseAddress} 
          style={{ 
            position: 'absolute', 
            bottom: '20px',
            right: '10px', 
            fontSize: '18px', 
            padding: '10px 20px', 
            borderRadius: '5px', 
            width: 'auto', 
            height: 'auto',
            backgroundColor: '#007bff', 
            border: 'none', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          }}
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
      <Card>
        
        <div className="discount-options" style={{ marginBottom: '20px' }}>
                <h3>เลือกส่วนลด</h3>
                {[3, 5, 10].map((percentage) => (
                    <div key={percentage} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Button
                            variant={isDiscountApplicable(percentage) ? 'primary' : 'danger'}
                            onClick={() => applyDiscount(percentage)}
                            disabled={!isDiscountApplicable(percentage)}
                        >
                            ใช้โค้ดลด {percentage}%
                        </Button>
                        <Button
                            variant="info"
                            style={{ marginLeft: '10px' }}
                            onClick={() => alert(`โค้ดลด ${percentage}% ${percentage === 5 ? 'ใช้ได้เมื่อเลือกซื้อสินค้าครบ 1500 บาท' : percentage === 10 ? 'ใช้ได้เมื่อเลือกซื้อสินค้าครบ 4000 บาท' : 'ใช้ได้ทุกยอดการสั่งซื้อ ไม่มีขั้นต่ำ'}`)}
                        >
                            เงื่อนไข
                        </Button>
                    </div>
                ))}
            </div>
      </Card>
      <Row>
                <Col sm={8}>
                  <strong style={{ fontSize: '1.5rem' }}>รวม</strong>
                </Col>
                <Col sm={4} className="text-end">
                  <strong style={{ fontSize: '1.5rem' }}>฿{order.total}</strong>
                </Col>
              </Row>
              <Row>
                <Col sm={8}>
                  <strong style={{ fontSize: '1.5rem' }}>ค่าจัดส่ง</strong>
                </Col>
                <Col sm={4} className="text-end">
                  <strong style={{ fontSize: '1.5rem' }}>฿{totalShipping}</strong>
                </Col>
              </Row>
              <Row>
              <Col sm={8}>
                  <strong style={{ fontSize: '1.5rem' }}>ส่วนลด {discountPercentage}%</strong>
                </Col>
                
              <Col sm={4} className="text-end">
                  <strong style={{ fontSize: '1.5rem' }}>฿{order.total-calculateGrandTotal()}</strong>
                </Col></Row>
              <Row>
    <Col sm={8}>
        <strong style={{ fontSize: '1.5rem' }}>ยอดรวมทั้งหมด</strong>
    </Col>
    <Col sm={4} className="text-end">
        <strong style={{ fontSize: '1.5rem' }}>฿{calculateGrandTotal()}</strong>
    </Col>
</Row>

      {/* ส่วนแสดงยอดรวมและค่าส่ง */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              

              {/* ส่วนการเลือกวิธีการชำระเงิน */}
              <div className="mb-3">
                <h4>วิธีการชำระเงิน</h4>
                <Form.Check
                  type="radio"
                  label="บัตรเครดิต"
                  value="creditCard"
                  checked={paymentMethod === 'creditCard'}
                  onChange={handlePaymentMethodChange}
                />
                <Form.Check
                  type="radio"
                  label="พร้อมเพย์"
                  value="promptpay"
                  checked={paymentMethod === 'promptpay'}
                  onChange={handlePaymentMethodChange}
                />
                <Form.Check
                    type="radio"
                    label="โอนผ่านธนาคาร"
                    value="bankTransfer"
                    checked={paymentMethod === 'bankTransfer'}
                    onChange={handlePaymentMethodChange}
                /> 
              </div>

              {/* ปุ่มยืนยันการชำระเงิน */}
              <Button 
                variant="success" 
                onClick={handleConfirmPayment} 
                style={{ padding: '10px 20px', fontSize: '18px', width: '100%' }}
            >
                ยืนยันชำระเงิน
            </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
