import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ใช้ useNavigate สำหรับเปลี่ยนเส้นทาง
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';

const TopNav = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // ใช้ในการเปลี่ยนเส้นทาง

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      // เปลี่ยนเส้นทางไปที่หน้าผลการค้นหา พร้อม query string
      navigate(`/search?q=${searchTerm}`);
    }
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo ชิดซ้าย */}
        <Link className="navbar-brand" to="/">
          <img src="/assets/logo.png" alt="Logo" width="45" height="30" />
          E-Commerce
        </Link>

        {/* ช่องค้นหา */}
        <form onSubmit={handleSearchSubmit} className="d-flex flex-grow-1 mx-4">
          <input
            className="form-control me-2 w-100"
            type="search"
            placeholder="ค้นหาสินค้า"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            <FaSearch />
          </button>
        </form>

        {/* ตะกร้าและผู้ใช้ชิดขวา */}
        <div className="d-flex">
          <Link className="btn btn-light" to="/cart">
            <FaShoppingCart /> <span className="badge bg-danger">2</span>
          </Link>
          <Link className="btn btn-light ms-2" to="/user">
            <FaUser />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;