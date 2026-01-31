import React, { useState, useEffect } from "react";
import axios from 'axios';

import API_BASE_URL from '../../config/api';

export default function JudgesSection() {
  const [judges, setJudges] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedJudge, setSelectedJudge] = useState(null);

  useEffect(() => {
    fetchJudges();
    fetchCompetitions();
  }, []);

  const fetchJudges = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/judges`);
      setJudges(response.data || []);
    } catch (error) {
      console.error('Error fetching judges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/competitions`);
      setCompetitions(response.data || []);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    }
  };

  const handleRemoveJudge = async (judgeAssignmentId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบกรรมการจากการประกวดนี้?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/admin/judge-assignment/${judgeAssignmentId}`);
      alert('ลบกรรมการสำเร็จ');
      fetchJudges();
    } catch (error) {
      console.error('Error removing judge:', error);
      alert('ไม่สามารถลบกรรมการได้');
    }
  };

  const handleViewPerformance = (judge) => {
    setSelectedJudge(judge);
  };

  if (loading) {
    return <div className="loading-spinner">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 className="section-header">⚖️ จัดการกรรมการ (Judges Management)</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowInviteModal(true)}
        >
          ➕ เชิญกรรมการใหม่
        </button>
      </div>

      {/* สถิติกรรมการ */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
            {judges.length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>กรรมการทั้งหมด</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
            {judges.filter(j => j.status === 'accepted').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>ตอบรับแล้ว</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
            {judges.filter(j => j.status === 'pending').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>รอตอบรับ</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#70136C' }}>
            {judges.reduce((sum, j) => sum + (j.scored_count || 0), 0)}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>ตรวจแล้วทั้งหมด</div>
        </div>
      </div>

      {/* รายการกรรมการ */}
      <div className="card">
        <h3 className="sub-header">รายชื่อกรรมการ</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ชื่อกรรมการ</th>
              <th>อีเมล</th>
              <th>การประกวด</th>
              <th>ระดับที่รับผิดชอบ</th>
              <th>สถานะ</th>
              <th>ตรวจแล้ว</th>
              <th>รอตรวจ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {judges.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  ยังไม่มีกรรมการ
                </td>
              </tr>
            ) : (
              judges.map((judge) => (
                <tr key={judge.judge_id}>
                  <td style={{ fontWeight: '500' }}>{judge.judge_name || 'ไม่ระบุชื่อ'}</td>
                  <td>{judge.judge_email}</td>
                  <td style={{ fontSize: '13px' }}>{judge.competition_title}</td>
                  <td>
                    <span className="badge-gray" style={{ background: '#f3e5f5', color: '#8e44ad', fontSize: '12px' }}>
                      {judge.level_name}
                    </span>
                  </td>
                  <td>
                    {judge.status === 'accepted' ? (
                      <span className="badge-gray" style={{ background: '#e8f8f5', color: '#27ae60' }}>
                        ตอบรับแล้ว
                      </span>
                    ) : judge.status === 'pending' ? (
                      <span className="badge-gray" style={{ background: '#fef9e7', color: '#f39c12' }}>
                        รอตอบรับ
                      </span>
                    ) : (
                      <span className="badge-gray" style={{ background: '#fee2e2', color: '#991b1b' }}>
                        ปฏิเสธ
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge-gray" style={{ background: '#e8f8f5', color: '#27ae60' }}>
                      {judge.scored_count || 0}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge-gray" style={{ 
                      background: (judge.pending_count || 0) > 0 ? '#fef9e7' : '#f0f0f0',
                      color: (judge.pending_count || 0) > 0 ? '#f39c12' : '#999'
                    }}>
                      {judge.pending_count || 0}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                      <button 
                        className="btn-text" 
                        style={{ color: '#2980b9', fontSize: '12px' }}
                        onClick={() => handleViewPerformance(judge)}
                      >
                        ดูประสิทธิภาพ
                      </button>
                      <button 
                        className="btn-text" 
                        style={{ color: '#e74c3c', fontSize: '12px' }}
                        onClick={() => handleRemoveJudge(judge.judge_id)}
                      >
                        ลบออก
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal ดูประสิทธิภาพ */}
      {selectedJudge && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedJudge(null)}
        >
          <div 
            className="card" 
            style={{ 
              maxWidth: '600px', 
              width: '90%',
              padding: '30px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, color: '#70136C' }}>
              ประสิทธิภาพกรรมการ: {selectedJudge.judge_name}
            </h3>
            
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: '13px', color: '#666' }}>การประกวด</div>
                <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '5px' }}>
                  {selectedJudge.competition_title}
                </div>
              </div>

              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: '13px', color: '#666' }}>ระดับที่รับผิดชอบ</div>
                <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '5px' }}>
                  {selectedJudge.level_name}
                </div>
              </div>

              <div className="grid-2" style={{ marginTop: 20 }}>
                <div style={{ padding: '15px', background: '#e8f8f5', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
                    {selectedJudge.scored_count || 0}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                    ตรวจสอบแล้ว
                  </div>
                </div>

                <div style={{ padding: '15px', background: '#fef9e7', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
                    {selectedJudge.pending_count || 0}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                    รอตรวจสอบ
                  </div>
                </div>
              </div>

              {selectedJudge.avg_score && (
                <div style={{ marginTop: 20, padding: '15px', background: '#f3e5f5', borderRadius: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>คะแนนเฉลี่ยที่ให้</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#70136C', marginTop: '5px' }}>
                    {selectedJudge.avg_score.toFixed(2)}
                  </div>
                </div>
              )}

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: 20 }}
                onClick={() => setSelectedJudge(null)}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal เชิญกรรมการใหม่ */}
      {showInviteModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowInviteModal(false)}
        >
          <div 
            className="card" 
            style={{ 
              maxWidth: '500px', 
              width: '90%',
              padding: '30px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, color: '#70136C' }}>
              เชิญกรรมการใหม่
            </h3>
            
            <div style={{ marginTop: 20 }}>
              <p style={{ color: '#666', fontSize: '14px' }}>
                ใช้หน้า "จัดการการประกวด" → "มอบหมายกรรมการ" เพื่อเชิญกรรมการสำหรับแต่ละการประกวด
              </p>

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: 20 }}
                onClick={() => setShowInviteModal(false)}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}