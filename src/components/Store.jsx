import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const placeholderImage = '/assets/images/Splendor.jpg';

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
  }, []);

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
          filteredProducts.map((product) => {
            const primaryImage = product.images.find((img) => img.is_primary)?.image_url;

            return (
              <Col md={4} key={product.id}> {/* 4 columns layout */}
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
          <h5 className="text-center text-muted mt-5">ไม่มีสินค้าที่ตรงกับการค้นหาของคุณ</h5>
        )}
      </Row>
    </Container>
  );
};

export default Store;
