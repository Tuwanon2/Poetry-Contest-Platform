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

  const placeholderImage = 'path/to/placeholder-image.jpg'; // แทนที่ด้วย URL ของ placeholder image

  useEffect(() => {
    axios
      .get('/api/v1/products?sort=created_at&order=desc&limit=6')
      .then((response) => {
        setProducts(response.data.items); // ทำให้ sure ว่า response.data.items มีข้อมูลที่ต้องการ
      })
      .catch((error) => {
        console.error('Error fetching the products:', error);
      });
  }, []);

  const categories = [
    'บอร์ดเกมทั้งหมด',
    'บอร์ดเกมเดี่ยว',
    'บอร์ดเกมเล่นหลายคน',
    'บอร์ดเกมปาร์ตี้',
    'บอร์ดเกมกลยุทธ์',
    'บอร์ดเกมเด็กและครอบครัว',
    'บอร์ดเกมแนวสงคราม',
    'บอร์ดเกม co-op',
    'บอร์ดเกมgateway',
    'บอร์ดเกมบริหารทรัพยากร'
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const filteredProducts = products
  .filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    product.price >= minPrice &&
    (maxPrice ? product.price <= maxPrice : true) &&
    (selectedCategory && selectedCategory !== 'บอร์ดเกมทั้งหมด' ? product.category === selectedCategory : true)
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
              variant={selectedCategory === category ? 'primary' : 'outline-primary'}
              onClick={() => handleCategoryClick(category)}
              className="w-100"
            >
              {category}
            </Button>
          </Col>
        ))}
      </Row>

      {/* ตัวกรองและการค้นหา */}
      <h3 className="text-center mt-5">บอร์ดเกม ...</h3>
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
        <Row>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
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
    </Container>
  );
};

export default Products;
