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
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': 'https://scontent.fbkk9-3.fna.fbcdn.net/v/t39.30808-6/422859534_925811232882066_2178207251347500122_n.png?stp=dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeFNyZwJIY4NkyBOMeA5W_nt4TzEtm7pO8ThPMS2buk7xOKZEBc4bbN_b13wwBgQUQ14tCteF5mwaqHpZJ2ULU-f&_nc_ohc=1FFIivHfLtUQ7kNvgG2dI9p&_nc_zt=23&_nc_ht=scontent.fbkk9-3.fna&_nc_gid=AWfvWuWPZtyJ9zZAqJubB7z&oh=00_AYDGKG9f1habQgUaCfgFWnOKUx5m0kGj-A9LtAY8FLaJhw&oe=6748FA0D',
      'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': 'https://scontent.fbkk12-5.fna.fbcdn.net/v/t1.6435-9/66903773_2873489199359619_1737719127734222848_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeHB5CVd1uB3DQdHi0pU-iCUU94QNsuaqpxT3hA2y5qqnH4AlzzITPcCmu0Fyoma1_7hUgnKe2B3viRVIk0yy3jF&_nc_ohc=BuzOt8GBqaMQ7kNvgGmJoIc&_nc_zt=23&_nc_ht=scontent.fbkk12-5.fna&_nc_gid=AYRTsV7aD9KvshCzGN1Qoeo&oh=00_AYClQombt19Oqt7goQg4AzCIWGzqxJBeLXY8ThlAxBnmzw&oe=676A7606',
      '940256ba-a9de-4aa9-bad8-604468cb6af3': 'https://scontent.fbkk12-5.fna.fbcdn.net/v/t39.30808-6/453875749_1039421788189156_7976962158170079787_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeH1LLTIxHuBXJrvvgD_P-6J4tAPydRZQYTi0A_J1FlBhCKVuWF-N5_83hmDNCo-9Vq0vETEfxOhT1aLfbz1KQt9&_nc_ohc=lycyCKj9iMgQ7kNvgEGWgUU&_nc_zt=23&_nc_ht=scontent.fbkk12-5.fna&_nc_gid=AII_tBVVn-KKG0YNGRQ7RXp&oh=00_AYDw-y5I3--cMSZkeTJ9VsEafAXUMVmG7Mvc4RKu7sB8Vg&oe=67490930',
      '494d4f06-225c-463e-bd8a-6c9caabc1fc4': 'https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/461719147_560189466582831_4227486017845167047_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeHzvPldzw31F8MtXyJyaw7H_Yt2SStU28L9i3ZJK1TbwiFN4dcyPqlxnr1geSpe81aqdhP4-5DGZZFS3ybR1ivA&_nc_ohc=EyFx3y7qEsgQ7kNvgGv8D2K&_nc_zt=23&_nc_ht=scontent.fbkk12-1.fna&_nc_gid=AB3FnFZeXoqsoty1KaBOJmm&oh=00_AYDSk1rpGnZiFVE9XDxQrKKMrme9jJZYggKhmsCjsr7sDw&oe=674908C3',
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': 'https://scontent.fbkk12-4.fna.fbcdn.net/v/t39.30808-6/344377111_783866660130708_7278320454818820108_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeHzVmXbwAlI2Y-F9AJZI5ej7OrOrYVS93Ds6s6thVL3cKUz6zZScep8BO8eW4eUTjfShMlMavfCgW4Lv1JBCKII&_nc_ohc=H3x3VKfwmXcQ7kNvgGSmYn5&_nc_zt=23&_nc_ht=scontent.fbkk12-4.fna&_nc_gid=A8H1sFHU4qiSPthFjnSUfrv&oh=00_AYAFgKCRiG19-msaLi9fKxR_7CvtkFPOrMVXZoMU4n5X9w&oe=6748DD09',
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
  const addToCart = (product) => {
    const quantity =1;
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

    <Container fluid>
      
      {/* Seller Section */}
      <Container fluid style={{ 
        backgroundImage: `url(${getBGSellerImage(sellerId)})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        color: '#ffffff', 
        padding: '2rem', 
        minHeight: '400px', 
        display: 'flex', 
        flexDirection: 'column-reverse', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '80%', // ทำให้ความกว้างลดลง
        margin: '0 auto', // จัดกลางในกรณีที่เป็น fluid container
        
      }}>
        <div className="text-center mb-4" style={{ marginTop: '50px' }}>
        
          <img
            src={getSellerImage(sellerId)}
            alt={sellerNames[sellerId]}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              border: '5px solid #ffffff',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            }}
          />
      </div>
      </Container>
      <h2 className="text-center mb-4"></h2>
      <h1 className="text-center mb-4">สินค้าของร้าน</h1>
      <div className="container space" style={{ position: 'relative' }}>
  

{/* Sidebar for Categories */}
<div className="sidebar " style={{
    display: 'flex',
    position: 'static',  // ทำให้มันอยู่ในตำแหน่งที่กำหนดใน container
    top: '0px',           // ระยะห่างจากด้านบนของ container
    left: '0',             // ระยะห่างจากด้านซ้ายของ container
    width: '300px',        // ความกว้าง
    backgroundColor: '#f8f9fa',
    padding: '10px',
              
  }}>
    <Row className="text-center my-4"  >
    <h2 className="text-center mt-5" >หมวดหมู่</h2>
      {categories.map((category, index) => (
        <Col key={index} xs={12} className="mb-3">
          <Button
            className={`category-button justify-content-center text-white position-relative ${selectedCategory === category ? 'selected' : 'default'} button-35`}
            onClick={() => handleCategoryClick(category)}
            style={{
              backgroundColor: selectedCategory === category ? '#8BD2EC' : 'transparent',
              height: '60px',
              width: '100%',
              borderRadius: '10px',
              border: '2px solid #CC0066',
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
    marginLeft: '50px',   // พื้นที่ขวางจากแถบหมวดหมู่
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
                      style={{ height: '300px', objectFit: 'contain', }}
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
                    <Button 
                        onClick={() => addToCart(product)}
                        variant="outline-primary"
                        className="mt-2"
                        style={{width:'100%'}}
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

export default Products;
