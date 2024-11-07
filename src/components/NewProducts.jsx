import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const NewProducts = () => {
  const [products, setProducts] = useState([]);

  const placeholderImage = '../assets/images/Splendor.jpg';

  useEffect(() => {
    axios
      .get('/api/v1/products?sort=created_at&order=desc&limit=4')
      .then((response) => {
        // กรองสินค้าที่มี product_type เป็น "preorder"
        const filteredProducts = response.data.items.filter(
          (product) => product.product_type === 'preorder'
        );
        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error('Error fetching the products:', error);
      });
  }, []);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">สินค้ามาใหม่ (Preorder)</h2>
      <Row>
        {products.length > 0 ? (
          products.map((product) => {
            const primaryImage = product.images.find((img) => img.is_primary)?.image_url;

            console.log("Primary Image URL:", primaryImage);

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
