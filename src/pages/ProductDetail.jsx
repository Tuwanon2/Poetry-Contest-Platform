import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import TopNav from '../components/TopNav';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';

const placeholderImage = '../assets/images/placeholder.jpg';

const getCategory = (sku) => {
  const lastDigit = sku.slice(-1);
  const categories = {
    '1': 'บอร์ดเกมผู้เล่น 1 คน',
    '2': 'บอร์ดเกมเล่นหลายคน',
    '3': 'บอร์ดเกมปาร์ตี้',
    '4': 'บอร์ดเกมกลยุทธ์',
    '5': 'บอร์ดเกมเด็กและครอบครัว',
    '6': 'บอร์ดเกมแนวสงคราม',
    '7': 'บอร์ดเกม co-op',
    '8': 'บอร์ดเกม gateway',
    '9': 'บอร์ดเกมบริหารทรัพยากร'
  };
  return categories[lastDigit] || 'ประเภทไม่ระบุ';
};

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

const QuantitySelector = ({ quantity, setQuantity }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(Number(value) || 1);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
      <Button
    size="sm"
    variant="outline-dark"
    onClick={() => setQuantity(Math.max(1, quantity - 1))}
    className="round-button"
  >
    -
  </Button>
  <input
    type="text"
    value={quantity}
    onChange={handleChange}
    style={{ width: '40px', textAlign: 'center', margin: '0 10px', border: '1px solid #ced4da', borderRadius: '4px' }}
  />
  <Button
    size="sm"
    variant="outline-dark"
    onClick={() => setQuantity(quantity + 1)}
    className="round-button"
  >
    +
  </Button>
    </div>
  );
};

const buttonStyle = {
  width: '40px',
  height: '40px',
  fontSize: '24px',
  fontWeight: 'bold',
  border: '1px solid #ddd',
  backgroundColor: '#CC0066',
  cursor: 'pointer',
  borderRadius: '50%',
};

const inputStyle = {
  width: '60px',
  height: '40px',
  textAlign: 'center',
  border: '1px solid #CC0066',
  fontSize: '20px',
  outline: 'none',
  fontSize: '1.2rem',
  borderRadius: '50%',
};

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProductDetails = (id) => {
    axios
      .get(`/api/v1/products/${id}`)
      .then((response) => {
        setProduct(response.data); // ตรวจสอบว่า response.data มีค่า created_at ด้วย
        fetchSellerProducts(response.data.seller_id);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
  };
  

  const fetchSellerProducts = (sellerId) => {
    axios
      .get(`/api/v1/products?seller_id=${sellerId}&limit=5`)
      .then((response) => {
        setRelatedProducts(response.data.items);
      })
      .catch((error) => {
        console.error('Error fetching seller products:', error);
      });
  };

  useEffect(() => {
    fetchProductDetails(productId);
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const addToCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = storedCart.find((item) => item.id === product.id);
  
    if (existingProduct) {
      existingProduct.quantity += quantity;
      localStorage.setItem('cart', JSON.stringify(storedCart));
    } else {
      storedCart.push({ ...product, quantity });
      localStorage.setItem('cart', JSON.stringify(storedCart));
    }
  
    window.dispatchEvent(new Event('cart-updated'));
    console.log(`Added ${quantity} of ${product.name} to the cart.`);
  };

  const handleNavigateToChooseAddress = () => {
    navigate('/Payment');
  };

  // Filter out the currently viewed product from the related products
  const filteredRelatedProducts = relatedProducts.filter(
    (relatedProduct) => relatedProduct.id !== product.id
  );

  return (
    <div>
      <TopNav />
      <TopMenu />
  
      <Container className="my-5">
        <Row>
          <Col md={6}>
            <Link to={`/product/${product.id}`}>
            <Card.Img
  src={product.images.find((img) => img.is_primary)?.image_url || placeholderImage}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = placeholderImage;
  }}
  style={{ maxHeight: '300px', objectFit: 'contain', cursor: 'pointer', width: '100%' }}
/>
            </Link>
            
            {/* Product details (moved below the image) */}
            <div style={{ marginTop: '20px' }}>
             
              <p style={{ fontSize: '18px' }}><strong>รายละเอียดสินค้า:</strong> <div className="pre-line-text">{product.description}</div></p>
              <p style={{ fontSize: '18px' }}><strong>ผู้ออกแบบ:</strong> {product.brand}</p>
              <p style={{ fontSize: '18px' }}><strong>คลัง:</strong> {product.inventory.quantity}</p>
              <p style={{ fontSize: '18px' }}><strong>ประเภทบอร์ดเกม:</strong> {getCategory(product.sku)}</p>
              {product.created_at && (
  <p style={{ fontSize: '18px' }}><strong>วันที่เพิ่มสินค้า:</strong> {new Date(product.created_at).toLocaleDateString('th-TH')}</p>
)}
            </div>
          </Col>
  
          <Col md={6}>
            <h2 style={{ fontSize: '32px' }}>{product.name}</h2>
  
            {/* Quantity Selector and Buttons */}
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            <Button
  variant="success"
  onClick={() => { addToCart(); handleNavigateToChooseAddress(); }}
  className="custom-btn" // ใช้คลาสใหม่
  style={{ fontSize: '20px', padding: '10px 20px', marginRight: '10px', backgroundColor: 'rgb(0, 204, 68)' }}
>
  ซื้อเลย
</Button>

            <Button 
  variant="primary" 
  onClick={addToCart} 
  className="custom-btn" // ใช้ชื่อคลาสใหม่ที่กำหนด
  style={{ fontSize: '17px', padding: '10px 20px', border: '2px solid #CC0066', backgroundColor: '#CC0066' }}
>
  เพิ่มลงตะกร้า
</Button>

  
            <p style={{ fontSize: '24px', marginTop: '20px' }}><strong>ราคา:</strong> {product.price ? `฿${product.price}` : 'ราคาไม่ระบุ'}</p>
          </Col>
        </Row>
      </Container>
  
      <Container>
        <Card.Text className="d-flex align-items-center mb-5">
        <Link to={`/seller/${product.seller_id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
  <img
    src={getSellerImage(product.seller_id)}
    alt={getSellerName(product.seller_id)}
    style={{ width: '90px', height: '90px', borderRadius: '50%', marginRight: '8px', cursor: 'pointer' }}
  />
  <h3 className="ml-3" style={{ marginLeft: '30px', fontSize: '34px', fontWeight: 'bold', color: 'black' }}>
    {getSellerName(product.seller_id)}
  </h3>
</Link>

        </Card.Text>
        <h3 className="ml-3" style={{ marginLeft: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          สินค้าอื่นๆที่คุณอาจสนใจจากร้าน
        </h3>
  
        <Row>
          {filteredRelatedProducts.map((relatedProduct) => (
            <Col key={relatedProduct.id} md={3} className="mb-4">
              <Card>
                <Link to={`/product/${relatedProduct.id}`}>
                  <Card.Img
                    variant="top"
                    src={relatedProduct.images[0]?.image_url || placeholderImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage;
                    }}
                    style={{ width: '100%', height: '250px', objectFit: 'contain' }}
                  />
                </Link>
                <Card.Body>
                  <Link to={`/product/${relatedProduct.id}`} style={{ textDecoration: 'none', color: '#CC0066' }}>
                    <Card.Title>{relatedProduct.name}</Card.Title>
                  </Link>
                  <Card.Text style={{ fontSize: '1.2rem', color: '#28a745' }}>฿{relatedProduct.price || 'ไม่ระบุ'} </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <div className="elgy-tooltip-container">
  <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
    <span className="elgy-text">
      <svg
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
      >
        <image
            href="../assets/namo-logo.png"
            width="18"
            height="16" // Match the width and height for a perfect fit inside the circle
            
        />
      </svg>
    </span>
  </a>

  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
    <span className="elgy-tooltip1">
      <svg
        viewBox="0 0 16 16"
        className="bi bi-twitter"
        height="20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"
        ></path>
      </svg>
    </span>
  </a>

  <a href="https://www.facebook.com/groups/1309994327041922" target="_blank" rel="noopener noreferrer">
    <span className="elgy-tooltip2">
      <svg
        viewBox="0 0 16 16"
        className="bi bi-facebook"
        height="20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"
        />
      </svg>
    </span>
  </a>

  <a href="/Contact" target="_blank" rel="noopener noreferrer">
    <span className="elgy-tooltip3">
      <svg
        viewBox="0 0 16 16"
        className="bi bi-whatsapp"
        height="20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          
          d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"
        />
      </svg>
    </span>
  </a>

  <a href="https://discord.gg/Q87GJnXjem" target="_blank" rel="noopener noreferrer">
    <span className="elgy-tooltip4">
      <svg
        viewBox="0 0 16 16"
        className="bi bi-discord"
        height="20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
        />
      </svg>
    </span>
  </a>
</div>
      <Footer />
    </div>
  );
  
};

export default ProductDetail;
