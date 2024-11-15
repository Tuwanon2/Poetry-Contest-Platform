import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const placeholderImage = '/assets/images/placeholder.jpg';

const ToShipPage = () => {
  const [order, setOrder] = useState({
    items: [],
    total: 0
  });
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

  const getSellerName = (sellerId) => {
    return sellerNames[sellerId] || 'Unknown';
  };

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

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem('orderDetails')) || { items: [], total: 0 };
    setOrder(savedOrder);
  }, []);

  const groupedItems = groupItemsByStore(order.items);
  const totalItems = calculateTotalItems(order.items);
  const totalPrice = calculateTotalPrice(order.items);

  const handleUpdateStatusClick = () => {
    navigate('/Upstatus');  // Navigate to status update page
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs="auto">
          <button  className=" custom-fade-button" onClick={() => navigate('/Ship1')}>
            ที่ต้องจัดส่ง
          </button>
        </Col>
        <Col xs="auto">
          <span style={{ borderLeft: '2px solid black', height: '100%' }} />
          
        </Col>
        <Col xs="auto">
          <button className=" custom-fade-button" onClick={() => navigate('/Ship2')}>
            ประวัติการสั่งซื้อ
          </button>
        </Col>
      </Row>
      <Row className="mb-4" style={{marginTop:'10px'}}>
        <Col>
          <Card>
            <Card.Header>
              <h3>ที่ต้องจัดส่ง</h3>
            </Card.Header>
            <Card.Body className="d-flex flex-column">
              {/* Store items grouped by seller */}
              {Object.keys(groupedItems).map((storeId, index) => (
                <div key={index}>
                  {/* Store logo and name */}
                  <Row className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                    <Col sm={1} style={{ paddingLeft: '0' }}>
                      <Image
                        src={getSellerImage(storeId)}  // Fetch store logo
                        rounded
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col sm={11} style={{ paddingLeft: '10px' }}>
                      <h5>{getSellerName(storeId)}</h5>
                    </Col>
                  </Row>

                  {/* Store's product items */}
                  {groupedItems[storeId].map((item, itemIndex) => (
                    <Row key={itemIndex} className="mb-3">
                      <Col sm={2}>
                        <Image
                          src={item.images?.[0]?.image_url || placeholderImage}
                          rounded
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = placeholderImage; }}
                        />
                      </Col>
                      <Col sm={10}>
                        <h4>{item.name}</h4>
                        <Row>
                          <Col sm={8}>
                            <strong style={{ fontSize: '1.2rem' }}>฿{item.price} x {item.quantity}</strong>
                          </Col>
                          <Col sm={4} className="text-end">
                            <strong style={{ fontSize: '1.2rem' }}>฿{item.price * item.quantity}</strong>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                </div>
              ))}

              {/* Total items summary */}
              <Row className="mt-auto text-end">
                <Col>
                  <h5>สินค้ารวม {totalItems} รายการ: ฿{totalPrice}</h5>
                </Col>
              </Row>

              {/* Button to update status and estimated delivery */}
              <Row className="mt-3">
                <Col className="text-end">
                  <Button 
                    variant="outline-primary" 
                    style={{ display: 'block', width: '100%', fontSize: '1.3rem', padding: '12px', color: '#CC0066' ,backgroundColor:'white', border: '2px solid #CC0066' }} 
                    onClick={handleUpdateStatusClick}
                  >   
                    คาดว่าจะได้รับสินค้าภายใน 1-3 วัน
                    <br />
                    <span style={{ fontSize: '1.0rem', color: 'gray' }}>ตรวจสอบรายละเอียดและสถานะการสั่งซื้อที่นี่</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ToShipPage;
