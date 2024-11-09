import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EditAddress = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    address: '',
    street: '',
    subDistrict: '',  // แยก subDistrict ออกจาก district
    district: '',
    province: '',
    country: '',
    postalCode: '',
    email: '',
    additionalInfo: ''
  });

  // ดึงข้อมูลจาก localStorage เมื่อโหลดหน้า
  useEffect(() => {
    const storedAddress = JSON.parse(localStorage.getItem('address'));
    if (storedAddress) {
      setFormData(storedAddress);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ฟังก์ชันตรวจสอบว่าได้กรอกข้อมูลที่จำเป็นครบหรือไม่
  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.phone &&
      formData.address &&
      formData.street &&
      formData.subDistrict &&  // ตรวจสอบ subDistrict ด้วย
      formData.district &&
      formData.province &&
      formData.country &&
      formData.postalCode &&
      formData.email
    );
  };

  const handleSubmit = () => {
    // บันทึกข้อมูลที่แก้ไขลง localStorage
    localStorage.setItem('address', JSON.stringify(formData));
    // นำทางไปยังหน้า Payment
    navigate('/payment');
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <center><h1>แก้ไขที่อยู่</h1></center>
      </Row>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>ชื่อจริง *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="ชื่อจริง" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>นามสกุล *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="นามสกุล" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhoneNumber">
                  <Form.Label>เบอร์โทรศัพท์ *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="เบอร์โทรศัพท์" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCompany">
                  <Form.Label>บริษัท</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="บริษัท" 
                    name="company"
                    value={formData.company}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>ที่อยู่ *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="บ้านเลขที่, หมู่ที่, อาคาร" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange} 
                  />
                  <Form.Label>แขวง / ตำบล *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="แขวง / ตำบล" 
                    name="subDistrict" // ใช้ชื่อแตกต่างจาก "district"
                    value={formData.subDistrict} // ใช้ค่าใน formData.subDistrict
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formStreet">
                  <Form.Label>ถนน / ซอย *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="ถนน / ซอย" 
                    name="street"
                    value={formData.street}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDistrict">
                  <Form.Label>เขต / อำเภอ *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="เขต / อำเภอ" 
                    name="district" // ชื่อฟิลด์ให้แตกต่างจาก "province" และ "street"
                    value={formData.district}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formProvince">
                  <Form.Label>จังหวัด *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="จังหวัด" 
                    name="province" // ยังคงเป็น "province"
                    value={formData.province}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCountry">
                  <Form.Label>ประเทศ *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="ประเทศ" 
                    name="country"
                    value={formData.country}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPostalCode">
                  <Form.Label>รหัสไปรษณีย์ *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="รหัสไปรษณีย์" 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>อีเมล *</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="อีเมล" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAdditionalInfo">
                  <Form.Label>ข้อมูลเพิ่มเติม</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="ข้อมูลเพิ่มเติม" 
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange} 
                  />
                </Form.Group>

                <Button variant="secondary" className="me-2" onClick={() => navigate('/payment')}>
                  ยกเลิก
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSubmit} 
                  disabled={!isFormValid()} // ปิดปุ่มเมื่อข้อมูลไม่ครบ
                >
                  ยืนยัน
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditAddress;
