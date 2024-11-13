import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const sellerNames = {
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': 'SIAM BOARDGAME',
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': 'Lanlalen',
  '940256ba-a9de-4aa9-bad8-604468cb6af3': 'TIME TO PLAY',
  '494d4f06-225c-463e-bd8a-6c9caabc1fc4': 'Towertactic',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': 'DiceCUP',
};

const getSellerImage = (sellerId) => {
  const images = {
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': '/assets/images/SIAM_BOARDGAME.jpg',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': '/assets/images/Lanlalen.jpg',
    '940256ba-a9de-4aa9-bad8-604468cb6af3': '/assets/images/TIME_TO_PLAY.jpg',
    '494d4f06-225c-463e-bd8a-6c9caabc1fc4': '/assets/images/Towertactic.jpg',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': '/assets/images/DiceCUP.jpg',
  };
  return images[sellerId] || '/assets/default_image.png';
};

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
            fontFamily: 'Roboto, Noto Sans Thai, sans-serif',
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
            <li className="nav-item dropdown">
              <Link
                className={`nav-link dropdown-toggle ${location.pathname === '/Shop' ? 'active' : ''}`}
                to="/Shop"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  color: 'white',
                  fontWeight: location.pathname === '/Shop' ? 'bold' : 'normal',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif',
                }}
              >
                ร้านค้า
              </Link>
              <ul className="dropdown-menu">
                {Object.entries(sellerNames).map(([seller_id, seller_name]) => (
                  <li key={seller_id} className="dropdown-item" style={{ fontFamily: 'Roboto, Noto Sans Thai, sans-serif' }}>
                    <Link 
                      to={`/seller/${seller_id}`} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: 'black', 
                        textDecoration: 'none' // Remove underline
                      }}
                    >
                      <img
                        src={getSellerImage(seller_id)}
                        alt={seller_name}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          marginRight: '10px',
                        }}
                      />
                      {seller_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/MyCart' ? 'active' : ''}`}
                to="/MyCart"
                style={{
                  color: 'white',
                  fontWeight: location.pathname === '/MyCart' ? 'bold' : 'normal',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif',
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
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif',
                }}
              >
                ชำระเงิน
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/Ship1' ? 'active' : ''}`}
                to="/Ship1"
                style={{
                  color: 'white',
                  fontWeight: location.pathname === '/Ship1' ? 'bold' : 'normal',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif',
                }}
              >
                การจัดส่ง
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/Contact' ? 'active' : ''}`}
                to="/Contact" // ลิงก์ไปที่หน้า Contact
                style={{
                  color: 'white',
                  fontWeight: location.pathname === '/Contact' ? 'bold' : 'normal',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif',
                }}
              >
                ติดต่อเรา
              </Link>
              
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;
