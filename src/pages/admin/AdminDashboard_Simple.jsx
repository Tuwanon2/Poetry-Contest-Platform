import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminDashboard.css";
import '../../App.css';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [pendingOrganizations, setPendingOrganizations] = useState([]);
  const [approvedOrganizations, setApprovedOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approveTab, setApproveTab] = useState('pending'); // 'pending' หรือ 'approved'
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalCompetitions: 0,
    totalOrganizations: 0,
    usersByRole: {
      judges: 0,
      organizers: 0,
      assistants: 0
    }
  });

  useEffect(() => {
    if (activeSection === 'overview') {
      fetchDashboardStats();
    }
    if (activeSection === 'approve-organizer') {
      if (approveTab === 'pending') {
        fetchPendingOrganizations();
      } else {
        fetchApprovedOrganizations();
      }
    }
  }, [activeSection, approveTab]);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/admin/dashboard/stats');
      setDashboardStats(res.data || {});
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const fetchPendingOrganizations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/v1/admin/organizations/pending');
      setPendingOrganizations(res.data || []);
    } catch (err) {
      console.error('Error fetching pending organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedOrganizations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/v1/admin/organizations/approved');
      setApprovedOrganizations(res.data || []);
    } catch (err) {
      console.error('Error fetching approved organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrganization = async (orgId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/admin/organizations/${orgId}/status`, {
        status: status
      });
      alert(`องค์กรถูก${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}เรียบร้อย`);
      if (approveTab === 'pending') {
        fetchPendingOrganizations();
      } else {
        fetchApprovedOrganizations();
      }
    } catch (err) {
      console.error('Error updating organization status:', err);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/login"; 
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Nav */}
      <div style={{ 
        height: '64px', 
        background: 'white', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <h1 style={{ color: '#70136C', fontSize: '20px', margin: 0 }}>Competition Admin Pro</h1>
        <button onClick={handleLogout} style={{ 
          border: "1px solid #e74c3c", 
          background: "transparent", 
          color: "#e74c3c", 
          borderRadius: "6px", 
          padding: "8px 16px", 
          cursor: "pointer" 
        }}>
          Logout
        </button>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ 
          width: '240px', 
          background: '#f8f4f8', 
          padding: '20px',
          borderRight: '1px solid #ddd'
        }}>
          {['ภาพรวม', 'รายการประกวด', 'ผู้ส่งเข้าประกวด', 'กรรมการ', 'อนุมัติ Organizer', 'ตรวจสอบเนื้อหา', 'Logs', 'ตั้งค่า'].map((label, idx) => {
            const key = ['overview', 'competitions', 'users', 'judges', 'approve-organizer', 'moderation', 'logs', 'settings'][idx];
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  background: activeSection === key ? '#70136C' : 'transparent',
                  color: activeSection === key ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: activeSection === key ? '600' : '400'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          padding: '30px', 
          overflowY: 'auto',
          background: '#f4f6f8'
        }}>
          {activeSection === 'overview' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#70136C', margin: 0 }}>ภาพรวมระบบ (Overview)</h2>
                <button 
                  onClick={() => alert('เปิด Modal เพิ่มสมาชิก')}
                  style={{
                    padding: '10px 20px',
                    background: '#70136C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>➕</span>
                  เพิ่มสมาชิกใหม่
                </button>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '20px',
                marginBottom: '30px'
              }}>
                {[
                  { title: 'ผู้ใช้ในระบบ', value: dashboardStats.totalUsers || 0, emoji: '👥', color: '#70136C' },
                  { title: 'รายการประกวด', value: dashboardStats.totalCompetitions || 0, emoji: '🏆', color: '#e67e22' },
                  { title: 'กรรมการ', value: dashboardStats.usersByRole?.judges || 0, emoji: '⚖️', color: '#27ae60' },
                  { title: 'องค์กร', value: dashboardStats.totalOrganizations || 0, emoji: '💼', color: '#2980b9' },
                  { title: 'ผู้ช่วยจัดการประกวด', value: dashboardStats.usersByRole?.assistants || 0, emoji: '✅', color: '#8e44ad' }
                ].map((stat, i) => (
                  <div key={i} style={{ 
                    background: 'white', 
                    padding: '20px', 
                    borderRadius: '10px',
                    border: '1px solid #eee',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{stat.title}</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '40px', opacity: 0.2, marginTop: '10px' }}>{stat.emoji}</div>
                  </div>
                ))}
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '20px' 
              }}>
                <div style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '10px',
                  border: '1px solid #eee'
                }}>
                  <h3 style={{ marginTop: 0 }}>รายการล่าสุด</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>รายการ</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>สถานะ</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>วันที่</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'ประกวดถ่ายภาพ 2024', status: 'เปิดรับสมัคร', date: '12 ม.ค. 67', color: 'green' },
                        { name: 'Hackathon Gen 5', status: 'จบแล้ว', date: '10 ม.ค. 67', color: 'gray' },
                        { name: 'Design Award', status: 'กำลังตัดสิน', date: '08 ม.ค. 67', color: 'orange' }
                      ].map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px 8px' }}>{item.name}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{ 
                              padding: '4px 12px', 
                              borderRadius: '12px',
                              background: item.color === 'green' ? '#e8f8f5' : item.color === 'orange' ? '#fef9e7' : '#f0f0f0',
                              color: item.color === 'green' ? 'green' : item.color === 'orange' ? 'orange' : 'gray',
                              fontSize: '14px'
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', color: '#666' }}>{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '10px',
                  border: '1px solid #eee'
                }}>
                  <h3 style={{ marginTop: 0 }}>Logs การใช้งาน</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {[
                      'User Somchai ลงทะเบียนเข้าแข่งขัน',
                      'Admin Admin01 อนุมัติผลงาน ID #882',
                      'Judge Dr.Wichai ให้คะแนนทีม A',
                      'System สำรองข้อมูลประจำวันอัตโนมัติ'
                    ].map((log, i) => (
                      <li key={i} style={{ 
                        padding: '12px 0', 
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: '14px'
                      }}>
                        {log}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'competitions' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
              <h2 style={{ color: '#70136C', marginTop: 0 }}>จัดการการประกวด</h2>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px' }}>ชื่อการประกวด</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px' }}>หมวดหมู่</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px' }}>ระดับ</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px' }}>สถานะ</th>
                    <th style={{ textAlign: 'center', padding: '12px 8px' }}>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, name: 'การประกวดกลอนวันแม่', category: 'กลอนสุภาพ', levels: 'มัธยมศึกษา, อุดมศึกษา', status: 'open' },
                    { id: 2, name: 'การประกวดกลอนวันภาษาไทย', category: 'กาพย์ยานี 11', levels: 'ประชาชนทั่วไป', status: 'closed' }
                  ].map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 8px' }}>{item.name}</td>
                      <td style={{ padding: '12px 8px', color: '#666' }}>{item.category}</td>
                      <td style={{ padding: '12px 8px', color: '#666' }}>{item.levels}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '12px',
                          background: item.status === 'open' ? '#e8f8f5' : '#fbe9e7',
                          color: item.status === 'open' ? '#27ae60' : '#c0392b',
                          fontSize: '14px'
                        }}>
                          {item.status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <button style={{ 
                          padding: '6px 12px', 
                          background: '#70136C', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}>
                          แก้ไข
                        </button>
                        <button style={{ 
                          padding: '6px 12px', 
                          background: 'transparent', 
                          color: '#c0392b', 
                          border: '1px solid #c0392b', 
                          borderRadius: '6px', 
                          cursor: 'pointer'
                        }}>
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'users' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
              <h2 style={{ color: '#70136C', marginTop: 0 }}>ผู้ส่งเข้าประกวด (Contestants)</h2>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px' }}>ชื่อ-สกุล</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px' }}>อีเมล</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px' }}>สถานะ</th>
                    <th style={{ textAlign: 'center', padding: '12px 8px' }}>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 101, name: 'Somchai Jaidee', email: 'somchai@email.com', status: 'Active' },
                    { id: 102, name: 'Alice Wonderland', email: 'alice@email.com', status: 'Banned' }
                  ].map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 8px' }}>#{user.id}</td>
                      <td style={{ padding: '12px 8px' }}>{user.name}</td>
                      <td style={{ padding: '12px 8px', color: '#666' }}>{user.email}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '12px',
                          background: user.status === 'Active' ? '#e8f8f5' : '#fbe9e7',
                          color: user.status === 'Active' ? '#27ae60' : '#c0392b',
                          fontSize: '14px'
                        }}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <button style={{ 
                          padding: '6px 12px', 
                          background: 'transparent', 
                          color: user.status === 'Active' ? '#c0392b' : '#27ae60',
                          border: 'none', 
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}>
                          {user.status === 'Active' ? 'ระงับบัญชี' : 'ปลดแบน'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'judges' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#70136C', margin: 0 }}>จัดการกรรมการ (Judges)</h2>
                <button 
                  onClick={() => alert('เพิ่มกรรมการ')}
                  style={{
                    padding: '10px 20px',
                    background: '#70136C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600'
                  }}
                >
                  + เพิ่มกรรมการ
                </button>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '20px' 
              }}>
                {[
                  { id: 1, name: 'ดร. สมศักดิ์', expertise: 'เทคโนโลยี AI', contests: 2 },
                  { id: 2, name: 'อ. วรรณา', expertise: 'ศิลปะและการออกแบบ', contests: 5 }
                ].map((judge) => (
                  <div key={judge.id} style={{ 
                    background: 'white', 
                    padding: '20px', 
                    borderRadius: '10px',
                    border: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <div style={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: '50%', 
                      background: '#f0f0f0', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      👤
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>{judge.name}</h4>
                      <div style={{ fontSize: '13px', color: '#666' }}>ความเชี่ยวชาญ: {judge.expertise}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'approve-organizer' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
              <h2 style={{ color: '#70136C', margin: '0 0 20px 0' }}>อนุมัติ Organizer (Organizations)</h2>
              
              {/* Tabs */}
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '30px',
                borderBottom: '2px solid #eee'
              }}>
                <button
                  onClick={() => setApproveTab('pending')}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: approveTab === 'pending' ? '3px solid #70136C' : '3px solid transparent',
                    color: approveTab === 'pending' ? '#70136C' : '#666',
                    fontSize: '16px',
                    fontWeight: approveTab === 'pending' ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  🕐 รออนุมัติ ({pendingOrganizations.length})
                </button>
                <button
                  onClick={() => setApproveTab('approved')}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: approveTab === 'approved' ? '3px solid #70136C' : '3px solid transparent',
                    color: approveTab === 'approved' ? '#70136C' : '#666',
                    fontSize: '16px',
                    fontWeight: approveTab === 'approved' ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  ✓ ดำเนินการแล้ว ({approvedOrganizations.length})
                </button>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  กำลังโหลดข้อมูล...
                </div>
              )}

              {/* Tab: รออนุมัติ */}
              {!loading && approveTab === 'pending' && (
                <>
                  {pendingOrganizations.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      ✅ ไม่มี Organization รอการอนุมัติ
                    </div>
                  )}

                  {pendingOrganizations.length > 0 && (
                    <div style={{ display: 'grid', gap: '20px' }}>
                      {pendingOrganizations.map((org) => (
                        <div key={org.organization_id} style={{ 
                          border: '1px solid #e0e0e0', 
                          borderRadius: '10px', 
                          padding: '20px',
                          borderLeft: '4px solid #f39c12'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: '0 0 10px 0', color: '#70136C' }}>{org.name}</h3>
                              <p style={{ margin: '0 0 10px 0', color: '#666' }}>{org.description || 'ไม่มีคำอธิบาย'}</p>
                              <div style={{ fontSize: '14px', color: '#999' }}>
                                <div>ผู้สร้าง: {org.creator_username || `User ID: ${org.creator_user_id}`}</div>
                                <div>วันที่สร้าง: {new Date(org.created_at).toLocaleDateString('th-TH')}</div>
                              </div>
                            </div>
                            
                            {org.cover_image && (
                              <div style={{ 
                                width: '120px', 
                                height: '80px', 
                                borderRadius: '8px', 
                                overflow: 'hidden',
                                marginLeft: '20px',
                                border: '1px solid #eee'
                              }}>
                                <img 
                                  src={org.cover_image} 
                                  alt={org.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                            )}
                          </div>

                          {org.certificate_document && (
                            <div style={{ 
                              background: '#f9f9f9', 
                              padding: '10px 15px', 
                              borderRadius: '6px',
                              marginBottom: '15px',
                              fontSize: '14px'
                            }}>
                              📄 เอกสารรับรอง: <a href={org.certificate_document} target="_blank" rel="noreferrer" style={{ color: '#70136C' }}>ดูเอกสาร</a>
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              onClick={() => handleApproveOrganization(org.organization_id, 'approved')}
                              style={{ 
                                padding: '10px 20px', 
                                background: '#27ae60', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '600'
                              }}
                            >
                              ✓ อนุมัติ
                            </button>
                            <button 
                              onClick={() => handleApproveOrganization(org.organization_id, 'rejected')}
                              style={{ 
                                padding: '10px 20px', 
                                background: '#c0392b', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '600'
                              }}
                            >
                              ✗ ปฏิเสธ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Tab: ดำเนินการแล้ว */}
              {!loading && approveTab === 'approved' && (
                <>
                  {approvedOrganizations.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      ไม่มีประวัติการดำเนินการ
                    </div>
                  )}

                  {approvedOrganizations.length > 0 && (
                    <div style={{ display: 'grid', gap: '15px' }}>
                      {approvedOrganizations.map((org) => (
                        <div key={org.organization_id} style={{ 
                          border: '1px solid #e0e0e0', 
                          borderRadius: '10px', 
                          padding: '20px',
                          borderLeft: org.status === 'approved' ? '4px solid #27ae60' : '4px solid #c0392b',
                          background: org.status === 'approved' ? '#f8fff8' : '#fff8f8'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <h3 style={{ margin: 0, color: '#70136C' }}>{org.name}</h3>
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  background: org.status === 'approved' ? '#27ae60' : '#c0392b',
                                  color: 'white'
                                }}>
                                  {org.status === 'approved' ? '✓ อนุมัติแล้ว' : '✗ ปฏิเสธแล้ว'}
                                </span>
                              </div>
                              <p style={{ margin: '0 0 10px 0', color: '#666' }}>{org.description || 'ไม่มีคำอธิบาย'}</p>
                              <div style={{ fontSize: '14px', color: '#999' }}>
                                <div>ผู้สร้าง: {org.creator_username || `User ID: ${org.creator_user_id}`}</div>
                                <div>วันที่ดำเนินการ: {new Date(org.updated_at || org.created_at).toLocaleDateString('th-TH')}</div>
                              </div>
                            </div>
                            
                            {org.cover_image && (
                              <div style={{ 
                                width: '100px', 
                                height: '70px', 
                                borderRadius: '8px', 
                                overflow: 'hidden',
                                marginLeft: '20px',
                                border: '1px solid #eee'
                              }}>
                                <img 
                                  src={org.cover_image} 
                                  alt={org.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeSection === 'moderation' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
              <h2 style={{ color: '#70136C', marginTop: 0 }}>ตรวจสอบเนื้อหา</h2>
              
              {[
                { id: 1, content: 'ฝากร้านหน่อยค่ะ สนใจแอดไลน์...', reporter: 'user_05', reason: 'Spam/โฆษณา' }
              ].map((report) => (
                <div key={report.id} style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '10px',
                  border: '1px solid #eee',
                  borderLeft: '4px solid #f39c12',
                  marginBottom: '15px'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#f39c12', marginBottom: '10px' }}>
                    รายงาน: {report.reason}
                  </div>
                  <div style={{ 
                    background: '#f9f9f9', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    margin: '10px 0',
                    fontStyle: 'italic'
                  }}>
                    "{report.content}"
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button style={{ 
                      padding: '8px 16px', 
                      background: '#27ae60', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer'
                    }}>
                      ✓ Keep
                    </button>
                    <button style={{ 
                      padding: '8px 16px', 
                      background: '#c0392b', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer'
                    }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'logs' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
              <h2 style={{ color: '#70136C', marginTop: 0 }}>Logs การใช้งานระบบ</h2>
              
              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    { time: '2 นาทีที่แล้ว', action: 'User Somchai ลงทะเบียนเข้าแข่งขัน', type: 'info' },
                    { time: '15 นาทีที่แล้ว', action: 'Admin Admin01 อนุมัติผลงาน ID #882', type: 'success' },
                    { time: '1 ชม. ที่แล้ว', action: 'Judge Dr.Wichai ให้คะแนนทีม A', type: 'info' },
                    { time: '3 ชม. ที่แล้ว', action: 'System สำรองข้อมูลประจำวันอัตโนมัติ', type: 'system' }
                  ].map((log, i) => (
                    <li key={i} style={{ 
                      padding: '12px 0', 
                      borderBottom: i < 3 ? '1px solid #e0e0e0' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '14px' }}>{log.action}</span>
                      <span style={{ fontSize: '12px', color: '#999' }}>{log.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
              <h2 style={{ color: '#70136C', marginTop: 0 }}>ตั้งค่าระบบ</h2>
              
              <div style={{ marginTop: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>ชื่อระบบ</label>
                  <input 
                    type="text" 
                    defaultValue="Competition Admin Pro"
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>อีเมลแจ้งเตือน</label>
                  <input 
                    type="email" 
                    defaultValue="admin@contest.com"
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    <span>เปิดใช้งานการแจ้งเตือนทางอีเมล</span>
                  </label>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    <span>อนุญาตให้ผู้ใช้ลงทะเบียนใหม่</span>
                  </label>
                </div>
                
                <button style={{ 
                  padding: '10px 24px', 
                  background: '#70136C', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600'
                }}>
                  บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
