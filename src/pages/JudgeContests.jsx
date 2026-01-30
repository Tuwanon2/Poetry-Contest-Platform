import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';
import '../styles/JudgeContests.css';

const JudgeContests = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [orgs, setOrgs] = useState({}); // org_id: orgData
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('invitations'); // invitations, contests

  useEffect(() => {
    fetchJudgeData();
  }, []);

  const fetchJudgeData = async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
      if (!userId) {
        setError('กรุณาเข้าสู่ระบบ');
        setLoading(false);
        return;
      }
      // Fetch invitations (pending)
      const invResponse = await axios.get(`http://localhost:8080/api/v1/judge/invitations?user_id=${userId}`);
      let invitationsData = invResponse.data || [];

      // For invitations missing organization_id, fetch contest detail to get org id
      const invitationsWithOrg = await Promise.all(invitationsData.map(async (inv) => {
        if (!inv.organization_id && inv.competition_id) {
          try {
            const contestRes = await axios.get(`http://localhost:8080/api/v1/contests/${inv.competition_id}`);
            return { ...inv, organization_id: contestRes.data.organization_id };
          } catch {
            return inv;
          }
        }
        return inv;
      }));
      setInvitations(invitationsWithOrg);

      // Fetch organizer info for each invitation (if org_id exists)
      const orgIds = Array.from(new Set(invitationsWithOrg.map(inv => inv.organization_id).filter(Boolean)));
      const orgsMap = {};
      await Promise.all(orgIds.map(async (orgId) => {
        try {
          const res = await axios.get(`http://localhost:8080/api/v1/organizations/${orgId}`);
          orgsMap[orgId] = res.data;
        } catch (e) {
          orgsMap[orgId] = null;
        }
      }));
      setOrgs(orgsMap);

      // Fetch accepted contests
      const contestResponse = await axios.get(`http://localhost:8080/api/v1/judge/contests?user_id=${userId}`);
      setContests(contestResponse.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching judge data:', err);
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await axios.post(`http://localhost:8080/api/v1/judge/invitations/${invitationId}/accept`);
      alert('ตอบรับคำเชิญสำเร็จ!');
      fetchJudgeData(); // Refresh data
    } catch (err) {
      console.error('Error accepting invitation:', err);
      alert('ไม่สามารถตอบรับคำเชิญได้');
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    if (!window.confirm('คุณต้องการปฏิเสธคำเชิญนี้หรือไม่?')) return;
    
    try {
      await axios.post(`http://localhost:8080/api/v1/judge/invitations/${invitationId}/reject`);
      alert('ปฏิเสธคำเชิญแล้ว');
      fetchJudgeData();
    } catch (err) {
      console.error('Error rejecting invitation:', err);
      alert('ไม่สามารถปฏิเสธคำเชิญได้');
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
        padding: '6px 16px',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        background: badge.color + '20',
        color: badge.color
      }}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <TopNav />
        <div className="judge-contests-container">
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            กำลังโหลดข้อมูล...
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopNav />
        <div className="judge-contests-container">
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#e74c3c' }}>
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <div className="judge-contests-container">
        <div className="page-header">
          <h1>งานกรรมการของฉัน</h1>
          <p className="subtitle">คำเชิญและการประกวดที่คุณรับผิดชอบ</p>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'invitations' ? 'active' : ''}`}
            onClick={() => setActiveTab('invitations')}
          >
            คำเชิญ ({invitations.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'contests' ? 'active' : ''}`}
            onClick={() => setActiveTab('contests')}
          >
            การประกวดของฉัน ({contests.length})
          </button>
        </div>

        {/* Invitations Tab */}
        {activeTab === 'invitations' && (
          <>
            {invitations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📬</div>
                <h3>ไม่มีคำเชิญใหม่</h3>
                <p>คุณจะเห็นคำเชิญเป็นกรรมการที่นี่</p>
              </div>
            ) : (
              <div className="invitations-list">
                {invitations.map((inv) => {
                  const org = inv.organization_id ? orgs[inv.organization_id] : null;
                  return (
                    <div key={inv.judge_id} className="invitation-card" style={{ padding: 0, overflow: 'hidden' }}>
                      <div style={{
                        background: '#fff',
                        borderLeft: '4px solid #ff9800',
                        borderRadius: 12,
                        padding: '28px 32px 24px 32px',
                        margin: 0,
                        boxShadow: '0 2px 8px rgba(255,152,0,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                      }}>
                        <div style={{ fontWeight: 700, color: '#70136C', fontSize: 20, marginBottom: 8, lineHeight: 1.3 }}>
                          คุณได้รับคำเชิญให้เป็นกรรมการ
                        </div>
                        <div style={{ fontWeight: 700, color: '#222', fontSize: 18, marginBottom: 2, lineHeight: 1.2 }}>
                          {inv.title || 'การประกวด'}
                        </div>
                        <div style={{ fontSize: 16, color: '#333', marginBottom: 2, fontWeight: 500 }}>
                          ระดับ: <span style={{ color: '#70136C', fontWeight: 700 }}>{inv.level_name || '-'}</span>
                        </div>
                        {org && (
                          <div style={{ fontSize: 15, color: '#666', marginBottom: 2, fontWeight: 500 }}>
                            จัดโดย: <span style={{ color: '#009688', fontWeight: 700 }}>{org.name || org.organization_name || '-'}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
                          <button 
                            className="accept-btn"
                            onClick={() => handleAcceptInvitation(inv.judge_id)}
                            style={{ flex: 1, fontSize: 18, padding: '14px 0', borderRadius: 8 }}
                          >
                            ✓ ตอบรับ
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => handleRejectInvitation(inv.judge_id)}
                            style={{ flex: 1, fontSize: 18, padding: '14px 0', borderRadius: 8 }}
                          >
                            ✕ ปฏิเสธ
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Contests Tab */}
        {activeTab === 'contests' && (
          <>
            {contests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👨‍⚖️</div>
                <h3>ยังไม่มีการประกวดที่ต้องตัดสิน</h3>
                <p>คุณจะเห็นการประกวดที่คุณได้รับเชิญเป็นกรรมการที่นี่</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {contests.map((contest) => (
                  <div
                    key={contest.id}
                    className="contest-card"
                    onClick={() => navigate(`/my-work/${contest.id}`)}
                    style={{
                      background: '#fff',
                      borderLeft: '4px solid #70136C',
                      borderRadius: 12,
                      boxShadow: '0 2px 8px rgba(112,19,108,0.08)',
                      padding: '28px 32px 24px 32px',
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      width: '100%',
                      maxWidth: '100%',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: 0 }}>
                      <h3 style={{ fontSize: 22, fontWeight: 700, color: '#70136C', margin: 0, flex: 1, lineHeight: 1.2 }}>{contest.title}</h3>
                      <span style={{ marginLeft: 16 }}>{getStatusBadge(contest.status)}</span>
                    </div>
                    <button
                      className="view-btn"
                      style={{
                        marginTop: 18,
                        padding: '14px 0',
                        background: '#70136C',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 18,
                        fontWeight: 600,
                        cursor: 'pointer',
                        width: '100%',
                        boxShadow: '0 2px 8px rgba(112,19,108,0.10)'
                      }}
                    >ดูรายละเอียดและให้คะแนน →</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default JudgeContests;
