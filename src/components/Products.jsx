import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'

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
      '494d4f06-225c-463e-bd8a-6c9caabc1fc4': '/assets/images/Towertactic.jpg',
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': '/assets/images/DiceCUP.jpg',
    };
    return images[sellerId] || '/assets/default_image.png';
  };

  const getBGSellerImage = (sellerId) => {
    const images = {
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': 'https://scontent.fbkk22-2.fna.fbcdn.net/v/t39.30808-6/422859534_925811232882066_2178207251347500122_n.png?stp=dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeFpoT1-o3ZBugbi1LptSYlo4TzEtm7pO8ThPMS2buk7xC17bCbztsUxsA_l2w8iMYtqNul0Dlub3Ndgyio7AuVX&_nc_ohc=DbYYm5DEGo8Q7kNvgHSJa6b&_nc_zt=23&_nc_ht=scontent.fbkk22-2.fna&_nc_gid=Aiv1zZIy0zZsRnLovqFeQyx&oh=00_AYA-vBzuEsMO-gaLIfQ_71h97LJ_Vx2yAmZUn7RHJ6ZAsg&oe=6739988D',
      'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': 'https://scontent.fbkk22-8.fna.fbcdn.net/v/t1.6435-9/66903773_2873489199359619_1737719127734222848_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeEp2lQnC5GjtCMqviReU-vHU94QNsuaqpxT3hA2y5qqnPjU2CqRUDcvVD08WxhJ78kjvAJFRLNT96Y_K2OcN1mH&_nc_ohc=0woLgdhtWAMQ7kNvgEKyGul&_nc_zt=23&_nc_ht=scontent.fbkk22-8.fna&_nc_gid=A5D4HA55TLcegFClB_1cKfO&oh=00_AYDe9_p8QuAVEJWk28Gibm00dO_1y_uw2df2Q3yXszkhjw&oe=675B4CC6',
      '940256ba-a9de-4aa9-bad8-604468cb6af3': 'https://scontent.fbkk22-8.fna.fbcdn.net/v/t39.30808-6/463604309_3230839817058130_1637667488835137061_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeHYasC1yLNuNou-YivmQxHzK8efDGNOxssrx58MY07Gy3NO2ddIe3goteZd7EiVSAGxYUSAJvtO-NEY7-4GI2hh&_nc_ohc=qy03ye2CUW0Q7kNvgFGYkHx&_nc_zt=23&_nc_ht=scontent.fbkk22-8.fna&_nc_gid=AR8Ieei8tzKPbIbH-VTN2Ap&oh=00_AYBX9gCfHJyZ9j5DcaiFW13fJEHqREL0uYUOQPSQGR6gaw&oe=67398C19',
      '494d4f06-225c-463e-bd8a-6c9caabc1fc4': 'https://scontent.fbkk22-6.fna.fbcdn.net/v/t39.30808-6/291624361_160843586498687_5274141732395249719_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGKQSxT2x_WX2kVLupOS7bJkCSsxTAJKfaQJKzFMAkp9i-0bu15KjbAsIzu-Bk2DOWxmWRiFPpAVNUYAuBVLT-c&_nc_ohc=xjoEYS2Uui0Q7kNvgFizO1P&_nc_zt=23&_nc_ht=scontent.fbkk22-6.fna&_nc_gid=AV2kJZ-DXMqpE6qICMz0rqm&oh=00_AYARTndco40mvepNrJLkgLHVKVS6HpKPNCHjx2MlgxMilw&oe=6739AA0E',
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': 'https://scontent.fbkk22-1.fna.fbcdn.net/v/t39.30808-6/462282249_3871596779754053_3452236430483136336_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEwir5QgQIQEOvzj7VTKJ4-2mdKyLY1Y5zaZ0rItjVjnHEPaLBYp0uBIPvC0n2UiqR_opDgCtnaZRet6sD3atTX&_nc_ohc=0ZRe0p33Pe8Q7kNvgHvzsg6&_nc_zt=23&_nc_ht=scontent.fbkk22-1.fna&_nc_gid=AATGKhZgvrhPQNPK6VKF1nT&oh=00_AYDO3Ij7iGDCGRvYysn0uvpl-gIr2VQqrWg0O0HUaB29Lg&oe=67398BD9',
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
      <Container fluid style={{ 
  backgroundImage: `url(${getBGSellerImage(sellerId)})`, 
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  color: '#ffffff', 
  padding: '2rem', 
  minHeight: '400px', // เพิ่มความสูงของ BG
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center'
}}>
  <div className="text-center mb-4" style={{ marginTop: '50px' }}> {/* ปรับระยะห่างด้านบน */}
    <img
      src={getSellerImage(sellerId)}
      alt={sellerNames[sellerId]}
      style={{
        width: '150px',  // Increased size
        height: '150px', // Increased size
        borderRadius: '50%',
        border: '5px solid #ffffff', // ขอบสีขาว 5px
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // เพิ่มเงาให้ขอบ
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
  className={`category-button w-100 d-flex align-items-center justify-content-center text-white position-relative ${selectedCategory === category ? 'selected' : 'default'} button-35`}
  onClick={() => handleCategoryClick(category)}
  style={{
    backgroundColor: selectedCategory === category ? '#8BD2EC' : 'transparent',
    height: '100px',
    borderRadius: '10px',
    border: '2px solid #CC0066', // Custom border color
  }}
>
  <div
    style={{
      width: '95%',
      height: '90%',
      borderRadius: '10px',
      border: '2px solid #CC0066', // Custom border color for inner div
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
