import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';
import SidebarNav from '../components/SidebarNav';
import { SidebarNavContext } from '../components/SidebarNavContext';
import InviteJudgeModal from '../components/InviteJudgeModal';
import '../styles/CompetitionManagement.css';

const CompetitionManagement = () => {
  const { competitionId } = useParams();
  const navigate = useNavigate();
  const [sidebarPage, setSidebarPage] = useState('overview');
  const [competition, setCompetition] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, submissions, settings
  const [isInviteJudgeModalOpen, setIsInviteJudgeModalOpen] = useState(false);
  const [competitionLevels, setCompetitionLevels] = useState([]);

  // Handle sidebar navigation
  const handleSidebarNavigate = (page) => {
    if (page === 'edit') {
      navigate(`/competition/${competitionId}/edit`);
    } else if (page === 'submissions') {
      navigate(`/competition/${competitionId}/submissions`);
    } else {
      setSidebarPage(page);
    }
  };

  useEffect(() => {
    fetchCompetitionDetails();
    fetchSubmissions();
    fetchCompetitionLevels();
  }, [competitionId]);

  const fetchCompetitionDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/contests/${competitionId}`);
      setCompetition(res.data);
    } catch (err) {
      console.error('Error fetching competition:', err);
      alert('ไม่สามารถโหลดข้อมูลการประกวดได้');
    }
  };

  const fetchCompetitionLevels = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/competitions/${competitionId}/levels`);
      setCompetitionLevels(res.data || []);
    } catch (err) {
      console.error('Error fetching competition levels:', err);
      setCompetitionLevels([]);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/v1/contests/${competitionId}/submissions`);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === 'open') {
        await axios.post(`http://localhost:8080/api/v1/contests/${competitionId}/open`);
      } else if (newStatus === 'closed') {
        await axios.post(`http://localhost:8080/api/v1/contests/${competitionId}/close`);
      }
      alert(`เปลี่ยนสถานะเป็น ${newStatus === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'} แล้ว`);
      fetchCompetitionDetails();
    } catch (err) {
      console.error('Error changing status:', err);
      alert('ไม่สามารถเปลี่ยนสถานะได้');
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

  if (!competition) {
    return (
      <SidebarNavContext.Provider value={{ sidebarPage, setSidebarPage }}>
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fb" }}>
          <SidebarNav current={sidebarPage} onNavigate={setSidebarPage} />
          <div style={{ flex: 1, marginLeft: 220 }}>
            <TopNav />
            <div className="comp-mgmt-container">
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                กำลังโหลดข้อมูล...
              </div>
            </div>
          </div>
        </div>
      </SidebarNavContext.Provider>
    );
  }

  return (
    <SidebarNavContext.Provider value={{ sidebarPage, setSidebarPage }}>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fb" }}>
        <SidebarNav current={sidebarPage} onNavigate={handleSidebarNavigate} />
        
        <div style={{ flex: 1, marginLeft: 220 }}>
          <TopNav />
      
      <div className="comp-mgmt-container">
        {/* Header */}
        <div className="comp-mgmt-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← กลับ
            </button>
            <div className="header-info">
              <h1 className="comp-title">{competition.title}</h1>
              <div className="comp-status">{getStatusBadge(competition.status)}</div>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="invite-judge-btn"
              onClick={() => setIsInviteJudgeModalOpen(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #70136C 0%, #9b1c96 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>👨‍⚖️</span>
              เชิญกรรมการ
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="tab-content">
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📝</div>
                  <div className="stat-value">{submissions.length}</div>
                  <div className="stat-label">ผลงานที่ส่งเข้าประกวด</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-label" style={{ order: -1, marginBottom: '8px', fontSize: '14px' }}>วันปิดรับสมัคร</div>
                  <div className="stat-value">
                    {new Date(competition.end_date).getDate()}
                  </div>
                  <div className="stat-label">
                    {new Date(competition.end_date).toLocaleDateString('th-TH', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>รายละเอียดการประกวด</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">หมวดหมู่:</span>
                    <span className="info-value">{competition.category_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">กลุ่มเป้าหมาย:</span>
                    <span className="info-value">{competition.target_group}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">วันเริ่มต้น:</span>
                    <span className="info-value">
                      {new Date(competition.start_date).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">วันสิ้นสุด:</span>
                    <span className="info-value">
                      {new Date(competition.end_date).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                </div>
                
                <div className="description-box">
                  <h4>คำอธิบาย</h4>
                  <p>{competition.description}</p>
                </div>
              </div>
            </div>
        </div>
      </div>
        </div>
      </div>

      {/* Invite Judge Modal */}
      <InviteJudgeModal
        isOpen={isInviteJudgeModalOpen}
        onClose={() => setIsInviteJudgeModalOpen(false)}
        competitionId={competitionId}
        levels={competitionLevels}
        onSuccess={() => {
          // Optional: refresh judges list if needed
          console.log('Judge invited successfully');
        }}
      />
    </SidebarNavContext.Provider>
  );
};

export default CompetitionManagement;
