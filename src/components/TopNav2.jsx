import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import './TopNav.css';

// ใช้ react-icons แทนรูปภาพ
const ProfileIcon = () => (
  <FaUserCircle style={{ width: 36, height: 36, color: '#222', background: '#fff', borderRadius: '50%', cursor: 'pointer' }} />
);

const TopNav2 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="topnav">
      <div className="topnav-container">
        {/* LEFT — Search Bar */}
        <div className="nav-left">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>

        {/* CENTER — Main Menu */}
        <div className="nav-center">
          <ul className="main-menu">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>หน้าหลัก</Link></li>
            <li className="dropdown">
              <span className={location.pathname.startsWith('/competition') ? 'active' : ''}>กิจกรรมการประกวด</span>
              <div className="dropdown-content">
                <Link to="/competition/student">สำหรับนักเรียน</Link>
                <Link to="/competition/university">สำหรับนิสิตนักศึกษา</Link>
                <Link to="/competition/general">สำหรับประชาชนทั่วไป</Link>
              </div>
            </li>
            <li><Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>ประกาศผล</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>เกี่ยวกับเรา</Link></li>
          </ul>
        </div>

        {/* RIGHT — Profile Icon */}
        <div className="nav-right">
          <ProfileIcon />
        </div>
      </div>
    </nav>
  );
};

export default TopNav2;
