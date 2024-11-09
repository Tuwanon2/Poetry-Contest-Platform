import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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

const Store = () => {
    const [products, setProducts] = useState([]);
  
    // ใช้ URL ของรูปภาพ placeholder แทนการ import
    const placeholderImage = '../assets/images/Splendor.jpg';
  
    useEffect(() => {
      // เรียก API สำหรับสินค้าโปรโมชั่นแทนสินค้ายอดฮิต
      axios
        .get('/api/v1/products?sort=name&order=desc&limit=4') // สมมติว่า sort=promotion ใช้สำหรับดึงสินค้าโปรโมชั่น
        .then((response) => {
          setProducts(response.data.items);
        })
        .catch((error) => {
          console.error('Error fetching the promotion products:', error);
        });
    }, []);
  
    return (
      <Container className="my-5">
        <h2 className="text-center mb-4">สินค้าโปรโมชั่น</h2>
        <Row>
          {products.length > 0 ? (
            products.map((product) => {
              // ใช้รูปภาพหลัก ถ้าไม่มีให้ใช้ placeholderImage
              const primaryImage = product.images.find((img) => img.is_primary)?.image_url;
  
              return (
                <Col md={3} key={product.id}> {/* เปลี่ยนเป็น md={3} เพื่อให้มี 4 คอลัมน์ */}
                  <Card className="mb-4">
                    <Link to={`/product/${product.id}`}>
                      <Card.Img 
                        variant="top" 
                        src={primaryImage || placeholderImage} 
                        alt={product.name} 
                        style={{ height: '300px', objectFit: 'cover' }} // ปรับขนาดและการแสดงผลของรูปภาพ
                        onError={(e) => {
                          e.target.onerror = null; // ป้องกันการเรียก onError ซ้ำ
                          e.target.src = placeholderImage; // เปลี่ยนไปใช้รูปภาพสำรอง
                        }} 
                      />
                    </Link>
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>
                        <strong>Price: ฿{product.price}</strong>
                      </Card.Text>
                      <Card.Text className="d-flex align-items-center">
    <Link to={`/seller/${product.seller_id}`} className="d-flex align-items-center">
      <img
        src={getSellerImage(product.seller_id)}
        alt={getSellerName(product.seller_id)}
        style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '8px' }}
      />
      <small style={{ fontWeight: 'bold', fontSize: '16px', color: '#007bff', textDecoration: 'underline' }}>
        {getSellerName(product.seller_id)}
      </small>
    </Link>
  </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <p className="text-center">ไม่พบสินค้าที่ค้นหา</p>
          )}
        </Row>
      </Container>
    );
  };
  
  export default Store;