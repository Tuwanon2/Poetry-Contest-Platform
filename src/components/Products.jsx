import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [selectedCategory, setSelectedCategory] = useState('');

  const placeholderImage = '../assets/images/Splendor.jpg';

  const categories = [
    { name: 'บอร์ดเกมทั้งหมด', icon: '/assets/images/AllBoardGame.png', category_id: '' },
    { name: 'บอร์ดเกมเดี่ยว', icon: '/assets/images/solo_BoardGame.png', category_id: 1 },
    { name: 'บอร์ดเกมเล่นหลายคน', icon: '/assets/images/Multi_BoardGame.png', category_id: 2 },
    { name: 'บอร์ดเกมปาร์ตี้', icon: '/assets/images/party_BoardGame.png', category_id: 3 },
    { name: 'บอร์ดเกมกลยุทธ์', icon: '/assets/images/strategy_BoardGame.png', category_id: 4 },
    { name: 'บอร์ดเกมเด็กและครอบครัว', icon: '/assets/images/Family_BoardGame.png', category_id: 5 },
    { name: 'บอร์ดเกมแนวสงคราม', icon: '/assets/images/War_BoardGame.png', category_id: 6 },
    { name: 'บอร์ดเกม co-op', icon: '/assets/images/Co-op_BoardGame.png', category_id: 7 },
    { name: 'บอร์ดเกม gateway', icon: '/assets/images/Gateway_BoardGame.png', category_id: 8 },
    { name: 'บอร์ดเกมบริหารทรัพยากร', icon: '/assets/images/Management_BoardGame.png', category_id: 9 }
  ];

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
      '494d4f06-225c-463e-bd8a-6c9caabc1fc4': '/assets/images/Towertactic.png',
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': '/assets/images/DiceCUP.jpg',
    };
    return images[sellerId] || '/assets/default_image.png';
  };

  useEffect(() => {
    axios
      .get('/api/v1/products?sort=created_at&order=desc')
      .then((response) => {
        const filteredProducts = response.data.items.filter(product => product.seller_id === sellerId);
        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error('Error fetching the products:', error);
      });
  }, [sellerId]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const filteredProducts = products
    .filter((product) => {
      const skuEndsWithCategoryId =
        selectedCategory && selectedCategory.category_id
          ? product.sku.endsWith(selectedCategory.category_id.toString())
          : true;

      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.price >= minPrice &&
        (maxPrice ? product.price <= maxPrice : true) &&
        skuEndsWithCategoryId
      );
    })
    .sort((a, b) => (sortOrder === 'price-asc' ? a.price - b.price : b.price - a.price));

  return (
    <Container>
      {/* Seller Section */}
      <Container fluid style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '2rem' }}>
        <h2 className="text-center">{sellerNames[sellerId]}</h2>
        <div className="text-center mb-4">
        <img
  src={getSellerImage(sellerId)}
  alt={sellerNames[sellerId]}
  style={{
    width: '150px',  // Increased size
    height: '150px', // Increased size
    borderRadius: '50%',
    border: '3px solid white',
  }}
/>
        
        </div>
      </Container>

      {/* Category Selection */}
      <h2 className="text-center mt-5">หมวดหมู่</h2>
      <Row className="text-center my-4">
        {categories.map((category, index) => (
          <Col key={index} xs={6} md={4} className="mb-3">
            <Button
              variant={selectedCategory === category ? 'primary' : 'outline-primary'}
              className={`category-button w-100 d-flex align-items-center justify-content-center text-white position-relative ${selectedCategory === category ? 'selected' : 'default'}`}
              onClick={() => handleCategoryClick(category)}
              style={{
                backgroundColor: selectedCategory === category ? '#8BD2EC' : 'transparent',
                height: '100px',
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

      {/* Search, Price Range, and Sort Options */}
      <Form className="my-4">
        <Row>
          <Col md={4} className="mb-3">
            <Form.Control
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={3} className="mb-3">
            <Form.Control
              type="number"
              placeholder="ราคาขั้นต่ำ"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
          </Col>
          <Col md={3} className="mb-3">
            <Form.Control
              type="number"
              placeholder="ราคาสูงสุด"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </Col>
          <Col md={2} className="mb-3">
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="price-asc">ราคาน้อยไปมาก</option>
              <option value="price-desc">ราคามากไปน้อย</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* Product Listings */}
      <Container className="my-5">
        <h2 className="text-center mb-4">สินค้าของร้าน</h2>
        <Row>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const primaryImage = product.images.find((img) => img.is_primary)?.image_url;

              return (
                <Col md={3} key={product.id}>
                  <Card className="product-card mb-4 shadow-sm border-light rounded">
                    <Link to={`/product/${product.id}`}>
                      <Card.Img
                        variant="top"
                        src={primaryImage || placeholderImage}
                        alt={product.name}
                        style={{ height: '300px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = placeholderImage; }}
                      />
                    </Link>
                    <Card.Body>
                      <Card.Title className="text-truncate" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        {product.name}
                      </Card.Title>
                      <Card.Text style={{ fontSize: '1.1rem', color: '#28a745' }}>
                        ฿{product.price}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col md={12}>
              <p className="text-center text-muted">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
            </Col>
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default Products;
