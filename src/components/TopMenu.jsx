import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TopMenu = () => {
  const location = useLocation();

  return (
    <>
      {/* บังคับสีตัวหนังสือ ชนะ CSS ทุกตัว */}
      <style>
        {`
          .topmenu a,
          .topmenu span {
            color: #222 !important;
          }

          .topmenu a:hover,
          .topmenu span:hover {
            color: #70136C !important;
          }

          .menu-dropdown-hover:hover + .menu-dropdown-content,
          .menu-dropdown-content:hover {
            display: block !important;
          }
        `}
      </style>

      <nav
        className="topmenu"
        style={{
          background: '#fff',
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: 70
          }}
        >
          <ul
            style={{
              display: 'flex',
              gap: 32,
              listStyle: 'none',
              margin: 0,
              padding: 0,
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <li>
              <Link
                to="/"
                style={{
                  fontWeight: location.pathname === '/' ? 'bold' : 'normal',
                  textDecoration: 'none',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif'
                }}
              >
                หน้าหลัก
              </Link>
            </li>

            <li style={{ position: 'relative' }}>
              <span
                className="menu-dropdown-hover"
                style={{
                  fontWeight: location.pathname.startsWith('/competition')
                    ? 'bold'
                    : 'normal',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                กิจกรรมการประกวด
              </span>

              <div
                className="menu-dropdown-content"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '100%',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderRadius: 8,
                  minWidth: 180,
                  display: 'none',
                  zIndex: 10
                }}
              >
                <Link to="/competition/student" style={{ display: 'block', padding: '10px 16px', textDecoration: 'none' }}>
                  สำหรับนักเรียน
                </Link>
                <Link to="/competition/university" style={{ display: 'block', padding: '10px 16px', textDecoration: 'none' }}>
                  สำหรับนิสิตนักศึกษา
                </Link>
                <Link to="/competition/general" style={{ display: 'block', padding: '10px 16px', textDecoration: 'none' }}>
                  สำหรับประชาชนทั่วไป
                </Link>
              </div>
            </li>

            <li>
              <Link
                to="/results"
                style={{
                  fontWeight: location.pathname === '/results' ? 'bold' : 'normal',
                  textDecoration: 'none',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif'
                }}
              >
                ประกาศผล
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                style={{
                  fontWeight: location.pathname === '/about' ? 'bold' : 'normal',
                  textDecoration: 'none',
                  fontFamily: 'Roboto, Noto Sans Thai, sans-serif'
                }}
              >
                เกี่ยวกับเรา
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default TopMenu;
