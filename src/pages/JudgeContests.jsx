import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';
import '../styles/JudgeContests.css';

const JudgeContests = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [invitations, setInvitations] = useState([]);
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
      setInvitations(invResponse.data || []);

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
                {invitations.map((inv) => (
                  <div key={inv.id} className="invitation-card">
                    <div className="card-header">
                      <h3 className="contest-title">{inv.title || 'การประกวด'}</h3>
                      <span className="status-badge pending">รอตอบรับ</span>
                    </div>

                    <div className="card-body">
                      <p className="contest-description">
                        {inv.description || `การประกวด ID: ${inv.competition_id}`}
                      </p>
                      <p style={{ fontSize: '14px', color: '#666' }}>
                        ระดับ: {inv.level_name || '-'}
                      </p>
                    </div>

                    <div className="card-footer">
                      <button 
                        className="accept-btn"
                        onClick={() => handleAcceptInvitation(inv.id)}
                      >
                        ✓ ตอบรับ
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRejectInvitation(inv.id)}
                      >
                        ✕ ปฏิเสธ
                      </button>
                    </div>
                  </div>
                ))}
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
              <div className="contests-grid">
                {contests.map((contest) => (
                  <div 
                    key={contest.id} 
                    className="contest-card"
                    onClick={() => navigate(`/judge-scoring/${contest.id}`)}
                  >
                    <div className="card-header">
                      <h3 className="contest-title">{contest.title}</h3>
                      {getStatusBadge(contest.status)}
                    </div>

                    <div className="card-body">
                      <p className="contest-description">{contest.description}</p>
                      
                      <div className="contest-dates">
                        <div className="date-item">
                          <span className="date-label">วันเริ่มต้น:</span>
                          <span className="date-value">{formatDate(contest.start_date)}</span>
                        </div>
                        <div className="date-item">
                          <span className="date-label">วันสิ้นสุด:</span>
                          <span className="date-value">{formatDate(contest.end_date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <button className="view-btn">
                        ดูรายละเอียดและให้คะแนน →
                      </button>
                    </div>
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
