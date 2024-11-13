import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../App.css';

const Contact_Data = () => {
    return (
        <Container fluid className="p-4">
            <Row className="border border-dark">
                {/* Contact Info Section */}
                <Col md={6} className="p-4 border-end border-dark">
                    <h5>เบอร์ติดต่อ</h5>
                    <p>012-xxx-xxxx</p>
                    <h5>ที่อยู่อีเมล</h5>
                    <p>abc@gmail.com</p>
                </Col>

                {/* Form Section */}
                <Col md={6} className="p-4">
                    <Row className="mb-3">
                        <Col md={4} className="text-center">
                            <div >
                                {/* Placeholder for Image */}
                                <p className="text-center">Image</p>
                            </div>
                        </Col>
                        <Col>
                            {/* Facebook Button */}
                            <button className="styled-button">
                                <svg
                                    viewBox="0 0 26 26"
                                    fill="currentColor"
                                    height="28"
                                    width="28"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 16.9913 5.65783 21.1283 10.4385 21.8785V14.8906H7.89941V12H10.4385V9.79688C10.4385 7.29063 11.9314 5.90625 14.2156 5.90625C15.3097 5.90625 16.4541 6.10156 16.4541 6.10156V8.5625H15.1931C13.9509 8.5625 13.5635 9.33334 13.5635 10.1242V12H16.3369L15.8936 14.8906H13.5635V21.8785C18.3441 21.1283 22.001 16.9913 22.001 12C22.001 6.47715 17.5238 2 12.001 2Z"
                                    ></path>
                                </svg>
                                <span>Facebook</span>
                            </button>

                            <div style={{ border: '1px solid black', height: '50px', marginBottom: '10px' }}></div>
                            <div style={{ border: '1px solid black', height: '50px' }}></div>
                        </Col>
                    </Row>
                    <Form>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>ชื่อ</Form.Label>
                            <Form.Control type="text" placeholder="ชื่อ" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>อีเมล</Form.Label>
                            <Form.Control type="email" placeholder="อีเมล" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label>เบอร์โทร</Form.Label>
                            <Form.Control type="text" placeholder="เบอร์โทร" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formMessage">
                            <Form.Label>ข้อความ</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="ข้อความ" />
                        </Form.Group>

                        <Button variant="danger" type="submit">ส่ง</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Contact_Data;
