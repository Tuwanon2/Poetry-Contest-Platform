import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TopNav from "../components/TopNav";
import SidebarNav from "../components/SidebarNav";
import { SidebarNavContext } from "../components/SidebarNavContext";
import "../styles/CompetitionSubmissions.css";

const CompetitionSubmissions = () => {
  const { competitionId } = useParams();
  const navigate = useNavigate();
  const [sidebarPage, setSidebarPage] = useState('submissions');
  const [competition, setCompetition] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Handle sidebar navigation
  const handleSidebarNavigate = (page) => {
    if (page === 'overview') {
      navigate(`/competition/${competitionId}/manage`);
    } else if (page === 'edit') {
      navigate(`/competition/${competitionId}/edit`);
    } else if (page === 'submissions') {
      // Already on submissions page
      setSidebarPage(page);
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
      const res = await axios.get(`http://localhost:8080/api/v1/competitions/${competitionId}`);
      setCompetition(res.data);
    } catch (err) {
      console.error("Failed to fetch competition details", err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/competitions/${competitionId}/submissions`);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    } finally {
      setLoading(false);
    }
  };

  if (!competition) {
    return (
      <SidebarNavContext.Provider value={{ sidebarPage, setSidebarPage }}>
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fb" }}>
          <SidebarNav current={sidebarPage} onNavigate={handleSidebarNavigate} />
          <div style={{ flex: 1, marginLeft: 220 }}>
            <TopNav />
            <div style={{ padding: "120px 24px", textAlign: "center" }}>
              <div className="loading-spinner">กำลังโหลด...</div>
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
      
          <div className="comp-submissions-container">
            {/* Header */}
            <div className="comp-submissions-header">
              <div className="header-left">
                <button className="back-btn" onClick={() => navigate(`/competition/${competitionId}/manage`)}>
                  ← กลับไปภาพรวม
                </button>
                <div className="header-info">
                  <h1 className="page-title">ผลงานที่ส่งเข้าประกวด</h1>
                  <p className="comp-subtitle">{competition.title}</p>
                </div>
              </div>
              
              <div className="submission-count">
                <span className="count-badge">{submissions.length}</span>
                <span className="count-label">ผลงานทั้งหมด</span>
              </div>
            </div>

            {/* Submissions Content */}
            <div className="submissions-content">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner">กำลังโหลดผลงาน...</div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>ยังไม่มีผลงานส่งเข้าประกวด</h3>
                  <p>เมื่อมีผู้ส่งผลงานเข้าประกวด ข้อมูลจะปรากฏที่นี่</p>
                </div>
              ) : (
                <div className="submissions-grid">
                  {submissions.map((sub) => (
                    <div key={sub.submission_id} className="submission-card">
                      <div className="submission-header">
                        <h4 className="submission-title">{sub.title}</h4>
                        <span className="submission-id">#{sub.submission_id}</span>
                      </div>
                      
                      <div className="submission-meta">
                        <div className="meta-item">
                          <span className="meta-icon">👤</span>
                          <span className="meta-text">{sub.participant_name || `User ID: ${sub.user_id}`}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">📅</span>
                          <span className="meta-text">{new Date(sub.submitted_at).toLocaleDateString('th-TH')}</span>
                        </div>
                        {sub.level_name && (
                          <div className="meta-item">
                            <span className="meta-icon">🎯</span>
                            <span className="meta-text">{sub.level_name}</span>
                          </div>
                        )}
                      </div>
                      
                      {sub.average_score && (
                        <div className="submission-score">
                          <span className="score-label">คะแนนเฉลี่ย:</span>
                          <span className="score-value">{sub.average_score.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <button 
                        className="view-detail-btn"
                        onClick={() => navigate(`/competition/${competitionId}/submission/${sub.submission_id}`)}
                      >
                        ดูรายละเอียด →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarNavContext.Provider>
  );
};

export default CompetitionSubmissions;
