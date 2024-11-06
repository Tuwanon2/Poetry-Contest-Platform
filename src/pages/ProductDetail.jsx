import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import TopNav from '../components/TopNav';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';

const placeholderImage = '../assets/images/placeholder.jpg';

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
    console.log(`Added ${quantity} of ${product.name} to the cart.`);
    // คุณสามารถเรียก API เพื่อเพิ่มในรถเข็นได้ที่นี่
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

            {/* ปุ่มเพิ่มในรถเข็น */}
            <Button variant="primary" onClick={addToCart} style={{ fontSize: '20px', padding: '10px 20px' }}>เพิ่มในรถเข็น</Button>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default ProductDetail;
