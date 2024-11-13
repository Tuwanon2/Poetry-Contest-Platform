import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const MyCart = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [discountPercentage, setDiscountPercentage] = useState(3);
    const placeholderImage = "https://via.placeholder.com/100";
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setProducts(savedCart);
        setLoading(false);
    }, []);

    const updateLocalStorage = (updatedProducts) => {
        localStorage.setItem('cart', JSON.stringify(updatedProducts));
    };

    const shipping = products.length > 0 ? 90 : 0;
    const subtotal = products.reduce((acc, product) => acc + product.price * (product.quantity || 1), 0);
    const isDiscountApplicable = (percentage) => {
        if (percentage === 3) return true;
        if (percentage === 5) return subtotal >= 1500;
        if (percentage === 10) return subtotal >= 4000;
        return false;
    };
    const discount = isDiscountApplicable(discountPercentage) ? (subtotal * discountPercentage) / 100 : 0;
    const total = subtotal - discount + shipping;

    const removeProduct = (productId) => {
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
        updateLocalStorage(updatedProducts);
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
        updateLocalStorage(updatedProducts);
    };

    const handleCheckout = () => {
        navigate('/Payment', { state: { order: { items: products, total: total } } });
    };

    const handleImageClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <Container className="my-cart">
            <h2>ตะกร้าสินค้าของคุณ</h2>
            {loading ? (
                <p>กำลังโหลด...</p>
            ) : products.length > 0 ? (
                <Row>
                    <Col md={9}>
                        <Row
                            className="cart-header"
                            style={{
                                fontWeight: 'bold',
                                backgroundColor: '#e0e0e0',
                                padding: '10px 0',
                                borderRadius: '50px'
                            }}
                        >
                            <Col xs={6}>Products</Col>
                            <Col xs={2} className="text-center">Price</Col>
                            <Col xs={2} className="text-center">Quantity</Col>
                            <Col xs={2} className="text-right">Total</Col>
                        </Row>

                        {products.map((product) => {
                            const primaryImage = product.images.find((img) => img.is_primary)?.image_url || placeholderImage;
                            return (
                                <Card className="mb-3" key={product.id} style={{ border: '1px solid #ddd', borderRadius: '10px' }}>
                                    <Row className="cart-item align-items-center" style={{ padding: '10px' }}>
                                        <Col xs={6} className="d-flex">
                                            <Card.Img
                                                src={primaryImage}
                                                alt={product.name}
                                                onClick={() => handleImageClick(product.id)}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                    marginRight: '15px',
                                                    cursor: 'pointer' // ทำให้ดูเหมือนลิงก์
                                                }}
                                            />
                                            <Card.Body>
                                                <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold' }}>{product.name}</Card.Title>
                                            </Card.Body>
                                        </Col>
                                        <Col xs={2} className="text-center">฿{product.price.toFixed(2)}</Col>
                                        <Col xs={2} className="text-center">
                                            <Button
                                                size="sm"
                                                variant="outline-dark"
                                                onClick={() => changeQuantity(product.id, 'decrease')}
                                                className="round-button"
                                            >
                                                -
                                            </Button>
                                            <span style={{ margin: '0 10px' }}>{product.quantity || 1}</span>
                                            <Button
                                                size="sm"
                                                variant="outline-dark"
                                                onClick={() => changeQuantity(product.id, 'increase')}
                                                className="round-button"
                                            >
                                                +
                                            </Button>
                                        </Col>
                                        <Col xs={2} className="text-right">
                                            ฿{(product.price * (product.quantity || 1)).toFixed(2)}
                                            <button
                                                className="button"
                                                onClick={() => removeProduct(product.id)}
                                                style={{
                                                    position: 'relative',
                                                    left: '-15px',
                                                    top: '5px'
                                                }}
                                            >
                                                <svg viewBox="0 0 448 512" className="svgIcon">
                                                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                                </svg>
                                            </button>
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })}
                    </Col>

                    {/* Cart Summary */}
                    <Col md={3}>
                        <div className="cart-summary" style={{ padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '15px', marginTop: '0px' }}>
                            <h5 style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0', padding: '10px', borderRadius: '15px 15px 0 0' }}>Cart Totals</h5>
                            <div style={{ padding: '20px' }}>
                                <p style={{ fontWeight: 'bold' }}>Subtotal <span style={{ float: 'right' }}>฿{subtotal.toFixed(2)}</span></p>
                                <p>Discount ({discountPercentage}%): <span style={{ float: 'right' }}>-฿{discount.toFixed(2)}</span></p>
                                {products.length > 0 && <p>Shipping <span style={{ float: 'right' }}>฿{shipping}</span></p>}
                                <h4>Total <span style={{ float: 'right' }}>฿{total.toFixed(2)}</span></h4>
                                
                                <Button
                                    className="styled-checkout-button"
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                    <svg
                                        className="styled-checkout-icon"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        height="24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clipPath="url(#clip0_30_96)">
                                            <path
                                                fill="white"
                                                d="M0.479167 11.5C0.203024 11.5 -0.0208333 11.7239 -0.0208333 12C-0.0208333 12.2761 0.203024 12.5 0.479167 12.5V11.5ZM22.9231 12.3536C23.1184 12.1583 23.1184 11.8417 22.9231 11.6464L19.7411 8.46447C19.5459 8.2692 19.2293 8.2692 19.034 8.46447C18.8388 8.65973 18.8388 8.97631 19.034 9.17157L21.7071 11.8447L19.034 14.5178C18.8388 14.7131 18.8388 15.0297 19.034 15.225C19.2293 15.4203 19.5459 15.4203 19.7411 15.225L22.9231 12.3536ZM0.479167 12.5H22.5V11.5H0.479167V12.5Z"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_30_96">
                                                <rect width="24" height="24" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            ) : (
                <button className="cta">
                <Link to="/Shop" style={{ textDecoration: 'none' }}>
                  <span className="hover-underline-animation"> Shop now </span>
                  <svg
                    id="arrow-horizontal"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="100"
                    viewBox="0 0 46 16"
                  >
                    <path
                      id="Path_10"
                      data-name="Path 10"
                      d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                      transform="translate(30)"
                    ></path>
                  </svg>
                </Link>
              </button>

            )}
        </Container>
    );
};

export default MyCart;
