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
  }, [competitionId]);

  const fetchCompetitionDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/contests/${competitionId}`);
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
      await axios.put(`http://localhost:8080/api/v1/competition-levels/${levelId}/criteria`, {
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

                {/* Levels and Scoring Criteria */}
                {competitionLevels.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <h4 style={{ marginBottom: '16px', color: '#70136C' }}>ระดับการแข่งขันและเกณฑ์การให้คะแนน</h4>
                    {competitionLevels.map((level, idx) => {
                      const isEditing = editingLevelId === level.competition_level_id;
                      const baseCriteria = level.scoring_criteria || [];
                      const criteriaToShow = isEditing ? editingCriteria : (Array.isArray(baseCriteria) ? baseCriteria : []);
                      
                      return (
                        <div key={idx} style={{ 
                          background: '#f8f9fa', 
                          padding: '16px', 
                          borderRadius: '8px', 
                          marginBottom: '12px',
                          border: '1px solid #e0e0e0'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h5 style={{ margin: 0, color: '#70136C', fontSize: '16px' }}>
                              ระดับ: {level.level_name || level.name}
                            </h5>
                            
                            {!isEditing ? (
                              <button
                                onClick={() => handleEditLevel(level)}
                                style={{
                                  padding: '6px 16px',
                                  background: '#70136C',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: 600
                                }}
                              >
                                ✏️ แก้ไข
                              </button>
                            ) : (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleSaveCriteria(level.competition_level_id)}
                                  style={{
                                    padding: '6px 16px',
                                    background: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 600
                                  }}
                                >
                                  ✓ บันทึก
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  style={{
                                    padding: '6px 16px',
                                    background: '#95a5a6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 600
                                  }}
                                >
                                  ✕ ยกเลิก
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {criteriaToShow.length > 0 ? (
                            <div>
                              <p style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>เกณฑ์การให้คะแนน:</p>
                              <div style={{ display: 'grid', gap: '8px' }}>
                                {criteriaToShow.map((criteria, cidx) => (
                                  <div key={cidx} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    background: 'white',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    gap: '8px'
                                  }}>
                                    {isEditing ? (
                                      <>
                                        <span style={{ fontWeight: 600, color: '#70136C', minWidth: '24px' }}>
                                          {cidx + 1}.
                                        </span>
                                        <input
                                          type="text"
                                          value={criteria.name}
                                          onChange={(e) => handleCriteriaChange(cidx, 'name', e.target.value)}
                                          placeholder="ชื่อเกณฑ์"
                                          style={{
                                            flex: 1,
                                            padding: '6px 10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px'
                                          }}
                                        />
                                        <input
                                          type="number"
                                          value={criteria.max_score}
                                          onChange={(e) => handleCriteriaChange(cidx, 'max_score', parseInt(e.target.value) || 0)}
                                          style={{
                                            width: '80px',
                                            padding: '6px 10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            textAlign: 'center'
                                          }}
                                        />
                                        <span style={{ fontSize: '14px', color: '#666' }}>คะแนน</span>
                                        <button
                                          onClick={() => handleRemoveCriteria(cidx)}
                                          style={{
                                            padding: '4px 8px',
                                            background: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                          }}
                                        >
                                          ✕
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <span>{cidx + 1}. {criteria.name}</span>
                                        <span style={{ fontWeight: 600, color: '#70136C' }}>
                                          {criteria.max_score} คะแนน
                                        </span>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                              
                              {isEditing && (
                                <button
                                  onClick={handleAddCriteria}
                                  style={{
                                    marginTop: '8px',
                                    padding: '8px 16px',
                                    background: 'white',
                                    border: '1px dashed #70136C',
                                    borderRadius: '6px',
                                    color: '#70136C',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    width: '100%'
                                  }}
                                >
                                  ➕ เพิ่มเกณฑ์
                                </button>
                              )}
                              
                              <div style={{ 
                                marginTop: '8px', 
                                textAlign: 'right', 
                                fontWeight: 'bold',
                                fontSize: '15px',
                                color: '#70136C'
                              }}>
                                คะแนนรวม: {criteriaToShow.reduce((sum, c) => sum + (c.max_score || 0), 0)} คะแนน
                              </div>
                            </div>
                          ) : (
                            <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                              ยังไม่มีการกำหนดเกณฑ์การให้คะแนน
                              {isEditing && (
                                <button
                                  onClick={handleAddCriteria}
                                  style={{
                                    marginLeft: '12px',
                                    padding: '6px 12px',
                                    background: '#70136C',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                  }}
                                >
                                  ➕ เพิ่มเกณฑ์
                                </button>
                              )}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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
        levels={competitionLevels.map(l => l.level_name || l.name)}
        onSuccess={() => {
          // Optional: refresh judges list if needed
          console.log('Judge invited successfully');
        }}
      />
    </SidebarNavContext.Provider>
  );
};

export default CompetitionManagement;
