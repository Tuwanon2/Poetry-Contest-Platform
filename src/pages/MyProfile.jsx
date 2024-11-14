import React, { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';
import GoogleAuth from '../components/GoogleAuth';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import EditAddres from '../components/EditAddres';  // ใช้ EditAddres แทน Payments

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [address, setAddress] = useState({});
  const [showEditAddress, setShowEditAddress] = useState(false);  // ใช้ state เพื่อแสดง EditAddres

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก sessionStorage เมื่อ component ถูกโหลด
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setNewName(userData.name); // ตั้งค่าชื่อปัจจุบันให้กับ input
    }

    // ดึงข้อมูลที่อยู่จาก localStorage
    const storedAddress = JSON.parse(localStorage.getItem('address'));
    if (storedAddress) {
      setAddress(storedAddress);
    }
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value); // อัปเดตชื่อใหม่ที่ผู้ใช้กรอก
  };

  const handleSaveName = () => {
    const updatedUser = { ...user, name: newName }; // สร้าง object ผู้ใช้ใหม่ที่มีชื่อใหม่
    setUser(updatedUser); // อัปเดต user ใน state
    sessionStorage.setItem('user', JSON.stringify(updatedUser)); // อัปเดตข้อมูลใน sessionStorage
    setEditingName(false); // ปิดฟอร์มแก้ไขชื่อ
  };

  const handleNavigateToChooseAddress = () => {
    setShowEditAddress(true); // เมื่อกดปุ่มแก้ไขที่อยู่ให้แสดง EditAddres component
  };

  return (
    <div>
      <TopNav />
      <TopMenu />
      
      <Container className="mt-5">
        <Row className="justify-content-center mb-4">
          <Col lg={6} md={12}>
            <Card className="shadow-lg rounded">
              <Card.Body>
                <h3 className="text-center mb-4">ข้อมูลผู้ใช้</h3>
                {user ? (
                  <div className="text-center">
                    <img
                      src={user.picture}
                      alt={`${user.name}'s profile`}
                      className="img-fluid rounded-circle mb-3"
                      style={{ width: '150px', height: '150px' }}
                    />
                    {editingName ? (
                      <div>
                        <input
                          type="text"
                          value={newName}
                          onChange={handleNameChange}
                          className="form-control mb-2"
                        />
                        <Button variant="primary" onClick={handleSaveName} className="w-100">
                          บันทึกชื่อ
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h5>{user.name}</h5>
                        <p>{user.email}</p>
                        <Button
                          variant="outline-secondary"
                          onClick={() => setEditingName(true)}
                          className="mb-3 w-100"
                        >
                          แก้ไขชื่อ
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p>กรุณาล็อกอินเพื่อดูข้อมูลโปรไฟล์</p>
                    <GoogleAuth setUser={setUser} handleClose={() => {}} />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} md={12}>
            {/* ส่วนแสดงที่อยู่จัดส่ง */}
            <Card className="shadow-lg rounded">
              <Card.Body>
                <h3 className="text-center mb-4">ที่อยู่จัดส่ง</h3>
                {address.firstName ? (
                  <div>
                    <p>{address.firstName} {address.lastName} │ {address.phone}</p>
                    <p>{address.company}, {address.address}, {address.subDistrict}, {address.street}, {address.district}, {address.province}, {address.country} {address.postalCode}</p>
                  </div>
                ) : (
                  <p>กรุณากรอกที่อยู่ในการจัดส่ง</p>
                )}

                <Button 
                  variant="outline-danger" 
                  onClick={handleNavigateToChooseAddress} 
                  className="w-100 mt-3"
                >
                  แก้ไขที่อยู่
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* แสดง EditAddres เมื่อมีการกดปุ่มแก้ไขที่อยู่ */}
        {showEditAddress && <EditAddres />}
      </Container>

      <Footer />
    </div>
  );
};

export default MyProfile;
