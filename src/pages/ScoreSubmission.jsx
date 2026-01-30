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
  const [scoringCriteria, setScoringCriteria] = useState([]);
  const [scores, setScores] = useState({});
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

      // Fetch competition levels to get scoring criteria
      const levelsRes = await axios.get(
        `${API_BASE_URL}/competitions/${response.data.competition_id}/levels`
      );
      
      // Find the level data for this submission
      const levelData = levelsRes.data.find(l => l.level_name === response.data.level_name || l.name === response.data.level_name);
      
      if (levelData && levelData.scoring_criteria && levelData.scoring_criteria.length > 0) {
        setScoringCriteria(levelData.scoring_criteria);
        
        // Initialize scores object
        const initialScores = {};
        levelData.scoring_criteria.forEach(criteria => {
          initialScores[criteria.name] = '';
        });
        setScores(initialScores);
        
        // If existing score exists, populate form
        if (response.data.existing_score && response.data.existing_score.scores) {
          const existingScores = {};
          response.data.existing_score.scores.forEach(s => {
            existingScores[s.criteria_name] = s.score;
          });
          setScores(existingScores);
          setComment(response.data.existing_score.comment || '');
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching submission:', err);
      setError('ไม่สามารถโหลดข้อมูลผลงานได้');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => {
      const num = parseFloat(score);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();

    // Validate scores for each criteria
    if (scoringCriteria.length > 0) {
      for (const criteria of scoringCriteria) {
        const score = parseFloat(scores[criteria.name]);
        if (isNaN(score) || score < 0 || score > criteria.max_score) {
          alert(`กรุณาให้คะแนน "${criteria.name}" ระหว่าง 0-${criteria.max_score}`);
          return;
        }
      }
    }

    if (!window.confirm('คุณต้องการยืนยันการให้คะแนนหรือไม่?')) {
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare scores array
      const scoresArray = scoringCriteria.map(criteria => ({
        criteria_name: criteria.name,
        max_score: criteria.max_score,
        score: parseFloat(scores[criteria.name])
      }));

      const totalScore = calculateTotalScore();

      await axios.post(
        `${API_BASE_URL}/judge/submission-score/${submissionId}`,
        {
          judge_id: judgeId,
          scores: scoresArray,
          total_score: totalScore,
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
          {scoringCriteria.length > 0 ? (
            <>
              <div className="scoring-criteria-section">
                <h3 style={{ marginBottom: '16px', color: '#70136C' }}>เกณฑ์การให้คะแนน</h3>
                
                {scoringCriteria.map((criteria, index) => (
                  <div key={index} className="form-group" style={{ 
                    background: '#f8f9fa', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    marginBottom: '12px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <label htmlFor={`score-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>
                        {index + 1}. {criteria.name} <span className="required">*</span>
                      </span>
                      <span className="score-range" style={{ fontSize: '14px' }}>
                        (เต็ม {criteria.max_score} คะแนน)
                      </span>
                    </label>
                    <input
                      type="number"
                      id={`score-${index}`}
                      value={scores[criteria.name] || ''}
                      onChange={(e) => setScores({ ...scores, [criteria.name]: e.target.value })}
                      min="0"
                      max={criteria.max_score}
                      step="0.01"
                      required
                      placeholder={`ใส่คะแนน 0-${criteria.max_score}`}
                      className="score-input"
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                ))}
              
              </div>
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="score">
                คะแนน <span className="required">*</span>
                <span className="score-range">(0-10)</span>
              </label>
              <input
                type="number"
                id="score"
                value={scores.default || ''}
                onChange={(e) => setScores({ default: e.target.value })}
                min="0"
                max="10"
                step="0.01"
                required
                placeholder="ใส่คะแนน 0-10"
                className="score-input"
              />
            </div>
          )}

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
