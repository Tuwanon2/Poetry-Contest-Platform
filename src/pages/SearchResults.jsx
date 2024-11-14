import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import TopNav from '../components/TopNav';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';

const placeholderImage = '../assets/images/placeholder.jpg';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null); // ใช้สำหรับเก็บข้อผิดพลาด

  const searchQuery = searchParams.get('q');

  // ฟังก์ชันดึงข้อมูลสินค้าจาก API
  const fetchProducts = (query) => {
    if (query) {
      axios
        .get(`/api/v1/products?search=${query}&limit=20`)
        .then((response) => {
          if (response.data.items) {
            // กรองผลลัพธ์ให้แสดงเฉพาะสินค้าที่ชื่อ (name) ตรงกับคำค้นหา
            const filteredProducts = response.data.items.filter((product) =>
              product.name.toLowerCase().includes(query.toLowerCase())
            );
            setProducts(filteredProducts); // ตั้งค่า products ด้วยสินค้าที่กรองแล้ว
            setError(null); // ล้าง error หากมีข้อมูล
          } else if (response.data.error) {
            setError(response.data.error); // เก็บข้อความข้อผิดพลาด
            setProducts([]); // ล้างรายการ products
          }
        })
        .catch((error) => {
          console.error('Error fetching the products:', error);
          setError('ไม่สามารถดึงข้อมูลสินค้ามาได้'); // เก็บข้อความข้อผิดพลาด
        });
    } else {
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [searchQuery]);

  // ฟังก์ชันเพิ่มสินค้าในตะกร้า
  const addToCart = (product) => {
    const quantity = 1; // ตั้งค่าเริ่มต้นจำนวนสินค้าเป็น 1
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

    // เช็คว่ามีสินค้านี้ในตะกร้าอยู่แล้วหรือไม่
    const existingProduct = storedCart.find((item) => item.id === product.id);

    if (existingProduct) {
      // หากสินค้าถูกเพิ่มแล้ว เพิ่มจำนวนสินค้า
      existingProduct.quantity += quantity;
    } else {
      // หากยังไม่มีสินค้าในตะกร้า ให้เพิ่มสินค้าใหม่
      storedCart.push({ ...product, quantity });
    }

    // บันทึกตะกร้าใน localStorage
    localStorage.setItem('cart', JSON.stringify(storedCart));

    // ส่งเหตุการณ์เพื่ออัพเดตจำนวนสินค้าที่แสดงใน TopNav
    window.dispatchEvent(new Event('cart-updated'));

    console.log(`Added ${quantity} of ${product.name} to the cart.`);
  };

  return (
    <div>
      <TopNav />
      <TopMenu />

      <Container className="my-5">
        <h2 className="text-center mb-4">ผลการค้นหาสำหรับ "{searchQuery}"</h2>
        <Row>
          {error ? (
            <p className="text-center">{error}</p> // แสดงข้อความข้อผิดพลาด
          ) : products.length > 0 ? (
            products.map((product) => {
              const primaryImage = product.images.find((img) => img.is_primary)?.image_url || placeholderImage;

              return (
                <Col md={12} key={product.id}>
                  <Card className="mb-4 p-3" style={{ border: '1px solid #e5e5e5' }}>
                    <Row>
                      <Col md={3}>
                        <Link to={`/product/${product.id}`}>
                          <Card.Img
                            src={primaryImage}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = placeholderImage;
                            }}
                            style={{ maxHeight: '150px', objectFit: 'contain', cursor: 'pointer' }}
                          />
                        </Link>
                      </Col>
                      <Col md={6}>
                        <Card.Body>
                          <Card.Title style={{ fontSize: '1.5rem', color: '#CC0066' }}>
                            {product.name}
                          </Card.Title>
                          <div style={{ fontSize: '1.2rem', color: '#28a745' }}>
                            <strong>{product.price ? `฿${product.price}` : 'ราคาไม่ระบุ'}</strong>
                          </div>
                        </Card.Body>
                      </Col>
                      <Col md={3} className="d-flex align-items-center justify-content-center">
                        <div>
                          <Button
                            variant="primary"
                            className="me-2"
                            onClick={() => addToCart(product)}
                            style={{
                              border: '3px solid #CC0066',
                              borderRadius: '5%',
                              backgroundColor: '#CC0066',
                              transition: 'all 0.3s ease', // เพิ่มการเปลี่ยนแปลงให้ลื่นไหล
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#9B0056')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#CC0066')}
                          >
                            เพิ่มลงในตะกร้า
                          </Button>
                          <Link to={`/product/${product.id}`}>
                            <Button
                              variant="outline-secondary"
                              style={{
                                border: '3px solid #CC0066',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              ดูรายละเอียด
                            </Button>
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })
          ) : (
            <p className="text-center">ไม่พบสินค้าที่ค้นหา</p>
          )}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default SearchResults;
