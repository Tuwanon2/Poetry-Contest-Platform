import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import API_BASE_URL from '../../config/api';

export default function ResultsSection() {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/competitions`);
      setCompetitions(response.data || []);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    }
  };

  const fetchResults = async (competitionId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/competitions/${competitionId}/results`);
      setResults(response.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnnounce = async (competitionId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะประกาศผลการแข่งขัน? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;
    
    try {
      await axios.post(`${API_BASE_URL}/admin/competitions/${competitionId}/announce-results`);
      alert('ประกาศผลการแข่งขันสำเร็จ!');
      fetchCompetitions();
    } catch (error) {
      console.error('Error announcing results:', error);
      alert('ไม่สามารถประกาศผลได้');
    }
  };

  const handleSetWinner = async (submissionId, award) => {
    try {
      await axios.post(`${API_BASE_URL}/admin/submissions/${submissionId}/set-award`, {
        award
      });
      alert(`ตั้งค่ารางวัล${award}สำเร็จ`);
      if (selectedCompetition) fetchResults(selectedCompetition.competition_id);
    } catch (error) {
      console.error('Error setting award:', error);
      alert('ไม่สามารถตั้งค่ารางวัลได้');
    }
  };

  const handleExport = async (competitionId, format) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/competitions/${competitionId}/export-results?format=${format}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `results_${competitionId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      alert(`ดาวน์โหลดผลการแข่งขัน (${format.toUpperCase()}) สำเร็จ`);
    } catch (error) {
      console.error('Error exporting results:', error);
      alert('ไม่สามารถดาวน์โหลดผลการแข่งขันได้');
    }
  };

  return (
    <div className="fade-in">
      <h2 className="section-header">🏆 การตัดสินและประกาศผล (Results & Announcement)</h2>

      {/* เลือกการประกวด */}
      <div className="card" style={{ marginTop: 20, padding: '20px' }}>
        <h3 className="sub-header">เลือกการประกวด</h3>
        <select
          value={selectedCompetition?.competition_id || ''}
          onChange={(e) => {
            const comp = competitions.find(c => c.competition_id === parseInt(e.target.value));
            setSelectedCompetition(comp);
            if (comp) fetchResults(comp.competition_id);
          }}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          <option value="">-- เลือกการประกวด --</option>
          {competitions.map(comp => (
            <option key={comp.competition_id} value={comp.competition_id}>
              {comp.title} ({comp.submissions_count || 0} ผลงาน)
            </option>
          ))}
        </select>
      </div>

      {selectedCompetition && (
        <>
          {/* ข้อมูลการประกวด */}
          <div className="card" style={{ marginTop: 20, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#70136C' }}>{selectedCompetition.title}</h3>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  สถานะ: {selectedCompetition.status === 'announced' ? 
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>ประกาศผลแล้ว</span> : 
                    <span style={{ color: '#f39c12' }}>ยังไม่ประกาศผล</span>
                  }
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-primary" 
                  style={{ background: '#27ae60' }}
                  onClick={() => handleExport(selectedCompetition.competition_id, 'pdf')}
                >
                  📄 Export PDF
                </button>
                <button 
                  className="btn-primary" 
                  style={{ background: '#2980b9' }}
                  onClick={() => handleExport(selectedCompetition.competition_id, 'xlsx')}
                >
                  📊 Export Excel
                </button>
                {selectedCompetition.status !== 'announced' && (
                  <button 
                    className="btn-primary" 
                    style={{ background: '#e67e22' }}
                    onClick={() => handleAnnounce(selectedCompetition.competition_id)}
                  >
                    📢 ประกาศผลอย่างเป็นทางการ
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ผลการแข่งขัน */}
          {loading ? (
            <div className="loading-spinner">กำลังโหลดผลการแข่งขัน...</div>
          ) : (
            <div className="card" style={{ marginTop: 20 }}>
              <h3 className="sub-header">ผลการแข่งขัน</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>อันดับ</th>
                    <th>ชื่อผลงาน</th>
                    <th>ระดับ</th>
                    <th>ผู้ส่ง</th>
                    <th>คะแนนเฉลี่ย</th>
                    <th>จำนวนกรรมการ</th>
                    <th>รางวัล</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        ยังไม่มีผลการแข่งขัน
                      </td>
                    </tr>
                  ) : (
                    results.map((result, index) => (
                      <tr key={result.submission_id}>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                          {index + 1}
                        </td>
                        <td>
                          <div style={{ fontWeight: '500' }}>{result.title}</div>
                          <div style={{ fontSize: '11px', color: '#999' }}>{result.poem_type}</div>
                        </td>
                        <td>{result.level_name}</td>
                        <td>
                          <div style={{ fontSize: '13px' }}>{result.author_name}</div>
                          <div style={{ fontSize: '11px', color: '#999' }}>{result.author_email}</div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold',
                            color: result.average_score >= 8 ? '#27ae60' : result.average_score >= 5 ? '#f39c12' : '#e74c3c'
                          }}>
                            {result.average_score?.toFixed(2) || 'N/A'}
                          </div>
                          <div style={{ fontSize: '11px', color: '#999' }}>
                            / {result.max_score || 10}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {result.judges_count} / {result.required_judges || result.judges_count}
                        </td>
                        <td>
                          <select
                            value={result.award || ''}
                            onChange={(e) => handleSetWinner(result.submission_id, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              border: '1px solid #e0e0e0',
                              borderRadius: '4px',
                              fontSize: '13px',
                              fontWeight: result.award ? 'bold' : 'normal',
                              color: result.award ? '#e67e22' : '#666'
                            }}
                          >
                            <option value="">-- เลือกรางวัล --</option>
                            <option value="รางวัลที่ 1">🥇 รางวัลที่ 1</option>
                            <option value="รางวัลที่ 2">🥈 รางวัลที่ 2</option>
                            <option value="รางวัลที่ 3">🥉 รางวัลที่ 3</option>
                            <option value="รางวัลชมเชย">🎖️ รางวัลชมเชย</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="btn-text" 
                            style={{ color: '#2980b9', fontSize: '12px' }}
                            onClick={() => navigate(`/admin/submission/${result.submission_id}`)}
                          >
                            ดูรายละเอียด
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* สถิติ */}
      {selectedCompetition && results.length > 0 && (
        <div className="grid-4" style={{ marginTop: 20 }}>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#70136C' }}>
              {results.length}
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>ผลงานทั้งหมด</div>
          </div>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
              {results.filter(r => r.judges_count >= (r.required_judges || r.judges_count)).length}
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>ตรวจครบทุกกรรมการ</div>
          </div>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e67e22' }}>
              {(results.reduce((sum, r) => sum + (r.average_score || 0), 0) / results.length).toFixed(2)}
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>คะแนนเฉลี่ยรวม</div>
          </div>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2980b9' }}>
              {results.filter(r => r.award).length}
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>กำหนดรางวัลแล้ว</div>
          </div>
        </div>
      )}
    </div>
  );
}
