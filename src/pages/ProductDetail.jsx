import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import TopNav from '../components/TopNav';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';

const placeholderImage = '../assets/images/placeholder.jpg';
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
      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={buttonStyle}>-</button>
      <input
        type="text"
        value={quantity}
        onChange={handleChange}
        style={inputStyle}
      />
      <button onClick={() => setQuantity(quantity + 1)} style={buttonStyle}>+</button>
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchProductDetails = (id) => {
    axios
      .get(`/api/v1/products/${id}`)
      .then((response) => {
        setProduct(response.data);
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
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true); // ตั้งค่าให้เป็น loading ก่อน
        const response = await axios.get(`/api/v1/products/${productId}`);
        setProduct(response.data);
        fetchSellerProducts(response.data.seller_id);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        // หน่วงเวลา 1 วินาทีเพื่อให้หน้าโหลดอยู่
        setTimeout(() => {
          setIsLoading(false);
        }, 900); // หน่วงเวลา 1000ms = 1 วินาที
      }
    };
  
    fetchProductDetails();
  }, [productId]);
  
  if (isLoading) {
    return (
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <img 
          src="../assets/images/Namo_loding.gif" 
        />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <img src="../assets/images/Namo_loding.gif" alt="Loading..." />
      </div>
    );
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
                style={{ maxHeight: '500px', objectFit: 'contain', cursor: 'pointer' }}
              />
            </Link>
          </Col>
          <Col md={6}>
            <h2 style={{ fontSize: '32px' }}>{product.name}</h2>

            {/* Buttons */}
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            <Button 
              variant="success" 
              onClick={() => { addToCart(); handleNavigateToChooseAddress(); }}
              style={{ fontSize: '20px', padding: '10px 20px', marginRight: '10px' }}
            >
              ซื้อเลย
            </Button>
            <Button 
              variant="primary" 
              onClick={addToCart} 
              style={{ fontSize: '20px', padding: '10px 20px', border: '2px solid #CC0066', backgroundColor: '#CC0066'}}
            >
              เพิ่มในตระกร้า
            </Button>

            {/* Product details (moved below the buttons) */}
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '24px' }}><strong>ราคา:</strong> {product.price ? `฿${product.price}` : 'ราคาไม่ระบุ'}</p>
              {/* เพิ่ม className เพื่อใช้ CSS pre-line */}
              <p style={{ fontSize: '18px' }}><strong>รายละเอียดสินค้า:</strong> <div className="pre-line-text">{product.description}</div></p>
              <p style={{ fontSize: '18px' }}><strong>ผู้ออกแบบ:</strong> {product.brand}</p>
              <p style={{ fontSize: '18px' }}><strong>คลัง:</strong> {product.inventory.quantity}</p>
            </div>
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
          </Link>
          <h3 className="ml-3" style={{ marginLeft: '30px', fontSize: '34px', fontWeight: 'bold' }}>
            {getSellerName(product.seller_id)}
          </h3>
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

      <Footer />
    </div>
  );
};

export default ProductDetail;
