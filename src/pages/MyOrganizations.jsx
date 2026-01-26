import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';

import '../styles/MyOrganizations.css';

const MyOrganizations = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username') || sessionStorage.getItem('username');
    const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
    
    if (!username && !userId) {
      navigate('/login');
      return;
    }

    fetchMyOrganizations();
  }, [navigate]);

  const fetchMyOrganizations = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
      
      const res = await axios.get(`http://localhost:8080/api/v1/organizations/user/${userId}`);
      console.log('Organizations data:', res.data); // Debug log
      
      setOrganizations(res.data || []);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('ไม่สามารถโหลดข้อมูล Organizations ได้');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'รอการอนุมัติ', color: '#FFA500' },
      approved: { text: 'อนุมัติแล้ว', color: '#4CAF50' },
      rejected: { text: 'ไม่อนุมัติ', color: '#F44336' }
    };
    const s = statusMap[status] || { text: status, color: '#999' };
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: '500',
        background: `${s.color}20`,
        color: s.color
      }}>
        {s.text}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      creator: { text: 'ผู้สร้าง', color: '#70136C' },
      member: { text: 'สมาชิก', color: '#757575' }
    };
    const r = roleMap[role] || { text: 'สมาชิก', color: '#757575' };
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: '500',
        background: `${r.color}20`,
        color: r.color
      }}>
        {r.text}
      </span>
    );
  };

  const handleAcceptInvitation = async (memberId) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/organizations/members/${memberId}/accept`);
      alert('ยอมรับคำเชิญสำเร็จ!');
      fetchMyOrganizations(); // Refresh
    } catch (err) {
      console.error('Error accepting invitation:', err);
      alert('เกิดข้อผิดพลาดในการยอมรับคำเชิญ');
    }
  };

  const handleRejectInvitation = async (memberId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะปฏิเสธคำเชิญนี้?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/v1/organizations/members/${memberId}/reject`);
      alert('ปฏิเสธคำเชิญสำเร็จ');
      fetchMyOrganizations(); // Refresh
    } catch (err) {
      console.error('Error rejecting invitation:', err);
      alert('เกิดข้อผิดพลาดในการปฏิเสธคำเชิญ');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{
        flex: 1,
        minWidth: 0,
        transition: 'margin-left 0.25s cubic-bezier(.4,0,.2,1)',
      }}>
        <TopNav />

        <div className="my-orgs-container">
          <div className="my-orgs-header">
            <div className="header-left">
              <button className="back-btn" onClick={() => navigate('/')}>
                ← กลับ
              </button>
              <h1>Organizations ของฉัน</h1>
            </div>
            <button 
              className="create-org-btn"
              onClick={() => navigate('/create-organization')}
            >
              + สร้าง Organization
            </button>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && organizations.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h2>ยังไม่มี Organization</h2>
              <p>คุณยังไม่ได้เป็นสมาชิกของ Organization ใดๆ</p>
              <button 
                className="create-org-btn-large"
                onClick={() => navigate('/create-organization')}
              >
                สร้าง Organization แรกของคุณ
              </button>
            </div>
          )}

          {!loading && !error && organizations.length > 0 && (
            <>
              {/* คำเชิญที่รอการตอบรับ (status = pending) */}
              {organizations.filter(org => org.member_status === 'pending').length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '20px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid #FF9800'
                  }}>
                    <span style={{ fontSize: '24px' }}>📬</span>
                    <h2 style={{ margin: 0, color: '#FF9800', fontSize: '20px' }}>
                      คำเชิญที่รอการตอบรับ
                    </h2>
                    <span style={{ 
                      background: '#FF9800', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {organizations.filter(org => org.member_status === 'pending').length}
                    </span>
                  </div>
                  
                  <div className="orgs-grid">
                    {organizations.filter(org => org.member_status === 'pending').map((org) => (
                      <div 
                        key={org.organization_id} 
                        className="org-card"
                        style={{ 
                          borderLeft: '4px solid #FF9800',
                          cursor: 'default'
                        }}
                      >
                        <div className="org-cover">
                          {org.cover_image ? (
                            <img src={org.cover_image} alt={org.name} />
                          ) : (
                            <div className="org-cover-placeholder">
                              <span>🏢</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="org-content">
                          <h3>{org.name}</h3>
                          <p className="org-description">
                            {org.description || 'ไม่มีคำอธิบาย'}
                          </p>
                          
                          <div style={{ 
                            marginTop: '16px', 
                            padding: '12px', 
                            background: '#FFF8E1', 
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: '#F57C00',
                            marginBottom: '12px'
                          }}>
                            📩 คุณได้รับเชิญให้เป็นสมาชิกใน Organization นี้
                          </div>

                          {/* แสดงปุ่มตอบรับ/ปฏิเสธสำหรับ pending invitations */}
                          <div style={{ 
                            display: 'flex', 
                            gap: '8px',
                            marginTop: '12px'
                          }}>
                            <button
                              onClick={() => handleAcceptInvitation(org.member_id)}
                              style={{
                                flex: 1,
                                padding: '10px',
                                background: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#45a049'}
                              onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
                            >
                              ✅ ยอมรับ
                            </button>

                            <button
                              onClick={() => handleRejectInvitation(org.member_id)}
                              style={{
                                flex: 1,
                                padding: '10px',
                                background: '#F44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#e53935'}
                              onMouseLeave={(e) => e.target.style.background = '#F44336'}
                            >
                              ❌ ปฏิเสธ
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizations ที่อนุมัติแล้ว (status = accepted) */}
              {organizations.filter(org => org.status === 'approved' && org.member_status === 'accepted').length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '20px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid #70136C'
                  }}>
                    <span style={{ fontSize: '24px' }}>✅</span>
                    <h2 style={{ margin: 0, color: '#70136C', fontSize: '20px' }}>
                      Organizations ที่ใช้งานได้
                    </h2>
                    <span style={{ 
                      background: '#4CAF50', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {organizations.filter(org => org.status === 'approved').length}
                    </span>
                  </div>
                  
                  <div className="orgs-grid">
                    {organizations.filter(org => org.status === 'approved' && org.member_status === 'accepted').map((org) => (
                      <div 
                        key={org.organization_id} 
                        className="org-card"
                        onClick={() => navigate(`/organization/${org.organization_id}`)}
                        style={{ borderLeft: '4px solid #4CAF50' }}
                      >
                        <div className="org-cover">
                          {org.cover_image ? (
                            <img src={org.cover_image} alt={org.name} />
                          ) : (
                            <div className="org-cover-placeholder">
                              <span>🏢</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="org-content">
                          <h3>{org.name}</h3>
                          <p className="org-description">
                            {org.description || 'ไม่มีคำอธิบาย'}
                          </p>
                          
                          <div className="org-meta">
                            
                            {getStatusBadge(org.status)}
                          </div>
                          
                          <div className="org-stats">
                            <span>สมาชิก {org.member_count || 0} คน</span>
                            <span>•</span>
                            <span>การประกวด {org.competition_count || 0} รายการ</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizations ที่รออนุมัติ */}
              {organizations.filter(org => org.status === 'pending').length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '20px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid #FFA500'
                  }}>
                    <span style={{ fontSize: '24px' }}>⏳</span>
                    <h2 style={{ margin: 0, color: '#FFA500', fontSize: '20px' }}>
                      รอการอนุมัติจากแอดมิน
                    </h2>
                    <span style={{ 
                      background: '#FFA500', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {organizations.filter(org => org.status === 'pending').length}
                    </span>
                  </div>
                  
                  <div className="orgs-grid">
                    {organizations.filter(org => org.status === 'pending').map((org) => (
                      <div 
                        key={org.organization_id} 
                        className="org-card"
                        style={{ 
                          borderLeft: '4px solid #FFA500',
                          opacity: 0.85,
                          cursor: 'default'
                        }}
                      >
                        <div className="org-cover">
                          {org.cover_image ? (
                            <img src={org.cover_image} alt={org.name} style={{ filter: 'grayscale(50%)' }} />
                          ) : (
                            <div className="org-cover-placeholder">
                              <span>🏢</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="org-content">
                          <h3>{org.name}</h3>
                          <p className="org-description">
                            {org.description || 'ไม่มีคำอธิบาย'}
                          </p>
                          
                          <div className="org-meta">
                            
                            {getStatusBadge(org.status)}
                          </div>
                          
                          <div style={{ 
                            marginTop: '12px', 
                            padding: '10px', 
                            background: '#FFF9E6', 
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: '#F57C00'
                          }}>
                            ⏰ Organization นี้กำลังรอการตรวจสอบจากผู้ดูแลระบบ
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizations ที่ถูกปฏิเสธ */}
              {organizations.filter(org => org.status === 'rejected').length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '20px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid #F44336'
                  }}>
                    <span style={{ fontSize: '24px' }}>❌</span>
                    <h2 style={{ margin: 0, color: '#F44336', fontSize: '20px' }}>
                      ไม่ผ่านการอนุมัติ
                    </h2>
                    <span style={{ 
                      background: '#F44336', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {organizations.filter(org => org.status === 'rejected').length}
                    </span>
                  </div>
                  
                  <div className="orgs-grid">
                    {organizations.filter(org => org.status === 'rejected').map((org) => (
                      <div 
                        key={org.organization_id} 
                        className="org-card"
                        style={{ 
                          borderLeft: '4px solid #F44336',
                          opacity: 0.7,
                          cursor: 'default'
                        }}
                      >
                        <div className="org-cover">
                          {org.cover_image ? (
                            <img src={org.cover_image} alt={org.name} style={{ filter: 'grayscale(100%)' }} />
                          ) : (
                            <div className="org-cover-placeholder">
                              <span>🏢</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="org-content">
                          <h3>{org.name}</h3>
                          <p className="org-description">
                            {org.description || 'ไม่มีคำอธิบาย'}
                          </p>
                          
                          <div className="org-meta">
                            
                            {getStatusBadge(org.status)}
                          </div>
                          
                          <div style={{ 
                            marginTop: '12px', 
                            padding: '10px', 
                            background: '#FFEBEE', 
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: '#C62828'
                          }}>
                            ⚠️ Organization นี้ไม่ผ่านการอนุมัติจากผู้ดูแลระบบ
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrganizations;
