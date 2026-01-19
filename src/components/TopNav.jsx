import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import SidebarHome from './SidebarHome';
import './TopNav.css';

const TopNav = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // ตรวจสอบ login status
  useEffect(() => {
    const checkAuth = () => {
      const user = sessionStorage.getItem('user') || localStorage.getItem('user');
      const storedUsername = sessionStorage.getItem('username') || localStorage.getItem('username');
      if (user || storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername || '');
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    };
    checkAuth();
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    // Also listen when navigating (for same-tab login)
    const handleLocationChange = () => checkAuth();
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [location]); // Re-check when location changes

  const handleLogout = () => {
    // Clear all auth data
    sessionStorage.clear();
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <nav className="topnav">
        <div className="topnav-container">
          {/* LEFT SECTION */}
          <div className="nav-left">
            {/* เรียกใช้ SidebarHome (ปุ่ม Hamburger จะแสดงตรงนี้) */}
            <div className="sidebar-trigger-wrapper">
              <SidebarHome open={isSidebarOpen} setOpen={setSidebarOpen} />
            </div>

            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="ค้นหาการประกวด..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>
          </div>

          {/* CENTER SECTION */}
          <div className="nav-center">
            <ul className="main-menu">
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>หน้าหลัก</Link></li>
              <li className="dropdown">
                <span className={location.pathname.startsWith('/competition') ? 'active' : ''}>
                  กิจกรรมการประกวด
                </span>
                <div className="dropdown-content">
                  <Link to="/competition/student">ระดับประถม</Link>
                  <Link to="/competition/secondary">ระดับมัธยม</Link>
                  <Link to="/competition/university">ระดับนักศึกษา</Link>
                  <Link to="/competition/general">ระดับประชาชนทั่วไป</Link>
                </div>
              </li>
              <li><Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>ประกาศผล</Link></li>
              <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>เกี่ยวกับเรา</Link></li>
            </ul>
          </div>

          {/* RIGHT SECTION */}
          <div className="nav-right">
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', color: '#555' }}>สวัสดี, {username}</span>
                <button 
                  onClick={handleLogout}
                  className="signin-btn"
                  style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <Link to="/login" className="signin-btn">เข้าสู่ระบบ</Link>
            )}
          </div>
        </div>
      </nav>
      {/* ดัน Content ลงมาไม่ให้โดน Navbar ทับ (Optional) */}
      <div style={{ height: '70px' }}></div> 
    </>
  );
};

export default TopNav;