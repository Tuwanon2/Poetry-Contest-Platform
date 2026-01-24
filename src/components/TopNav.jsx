import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import './TopNav.css';

const TopNav = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
    // Close profile menu when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown-container')) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('storage', checkAuth);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [location]); // Re-check when location changes

  const handleLogout = () => {
    // Clear all auth data
    sessionStorage.clear();
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
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
                  <Link to="/competition/primary">ระดับประถม</Link>
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
              <div className="profile-dropdown-container">
                <FaUserCircle 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  style={{ 
                    width: 40, 
                    height: 40, 
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                  title={username}
                />
                {isProfileMenuOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-menu">
                      <div className="menu-item" onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}>
                        ดูโปรไฟล์
                      </div>
                      <div className="menu-item" onClick={() => { navigate('/my-organizations'); setIsProfileMenuOpen(false); }}>
                        Organizations ของฉัน
                      </div>
                      <div className="menu-item" onClick={() => { navigate('/my-works'); setIsProfileMenuOpen(false); }}>
                        ผลงานที่ส่งประกวด
                      </div>
                      <div className="menu-item" onClick={() => { navigate('/judge/contests'); setIsProfileMenuOpen(false); }}>
                        งานกรรมการ
                      </div>
                      <div className="menu-item" onClick={() => { navigate('/help'); setIsProfileMenuOpen(false); }}>
                        ช่วยเหลือ/คู่มือ
                      </div>
                      <div className="menu-divider"></div>
                      <div className="menu-item" onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}>
                        ออกจากระบบ
                      </div>
                    </div>
                  </div>
                )}
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