import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate
import '../App.css';

const placeholderImage = '/assets/images/placeholder.jpg';

const Deliverys = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState([]);
  const navigate = useNavigate(); // กำหนด navigate

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

  const statusMessages = [
    "สั่งซื้อสินค้าสำเร็จ",
    "ผู้ส่งกำลังเตรียมพัสดุ",
    "คนขับกำลังเข้ารับพัสดุของคุณ",
    "บริษัทขนส่งเข้ารับพัสดุเรียบร้อยแล้ว",
    "พัสดุถึงศูนย์คัดแยกสินค้า",
    "พัสดุออกจากศูนย์คัดแยกสินค้า",
    "พัสดุถึงสาขาปลายทาง",
    "พัสดุถูกส่งมอบให้พนักงานขนส่ง",
    "พัสดุอยู่ระหว่างการนำส่ง คาดว่าจะถึงปลายทางภายใน 20:00 น. หรืออาจนำส่งวันถัดไป ในกรณีที่ไม่สามารถนำส่งสำเร็จ",
    "พัสดุถูกจัดส่งสำเร็จแล้ว"
  ];

  useEffect(() => {
    const storedOrderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    if (storedOrderDetails && !orderDetails) {
      setOrderDetails(storedOrderDetails);
      setShippingAddress(storedOrderDetails.address);
    }
  }, []);

  useEffect(() => {
    const storedStatus = JSON.parse(localStorage.getItem('orderStatus'));
    let currentIndex = storedStatus ? storedStatus.currentIndex || 0 : 0;
  
    if (storedStatus) {
      setStatusUpdates(storedStatus.statusMessages); // ฟื้นฟูสถานะจาก localStorage
    }
  
    if (currentIndex >= statusMessages.length) {
      return;
    }
  
    const interval = setInterval(() => {
      const now = new Date().toLocaleString('th-TH');
      const newStatus = { message: statusMessages[currentIndex], time: now };
  
      // ตรวจสอบว่าเป็นสถานะใหม่หรือไม่
      setStatusUpdates(prevUpdates => {
        // ตรวจสอบสถานะล่าสุดว่าซ้ำกับสถานะใหม่หรือไม่
        if (prevUpdates.length > 0 && prevUpdates[0].message === newStatus.message) {
          return prevUpdates; // ถ้าซ้ำก็ไม่อัปเดต
        }
  
        // ถ้าไม่ซ้ำก็อัปเดตสถานะ
        const updatedStatus = [...prevUpdates, newStatus]; // เก็บสถานะใหม่ที่ท้ายสุด
        localStorage.setItem('orderStatus', JSON.stringify({
          statusMessages: updatedStatus,
          currentIndex: currentIndex + 1
        }));
        return updatedStatus;
      });
  
      currentIndex += 1;
  
      if (currentIndex >= statusMessages.length) {
        clearInterval(interval);
      }
    }, 10000); // อัปเดตทุกๆ 30 วินาที
  
    return () => clearInterval(interval);
  }, []);
  
  

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
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

      

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h3>สถานะการจัดส่ง</h3>
            </Card.Header>
            <Card.Body>
  {statusUpdates.slice().reverse().map((update, index) => (
    <Row key={index} className="mb-2">
      <Col sm={8}>{update.message}</Col>
      <Col sm={4} className="text-end">{update.time}</Col>
    </Row>
  ))}
</Card.Body>

          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Deliverys;
