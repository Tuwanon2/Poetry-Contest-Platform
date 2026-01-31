import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';

import '../styles/MyOrganizations.css';

const MyOrganizations = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orgRoles, setOrgRoles] = useState({}); // { orgId: role }

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
      const res = await axios.get(`${API_BASE_URL}/organizations/user/${userId}`);
      setOrganizations(res.data || []);

      // Fetch roles for each org
      const rolesObj = {};
      await Promise.all(
        (res.data || []).map(async (org) => {
          try {
            const membersRes = await axios.get(`${API_BASE_URL}/organizations/${org.organization_id}/members`);
            const me = (membersRes.data || []).find(m => String(m.user_id) === String(userId));
            if (me && me.role) {
              rolesObj[org.organization_id] = me.role;
            }
          } catch (e) {
            // ignore error for this org
          }
        })
      );
      setOrgRoles(rolesObj);
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
      await axios.put(`${API_BASE_URL}/organizations/members/${memberId}/accept`);
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
      await axios.delete(`${API_BASE_URL}/organizations/members/${memberId}/reject`);
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

       

        <div className="my-orgs-container" style={{ maxWidth: 900, margin: '40px auto', padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 24, margin: 0 }}>Organizations</h2>
            <button
              style={{
                background: 'none',
                border: '1px solid #4F95DA',
                color: '#fff',
                fontWeight: 500,
                fontSize: 15,
                borderRadius: 6,
                padding: '6px 16px',
                cursor: 'pointer',
                backgroundColor: '#70136C',
                transition: 'background 0.2s',
              }}
              onClick={() => navigate('/create-organization')}
            >
              สร้าง organization ใหม่
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
              
              <h2>คุณยังไม่ได้เป็นสมาชิกของ Organization ใดๆ</h2>
             
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
                        style={{
                          background: '#FF9800',
                          borderRadius: 10,
                          boxShadow: '0 1px 4px 0 rgba(0,0,0,0.12)',
                          border: '1px solid #e6a23c',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 24px',
                          minHeight: 64,
                          marginBottom: 16,
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        {/* Logo/cover */}
                        <div style={{ width: 40, height: 40, minWidth: 40, minHeight: 40, borderRadius: 6, overflow: 'hidden', marginRight: 16, background: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {org.cover_image ? (
                            <img src={org.cover_image} alt={org.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: 22, color: '#b26a00' }}>🏢</span>
                          )}
                        </div>
                        {/* Main info */}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span
                            style={{
                              color: '#ffffff',
                              fontWeight: 600,
                              fontSize: 17,
                              textAlign: 'left',
                              wordBreak: 'break-word',
                              // maxWidth: 220, // ถ้าอยากให้กว้างสุดเท่า card ก็ลบ maxWidth ออก
                              transition: 'color 0.2s',
                              // ลบ overflow, textOverflow, whiteSpace
                            }}
                          >
                            {org.name}
                          </span>
                          <span style={{
                            background: '#fff',
                            color: '#FF9800',
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 600,
                            padding: '2px 12px',
                            marginLeft: 6,
                            border: '2px solid #ffe0b2',
                            boxShadow: '0 1px 4px 0 rgba(255,152,0,0.06)',
                            display: 'inline-block',
                          }}>รอการตอบรับ</span>
                        </div>
                        {/* Accept/Reject buttons on the right */}
                        <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                          <button
                            onClick={() => handleAcceptInvitation(org.member_id)}
                            style={{
                              padding: '6px 12px',
                              background: '#fff',
                              color: '#43a047',
                              border: '2px solid #43a047',
                              borderRadius: 8,
                              fontSize: 15,
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'background 0.2s, color 0.2s',
                            }}
                            onMouseEnter={e => { e.target.style.background = '#43a047'; e.target.style.color = '#fff'; }}
                            onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#43a047'; }}
                          >
                            ยอมรับ
                          </button>
                          <button
                            onClick={() => handleRejectInvitation(org.member_id)}
                            style={{
                              padding: '6px 12px',
                              background: '#fff',
                              color: '#e53935',
                              border: '2px solid #e53935',
                              borderRadius: 8,
                              fontSize: 15,
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'background 0.2s, color 0.2s',
                            }}
                            onMouseEnter={e => { e.target.style.background = '#e53935'; e.target.style.color = '#fff'; }}
                            onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#e53935'; }}
                          >
                            ปฏิเสธ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizations ที่อนุมัติแล้ว (status = approved) */}
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
                    <h2 style={{ margin: 0, color: '#70136C', fontSize: '30px' }}>
                      Organizations ของฉัน
                    </h2>
                   
                  </div>
                  <div className="orgs-grid">
                    {organizations.filter(org => org.status === 'approved' && org.member_status === 'accepted').map((org) => (
                      <div
                        key={org.organization_id}
                        style={{
                          background: '#70136C',
                          borderRadius: 10,
                          boxShadow: '0 1px 4px 0 rgba(0,0,0,0.12)',
                          border: '1px solid #30363d',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 24px',
                          minHeight: 64,
                          marginBottom: 16,
                          width: '100%',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                          transition: 'box-shadow 0.2s, transform 0.2s',
                        }}
                        onClick={() => navigate(`/organization/${org.organization_id}`)}
                        onMouseOver={e => {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(112,19,108,0.18)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.boxShadow = '0 1px 4px 0 rgba(0,0,0,0.12)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        {/* Logo/cover */}
                        <div style={{ width: 40, height: 40, minWidth: 40, minHeight: 40, borderRadius: 6, overflow: 'hidden', marginRight: 16, background: '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {org.cover_image ? (
                            <img src={org.cover_image} alt={org.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: 22, color: '#c9d1d9' }}>🏢</span>
                          )}
                        </div>
                        {/* Main info */}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span
                            style={{
                              color: '#ffffff',
                              fontWeight: 600,
                              fontSize: 17,
                              textAlign: 'left',
                              wordBreak: 'break-word',
                              // maxWidth: 220, // ถ้าอยากให้กว้างสุดเท่า card ก็ลบ maxWidth ออก
                              transition: 'color 0.2s',
                              // ลบ overflow, textOverflow, whiteSpace
                            }}
                          >
                            {org.name}
                          </span>
                          {/* Role badge (fetch from orgRoles) */}
                          {orgRoles[org.organization_id] === 'creator' && (
                            <span style={{
                              background: '#fff',
                              color: '#70136C',
                              borderRadius: 12,
                              fontSize: 13,
                              fontWeight: 600,
                              padding: '2px 12px',
                              marginLeft: 6,
                              border: '2px solid #e0c7e7',
                              boxShadow: '0 1px 4px 0 rgba(112,19,108,0.06)',
                              display: 'inline-block',
                            }}>ผู้สร้าง</span>
                          )}
                          {orgRoles[org.organization_id] === 'assistant' && (
                            <span style={{
                              background: '#fff',
                              color: '#70136C',
                              borderRadius: 12,
                              fontSize: 13,
                              fontWeight: 600,
                              padding: '2px 12px',
                              marginLeft: 6,
                              border: '2px solid #e0c7e7',
                              boxShadow: '0 1px 4px 0 rgba(112,19,108,0.06)',
                              display: 'inline-block',
                            }}>ผู้ช่วย</span>
                          )}
                        </div>
                        {/* Setting button for owner only */}
                        {org.role === 'creator' && (
                          <button
                            style={{
                              marginLeft: 16,
                              background: '#21262d',
                              border: '1px solid #30363d',
                              borderRadius: 6,
                              color: '#c9d1d9',
                              fontWeight: 500,
                              fontSize: 15,
                              padding: '6px 16px',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                            }}
                            onClick={e => { e.stopPropagation(); alert('ยังไม่มีหน้าตั้งค่า'); }}
                          >
                            Settings
                          </button>
                        )}
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
