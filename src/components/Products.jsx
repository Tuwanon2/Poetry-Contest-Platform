import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [selectedCategory, setSelectedCategory] = useState('');

  const placeholderImage = '../assets/images/Splendor.jpg'; // เปลี่ยนเป็น URL ของ placeholder ที่เหมาะสม

  useEffect(() => {
    axios
      .get('/api/v1/products?sort=created_at&order=desc') // ดึงสินค้าทั้งหมด
      .then((response) => {
        setProducts(response.data.items);
      })
      .catch((error) => {
        console.error('Error fetching the products:', error);
      });
  }, []);

  const categories = [
    { name: 'บอร์ดเกมทั้งหมด', icon: '/assets/images/AllBoardGame.png', category_id: '' },
    { name: 'บอร์ดเกมเดี่ยว', icon: 'assets/images/solo_BoardGame.png', category_id: 1 },
    { name: 'บอร์ดเกมเล่นหลายคน', icon: 'assets/images/Multi_BoardGame.png', category_id: 2 },
    { name: 'บอร์ดเกมปาร์ตี้', icon: 'assets/images/party_BoardGame.png', category_id: 3 },
    { name: 'บอร์ดเกมกลยุทธ์', icon: 'assets/images/strategy_BoardGame.png', category_id: 4 },
    { name: 'บอร์ดเกมเด็กและครอบครัว', icon: 'assets/images/Family_BoardGame.png', category_id: 5 },
    { name: 'บอร์ดเกมแนวสงคราม', icon: 'assets/images/War_BoardGame.png', category_id: 6 },
    { name: 'บอร์ดเกม co-op', icon: 'assets/images/Co-op_BoardGame.png', category_id: 7 },
    { name: 'บอร์ดเกม gateway', icon: 'assets/images/Gateway_BoardGame.png', category_id: 8 },
    { name: 'บอร์ดเกมบริหารทรัพยากร', icon: 'assets/images/Management_BoardGame.png', category_id: 9 }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.price >= minPrice &&
      (maxPrice ? product.price <= maxPrice : true) &&
      (selectedCategory && selectedCategory !== 'บอร์ดเกมทั้งหมด' ? product.category_id === selectedCategory.category_id : true)
    )
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return 0;
    });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <Container>
      {/* หมวดหมู่ */}
      <h2 className="text-center mt-5">หมวดหมู่</h2>
      <Row className="text-center my-4">
        {categories.map((category, index) => (
          <Col key={index} xs={6} md={4} className="mb-3">
            <Button 
              variant={selectedCategory === category.name ? 'primary' : 'outline-primary'}
              className={`category-button w-100 d-flex align-items-center justify-content-center text-white position-relative ${selectedCategory === category.name ? 'selected' : 'default'}`}
              onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
              style={{
                backgroundColor: selectedCategory === category.name ? '#8BD2EC' : 'transparent',
                height: '100px',
                transition: 'background-color 0.2s ease-in-out',
                borderRadius: '10px',
              }}
            >
              <div 
                style={{
                  width: '95%',
                  height: '90%',
                  borderRadius: '10px',
                  border: '2px solid white',
                  overflow: 'hidden',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: `url(${category.icon}) center/cover no-repeat`,
                }}
              />
              <span className="visually-hidden">{category.name}</span>
            </Button>
          </Col>
        ))}
      </Row>

      {/* แสดงหมวดหมู่ที่เลือก */}
      <h3 className="text-center mt-5">
        {selectedCategory ? `บอร์ดเกมในหมวดหมู่: ${selectedCategory.name}` : 'เลือกหมวดหมู่เพื่อเริ่มค้นหา'}
      </h3>

      {/* ตัวกรองและการค้นหา */}
      <Form onSubmit={handleSearch} className="d-flex justify-content-center my-4">
        <Form.Group className="mx-2">
          <Form.Label>ค้นหาสินค้า</Form.Label>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mx-2">
          <Form.Label>ราคาเริ่มต้น</Form.Label>
          <Form.Control
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
        </Form.Group>
        <Form.Group className="mx-2">
          <Form.Label>ถึง</Form.Label>
          <Form.Control
            type="number"
            placeholder="สูงสุด"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value) || '')}
          />
        </Form.Group>
        <Form.Group className="mx-2">
          <Form.Label>จัดเรียงสินค้าตาม</Form.Label>
          <Form.Control as="select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="price-asc">ราคาน้อย-มาก</option>
            <option value="price-desc">ราคามาก-น้อย</option>
          </Form.Control>
        </Form.Group>
      </Form>

      {/* สินค้า */}
      <Container className="my-5">
        <h2 className="text-center mb-4">สินค้าทั้งหมด</h2>
        <Row>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
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
                          e.target.onerror = null;
                          e.target.src = placeholderImage;
                        }} 
                      />
                    </Link>
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>
                        <strong>Price: ฿{product.price}</strong>
                      </Card.Text>
                      {/* เพิ่มการแสดง category_id */}
                      <Card.Text>
                        <small>Category ID: {product.category_id}</small>
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
    </Container>
  );
};

export default Products;
