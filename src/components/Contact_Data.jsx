import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../App.css';

const Contact_Data = () => {
    // Initialize state for each input field
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        issue: ''
    });

    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('ทาง Namo จะรีบแก้ไขปัญหานะคะ');

        // Reset the form after submission
        setFormData({
            name: '',
            email: '',
            phone: '',
            issue: ''
        });
    };

    return (
        <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa' }}>

            

            <Row className="border border-dark">
                {/* Left Section: Student Info */}
                <Col md={6} className="p-4 border-end border-dark" style={{ backgroundColor: '#ffffff', borderRadius: '10px' }}>

                <h3 className="text-center mb-4" style={{ fontSize: '2.2rem', fontWeight: '600', color: '#B740D8' }}>ติดต่อเรา</h3>
                <h3 className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#CC6CE7' }}>012-345-6789</h3>

    <h5 className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#99BBFA' }}>-------------------------------------------------------------------</h5>
    <h5 className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4943D4' }}>รายชื่อนักศึกษา</h5>
   
 
    <ul className="list-unstyled">
        <li className="mb-3" style={{ fontSize: '1.2rem', fontWeight: '500', lineHeight: '1.5' }}>
            <strong>ชื่อ:</strong> นาย ธุวานนท์ ใจกล้า - <strong>รหัส:</strong> 650710159
        </li>
        <li className="mb-3" style={{ fontSize: '1.2rem', fontWeight: '500', lineHeight: '1.5' }}>
            <strong>ชื่อ:</strong> นางสาว จิราพร ศรีใสสุข - <strong>รหัส:</strong> 650710676
        </li>
        <li className="mb-3" style={{ fontSize: '1.2rem', fontWeight: '500', lineHeight: '1.5' }}>
            <strong>ชื่อ:</strong> นางสาว.ปภาดา ไชยพงษ์ - <strong>รหัส:</strong> 650710699
        </li>
        <li className="mb-3" style={{ fontSize: '1.2rem', fontWeight: '500', lineHeight: '1.5' }}>
            <strong>ชื่อ:</strong> นางสาวอาทิตยา แสงกระจ่าง - <strong>รหัส:</strong> 650710733
        </li>
        <li className="mb-3" style={{ fontSize: '1.2rem', fontWeight: '500', lineHeight: '1.5' }}>
            <strong>ชื่อ:</strong> นาย ชนกันต์ กิตติวิริยะ - <strong>รหัส:</strong> 650710862
        </li>
    </ul>
</Col>


                {/* Right Section: Request Form */}
                <Col md={6} className="p-4" style={{ backgroundColor: '#ffffff' }}>
                    {/* GIF at the top of the form */}
                    <div className="text-center mb-3">
                        <img src="/assets/images/bug_fix.gif" alt="request gif" style={{ width: '128px', maxHeight: '128px', objectFit: 'cover' }} />
                    </div>
                    <h5 className="text-center"> <strong>คำร้อง</strong>  </h5>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>ชื่อ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="ชื่อ"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>อีเมล</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="อีเมล"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label>เบอร์โทร</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="เบอร์โทร"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formIssue">
                            <Form.Label>ปัญหา</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="อธิบายปัญหาที่เกิดขึ้น"
                                name="issue"
                                value={formData.issue}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        
  <div class="gradient-btn-1"  variant="danger" type="submit">
    <div class="gradient-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
      </svg>
      <span>ส่ง</span>
    </div>
  </div>
  
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Contact_Data;
