import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import axios from 'axios';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [status, setStatus] = useState('กำลังเข้าสู่ระบบ...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Starting auth callback...');
        console.log('Current URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        
        setStatus('กำลังตรวจสอบข้อมูล...');
        
        // Check if we have hash parameters (Supabase implicit flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log('Has access token in hash:', !!accessToken);
        
        // Get the session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        console.log('Session:', session);
        console.log('Session error:', sessionError);

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (session && session.user) {
          console.log('User found:', session.user);
          setStatus('กำลังบันทึกข้อมูล...');
          
          // Extract user data from Google
          const { user } = session;
          const email = user.email;
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email;
          const googleId = user.id;
          const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

          console.log('User data:', { email, fullName, googleId });

          // Send to your backend to create/update user
          try {
            setStatus('กำลังเชื่อมต่อกับระบบ...');
            const res = await axios.post('http://localhost:8080/api/v1/auth/google-login', {
              email,
              full_name: fullName,
              google_id: googleId,
              provider: 'google',
              avatar_url: avatarUrl
            });

            console.log('Backend response:', res.data);

            const userData = res.data?.user;
            const username = userData?.username || userData?.Username || email;
            const userRole = userData?.role || userData?.Role || 'user';
            const userId = userData?.user_id || userData?.UserID || userData?.id || userData?.ID;

            // Store in localStorage
            localStorage.setItem('username', username);
            if (userId) localStorage.setItem('user_id', userId.toString());
            if (userData) localStorage.setItem('user', JSON.stringify(userData));
            if (res.data?.token) localStorage.setItem('token', res.data.token);
            
            // Trigger storage event
            window.dispatchEvent(new Event('storage'));

            console.log('Redirecting to home...');
            setStatus('เข้าสู่ระบบสำเร็จ!');
            
            // Redirect based on role
            setTimeout(() => {
              if (userRole.toLowerCase() === 'admin') {
                navigate('/admin', { replace: true });
              } else {
                navigate('/', { replace: true });
              }
            }, 500);

          } catch (backendError) {
            console.error('Backend error:', backendError);
            console.error('Backend error response:', backendError.response?.data);
            
            // If backend fails, still store basic info and redirect
            console.log('Backend failed, storing basic info and redirecting...');
            localStorage.setItem('username', email);
            localStorage.setItem('user', JSON.stringify({ 
              email, 
              full_name: fullName,
              username: email,
              role: 'user'
            }));
            window.dispatchEvent(new Event('storage'));
            
            setStatus('เข้าสู่ระบบสำเร็จ!');
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 500);
          }
        } else {
          console.error('No session or user found');
          throw new Error('ไม่พบข้อมูล session กรุณาลองใหม่อีกครั้ง');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
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
            <p>{status}</p>
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
