import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const MyCart = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState(3); // Default 3% discount
    const placeholderImage = "https://via.placeholder.com/100";

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

    // Determine if shipping should be applied
    const shipping = products.length > 0 ? 90 : 0;  // No shipping if no products

    // Calculate subtotal
    const subtotal = products.reduce((acc, product) => {
        const quantity = product.quantity || 1; // Default to 1 if quantity is undefined
        return acc + (product.price * quantity);
    }, 0);

    // Check if discount is applicable
    const isDiscountApplicable = (percentage) => {
        if (percentage === 3) return true;
        if (percentage === 5) return subtotal >= 1500;
        if (percentage === 10) return subtotal >= 4000;
        return false;
    };

    // Apply discount
    const applyDiscount = (percentage) => {
        if (isDiscountApplicable(percentage)) {
            setDiscountPercentage(percentage);
        }
    };

    // Calculate discount
    const discount = isDiscountApplicable(discountPercentage)
        ? (subtotal * discountPercentage / 100)
        : 0;

    const total = subtotal - discount + shipping;  // Total includes shipping only if products exist

    // Handle removing a product
    const removeProduct = (productId) => {
        setProducts(products.filter(product => product.id !== productId));
    };

    // Handle changing product quantity
    const changeQuantity = (productId, action) => {
        setProducts(prevProducts => prevProducts.map(product => {
            if (product.id === productId) {
                const updatedQuantity = action === 'increase' 
                    ? (product.quantity || 1) + 1 
                    : Math.max((product.quantity || 1) - 1, 1); // Prevent going below 1
                return { ...product, quantity: updatedQuantity };
            }
            return product;
        }));
    };

    return (
        <Container className="my-cart">
            {/* Total and Confirm Order Button at the Top */}
            <div className="cart-total" style={{ marginBottom: '20px', textAlign: 'right' }}>
                <div>
                    <span>ยอดรวม</span>
                    <span>฿{subtotal.toFixed(2)}</span>
                </div>
                <div>
                    <span>ส่วนลด ({discountPercentage}% {isDiscountApplicable(discountPercentage) ? '' : '(ใช้ไม่ได้)'})</span>
                    <span>-฿{discount.toFixed(2)}</span>
                </div>
                {products.length > 0 && (
                    <div>
                        <span>ค่าจัดส่ง</span>
                        <span>฿{shipping}</span>
                    </div>
                )}
                <div>
                    <strong>ยอดรวมสุทธิ</strong>
                    <strong>฿{total.toFixed(2)}</strong>
                </div>
                <Button variant="success" size="lg" className="checkout-button" style={{ width: '100%' }}>
                    ยืนยันการสั่งซื้อ
                </Button>
            </div>

            <div className="discount-options" style={{ marginBottom: '20px' }}>
                <h3>เลือกส่วนลด</h3>
                {[3, 5, 10].map((percentage) => (
                    <div key={percentage} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Button
                            variant={isDiscountApplicable(percentage) ? 'primary' : 'danger'}
                            onClick={() => applyDiscount(percentage)}
                            disabled={!isDiscountApplicable(percentage)}
                        >
                            ใช้โค้ดลด {percentage}%
                        </Button>
                        <Button
                            variant="info"
                            style={{ marginLeft: '10px' }}
                            onClick={() => alert(`โค้ดลด ${percentage}% ${percentage === 5 ? 'ใช้ได้เมื่อยเลือกซื้อสินค้าครบ 1500 บาท' : percentage === 10 ? 'ใช้ได้เมื่อยเลือกซื้อสินค้าครบ 4000 บาท' : 'ใช้ได้ทุกยอดรวม'}`)}
                        >
                            เงื่อนไข
                        </Button>
                    </div>
                ))}
            </div>

            <div className="order-summary" style={{ marginBottom: '20px' }}>
                <h2>รายละเอียดคำสั่งซื้อ</h2>
                {loading ? (
                    <p>กำลังโหลด...</p>
                ) : error ? (
                    <p>เกิดข้อผิดพลาดในการดึงข้อมูล: {error.message}</p>
                ) : products.length > 0 ? (
                    products.map((product) => {
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
                                                <strong>จำนวน: {product.quantity || 1}</strong>
                                                <Button variant="secondary" size="sm" onClick={() => changeQuantity(product.id, 'decrease')} style={{ marginLeft: '10px' }}>
                                                    -
                                                </Button>
                                                <Button variant="secondary" size="sm" onClick={() => changeQuantity(product.id, 'increase')} style={{ marginLeft: '10px' }}>
                                                    +
                                                </Button>
                                            </Card.Text>
                                        </div>
                                        <Card.Text style={{ textAlign: 'right' }}>
                                            <strong>ราคา: ฿{product.price * (product.quantity || 1)}</strong>
                                        </Card.Text>
                                        {/* Clickable Text for Removing Product */}
                                        <span
                                            onClick={() => removeProduct(product.id)}
                                            style={{
                                                color: 'red',
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            นำสินค้าออก
                                        </span>
                                    </Card.Body>
                                </Col>
                            </Row>
                        );
                    })
                ) : (
                    <p>ไม่มีผลิตภัณฑ์ในตะกร้า</p>
                )}
            </div>
        </Container>
    );
};

export default MyCart;
