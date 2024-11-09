import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TopMenu = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#CC0066' }}>
      <div className="container-fluid">
        <Link
          className={`navbar-brand ${location.pathname === '/' ? 'active' : ''}`}
          to="/"
          style={{
            color: 'white',
            fontWeight: location.pathname === '/' ? 'bold' : 'normal',
            fontFamily: 'Roboto, Noto Sans Thai, sans-serif'
          }}
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

        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
          <ul className="navbar-nav" style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/Shop' ? 'active' : ''}`}
                to="/Shop"
                style={{
                  color: 'white',
                  fontWeight: location.pathname === '/Shop' ? 'bold' : 'normal',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif'
                }}
              >
                ร้านค้า
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/MyCart' ? 'active' : ''}`}
                to="/MyCart"
                style={{
                  color: 'white',
                  fontWeight: location.pathname === '/MyCart' ? 'bold' : 'normal',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif'
                }}
                
              >
                ตะกร้าของฉัน
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/Payment' ? 'active' : ''}`}
                to="/Payment"
                style={{
                  color: 'white',
                  fontWeight: location.pathname === '/Payment' ? 'bold' : 'normal',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif'
                }}
              >
                ชำระเงิน
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/MyProfile' ? 'active' : ''}`}
                to="/MyProfile"
                style={{
                  color: 'white',
                  fontWeight: location.pathname === '/MyProfile' ? 'bold' : 'normal',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif'
                }}
              >
                ข้อมูลส่วนตัว
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;

