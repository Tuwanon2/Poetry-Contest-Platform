import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PromotionProducts = () => {
  const [products, setProducts] = useState([]);

  // ใช้ URL ของรูปภาพ placeholder แทนการ import
  const placeholderImage = '../assets/images/Splendor.jpg';

  useEffect(() => {
    // เรียก API สำหรับสินค้าโปรโมชั่นแทนสินค้ายอดฮิต
    axios
      .get('/api/v1/products?sort=promotion&order=desc&limit=3') // สมมติว่า sort=promotion ใช้สำหรับดึงสินค้าโปรโมชั่น
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
              <Col md={4} key={product.id}>
                <Card className="mb-4">
                  <Link to={`/product/${product.id}`}>
                    <Card.Img 
                      variant="top" 
                      src={primaryImage || placeholderImage} 
                      alt={product.name} 
                      onError={(e) => {
                        e.target.onerror = null; // ป้องกันการเรียก onError ซ้ำ
                        e.target.src = placeholderImage; // เปลี่ยนไปใช้รูปภาพสำรอง
                      }} 
                    />
                  </Link>
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
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

export default PromotionProducts;
