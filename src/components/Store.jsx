import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'

const Store = () => {
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
      '494d4f06-225c-463e-bd8a-6c9caabc1fc4': '/assets/images/Towertactic.jpg',
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': '/assets/images/DiceCUP.jpg',
    };
    return images[sellerId] || '/assets/default_image.png';
  };
  
  const getSellerName = (sellerId) => {
    return sellerNames[sellerId] || 'Unknown';
  };


  useEffect(() => {
    axios
      .get('/api/v1/products?sort=created_at&order=desc')
      .then((response) => {
        console.log('API Response:', response.data);
        setProducts(response.data.items || []);
      })
      .catch((error) => {
        console.error('Error fetching the products:', error);
      });
  }, [sellerId]); // ฟังก์ชันสำหรับเพิ่มสินค้าลงตะกร้า
  const [quantity, setQuantity] = useState(1);

  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = storedCart.find((item) => item.id === product.id);
  
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      storedCart.push({ ...product, quantity });
    }
  
    localStorage.setItem('cart', JSON.stringify(storedCart));
    window.dispatchEvent(new Event('cart-updated'));
    console.log(`Added ${quantity} of ${product.name} to the cart.`);
  };
  
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

    <Container fluid style={{width: '100%', marginRight: '0%',right:  '0px',}}>
      
      
      <h2 className="text-center mb-4"></h2>
      <div className="container space" style={{ position: 'relative', marginLeft: '0%',  // Reduced the left margin
  padding: '20px',
  backgroundColor: '#fff', }}>
  

{/* Sidebar for Categories */}
<div className="sidebar " style={{
    display: 'block',
    position: 'sticky',  // ทำให้มันอยู่ในตำแหน่งที่กำหนดใน container
    top: '0px',           // ระยะห่างจากด้านบนของ container
    left: '0px', 
    right:  '0px',          // ระยะห่างจากด้านซ้ายของ container
    width: '250px',        // ความกว้าง
    backgroundColor: '#f8f9fa',
    padding: '10px',
              
  }}>
    <Row className="text-center my-4"  >
    <h2 className="text-center mt-5" >หมวดหมู่</h2>
      {categories.map((category, index) => (
        <Col key={index} xs={12} className="mb-3 display-fixed">
          <Button
            className={`category-button justify-content-center text-white position-relative ${selectedCategory === category ? 'selected' : 'default'} button-35`}
            onClick={() => handleCategoryClick(category)}
            style={{
              backgroundColor: selectedCategory === category ? '#8BD2EC' : 'transparent',
              height: '60px', // ขนาดคงที่
              width: '120%', // ขนาดคงที่เต็มความกว้าง
              borderRadius: '10px',
              border: '2px solid #CC0066',
              display: 'flex', // ใช้ Flexbox เพื่อจัดการเนื้อหาในปุ่ม
              alignItems: 'center', // จัดแนวกลางในแนวตั้ง
              justifyContent: 'center', // จัดแนวกลางในแนวนอน
              overflow: 'hidden', // ป้องกันเนื้อหาล้นออก
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'absolute',
                top: '50%',
                left: '50%',
                right:  '0px',
                transform: 'translate(-50%, -50%)',
                background: `url(${category.icon}) center/cover no-repeat`,
                border: 'none',
              }}
            />
            <span className="visually-hidden">{category.name}</span>
          </Button>
        </Col>
      ))}
    </Row>
  </div>


  {/* Main Content */}
<div className="content" style={{
  marginLeft: '20px', // เพิ่มระยะห่างทางซ้าย
  padding: '20px',
  backgroundColor: '#fff',
}}>
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
    <Row className="justify-content-end"> {/* ใช้ justify-content-end เพื่อเลื่อนสินค้าทางขวา */}
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => {
          const primaryImage = product.images.find((img) => img.is_primary)?.image_url;

          return (
            <Col md={4} lg={3} key={product.id}>
              <Card className="product-card mb-4 shadow-sm border-light fade-in" style={{
                height: 'auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
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
                          ร้านค้า >>
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
        <Col md={12}>
          <p className="text-center text-muted">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
        </Col>
      )}
    </Row>
  </Container>
</div>
  
        
  


</div>
    </Container>
  );
};

export default Store;
