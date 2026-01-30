import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';
import InviteMemberModal from '../components/InviteMemberModal';
import AddMemberModal from '../components/AddMemberModal';
import InviteAssistantModal from '../components/InviteAssistantModal';

const OrganizationDetail = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [organization, setOrganization] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [members, setMembers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userPermissions, setUserPermissions] = useState({
    can_view: false,
    can_edit: false,
    can_view_scores: false,
    can_add_assistant: false,
    can_create_competition: false
  });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showInviteAssistantModal, setShowInviteAssistantModal] = useState(false);
  const [stats, setStats] = useState({
    totalCompetitions: 0,
    activeCompetitions: 0,
    totalMembers: 0,
    pendingInvites: 0
  });

  // ====== STYLE VARIABLES ======
  const statCardModernStyle = {
    background: "#fff",
    border: "2px solid #e0c7e7",
    borderRadius: 16,
    padding: "20px 24px",
    boxShadow: "0 2px 10px rgba(112,19,108,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    transition: "all 0.3s ease",
  };

  const manageCardStyle = {
    background: "#fff",
    border: "2px solid #e0c7e7",
    marginBottom: 10,
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(112,19,108,0.06)",
    padding: "24px 18px",
    minHeight: 180,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };

  const manageTitleStyle = {
    fontWeight: 700,
    fontSize: "1.12rem",
    color: "#70136C",
    marginBottom: 10,
  };

  const manageListStyle = {
    color: "#444",
    fontSize: "1.04rem",
    margin: 0,
    padding: "0 0 0 18px",
    lineHeight: 1.7,
  };

  useEffect(() => {
    // เก็บ organization_id ลง localStorage เมื่อเข้าหน้านี้
    if (orgId) {
      localStorage.setItem('current_organization_id', orgId);
    }

    fetchOrganizationDetails();
    fetchCompetitions();
    fetchMembers();
    fetchAssistants();
    checkUserRole();
    calculateStats();
  }, [orgId]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/organizations/${orgId}/members`);
      setMembers(res.data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchAssistants = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/organizations/${orgId}/assistants`);
      setAssistants(res.data || []);
    } catch (err) {
      console.error('Error fetching assistants:', err);
    }
  };

  const calculateStats = async () => {
    try {
      const compsRes = await axios.get(`http://localhost:8080/api/v1/organizations/${orgId}/competitions`);
      const comps = compsRes.data || [];
      const membersRes = await axios.get(`http://localhost:8080/api/v1/organizations/${orgId}/members`);
      const mems = membersRes.data || [];

      setStats({
        totalCompetitions: comps.length,
        activeCompetitions: comps.filter(c => c.status === 'open').length,
        totalMembers: mems.filter(m => m.status === 'accepted').length,
        pendingInvites: mems.filter(m => m.status === 'pending').length
      });
    } catch (err) {
      console.error('Error calculating stats:', err);
    }
  };

  const checkUserRole = async () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      const userId = user.user_id || user.id;

      console.log('🔍 Checking user role...');
      console.log('Current userId:', userId);

      // ดึงข้อมูลสมาชิกจาก organization_members
      const membersRes = await axios.get(`http://localhost:8080/api/v1/organizations/${orgId}/members`);
      const members = membersRes.data || [];
      console.log('Members list:', members);
      
      const userMember = members.find(m => m.user_id === userId && m.status === 'accepted');
      console.log('Found user member:', userMember);
      
      if (userMember) {
        const memberRole = userMember.role || 'member';
        console.log('Setting role to:', memberRole);
        setUserRole(memberRole);
        
        // ถ้าเป็น creator ให้สิทธิ์เต็ม
        if (memberRole === 'creator') {
          console.log('✅ User is CREATOR - setting all permissions to true');
          setUserPermissions({
            can_view: true,
            can_edit: true,
            can_view_scores: true,
            can_add_assistant: true,
            can_create_competition: true
          });
        } 
        // ถ้าเป็น assistant ใช้ permissions จาก database
        else if (memberRole === 'assistant') {
          console.log('✅ User is ASSISTANT, permissions:', {
            can_view: userMember.can_view,
            can_edit: userMember.can_edit,
            can_view_scores: userMember.can_view_scores,
            can_add_assistant: userMember.can_add_assistant,
            can_create_competition: userMember.can_create_competition
          });
          setUserPermissions({
            can_view: userMember.can_view || false,
            can_edit: userMember.can_edit || false,
            can_view_scores: userMember.can_view_scores || false,
            can_add_assistant: userMember.can_add_assistant || false,
            can_create_competition: userMember.can_create_competition || false
          });
        }
        // member ปกติไม่มีสิทธิ์พิเศษ
        else {
          console.log('ℹ️ User is MEMBER - no special permissions');
          setUserPermissions({
            can_view: false,
            can_edit: false,
            can_view_scores: false,
            can_add_assistant: false,
            can_create_competition: false
          });
        }
      }
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const fetchOrganizationDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/organizations/${orgId}`);
      setOrganization(res.data);
    } catch (err) {
      console.error('Error fetching organization:', err);
      setError('ไม่สามารถโหลดข้อมูล organization ได้');
    }
  };

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:8080/api/v1/organizations/${orgId}/competitions`;
      console.log('Fetching competitions from:', url);
      
      const res = await axios.get(url);
      console.log('Competitions response:', res.data);
      
      setCompetitions(res.data || []);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      console.error('Error response:', err.response?.data);
      setError('ไม่สามารถโหลดข้อมูลการประกวดได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompetition = () => {
    console.log('🎯 handleCreateCompetition called');
    console.log('Current userRole:', userRole);
    console.log('Current userPermissions:', userPermissions);
    
    // เช็คสิทธิ์ก่อนไปหน้าสร้างการประกวด
    if (userRole === 'creator') {
      console.log('✅ Creator - navigating to create competition');
      // creator สร้างได้เสมอ
      navigate('/create-competition', { state: { organizationId: parseInt(orgId) } });
    } else if (userRole === 'assistant' && userPermissions.can_create_competition) {
      console.log('✅ Assistant with permission - navigating to create competition');
      // assistant ที่มีสิทธิ์ก็สร้างได้
      navigate('/create-competition', { state: { organizationId: parseInt(orgId) } });
    } else {
      console.log('❌ No permission to create competition');
      // ไม่มีสิทธิ์
      alert('⚠️ คุณไม่มีสิทธิ์สร้างการประกวด\n\nกรุณาติดต่อผู้สร้างองค์กรเพื่อขอสิทธิ์');
    }
  };

  const handleCompetitionClick = (competition) => {
    // ใช้ competition_id หรือ id ก็ได้
    const compId = competition.competition_id || competition.id;
    
    // ตรวจสอบว่า user เป็นสมาชิก organization หรือไม่
    if (userRole === 'creator' || userRole === 'assistant' || userRole === 'member') {
      // สมาชิก organization (creator, assistant, member) ไปหน้าจัดการการประกวด
      navigate(`/competition/${compId}/manage`);
    } else {
      // ไม่ใช่สมาชิกให้ไปหน้า detail ธรรมดา
      navigate(`/contest-detail/${compId}`);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'open': { text: 'เปิดรับสมัคร', color: '#27ae60' },
      'closed': { text: 'ปิดรับสมัคร', color: '#e74c3c' },
      'judging': { text: 'กำลังตัดสิน', color: '#f39c12' },
      'completed': { text: 'เสร็จสิ้น', color: '#95a5a6' }
    };
    const badge = statusMap[status] || { text: status, color: '#666' };
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        background: badge.color + '20',
        color: badge.color
      }}>
        {badge.text}
      </span>
    );
  }

  if (error && !organization) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f9fb" }}>
        <TopNav />
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#e74c3c' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fb" }}>
      <TopNav />

      <div style={{ padding: '24px 24px 32px 24px', maxWidth: 1200, margin: "0 auto" }}>
        {/* Header: Settings button, org image, org name (horizontal) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 24,
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Org image (square) */}
            <div style={{
              width: 140,
              height: 140,
              borderRadius: 24,
              overflow: 'hidden',
              background: '#f3f3f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #e0c7e7',
            }}>
              {organization && organization.cover_image ? (
                <img src={organization.cover_image} alt={organization.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 80, color: '#8bc34a' }}>🏢</span>
              )}
            </div>
            {/* Org name */}
            <span style={{
              color: '#70136C',
              fontWeight: 700,
              fontSize: '1.5rem',
              marginLeft: 0,
              letterSpacing: 0.2,
            }}>
              {organization?.name}
            </span>
          </div>
          {/* Settings button (rightmost) */}
          <button
            onClick={() => alert('ยังไม่มีหน้าตั้งค่า')}
            style={{
              background: '#fff',
              border: '2px solid #70136C',
              color: '#70136C',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              padding: '8px 18px',
              cursor: 'pointer',
              marginLeft: 12,
              transition: 'background 0.2s',
            }}
          >
            Settings
          </button>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          borderBottom: '2px solid #e0c7e7',
          marginBottom: 24 
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'overview' ? '#70136C' : 'transparent',
              color: activeTab === 'overview' ? 'white' : '#70136C',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '3px solid #70136C' : 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
             ภาพรวม
          </button>
          <button
            onClick={() => setActiveTab('assistants')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'assistants' ? '#70136C' : 'transparent',
              color: activeTab === 'assistants' ? 'white' : '#70136C',
              border: 'none',
              borderBottom: activeTab === 'assistants' ? '3px solid #70136C' : 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ผู้ช่วยจัดการ
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
              <>
                {/* HEADER */}
                <div
                  style={{
                    background: "#fff",
                    border: "2px solid #e0c7e7",
                    borderRadius: 16,
                    boxShadow: "0 2px 12px rgba(112,19,108,0.06)",
                    padding: "16px 22px 12px 22px",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      flexWrap: "wrap",
                      marginBottom: 8,
                    }}
                  >
                  </div>

                  <div style={{ color: "#666", fontSize: "1.02rem", marginBottom: 8 }}>
                    {organization?.description || 'ไม่มีคำอธิบาย'}
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #e6e6e6', margin: '0 0 16px 0' }} />

                {/* Create Competition & Invite Member Buttons */}
                {(userRole === 'creator' || userRole === 'assistant') && (
                  <>
                   
                    <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#6c5ce7', margin: '0 0 10px 2px', letterSpacing: '-0.5px' }}>
                      จัดการ
                    </div>
                    
                    <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
                      <button
                        onClick={handleCreateCompetition}
                        style={{
                          padding: '12px 24px',
                          background: '#70136C',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 8px rgba(112,19,108,0.2)',
                        }}
                        onMouseOver={e => {
                          e.target.style.background = '#5a0f56';
                          e.target.style.boxShadow = '0 4px 16px rgba(112,19,108,0.3)';
                        }}
                        onMouseOut={e => {
                          e.target.style.background = '#70136C';
                          e.target.style.boxShadow = '0 2px 8px rgba(112,19,108,0.2)';
                        }}
                      >
                        ➕ สร้างการประกวดใหม่
                      </button>

                      {/* ปุ่มเชิญผู้ช่วย - เฉพาะ creator และ assistant ที่มีสิทธิ์ */}
                      {(userRole === 'creator' || (userRole === 'assistant' && userPermissions.can_add_assistant)) && (
                        <button
                          onClick={() => setShowInviteAssistantModal(true)}
                          style={{
                            padding: '12px 24px',
                            background: 'white',
                            color: '#e17055',
                            border: '2px solid #e17055',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseOver={e => {
                            e.target.style.background = '#fef5f3';
                          }}
                          onMouseOut={e => {
                            e.target.style.background = 'white';
                          }}
                        >
                          ✨ เชิญผู้ช่วย
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* Competitions List */}
                <div style={{ borderBottom: '1px solid #e6e6e6', margin: '16px 0 16px 0' }} />
                <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#6c5ce7', margin: '0 0 10px 2px', letterSpacing: '-0.5px' }}>
                  การประกวดทั้งหมด ({competitions.length})
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    กำลังโหลดการประกวด...
                  </div>
                ) : competitions.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px', 
                    color: '#999',
                    background: '#fff',
                    borderRadius: '12px',
                    border: '2px solid #e0c7e7'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#666' }}>ยังไม่มีการประกวด</div>
                    {(userRole === 'creator' || userRole === 'assistant') && (
                      <div style={{ marginTop: '8px', fontSize: '14px', color: '#999' }}>
                        คลิกปุ่ม "สร้างการประกวดใหม่" เพื่อเริ่มต้น
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                  }}>
                    {competitions.map((comp) => {
                      const compId = comp.competition_id || comp.id;
                      let imageUrl = comp.image_url || comp.poster_url;
                      if (imageUrl && !imageUrl.startsWith('http')) {
                        if (imageUrl.startsWith('/DB_poem/uploads')) {
                          imageUrl = `http://localhost:8080${imageUrl}`;
                        }
                        // If it starts with /uploads, use as-is (served by backend static route)
                        // If it starts with something else, fallback to original logic
                        else if (imageUrl.startsWith('/uploads')) {
                          imageUrl = `http://localhost:8080${imageUrl}`;
                        }
                        // else, fallback (for legacy or unexpected cases)
                        else {
                          imageUrl = `http://localhost:8080/${imageUrl}`;
                        }
                      }
                      return (
                        <div 
                          key={compId}
                          onClick={() => handleCompetitionClick(comp)}
                          style={{
                            background: '#fff',
                            border: '2px solid #e0c7e7',
                            borderRadius: 12,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(112,19,108,0.06)',
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(112,19,108,0.15)';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(112,19,108,0.06)';
                          }}
                        >
                          {imageUrl && (
                            <div style={{ 
                              height: 140, 
                              background: 'linear-gradient(135deg, #70136C 0%, #9C27B0 100%)',
                              overflow: 'hidden'
                            }}>
                              <img 
                                src={imageUrl} 
                                alt={comp.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          )}
                          
                          <div style={{ padding: '16px' }}>
                            <h3 style={{ 
                              fontSize: '1.15rem', 
                              color: '#333', 
                              margin: '0 0 8px 0',
                              fontWeight: 700
                            }}>
                              {comp.title}
                            </h3>
                            
                            <p style={{
                              color: '#666',
                              fontSize: '0.92rem',
                              margin: '0 0 12px 0',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {comp.description}
                            </p>
                            
                            {comp.category_name && (
                              <div style={{ fontSize: '0.88rem', color: '#999', marginBottom: 8 }}>
                                📚 {comp.category_name}
                              </div>
                            )}
                            
                            {comp.type && (
                              <div style={{ fontSize: '0.88rem', color: '#999', marginBottom: 8 }}>
                                📚 {comp.type}
                              </div>
                            )}
                            
                            <div style={{ fontSize: '0.88rem', color: '#999', marginBottom: 12 }}>
                              📅 {new Date(comp.start_date).toLocaleDateString('th-TH')} - {new Date(comp.end_date).toLocaleDateString('th-TH')}
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              {getStatusBadge(comp.status)}
                              
                              {(userRole === 'creator' || userRole === 'assistant') && (
                                <span style={{ fontSize: '12px', color: '#6c5ce7', fontWeight: 500 }}>
                                  จัดการ →
                                </span>
                              )}
                              {userRole === 'judge' && (
                                <span style={{ fontSize: '12px', color: '#6c5ce7', fontWeight: 500 }}>
                                  ตรวจผลงาน →
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === "assistants" && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 40,
                  minHeight: 400,
                  boxShadow: "0 2px 12px rgba(112,19,108,0.06)",
                  border: "2px solid #e0c7e7",
                }}
              >
                <h2 style={{ color: "#e17055", fontWeight: 700, fontSize: "1.3rem", marginBottom: 24 }}>
                  ผู้ช่วยจัดการ
                </h2>
                
                {assistants.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
                    <div>ยังไม่มีผู้ช่วยจัดการ</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {assistants.map((assistant) => (
                      <div
                        key={assistant.assistant_id}
                        style={{
                          padding: '16px',
                          border: '1.5px solid #e0c7e7',
                          borderRadius: 8,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#333', marginBottom: 4 }}>
                            {assistant.full_name || assistant.username}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: 8 }}>
                            {assistant.email}
                          </div>
                          
                          {/* Permissions */}
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {assistant.can_view && (
                              <span style={{
                                padding: '3px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: '#e8f5e9',
                                color: '#2e7d32'
                              }}>
                                👁 ดูภาพรวม
                              </span>
                            )}
                            {assistant.can_edit && (
                              <span style={{
                                padding: '3px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: '#fff3e0',
                                color: '#e65100'
                              }}>
                                ✏️ แก้ไข
                              </span>
                            )}
                            {assistant.can_view_scores && (
                              <span style={{
                                padding: '3px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: '#e1f5fe',
                                color: '#01579b'
                              }}>
                                📊 ดูคะแนน
                              </span>
                            )}
                            {assistant.can_add_assistant && (
                              <span style={{
                                padding: '3px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: '#f3e5f5',
                                color: '#6a1b9a'
                              }}>
                                ➕ เชิญผู้ช่วย
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {assistant.status === 'pending' && (
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              background: '#f39c1220',
                              color: '#f39c12'
                            }}>
                              รอตอบรับ
                            </span>
                          )}
                          {assistant.status === 'accepted' && (
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              background: '#27ae6020',
                              color: '#27ae60'
                            }}>
                              ✓ ยอมรับแล้ว
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
      </div>

      {/* Modals */}
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          organizationId={parseInt(orgId)}
          onSuccess={() => {
            setShowInviteModal(false);
            fetchMembers();
            calculateStats();
          }}
        />

        {showAddMemberModal && (
          <AddMemberModal
            isOpen={showAddMemberModal}
            onClose={() => setShowAddMemberModal(false)}
            organizationId={parseInt(orgId)}
            onSuccess={() => {
              setShowAddMemberModal(false);
              fetchMembers();
              calculateStats();
            }}
          />
        )}

        <InviteAssistantModal
          isOpen={showInviteAssistantModal}
          onClose={() => setShowInviteAssistantModal(false)}
          organizationId={parseInt(orgId)}
          onSuccess={() => {
            setShowInviteAssistantModal(false);
            fetchAssistants();
          }}
        />
    </div>
  );
};

export default OrganizationDetail;
