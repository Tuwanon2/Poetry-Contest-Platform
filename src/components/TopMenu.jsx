import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TopMenu = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0">
      <div className="container-fluid">
        <Link
          className={`navbar-brand ${location.pathname === '/' ? 'active' : ''}`}
          to="/"
        >
          หน้าแรก
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/Seller' ? 'active' : ''}`}
                to="/Seller"
              >
                ร้านค้า
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/MyCart' ? 'active' : ''}`}
                to="/MyCart"
              >
                ตะกร้าของฉัน
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/Payment' ? 'active' : ''}`}
                to="/Payment"
              >
                การชำระเงิน
              </Link>
            </li>
            
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/MyProfile' ? 'active' : ''}`}
                to="/MyProfile"
              >
                ข้อมูลส่วนตัว
              </Link>
            </li>
            {/* เพิ่มลิงก์อื่น ๆ ที่ต้องการ */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;
