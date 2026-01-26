import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';

import '../styles/SubmissionReview.css';

const SubmissionReview = () => {
  const { competitionId, submissionId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissionDetails();
  }, [submissionId]);

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/v1/submission/${submissionId}`);
      setSubmission(res.data);
    } catch (err) {
      console.error('Error fetching submission:', err);
      setError('ไม่สามารถโหลดข้อมูลผลงานได้');
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content) => {
    if (!content) return [];
    
    // แบ่งบทด้วย % 
    const sections = content.split('%');
    
    return sections.map(section => {
      // แบ่งวรรคด้วย &
      const verses = section.split('&')
        .map(verse => verse.trim())
        .filter(verse => verse.length > 0);
      return verses;
    }).filter(section => section.length > 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="submission-review-layout">
        <TopNav />
        <div className="submission-review-container">
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            กำลังโหลดข้อมูล...
          </div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="submission-review-layout">
        <TopNav />
        <div className="submission-review-container">
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#e74c3c' }}>
            {error || 'ไม่พบข้อมูลผลงาน'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-review-layout">
      <TopNav />
      <div className="submission-review-container">
        {/* Header */}
        <div className="review-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← กลับ
          </button>
          <h1 className="review-title">รายละเอียดผลงาน</h1>
        </div>

        {/* Main Content */}
        <div className="review-content">
          {/* Applicant Info Section */}
          <div className="review-section applicant-section">
            <h2 className="section-title">
              <span className="title-icon">👤</span>
              ข้อมูลผู้ส่งผลงาน
            </h2>
            
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">ชื่อ - นามสกุล</div>
                <div className="info-value">{submission.name}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">อีเมล</div>
                <div className="info-value">
                  <a href={`mailto:${submission.email}`}>{submission.email}</a>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-label">เบอร์โทรศัพท์</div>
                <div className="info-value">{submission.phone || 'ไม่ระบุ'}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">ระดับการแข่งขัน</div>
                <div className="info-value">
                  <span className="level-badge">{submission.level_name}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-label">วันที่ส่งผลงาน</div>
                <div className="info-value">{formatDate(submission.submitted_at)}</div>
              </div>
              
              {submission.document && (
                <div className="info-item full-width">
                  <div className="info-label">เอกสารรับรองการเป็นนักเรียน/นักศึกษา</div>
                  <div className="info-value">
                    <a 
                      href={`http://localhost:8080${submission.document}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      📄 ดูเอกสาร
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Poem Section */}
          <div className="review-section poem-section">
            <h2 className="section-title">
              <span className="title-icon">📝</span>
              ผลงานกลอน
            </h2>
            
            <div className="poem-info">
              <div className="poem-header">
                <h3 className="poem-title">{submission.title}</h3>
                <span className="poem-type-badge">{submission.poem_type}</span>
              </div>
              
              <div className="poem-content">
                {formatContent(submission.content).map((verses, sectionIndex) => (
                  <div key={sectionIndex} className="poem-section-content">
                    {/* หัวข้อบท */}
                    {formatContent(submission.content).length > 1 && (
                      <h6 className="section-subtitle">
                        บทที่ {sectionIndex + 1}
                      </h6>
                    )}
                    
                    {/* แสดงวรรคแบบ 2 คอลัมน์ */}
                    <div className="verses-grid">
                      {verses.map((verse, verseIndex) => {
                        const verseNumber = verseIndex + 1;
                        const isLeftColumn = verseIndex % 2 === 0;
                        
                        return (
                          <div 
                            key={verseIndex} 
                            className={`verse-item ${isLeftColumn ? 'left-col' : 'right-col'}`}
                          >
                            <div className="verse-number">{verseNumber}.</div>
                            <div className="verse-line">
                              {verse}
                              <div className="verse-underline"></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="review-section status-section">
            <h2 className="section-title">
              <span className="title-icon">ℹ️</span>
              สถานะผลงาน
            </h2>
            
            <div className="status-info">
              <div className="status-item">
                <span className="status-label">สถานะ:</span>
                <span className={`status-badge status-${submission.status}`}>
                  {submission.status === 'pending' && '⏳ รอการตรวจ'}
                  {submission.status === 'approved' && '✅ ผ่านการตรวจ'}
                  {submission.status === 'rejected' && '❌ ไม่ผ่าน'}
                  {submission.status === 'scored' && '⭐ ตรวจแล้ว'}
                </span>
              </div>
              
            </div>
          </div>

          {/* Actions */}
          <div className="review-actions">
            <button 
              className="action-btn back-btn-bottom"
              onClick={() => navigate(-1)}
            >
              ← กลับไปยังรายการผลงาน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionReview;
