import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import axios from 'axios';
import HomeAdminButton from '../components/HomeAdminButton';
import TopNav from '../components/TopNav';
// import TopMenu from '../components/TopMenu';
import BannerCarousel from '../components/BannerCarousel';
import ActivitiesList from '../components/ActivitiesList';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Google OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if URL has hash (from OAuth redirect)
      if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log('OAuth callback detected');
        
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          if (session && session.user) {
            console.log('User from OAuth:', session.user);
            
            const { user } = session;
            const email = user.email;
            const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email;
            const googleId = user.id;
            
            try {
              // Send to backend
              const res = await axios.post(`${API_BASE_URL}/auth/google-login`, {
                email,
                full_name: fullName,
                google_id: googleId,
                provider: 'google'
              });
              
              const userData = res.data?.user;
              const username = userData?.username || userData?.Username || email;
              const userRole = userData?.role || userData?.Role || 'user';
              const userId = userData?.user_id || userData?.UserID || userData?.id || userData?.ID;
              
              // Store in localStorage
              localStorage.setItem('username', username);
              if (userId) localStorage.setItem('user_id', userId.toString());
              if (userData) localStorage.setItem('user', JSON.stringify(userData));
              if (res.data?.token) localStorage.setItem('token', res.data.token);
              
              window.dispatchEvent(new Event('storage'));
              
              console.log('Login successful, redirecting...');
              
              // Clean URL and redirect
              if (userRole.toLowerCase() === 'admin') {
                window.location.href = '/admin';
              } else {
                window.location.href = '/';
              }
              
            } catch (backendError) {
              console.error('Backend error:', backendError);
              // Store basic info even if backend fails
              localStorage.setItem('username', email);
              localStorage.setItem('user', JSON.stringify({ 
                email, 
                full_name: fullName,
                username: email,
                role: 'user'
              }));
              window.dispatchEvent(new Event('storage'));
              window.location.href = '/';
            }
          }
        } catch (err) {
          console.error('OAuth callback error:', err);
        }
      }
    };
    
    handleOAuthCallback();
  }, []);

  let filterCategory = null;
  if (location.pathname === '/competition/student') filterCategory = 'นักเรียน';
  if (location.pathname === '/competition/university') filterCategory = 'นิสิต';
  if (location.pathname === '/competition/general') filterCategory = 'ประชาชนทั่วไป';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          transition: 'margin-left 0.25s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <TopNav />

        {/* 🔥 Banner */}
        <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 24px' }}>
          <BannerCarousel />
        </div>

        {/* Activities */}
        <ActivitiesList filterCategory={filterCategory} />

        {/* Floating Social Icons */}
        <div className="elgy-tooltip-container">
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default Home;