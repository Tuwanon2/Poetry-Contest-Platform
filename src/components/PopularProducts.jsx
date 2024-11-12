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
    '940256ba-a9de-4aa9-bad8-604468cb6af3': '/assets/images/TIME_TO_PLAY.jpg',
    '494d4f06-225c-463e-bd8a-6c9caabc1fc4': '/assets/images/Towertactic.jpg',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': '/assets/images/DiceCUP.jpg',
  };
  return images[sellerId] || '/assets/default_image.png';
};

const getSellerName = (sellerId) => {
  return sellerNames[sellerId] || 'Unknown';
};

const PopularProducts = () => {
  const [products, setProducts] = useState([]);

  const placeholderImage = '../assets/images/Splendor.jpg';

  useEffect(() => {
    axios
      .get('/api/v1/products?sort=name&order=asc,desc&limit=4')
      .then((response) => {
        setProducts(response.data.items);
      })
      .catch((error) => {
        console.error('Error fetching the popular products:', error);
      });
  }, []);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">สินค้ายอดฮิต</h1>
      <Row>
        {products.length > 0 ? (
          products.map((product) => {
            const primaryImage = product.images.find((img) => img.is_primary)?.image_url;

            return (
              <Col md={3} key={product.id}>
                <Card className="product-card mb-4 shadow-sm border-light rounded">
                  <div 
                    style={{ 
                      height: '250px', 
                      width: '100%', 
                      overflow: 'hidden', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderTopLeftRadius: '10px', 
                      borderTopRightRadius: '10px' 
                    }}
                  >
                    <Link to={`/product/${product.id}`}>
                      <Card.Img 
                        variant="top" 
                        src={primaryImage || placeholderImage} 
                        alt={product.name} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          maxWidth: '100%', 
                          maxHeight: '250px',
                          objectFit: 'contain' 
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImage;
                        }}
                      />
                    </Link>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title 
                      className="text-truncate" 
                      style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#CC0066' }}
                    >
                      {product.name}
                    </Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                      <Card.Text 
                        style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#28a745' }}
                      >
                        ฿{product.price}
                      </Card.Text>
                      <div className="d-flex align-items-center clickable-logo-card">
                        {/* Seller logo and link to profile */}
                        <Link 
                          to={`/seller/${product.seller_id}`}
                          className="button-57 d-flex align-items-center clickable-logo-card"
                          style={{
                            padding: '5px 15px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative', // Positioning for the hover effect
                            borderRadius: '5px',
                            border: '2px solid #CC0066',
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
                              border: '2px solid #CC0066',
                            }}
                          />
                          <small 
                            style={{
                              fontSize: '0.9rem', 
                              fontWeight: 'bold', 
                              color: '#CC0066', 
                              cursor: 'pointer',
                            }}
                          >
                            {getSellerName(product.seller_id)}
                          </small>

                          {/* Centered hover text */}
                          <span className="hover-text" style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)', // Center perfectly
                            opacity: 0,
                            visibility: 'hidden',
                            color: '#CC0066',
                            fontSize: '0.8rem',
                            fontWeight: 'normal',
                            transition: 'opacity 0.3s ease, visibility 0.3s ease', 
                            whiteSpace: 'nowrap',
                          }}>
                            {getSellerName(product.seller_id)}'s Shop
                          </span>

                          <span style={{
                            fontSize: '0.9rem', 
                            fontWeight: 'bold', 
                            color: 'white', 
                            cursor: 'pointer',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)', // Center perfectly
                            textAlign: 'center',
                          }}>
                            ร้านค้า
                          </span>
                        </Link>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <h5 className="text-center text-muted mt-5">ไม่มีสินค้าที่ตรงกับการค้นหาของคุณ</h5>
        )}
      </Row>
    </Container>
  );
};

export default PopularProducts;
