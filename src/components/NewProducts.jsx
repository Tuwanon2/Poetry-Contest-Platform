import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';




// ฟังก์ชันสำหรับดึงข้อมูลชื่อผู้ขาย
const getSellerImage = (sellerId) => {
  const images = {
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': '/assets/images/SIAM_BOARDGAME.jpg',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': '/assets/images/Lanlalen.jpg',
    '940256ba-a9de-4aa9-bad8-604468cb6af3': '/assets/images/TIME_TO_PLAY.jpg',
    '494d4f06-225c-463e-bd8a-6c9caabc1fc4': '/assets/images/Towertactic.jpg',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': '/assets/images/DiceCUP.jpg',
  };
  return images[sellerId] || '/assets/default_image.png'; // ใช้ภาพดีฟอลต์หากไม่มี
};

// ฟังก์ชันสำหรับดึงข้อมูลชื่อผู้ขาย
const getSellerName = (sellerId) => {
  const sellerNames = {
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': 'SIAM BOARDGAME',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': 'Lanlalen',
    '940256ba-a9de-4aa9-bad8-604468cb6af3': 'TIME TO PLAY',
    '494d4f06-225c-463e-bd8a-6c9caabc1fc4': 'Towertactic',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': 'DiceCUP',
  };
  return sellerNames[sellerId] || 'Unknown'; // ใช้ชื่อผู้ขายเป็น 'Unknown' หากไม่พบ
};

const NewProducts = () => {
  const [product, setProducts] = useState([]);
  const productRefs = useRef([]);
  const placeholderImage = '../assets/images/Splendor.jpg';
  const [quantity, setQuantity] = useState(1); // กำหนดเริ่มต้นเป็น 1


  
  // ฟังก์ชันสำหรับเพิ่มสินค้าลงตะกร้า
  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = storedCart.find((item) => item.id === product.id);  // ใช้ product ที่ส่งมา
  
    if (existingProduct) {
      existingProduct.quantity += quantity;
      localStorage.setItem('cart', JSON.stringify(storedCart));
    } else {
      storedCart.push({ ...product, quantity });
      localStorage.setItem('cart', JSON.stringify(storedCart));
    }
  
    window.dispatchEvent(new Event('cart-updated'));
  };
  


  useEffect(() => {
    axios
      .get('/api/v1/products?sort=created_at&order=desc&limit=5')
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
  }, [product]);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">สินค้ามาใหม่</h1>
      <div className="horizontal-scroll">
        <Row className="flex-nowrap">
          {product.length > 0 ? (
            product.map((product, index) => {
              const primaryImage = product.images.find((img) => img.is_primary)?.image_url;

              return (
                <Col md={3} key={product.id}>
                  <Card className="product-card mb-4 shadow-sm border-light rounded product fade-in">
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
                    <Card.Body className="d-flex flex-column fade-in">
                      <Card.Title 
                        className="text-truncate" 
                        style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#CC0066' }}
                      >
                        {product.name}
                      </Card.Title>
                      <div className="d-flex justify-content-between align-items-center ">
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
                            <span style={{
    fontSize: '0.9rem', 
    fontWeight: 'bold', 
    color: 'white', 
    cursor: 'pointer',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  }}>
    ร้านค้า>>
  </span>
                          </Link>
                          
                        </div>
                      </div>
                      <Button 
                        onClick={() => addToCart(product)}
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

export default NewProducts;
