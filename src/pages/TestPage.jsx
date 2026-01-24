import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Noto Sans Thai, sans-serif'
    }}>
      <h1 style={{ color: '#70136C', marginBottom: '20px' }}>
        🎉 หน้าทดสอบ Route
      </h1>
      
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        ถ้าคุณเห็นหน้านี้แสดงว่า React Router ทำงานได้ปกติ!
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            background: '#70136C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← กลับหน้าหลัก
        </button>

        <button
          onClick={() => navigate('/my-organizations')}
          style={{
            padding: '12px 24px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ไป MyOrganizations
        </button>

        <button
          onClick={() => navigate('/create-organization')}
          style={{
            padding: '12px 24px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ไป CreateOrganization
        </button>
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0 }}>ข้อมูล localStorage/sessionStorage:</h3>
        <pre style={{
          background: 'white',
          padding: '15px',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify({
            username: localStorage.getItem('username') || sessionStorage.getItem('username'),
            user_id: localStorage.getItem('user_id') || sessionStorage.getItem('user_id'),
            hasUser: !!(localStorage.getItem('user') || sessionStorage.getItem('user'))
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestPage;
