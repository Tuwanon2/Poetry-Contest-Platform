import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
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
  const [cart, setCart] = useState([]);  // สถานะของตะกร้า
  const productRefs = useRef([]);
  const placeholderImage = '../assets/images/Splendor.jpg';

  // ฟังก์ชันสำหรับเพิ่มสินค้าลงตะกร้า
  const addToCart = (productId) => {
    setCart((prevCart) => {
        const existingProduct = prevCart.find(item => item.id === productId);
        if (existingProduct) {
            return prevCart; // ถ้ามีสินค้าอยู่แล้วไม่ต้องเพิ่ม
        }
        const productToAdd = products.find(product => product.id === productId);
        const updatedCart = [...prevCart, productToAdd];
        
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // บันทึกตะกร้าลง localStorage
        return updatedCart;
    });
    console.log(`เพิ่มสินค้า ID: ${productId} ลงตะกร้า`);
};


  useEffect(() => {
    axios
    .get('/api/v1/products?sort=name&order=asc,desc&limit=5')
      .then((response) => {
        const filteredProducts = response.data.items.filter(
          (product) => product.product_type === 'preorder'
        );
        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:', error);
      });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    productRefs.current.forEach((productRef) => {
      if (productRef) {
        observer.observe(productRef);
      }
    });

    return () => observer.disconnect();
  }, [products]);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">สินค้ายอดนิยม</h1>
      <div className="horizontal-scroll">
        <Row className="flex-nowrap">
          {products.length > 0 ? (
            products.map((product, index) => {
              const primaryImage = product.images.find((img) => img.is_primary)?.image_url;

              return (
                <Col md={3} key={product.id}>
                  <Card className="product-card mb-4 shadow-sm border-light rounded product">
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
                          <Link 
                            to={`/seller/${product.seller_id}`}
                            className="button-57 d-flex align-items-center clickable-logo-card"
                            style={{
                              padding: '5px 15px',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
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
                          </Link>
                        </div>
                      </div>
                      <Button 
                        onClick={() => addToCart(product.id)}
                        variant="outline-primary"
                        className="mt-2"
                      >
                        เพิ่มลงตะกร้า
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <h5 className="text-center text-muted mt-5">ไม่มีสินค้าที่ตรงกับการค้นหาของคุณ</h5>
          )}
        </Row>
      </div>
    </Container>
  );
};

export default PopularProducts;
