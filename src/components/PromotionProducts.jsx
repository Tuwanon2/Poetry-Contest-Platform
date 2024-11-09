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

const PromotionProducts = () => {
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
                <Card className="product-card mb-4 shadow-sm border-light rounded">
  <Link to={`/product/${product.id}`}>
    <Card.Img 
      variant="top" 
      src={primaryImage || placeholderImage} 
      alt={product.name} 
      style={{ height: '300px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = placeholderImage;
      }}
    />
  </Link>
  <Card.Body className="d-flex flex-column">
    <Card.Title className="text-truncate" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
      {product.name}
    </Card.Title>
    <div className="d-flex justify-content-between align-items-center">
      <Card.Text style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#28a745' }}>
        ฿{product.price}
      </Card.Text>
      <div className="d-flex align-items-center">
        {/* กรอบโลโก้ร้านทำให้เป็นปุ่มที่สามารถกดได้ */}
        <div 
          onClick={() => window.location.href = `/seller/${product.seller_id}`} // กดแล้วไปยังหน้าโปรไฟล์ร้าน
          className="d-flex align-items-center clickable-logo-card"
          style={{
            border: '2px solid #007bff', 
            borderRadius: '5px', 
            padding: '5px 10px', 
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            transition: 'all 0.3s ease',  // เพิ่ม transition สำหรับการเคลื่อนไหว
          }}
        >
          <img
            src={getSellerImage(product.seller_id)}
            alt={getSellerName(product.seller_id)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '8px',
              border: '2px solid #fff',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          />
          <small style={{
            fontSize: '0.9rem', 
            color: '#007bff', 
            fontWeight: 'bold', 
            textDecoration: 'none',
            cursor: 'pointer',
          }}>
            {getSellerName(product.seller_id)}
          </small>
        </div>
      </div>
    </div>
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

export default PromotionProducts;
