import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';
import SidebarNav from '../components/SidebarNav';
import { SidebarNavContext } from '../components/SidebarNavContext';
import InviteJudgeModal from '../components/InviteJudgeModal';
import InviteJudgeModalManagement from '../components/InviteJudgeModalManagement';
import '../styles/CompetitionManagement.css';

const CompetitionManagement = () => {
    const [judges, setJudges] = useState([]);
    const [isJudgesModalOpen, setIsJudgesModalOpen] = useState(false);
    const [removingJudgeId, setRemovingJudgeId] = useState(null);
  const { competitionId } = useParams();
  const navigate = useNavigate();
  const [sidebarPage, setSidebarPage] = useState('overview');
  const [competition, setCompetition] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, submissions, settings
  const [isInviteJudgeModalOpen, setIsInviteJudgeModalOpen] = useState(false);
  const [competitionLevels, setCompetitionLevels] = useState([]);
  const [editingLevelId, setEditingLevelId] = useState(null);
  const [editingCriteria, setEditingCriteria] = useState([]);

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
    fetchJudges();
  }, [competitionId]);

  const fetchJudges = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/contests/${competitionId}/judges`);
      setJudges(res.data || []);
    } catch (err) {
      setJudges([]);
    }
  };
  const handleRemoveJudge = async (judgeId) => {
    if (!window.confirm('ยืนยันการลบกรรมการคนนี้?')) return;
    setRemovingJudgeId(judgeId);
    try {
      await axios.delete(`${API_BASE_URL}/contests/judges/${judgeId}`);
      setJudges(judges.filter(j => j.id !== judgeId));
    } catch (err) {
      alert('ลบกรรมการไม่สำเร็จ');
    } finally {
      setRemovingJudgeId(null);
    }
  };

  const fetchCompetitionDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/contests/${competitionId}`);
      setCompetition(res.data);
      
      // Parse levels from competition object
      if (res.data.levels) {
        try {
          const levels = typeof res.data.levels === 'string' 
            ? JSON.parse(res.data.levels) 
            : res.data.levels;
          setCompetitionLevels(Array.isArray(levels) ? levels : []);
        } catch (e) {
          console.error('Error parsing levels:', e);
          setCompetitionLevels([]);
        }
      } else {
        setCompetitionLevels([]);
      }
    } catch (err) {
      console.error('Error fetching competition:', err);
      alert('ไม่สามารถโหลดข้อมูลการประกวดได้');
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/contests/${competitionId}/submissions`);
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
        await axios.post(`${API_BASE_URL}/contests/${competitionId}/open`);
      } else if (newStatus === 'closed') {
        await axios.post(`${API_BASE_URL}/contests/${competitionId}/close`);
      }
      alert(`เปลี่ยนสถานะเป็น ${newStatus === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'} แล้ว`);
      fetchCompetitionDetails();
    } catch (err) {
      console.error('Error changing status:', err);
      alert('ไม่สามารถเปลี่ยนสถานะได้');
    }
  };

  const handleEditLevel = (level) => {
    console.log('Editing level:', level);
    console.log('scoring_criteria:', level.scoring_criteria);
    setEditingLevelId(level.competition_level_id);
    const criteria = level.scoring_criteria || [];
    const validCriteria = Array.isArray(criteria) ? criteria : [];
    setEditingCriteria([...validCriteria]);
  };

  const handleCancelEdit = () => {
    setEditingLevelId(null);
    setEditingCriteria([]);
  };

  const handleAddCriteria = () => {
    setEditingCriteria([...editingCriteria, { name: '', max_score: 10 }]);
  };

  const handleRemoveCriteria = (index) => {
    setEditingCriteria(editingCriteria.filter((_, i) => i !== index));
  };

  const handleCriteriaChange = (index, field, value) => {
    const newCriteria = [...editingCriteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setEditingCriteria(newCriteria);
  };

  const handleSaveCriteria = async (levelId) => {
    try {
      await axios.put(`${API_BASE_URL}/competition-levels/${levelId}/criteria`, {
        scoring_criteria: editingCriteria
      });
      alert('บันทึกเกณฑ์การให้คะแนนสำเร็จ');
      setEditingLevelId(null);
      setEditingCriteria([]);
      fetchCompetitionDetails();
    } catch (err) {
      console.error('Error saving criteria:', err);
      alert('ไม่สามารถบันทึกได้: ' + (err.response?.data?.error || err.message));
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
            {/* Custom Header Layout */}
            <div className="comp-mgmt-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0, paddingBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  
                  <button className="back-btn" onClick={() => navigate(-1)} style={{ marginLeft: 0 }}>
                    ← กลับ
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flex: 1 }}>
                  <h1 className="comp-title" style={{ fontSize: 28, fontWeight: 700, color: '#70136C', margin: 0, textAlign: 'right' }}>{competition.title}</h1>
                  <div className="comp-status" style={{ marginTop: 4 }}>{getStatusBadge(competition.status)}</div>
                </div>
              </div>
              {/* Stats Cards Row */}
              <div className="stats-grid" style={{ marginTop: 32, marginBottom: 0, gap: 32 }}>
                <div className="stat-card" style={{
                  background: 'linear-gradient(135deg, #f8e1fa 0%, #f3e6f7 100%)',
                  border: '2px solid #e1bee7',
                  boxShadow: '0 4px 16px rgba(112,19,108,0.07)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minWidth: 220, minHeight: 120
                }}>
                  <div className="stat-icon" style={{ fontSize: 40, marginBottom: 8 }}>📝</div>
                  <div className="stat-value" style={{ fontSize: 36, fontWeight: 700, color: '#70136C', marginBottom: 4 }}>{submissions.length}</div>
                  <div className="stat-label" style={{ fontSize: 16, color: '#70136C', fontWeight: 600 }}>ผลงานที่ส่งเข้าประกวด</div>
                </div>
                <div className="stat-card" style={{
                  background: 'linear-gradient(135deg, #e1f5fe 0%, #e3f2fd 100%)',
                  border: '2px solid #b3e5fc',
                  boxShadow: '0 4px 16px rgba(19,112,108,0.07)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minWidth: 220, minHeight: 120
                }}>
                  <div className="stat-icon" style={{ fontSize: 40, marginBottom: 8 }}>📅</div>
                  <div className="stat-label" style={{ fontSize: 15, color: '#1976d2', fontWeight: 600, marginBottom: 2 }}>วันปิดรับสมัคร</div>
                  <div className="stat-value" style={{ fontSize: 32, fontWeight: 700, color: '#1976d2', marginBottom: 2 }}>
                    {new Date(competition.end_date).getDate()}
                  </div>
                  <div className="stat-label" style={{ fontSize: 15, color: '#1976d2' }}>
                    {new Date(competition.end_date).toLocaleDateString('th-TH', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                {/* Judges Stat Card */}
                <div className="stat-card clickable" style={{
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #e0f7fa 100%)',
                  border: '2px solid #b2dfdb',
                  boxShadow: '0 4px 16px rgba(19,108,112,0.07)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minWidth: 220, minHeight: 120, cursor: 'pointer'
                }} onClick={() => setIsJudgesModalOpen(true)}>
                  <div className="stat-icon" style={{ fontSize: 40, marginBottom: 8 }}>👨‍⚖️</div>
                  <div className="stat-value" style={{ fontSize: 36, fontWeight: 700, color: '#009688', marginBottom: 4 }}>{judges.length}</div>
                  <div className="stat-label" style={{ fontSize: 16, color: '#009688', fontWeight: 600 }}>กรรมการ</div>
                  <div style={{ fontSize: 13, color: '#009688', marginTop: 4, textDecoration: 'underline' }}>ดูทั้งหมด</div>
                </div>
              </div>
                  {/* Judges Modal */}
                  {isJudgesModalOpen && (
                    <div style={{
                      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000,
                      background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{
                        background: 'white',
                        borderRadius: 20,
                        padding: 48,
                        minWidth: 600,
                        maxWidth: 800,
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.18)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                          <h2 style={{ margin: 0, color: '#009688', fontWeight: 700, fontSize: 28 }}>กรรมการในการประกวด</h2>
                          <button onClick={() => setIsJudgesModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 32, color: '#888', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
                        </div>
                        <div style={{ marginBottom: 24 }}>
                          <button
                            onClick={() => { setIsInviteJudgeModalOpen(true); setIsJudgesModalOpen(false); }}
                            style={{
                              padding: '12px 28px', background: 'linear-gradient(135deg, #70136C 0%, #9b1c96 100%)', color: 'white',
                              border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 17, cursor: 'pointer', marginBottom: 8
                            }}
                          >+ เพิ่มกรรมการ</button>
                        </div>
                        {judges.length === 0 ? (
                          <div style={{ color: '#888', textAlign: 'center', margin: '48px 0', fontSize: 20 }}>ยังไม่มีกรรมการ</div>
                        ) : (
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {judges.map(judge => (
                              <li key={judge.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #eee' }}>
                                <div>
                                  <span style={{ fontWeight: 600, color: '#333', fontSize: 18 }}>{judge.full_name || judge.username || judge.email}</span>
                                  <span style={{ color: '#888', fontSize: 15, marginLeft: 12 }}>{judge.email}</span>
                                </div>
                                <button
                                  onClick={() => handleRemoveJudge(judge.id)}
                                  disabled={removingJudgeId === judge.id}
                                  style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: removingJudgeId === judge.id ? 'not-allowed' : 'pointer', opacity: removingJudgeId === judge.id ? 0.6 : 1 }}
                                >{removingJudgeId === judge.id ? 'กำลังลบ...' : 'ลบ'}</button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
            </div>
            {/* Content */}
            <div className="tab-content">
              <div className="overview-tab">
                {/* ...existing code for info-section, etc. (if any) ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Invite Judge Modal */}
      <InviteJudgeModalManagement
        isOpen={isInviteJudgeModalOpen}
        onClose={() => setIsInviteJudgeModalOpen(false)}
        competitionId={competitionId}
        levels={competitionLevels}
        onSuccess={() => {
          // รีเฟรชข้อมูลกรรมการหรืออะไรก็ตามที่ต้องการ
        }}
      />
    </SidebarNavContext.Provider>
  );
};

export default CompetitionManagement;
