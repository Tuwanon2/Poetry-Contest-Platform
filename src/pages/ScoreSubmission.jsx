import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';
import '../styles/ScoreSubmission.css';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const ScoreSubmission = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { competitionId, levelId, judgeId } = location.state || {};

  const [submission, setSubmission] = useState(null);
  const [maxScore, setMaxScore] = useState(10);
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissionDetail();
  }, [submissionId]);

  const fetchSubmissionDetail = async () => {
    try {
      setLoading(true);
      
      // Fetch submission details
      const response = await axios.get(
        `${API_BASE_URL}/judge/submission-detail/${submissionId}?judge_id=${judgeId}`
      );
      
      setSubmission(response.data);

      // Fetch competition to get max_score
      const competitionRes = await axios.get(
        `${API_BASE_URL}/competitions/${response.data.competition_id}`
      );
      setMaxScore(competitionRes.data.max_score || 10);

      // If existing score exists, populate form
      if (response.data.existing_score) {
        setScore(response.data.existing_score.score || '');
        setComment(response.data.existing_score.comment || '');
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching submission:', err);
      setError('ไม่สามารถโหลดข้อมูลผลงานได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();

    // Validate score
    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > maxScore) {
      alert(`กรุณาใส่คะแนนระหว่าง 0-${maxScore}`);
      return;
    }

    if (!window.confirm('คุณต้องการยืนยันการให้คะแนนหรือไม่?')) {
      return;
    }

    try {
      setSubmitting(true);
      
      await axios.post(
        `${API_BASE_URL}/judge/submission-score/${submissionId}`,
        {
          judge_id: judgeId,
          score: scoreNum,
          comment: comment.trim()
        }
      );

      alert('บันทึกคะแนนสำเร็จ!');
      navigate(`/my-work/${competitionId}`);
    } catch (err) {
      console.error('Error submitting score:', err);
      alert('ไม่สามารถบันทึกคะแนนได้');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('คุณต้องการยกเลิกและกลับไปหน้าก่อนหน้าหรือไม่?')) {
      navigate(`/my-work/${competitionId}`);
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

  if (loading) {
    return (
      <>
        <TopNav />
        <div className="score-container">
          <div className="loading-spinner">กำลังโหลด...</div>
        </div>
      </>
    );
  }

  if (error || !submission) {
    return (
      <>
        <TopNav />
        <div className="score-container">
          <div className="error-message">{error || 'ไม่พบข้อมูลผลงาน'}</div>
          <button className="back-btn" onClick={() => navigate(`/my-work/${competitionId}`)}>
            กลับ
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <div className="score-container">
        <div className="score-header">
          <h1>ให้คะแนนผลงาน</h1>
          <div className="competition-info">
            <span className="info-label">การประกวด:</span>
            <span className="info-value">{submission.competition_title}</span>
          </div>
          <div className="level-info">
            <span className="info-label">ระดับ:</span>
            <span className="info-value">{submission.level_name}</span>
          </div>
        </div>

        <div className="submission-content">
          <div className="content-section">
            <h2>หัวข้อ</h2>
            <p className="submission-title">{submission.title}</p>
          </div>

          <div className="content-section">
            <h2>เนื้อหากลอน</h2>
            <div className="submission-text">
              {formatContent(submission.content).map((verses, sectionIndex) => (
                <div key={sectionIndex} className="poem-section-content">
                  {formatContent(submission.content).length > 1 && (
                    <h6 className="section-subtitle">
                      บทที่ {sectionIndex + 1}
                    </h6>
                  )}
                  
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

        <form onSubmit={handleSubmitScore} className="score-form">
          <div className="form-group">
            <label htmlFor="score">
              คะแนน <span className="required">*</span>
              <span className="score-range">(0-{maxScore})</span>
            </label>
            <input
              type="number"
              id="score"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              min="0"
              max={maxScore}
              step="0.01"
              required
              placeholder={`ใส่คะแนน 0-${maxScore}`}
              className="score-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="comment">
              ความคิดเห็น
              <span className="optional"> (ไม่จำเป็น)</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="6"
              placeholder="ใส่ความคิดเห็นหรือข้อเสนอแนะ"
              className="comment-textarea"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-btn"
              disabled={submitting}
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'กำลังบันทึก...' : 'ยืนยันการให้คะแนน'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ScoreSubmission;
