import React, { useState, useEffect } from 'react';
import axios from 'axios';

import API_BASE_URL from '../../config/api';

export default function ReportsSection() {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [reportData, setReportData] = useState(null);
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

  const fetchReportData = async (competitionId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/competitions/${competitionId}/report`);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    if (!selectedCompetition) {
      alert('กรุณาเลือกการประกวดก่อน');
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/competitions/${selectedCompetition.competition_id}/report-export?format=${format}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${selectedCompetition.competition_id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      alert(`ดาวน์โหลดรายงาน (${format.toUpperCase()}) สำเร็จ`);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('ไม่สามารถดาวน์โหลดรายงานได้');
    }
  };

  return (
    <div className="fade-in">
      <h2 className="section-header">📊 รายงานและสถิติ (Reports & Analytics)</h2>

      {/* เลือกการประกวด */}
      <div className="card" style={{ marginTop: 20, padding: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', fontSize: '14px' }}>
              เลือกการประกวด
            </label>
            <select
              value={selectedCompetition?.competition_id || ''}
              onChange={(e) => {
                const comp = competitions.find(c => c.competition_id === parseInt(e.target.value));
                setSelectedCompetition(comp);
                if (comp) fetchReportData(comp.competition_id);
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
                  {comp.title}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-primary" 
              style={{ background: '#e74c3c' }}
              onClick={() => handleExport('pdf')}
              disabled={!selectedCompetition}
            >
              📄 Export PDF
            </button>
            <button 
              className="btn-primary" 
              style={{ background: '#27ae60' }}
              onClick={() => handleExport('xlsx')}
              disabled={!selectedCompetition}
            >
              📊 Export Excel
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="loading-spinner">กำลังโหลดรายงาน...</div>}

      {reportData && !loading && (
        <>
          {/* ภาพรวมการประกวด */}
          <div className="card" style={{ marginTop: 20, padding: '20px' }}>
            <h3 className="sub-header">📈 ภาพรวมการประกวด: {selectedCompetition?.title}</h3>
            
            <div className="grid-4" style={{ marginTop: 15 }}>
              <StatBox 
                title="จำนวนผู้สมัคร" 
                value={reportData.total_participants || 0} 
                color="#8e44ad"
                icon="👥"
              />
              <StatBox 
                title="ผลงานที่ส่ง" 
                value={reportData.total_submissions || 0} 
                color="#3498db"
                icon="📝"
              />
              <StatBox 
                title="ตรวจสอบแล้ว" 
                value={reportData.scored_submissions || 0} 
                color="#27ae60"
                icon="✅"
              />
              <StatBox 
                title="คะแนนเฉลี่ย" 
                value={reportData.average_score?.toFixed(2) || '0.00'} 
                color="#e67e22"
                icon="⭐"
              />
            </div>
          </div>

          {/* ผลงานต่อระดับ */}
          <div className="card" style={{ marginTop: 20 }}>
            <h3 className="sub-header">📊 จำนวนผลงานต่อระดับ</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ระดับ</th>
                  <th>จำนวนผลงาน</th>
                  <th>ตรวจแล้ว</th>
                  <th>คะแนนเฉลี่ย</th>
                  <th>คะแนนสูงสุด</th>
                  <th>คะแนนต่ำสุด</th>
                </tr>
              </thead>
              <tbody>
                {reportData.by_level?.map((level, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '500' }}>{level.level_name}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-gray" style={{ background: '#e3f2fd', color: '#2980b9' }}>
                        {level.total_submissions}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-gray" style={{ background: '#e8f8f5', color: '#27ae60' }}>
                        {level.scored_submissions}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#e67e22' }}>
                      {level.average_score?.toFixed(2) || 'N/A'}
                    </td>
                    <td style={{ textAlign: 'center', color: '#27ae60' }}>
                      {level.max_score?.toFixed(2) || 'N/A'}
                    </td>
                    <td style={{ textAlign: 'center', color: '#e74c3c' }}>
                      {level.min_score?.toFixed(2) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* การกระจายคะแนน */}
          <div className="card" style={{ marginTop: 20 }}>
            <h3 className="sub-header">📉 การกระจายคะแนน</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ช่วงคะแนน</th>
                  <th>จำนวนผลงาน</th>
                  <th>เปอร์เซ็นต์</th>
                </tr>
              </thead>
              <tbody>
                {reportData.score_distribution?.map((dist, index) => (
                  <tr key={index}>
                    <td>{dist.range}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-gray" style={{ background: '#f3e5f5', color: '#8e44ad' }}>
                        {dist.count} ผลงาน
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                          flex: 1, 
                          height: '20px', 
                          background: '#f0f0f0', 
                          borderRadius: '10px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${dist.percentage}%`, 
                            height: '100%', 
                            background: '#70136C',
                            transition: 'width 0.3s'
                          }}></div>
                        </div>
                        <span style={{ fontWeight: 'bold', minWidth: '50px' }}>
                          {dist.percentage?.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ประสิทธิภาพกรรมการ */}
          <div className="card" style={{ marginTop: 20 }}>
            <h3 className="sub-header">⚖️ ประสิทธิภาพกรรมการ</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>กรรมการ</th>
                  <th>ตรวจแล้ว</th>
                  <th>ยังไม่ตรวจ</th>
                  <th>เวลาเฉลี่ยต่อผลงาน</th>
                  <th>คะแนนเฉลี่ยที่ให้</th>
                </tr>
              </thead>
              <tbody>
                {reportData.judge_performance?.map((judge, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '500' }}>{judge.judge_name}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-gray" style={{ background: '#e8f8f5', color: '#27ae60' }}>
                        {judge.scored_count}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-gray" style={{ 
                        background: judge.pending_count > 0 ? '#fef9e7' : '#f0f0f0', 
                        color: judge.pending_count > 0 ? '#f39c12' : '#999'
                      }}>
                        {judge.pending_count}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
                      {judge.avg_time_minutes ? `${judge.avg_time_minutes} นาที` : 'N/A'}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#2980b9' }}>
                      {judge.avg_score_given?.toFixed(2) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* เวลาที่ใช้ในการตรวจ */}
          <div className="grid-2" style={{ marginTop: 20 }}>
            <div className="card" style={{ padding: '20px' }}>
              <h3 className="sub-header">⏱️ สถิติเวลา</h3>
              <div style={{ marginTop: 15 }}>
                <div style={{ marginBottom: 15 }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>เวลาเฉลี่ยต่อผลงาน</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#70136C', marginTop: '5px' }}>
                    {reportData.timing?.avg_time_per_submission || 'N/A'} นาที
                  </div>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>เวลาสั้นสุด</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#27ae60', marginTop: '5px' }}>
                    {reportData.timing?.min_time || 'N/A'} นาที
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#666' }}>เวลานานสุด</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c', marginTop: '5px' }}>
                    {reportData.timing?.max_time || 'N/A'} นาที
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h3 className="sub-header">📅 Timeline</h3>
              <div style={{ marginTop: 15 }}>
                <div style={{ marginBottom: 15 }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>เปิดรับสมัคร</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '5px' }}>
                    {new Date(selectedCompetition.start_date).toLocaleDateString('th-TH')}
                  </div>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>ปิดรับสมัคร</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '5px' }}>
                    {new Date(selectedCompetition.end_date).toLocaleDateString('th-TH')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#666' }}>ระยะเวลารวม</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '5px' }}>
                    {Math.ceil((new Date(selectedCompetition.end_date) - new Date(selectedCompetition.start_date)) / (1000 * 60 * 60 * 24))} วัน
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!selectedCompetition && !loading && (
        <div className="card" style={{ marginTop: 20, padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
          <div style={{ fontSize: '18px', color: '#666' }}>กรุณาเลือกการประกวดเพื่อดูรายงาน</div>
        </div>
      )}
    </div>
  );
}

function StatBox({ title, value, color, icon }) {
  return (
    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: color }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
        {title}
      </div>
    </div>
  );
}
