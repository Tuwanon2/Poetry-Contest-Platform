import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';
import '../styles/MyWork.css';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const MyWork = () => {
  const { competitionId } = useParams();
  const navigate = useNavigate();
  const [competitionTitle, setCompetitionTitle] = useState('');
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (competitionId) {
      fetchJudgeData();
    }
  }, [competitionId]);

  useEffect(() => {
    if (selectedLevel) {
      fetchSubmissions();
    }
  }, [selectedLevel]);

  const fetchJudgeData = async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
      
      if (!userId) {
        setError('กรุณาเข้าสู่ระบบ');
        setLoading(false);
        return;
      }

      // Fetch competition details
      const competitionResponse = await axios.get(`${API_BASE_URL}/competitions/${competitionId}`);
      setCompetitionTitle(competitionResponse.data.title || 'การประกวด');

      // Fetch levels assigned to this judge for this competition
      const levelsResponse = await axios.get(
        `${API_BASE_URL}/judge/competitions/${competitionId}/levels?user_id=${userId}`
      );
      const fetchedLevels = levelsResponse.data || [];
      setLevels(fetchedLevels);

      // Auto-select first level if available
      if (fetchedLevels.length > 0) {
        setSelectedLevel(fetchedLevels[0]);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching judge data:', err);
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
      
      const response = await axios.get(
        `${API_BASE_URL}/judge/competitions/${competitionId}/levels/${selectedLevel.level_id}/submissions?user_id=${userId}`
      );
      console.log('📋 Submissions data:', response.data);
      setSubmissions(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('ไม่สามารถโหลดข้อมูลผลงานได้');
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (e) => {
    const levelId = parseInt(e.target.value);
    const level = levels.find(l => l.level_id === levelId);
    setSelectedLevel(level);
  };

  const handleScoreSubmission = (submissionId) => {
    navigate(`/score-submission/${submissionId}`, {
      state: {
        competitionId,
        levelId: selectedLevel?.level_id,
        judgeId: selectedLevel?.judge_id
      }
    });
  };

  if (loading && !selectedLevel) {
    return (
      <>
        <TopNav />
        <div className="mywork-container">
          <div className="loading-spinner">กำลังโหลด...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopNav />
        <div className="mywork-container">
          <div className="error-message">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <div className="mywork-container">
        <div className="mywork-header">
          <h1>{competitionTitle}</h1>
          
          {levels.length > 0 && (
            <div className="level-selector">
              <label htmlFor="level-select">เลือกระดับ:</label>
              <select 
                id="level-select"
                value={selectedLevel?.level_id || ''}
                onChange={handleLevelChange}
              >
                {levels.map(level => (
                  <option key={level.level_id} value={level.level_id}>
                    {level.level_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedLevel && (
          <div className="submissions-section">
            <h2>ผลงานในระดับ: {selectedLevel.level_name}</h2>
            
            {loading ? (
              <div className="loading-spinner">กำลังโหลดผลงาน...</div>
            ) : submissions.length === 0 ? (
              <div className="empty-state">
                <p>ยังไม่มีผลงานที่ส่งเข้าประกวดในระดับนี้</p>
              </div>
            ) : (
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>หัวข้อ</th>
                    <th style={{ width: '150px' }}>สถานะ</th>
                    <th style={{ width: '150px' }}>การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => {
                    console.log(`Submission ${index + 1}:`, submission.title, 'is_scored:', submission.is_scored);
                    return (
                      <tr key={submission.submission_id}>
                        <td className="text-center">{index + 1}</td>
                        <td>{submission.title}</td>
                        <td className="text-center">
                          {submission.is_scored === true ? 'เสร็จสิ้น' : 'รอดำเนินการ'}
                        </td>
                        <td className="text-center">
                          <button 
                            className="score-btn"
                            onClick={() => handleScoreSubmission(submission.submission_id)}
                          >
                            {submission.is_scored ? 'แก้ไขคะแนน' : 'ให้คะแนน'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MyWork;
