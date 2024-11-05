import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

const MyCart = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const placeholderImage = "https://via.placeholder.com/100"; // URL ของ placeholder image ขนาดเล็กลง

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/v1/products?sort=created_at&order=desc&limit=6');
                setProducts(response.data.items);
            } catch (error) {
                console.error('Error fetching the products:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const discount = 2000; 
    const shipping = 90; 

    // คำนวณยอดรวม
    const subtotal = products.reduce((acc, product) => {
        const quantity = product.quantity || 1; // ถ้าไม่มี quantity ให้ใช้เป็น 1
        return acc + (product.price * quantity);
    }, 0);

    const total = subtotal - discount + shipping;

    return (
        <Container className="my-cart">
            <h1>ทำการสั่งซื้อ</h1>
            <div className="order-summary">
                <h2>รายการคำสั่งซื้อ</h2>
                {loading ? (
                    <p>กำลังโหลด...</p>
                ) : error ? (
                    <p>เกิดข้อผิดพลาดในการดึงข้อมูล: {error.message}</p>
                ) : products.length > 0 ? (
                    products.map((product) => {
                        // หา primary image จาก product.images
                        const primaryImage = product.images.find((img) => img.is_primary)?.image_url;

                        return (
                            <Row className="cart-item mb-4" key={product.id} style={{ alignItems: 'center' }}>
                                <Col xs={4} className="d-flex justify-content-center">
                                    <img 
                                        src={primaryImage || placeholderImage} 
                                        alt={product.name} 
                                        style={{ width: '80%', borderRadius: '5px' }} 
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = placeholderImage; 
                                        }} 
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Card.Body style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                        <div>
                                            <Card.Title>{product.name}</Card.Title>
                                            <Card.Text>{product.description}</Card.Text>
                                            <Card.Text>
                                                <strong>จำนวน: {product.quantity || 1}</strong> {/* แสดงจำนวนสินค้า */}
                                            </Card.Text>
                                        </div>
                                        <Card.Text style={{ textAlign: 'right' }}>
                                            <strong>ราคา: ฿{product.price * (product.quantity || 1)}</strong> {/* คำนวณราคาทั้งหมด */}
                                        </Card.Text>
                                    </Card.Body>
                                </Col>
                            </Row>
                        );
                    })
                ) : (
                    <p>ไม่มีผลิตภัณฑ์ในตะกร้า</p>
                )}
                <div className="cart-total">
                    <div>
                        <span>ส่วนลด</span>
                        <span>฿{discount}</span>
                    </div>
                    <div>
                        <span>ค่าจัดส่ง</span>
                        <span>฿{shipping}</span>
                    </div>
                    <div>
                        <strong>ยอดรวม</strong>
                        <strong>฿{total}</strong> {/* ใช้ total ที่คำนวณแล้ว */}
                    </div>
                </div>
            </div>
            <button className="checkout-button">ยืนยันการสั่งซื้อ</button>
        </Container>
    );
};

export default MyCart;
