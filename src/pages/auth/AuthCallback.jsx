import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import axios from 'axios';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          // Extract user data from Google
          const { user } = session;
          const email = user.email;
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
          const googleId = user.id;

          // Send to your backend to create/update user
          try {
            const res = await axios.post('http://localhost:8080/api/v1/auth/google-login', {
              email,
              full_name: fullName,
              google_id: googleId,
              provider: 'google'
            });

            const userData = res.data?.user;
            const username = userData?.Username || userData?.username || email;
            const userRole = userData?.role || userData?.Role || '';
            const userId = userData?.id || userData?.ID || userData?.user_id || userData?.UserID;

            // Store in localStorage
            localStorage.setItem('username', username);
            if (userId) localStorage.setItem('user_id', userId.toString());
            if (userData) localStorage.setItem('user', JSON.stringify(userData));
            if (res.data?.token) localStorage.setItem('token', res.data.token);
            
            // Trigger storage event
            window.dispatchEvent(new Event('storage'));

            // Redirect based on role
            if (userRole.toLowerCase() === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          } catch (backendError) {
            console.error('Backend error:', backendError);
            // If backend fails, still store basic info and redirect
            localStorage.setItem('username', email);
            localStorage.setItem('user', JSON.stringify({ email, full_name: fullName }));
            window.dispatchEvent(new Event('storage'));
            navigate('/');
          }
        } else {
          throw new Error('No session found');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f6fa'
    }}>
      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        {error ? (
          <>
            <div style={{ color: '#b71c1c', marginBottom: '16px' }}>
              {error}
            </div>
            <p>กำลังนำคุณกลับไปหน้า Login...</p>
          </>
        ) : (
          <>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #70136c',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p>กำลังเข้าสู่ระบบ...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
