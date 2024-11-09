import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Col, Row } from 'react-bootstrap';

const placeholderImage = '../assets/images/placeholder.jpg'; // ปรับเส้นทางให้ตรงตามที่ใช้งาน

const IntroduceProduct = ({ sku }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // ดึงข้อมูลสินค้าทั้งหมด
        const response = await axios.get('/api/v1/products');
        const products = response.data;

        // พิมพ์ข้อมูลสินค้าที่ดึงมา
        console.log('Fetched products:', products);

        // กรองสินค้าโดยใช้ SKU ตัวท้ายที่ตรงกับสินค้าปัจจุบัน
        const lastDigit = sku.slice(-1);
        console.log('Last digit of SKU:', lastDigit); // พิมพ์ตัวท้ายของ SKU

        const filteredProducts = products.filter((product) => product.sku.slice(-1) === lastDigit);

        // พิมพ์สินค้าที่กรองแล้ว
        console.log('Filtered products:', filteredProducts);

        setRelatedProducts(filteredProducts.slice(0, 3)); // จำกัดจำนวนสินค้าที่แนะนำเป็น 3 ชิ้น
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [sku]);

  const getSellerImage = (sellerId) => {
    // เปลี่ยนให้ส่งคืน URL ของรูปภาพที่ตรงกับ sellerId ของ seller
    // ตัวอย่าง: return `/path/to/seller/images/${sellerId}.jpg`;
    return `path/to/seller_images/${sellerId}.jpg`; // กำหนดตามการใช้งานจริง
  };

  const getSellerName = (sellerId) => {
    // ใส่ชื่อของผู้ขายตาม sellerId
    const sellerNames = {
      1: 'SIAM BOARDGAME',
      2: 'Lanlalen',
      3: 'TIME TO PLAY',
      4: 'Towertactic',
      5: 'DiceCUP',
      // เพิ่มตามที่มีในฐานข้อมูล
    };
    return sellerNames[sellerId] || 'Unknown Seller';
  };

  // ถ้าไม่มีสินค้าที่กรองมาแสดง
  if (relatedProducts.length === 0) {
    return <div>ไม่มีสินค้าที่แนะนำ</div>;
  }

  return (
    <div>
      <h3>สินค้าแนะนำ</h3>
      <Row>
        {relatedProducts.map((product) => (
          <Col md={4} key={product.id}>
            <Card className="mb-4">
              <Link to={`/product/${product.id}`}>
                <Card.Img
                  variant="top"
                  src={product.image || placeholderImage}
                  alt={product.name}
                  style={{ height: '300px', objectFit: 'cover' }}
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
                <Card.Text className="d-flex align-items-center">
                  <Link to={`/seller/${product.seller_id}`} className="d-flex align-items-center">
                    <img
                      src={getSellerImage(product.seller_id)}
                      alt={getSellerName(product.seller_id)}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px' }}
                    />
                    <small>{getSellerName(product.seller_id)}</small>
                  </Link>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default IntroduceProduct;
