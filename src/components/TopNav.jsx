import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { Button, Modal, Dropdown } from 'react-bootstrap'; // เพิ่ม Dropdown จาก react-bootstrap
import GoogleAuth from './GoogleAuth';

const TopNav = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const navigate = useNavigate();

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก sessionStorage เมื่อหน้าเว็บถูกโหลดหรือรีเฟรช
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // กำหนดข้อมูลผู้ใช้ใน state
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  const handleShow = () => setShowLogin(true);
  const handleClose = () => setShowLogin(false);

  const handleLogout = () => {
    // ลบข้อมูลผู้ใช้จาก sessionStorage
    sessionStorage.removeItem('user');
    setUser(null); // รีเซ็ต state
    navigate('/'); // เปลี่ยนเส้นทางกลับไปที่หน้าหลัก
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">
          <img src="/assets/namo-logo.png" alt="Logo" width="65" height="50" />
          Namo Boardgame
        </Link>

        <form onSubmit={handleSearchSubmit} className="d-flex flex-grow-1 mx-4">
          <input
            className="form-control me-2 w-100"
            type="search"
            placeholder="ค้นหา"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            <FaSearch />
          </button>
        </form>

        <div className="d-flex">
          <Link className="btn btn-light" to="/cart">
            <FaShoppingCart /> <span className="badge bg-danger">2</span>
          </Link>

          {user ? (
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center">
                <img
                  src={user.picture} // รูปภาพจาก Google
                  alt="user-profile"
                  style={{ borderRadius: '50%', width: '40px' }}
                  referrerPolicy="no-referrer"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button variant="light" className="ms-2" onClick={handleShow}>
              <FaUser /> เข้าสู่ระบบ
            </Button>
          )}
        </div>
      </div>

      {/* Modal สำหรับเข้าสู่ระบบ */}
      <Modal show={showLogin} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>เข้าสู่ระบบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GoogleAuth
            setUser={(user) => {
              setUser(user);
              sessionStorage.setItem('user', JSON.stringify(user)); // เก็บข้อมูลผู้ใช้ใน sessionStorage
            }}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal>
    </nav>
  );
};

export default TopNav;
