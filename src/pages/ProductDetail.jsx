import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom'; // For routing
import { Container, Row, Col, Card, Button } from 'react-bootstrap'; // For UI components
import TopNav from '../components/TopNav'; // Import TopNav component
import TopMenu from '../components/TopMenu'; // Import TopMenu component
import Footer from '../components/Footer'; // Import Footer component

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
    '940256ba-a9de-4aa9-bad8-604468cb6af3': '/assets/images/TIME_TO_PLAY.png',
    '494d4f06-225c-463e-bd8a-6c9caabc1fc4': '/assets/images/Towertactic.png',
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
    if (/^\d*$/.test(value)) { // ตรวจสอบว่าเป็นตัวเลข
      setQuantity(Number(value) || 1); // หากใส่ค่าว่างจะให้เป็น 1
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

// ปรับสไตล์ให้ใหญ่ขึ้น
const buttonStyle = {
  width: '40px',
  height: '40px',
  fontSize: '24px',
  fontWeight: 'bold',
  border: '1px solid #ddd',
  backgroundColor: '#f0f0f0',
  cursor: 'pointer',
};

const inputStyle = {
  width: '60px',
  height: '40px',
  textAlign: 'center',
  border: '1px solid #ddd',
  fontSize: '20px',
  outline: 'none',
};

const ProductDetail = () => {
  const { productId } = useParams(); // รับ productId จาก URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // จัดการจำนวนสินค้า
  const navigate = useNavigate(); // สำหรับการนำทางไปหน้า Payment.jsx

  // ฟังก์ชันดึงข้อมูลรายละเอียดสินค้าจาก API
  const fetchProductDetails = (id) => {
    axios
      .get(`/api/v1/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
  };

  useEffect(() => {
    fetchProductDetails(productId);
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>; // แสดง Loading ระหว่างดึงข้อมูล
  }

  const addToCart = () => {
    // Get the current cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Check if the product is already in the cart
    const existingProduct = storedCart.find((item) => item.id === product.id);
  
    if (existingProduct) {
      // If the product is already in the cart, update the quantity
      existingProduct.quantity += quantity;
      localStorage.setItem('cart', JSON.stringify(storedCart));
    } else {
      // If the product is not in the cart, add it
      storedCart.push({ ...product, quantity });
      localStorage.setItem('cart', JSON.stringify(storedCart));
    }
  
    // Dispatch the custom event to update the cart count in TopNav
    window.dispatchEvent(new Event('cart-updated'));
  
    console.log(`Added ${quantity} of ${product.name} to the cart.`);
  };

  const handleBuyNow = () => {
    // คำนวณยอดรวม (ราคา * จำนวน + ค่าขนส่ง)
    const total = product.price * quantity + 90;  // ราคา * จำนวน + ค่าขนส่ง 90
    
    // หารูปภาพหลักของสินค้า
    const primaryImage = product.images?.find((img) => img.is_primary)?.image_url || placeholderImage;


  
    // ส่งข้อมูลสินค้า, จำนวน, รูปภาพ, และค่าขนส่งไปยังหน้า Payment
    navigate('/payment', {
      state: {
        items: [
          { 
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image_url: primaryImage  // ส่งรูปภาพ
          }
        ],
        shippingCost: 90,  // ค่าขนส่ง
        total: total        // ยอดรวม (ราคา * จำนวน + ค่าขนส่ง)
      }
    });
  };

  return (
    <div>
      <TopNav />
      <TopMenu />

      <Container className="my-5">
        <Row>
          <Col md={6}>
            {/* แสดงรูปภาพสินค้า */}
            <Card.Img
              src={product.images.find((img) => img.is_primary)?.image_url || placeholderImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderImage;
              }}
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </Col>
          <Col md={6}>
            <h2 style={{ fontSize: '32px' }}>{product.name}</h2>
            <p style={{ fontSize: '24px' }}><strong>ราคา:</strong> {product.price ? `฿${product.price}` : 'ราคาไม่ระบุ'}</p>
            <p style={{ fontSize: '18px' }}><strong>รายละเอียดสินค้า:</strong> {product.description}</p>
            <p style={{ fontSize: '18px' }}><strong>ผู้ออกแบบ:</strong> {product.brand}</p>
            <p style={{ fontSize: '18px' }}><strong>คลัง:</strong> {product.inventory.quantity}</p>

            {/* จำนวนสินค้า */}
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            <Button
              variant="success"
              onClick={handleBuyNow}
              style={{
                fontSize: '20px',
                padding: '10px 20px',
                marginRight: '20px',  // เพิ่ม margin เพื่อเพิ่มระยะห่าง
              }}
            >
              ซื้อเลย
            </Button>

            <Button
              variant="primary"
              onClick={addToCart}
              style={{
                fontSize: '20px',
                padding: '10px 20px',
              }}
            >
              เพิ่มในรถเข็น
            </Button>
          </Col>
        </Row>
      </Container>

      <Card.Text className="d-flex align-items-center mt-3 mb-5">
        <img
          src={getSellerImage(product.seller_id)}
          alt={getSellerName(product.seller_id)}
          style={{ width: '70px', height: '70px', borderRadius: '50%', marginRight: '8px' }}
        />
        <Link to={`/seller/${product.seller_id}`} style={{ fontSize: '20px' }}>
          {getSellerName(product.seller_id)}
        </Link>
      </Card.Text>

      <Footer />
    </div>
  );
};

export default ProductDetail;
