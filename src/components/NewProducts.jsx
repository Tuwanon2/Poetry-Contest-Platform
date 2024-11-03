import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NewProducts = () => {
  const [products, setProducts] = useState([]);

  // ใช้ URL ของรูปภาพ placeholder แทนการ import
  const placeholderImage = '../assets/images/Splendor.jpg';

  useEffect(() => {
    axios
      .get('/api/v1/products?sort=created_at&order=desc&limit=4')
      .then((response) => {
        setProducts(response.data.items);
      })
      .catch((error) => {
        console.error('Error fetching the products:', error);
      });
  }, []);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">สินค้ามาใหม่</h2>
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

export default NewProducts;
