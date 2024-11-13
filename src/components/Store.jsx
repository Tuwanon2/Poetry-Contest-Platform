import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css'; 

const placeholderImage = '/assets/images/Splendor.jpg';

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
  const sellerNames = {
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': 'SIAM BOARDGAME',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': 'Lanlalen',
    '940256ba-a9de-4aa9-bad8-604468cb6af3': 'TIME TO PLAY',
    '494d4f06-225c-463e-bd8a-6c9caabc1fc4': 'Towertactic',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': 'DiceCUP',
  };
  return sellerNames[sellerId] || 'Unknown Seller';
};

const Store = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('price-asc'); // For sorting by price
  const productRefs = useRef([]);

  useEffect(() => {
    // Fetch products (replace with your actual API endpoint)
    axios
      .get('/api/v1/products?sort=created_at&order=desc')
      .then((response) => {
        setProducts(response.data.items);
      })
      .catch((error) => {
        console.error('Error fetching the products:', error);
      });
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('fade-in'); // เพิ่มคลาส fade-in เมื่อสินค้าปรากฏในมุมมอง
              observer.unobserve(entry.target); // หยุดสังเกตการณ์หลังจากแสดงผลแล้ว
            }
          });
        },
        { threshold: 0.1 }
      );
  
      // สังเกตการณ์สินค้าทุกตัว
      productRefs.current.forEach((productRef) => {
        if (productRef) {
          observer.observe(productRef);
        }
      });
  
      // ลบ observer เมื่อคอมโพเนนต์ถูกถอดออก
      return () => observer.disconnect();
    }, [products]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(Number(e.target.value));
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(Number(e.target.value) || '');
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMinPrice = product.price >= minPrice;
      const matchesMaxPrice = maxPrice ? product.price <= maxPrice : true;
      return matchesSearchTerm && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">รวมบอร์ดเกม</h2>

      {/* Search and Filter Form */}
      <Form className="mb-4 d-flex justify-content-center">
        <Form.Group className="mx-2">
          <Form.Label>ค้นหาสินค้า</Form.Label>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Form.Group>
        <Form.Group className="mx-2">
          <Form.Label>ราคาเริ่มต้น</Form.Label>
          <Form.Control
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={handleMinPriceChange}
          />
        </Form.Group>
        <Form.Group className="mx-2">
          <Form.Label>ถึง</Form.Label>
          <Form.Control
            type="number"
            placeholder="สูงสุด"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </Form.Group>
        <Form.Group className="mx-2">
          <Form.Label>จัดเรียงตาม</Form.Label>
          <Form.Control as="select" value={sortOrder} onChange={handleSortChange}>
            <option value="price-asc">ราคาน้อย-มาก</option>
            <option value="price-desc">ราคามาก-น้อย</option>
          </Form.Control>
        </Form.Group>
      </Form>

      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => {
            const primaryImage = product.images.find((img) => img.is_primary)?.image_url;

            return (
              <Col md={3} key={product.id}> {/* 4 columns layout */}
                <Card className="product-card mb-4 shadow-sm border-light rounded product" ref={(el) => (productRefs.current[index] = el)} >
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
  className="button-57 d-flex align-items-center clickable-logo-card "
  style={{
    padding: '5px 15px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: '12px',  // Rounded corners for the link
    overflow: 'hidden',    // Ensures the image fits within the rounded container
  }}
>
  <img
    src={getSellerImage(product.seller_id)}
    alt={getSellerName(product.seller_id)}
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',  // Make the image circular
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
  
  {/* Additional text that will appear on hover */}
  <span className="hover-text" style={{
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
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
    transform: 'translate(-50%, -50%)',
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

export default Store;
