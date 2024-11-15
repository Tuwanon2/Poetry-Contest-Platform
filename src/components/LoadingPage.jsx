import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingPage.css';

const LoadingPage = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisited');

    if (!hasVisitedBefore) {
      // ถ้าไม่เคยเข้าเว็บมาก่อน ให้แสดงหน้า Loading
      setIsFirstVisit(true);
      localStorage.setItem('hasVisited', 'true');

      // ตั้งเวลาหลังจากหน้าโหลดเสร็จให้ไปยังหน้าอื่น
      setTimeout(() => {
        navigate('/'); // เปลี่ยนไปที่หน้าอื่นที่ต้องการหลังจากโหลดเสร็จ
      }, 4000); // แสดงหน้า Loading เป็นเวลา 3 วินาที
    }
  }, [navigate]);

  return (
    <>
      {isFirstVisit ? (
        <div className="loading-container">
          <img 
            src="../assets/images/Namo_Anim.gif" 
            alt="Loading" 
            className="loading-gif"
          />
          <h2 className="text-center mb-4">ยินดีต้อนรับสู่ NAMO BOARDGAME!</h2>
        </div>
      ) : (
        <div className="welcome-message">
          <img 
            src="../assets/images/Namo_Anim.gif" 
            alt="Loading" 
            className="loading-gif"
          />
          <h2 className="text-center mb-4">ยินดีต้อนรับสู่ NAMO BOARDGAME!</h2>
        </div>
      )}
    </>
  );
};

export default LoadingPage;
