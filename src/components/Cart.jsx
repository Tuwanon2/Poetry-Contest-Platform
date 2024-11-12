import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const MyCart = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState(3); // Default 3% discount
    const [cartCount, setCartCount] = useState(0); // For managing cart item count
    const placeholderImage = "https://via.placeholder.com/100";
    const navigate = useNavigate(); // Initialize navigation function

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setProducts(savedCart);
        setCartCount(savedCart.length); 
        setLoading(false);
    }, []);

    const updateLocalStorage = (updatedProducts) => {
        try {
            const data = JSON.stringify(updatedProducts);
            console.log('Updated products:', data); // ตรวจสอบข้อมูลก่อนบันทึก
            localStorage.setItem('cart', data);
        } catch (error) {
            console.error('Error updating localStorage:', error); // แจ้งเตือนหากเกิดข้อผิดพลาด
        }
    };
    
    
    

    const shipping = products.length > 0 ? 90 : 0;

    const subtotal = products.reduce((acc, product) => {
        const quantity = product.quantity || 1;
        return acc + (product.price * quantity);
    }, 0);

    const isDiscountApplicable = (percentage) => {
        if (percentage === 3) return true;
        if (percentage === 5) return subtotal >= 1500;
        if (percentage === 10) return subtotal >= 4000;
        return false;
    };

    const applyDiscount = (percentage) => {
        if (isDiscountApplicable(percentage)) {
            setDiscountPercentage(percentage);
        }
    };

    const discount = isDiscountApplicable(discountPercentage)
        ? (subtotal * discountPercentage / 100)
        : 0;

    const total = subtotal - discount + shipping;

    const removeProduct = (productId) => {
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
        setCartCount(updatedProducts.length); 
        updateLocalStorage(updatedProducts);
        window.dispatchEvent(new Event('cart-updated')); 
    };

    const changeQuantity = (productId, action) => {
        const updatedProducts = products.map(product => {
            if (product.id === productId) {
                const updatedQuantity = action === 'increase'
                    ? (product.quantity || 1) + 1
                    : Math.max((product.quantity || 1) - 1, 1); 
                return { ...product, quantity: updatedQuantity };
            }
            return product;
        });
        setProducts(updatedProducts);
        setCartCount(updatedProducts.length); 
        updateLocalStorage(updatedProducts);
    };   



    const handleCheckout = () => {
        const checkoutData = {
            items: products.map((product) => ({
                primaryImage: product.images.find((img) => img.is_primary)?.image_url || placeholderImage, // Main image of the product
                name: product.name, // Product name
                price: product.price, // Product price
                quantity: product.quantity || 1, // Product quantity
                id: product.id, // Product ID
                description: product.description || 'No description available', // Product description (fallback)
                category: product.category || 'Uncategorized', // Category fallback if not provided
            })),
            shippingCost: shipping, // Shipping cost
            total: total, // Total amount
        };      
            console.log('Navigating to Payment with:', products, total); // ตรวจสอบข้อมูลก่อนส่ง
            navigate('/Payment', { state: { order: { items: products, total: total } } });

    };


    return (
        <Container className="my-cart">
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
                                        <button
                                            className="custom-button"
                                            onClick={() => removeProduct(product.id)}
>
                                            <span className="custom-text">Delete</span>
                                            <span className="custom-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                                            </svg>
                                            </span>
                                        </button>

                                    </Card.Body>
                                </Col>
                            </Row>
                        );
                    })
                ) : (
                    <div>
                        <p>ไม่มีสินค้าที่อยู่ในตะกร้า</p>
                        <Link to="/Shop" ><button class='button-57'style={{ border:'3px solid #CC0066', borderRadius: '6%'}}>กลับไปเลือกสินค้าต่อ <span>กลับไปเลือกสินค้าต่อ</span></button></Link>
                    </div>
                )}
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
                <Button
                    variant="success"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={products.length === 0}
                    style={{ width: '100%' }}
                >
                    ไปยังหน้าชำระเงิน
                </Button>
            </div>
        </Container>
    );
};

export default MyCart;
