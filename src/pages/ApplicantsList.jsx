import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import API_BASE_URL from '../config/api';

export default function ApplicantsList() {
  const { competitionId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (competitionId) {
      fetchSubmissions();
    }
  }, [competitionId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/competitions/${competitionId}/submissions`);
      setSubmissions(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('ไม่สามารถโหลดข้อมูลผู้สมัครได้');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>กำลังโหลดข้อมูล...</div>;
  if (error) return <div style={{ padding: 32, textAlign: 'center', color: '#e74c3c' }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#009688', margin: 0 }}>ผู้สมัครเข้าประกวด</h2>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24 }}>
        {submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            ยังไม่มีผู้สมัคร
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ background: '#f4f5f7', color: '#222' }}>
                <th style={thStyle}>ชื่อผู้สมัคร</th>
                <th style={thStyle}>ระดับที่สมัคร</th>
                <th style={thStyle}>ชื่อกลอน</th>
                <th style={thStyle}>สถานะ</th>
                <th style={thStyle}>วันที่สมัคร</th>
                <th style={thStyle}>ดูรายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.submission_id || submission.id}>
                  <td style={tdStyle}>{submission.author_name || submission.name || '-'}</td>
                  <td style={tdStyle}>{submission.level_name || '-'}</td>
                  <td style={tdStyle}>{submission.title || '-'}</td>
                  <td style={tdStyle}>
                    <span style={{
                      color: submission.document_url ? '#00b8a9' : '#ff9800',
                      fontWeight: 600
                    }}>
                      {submission.document_url ? '✔ มีเอกสาร' : 'รออัปโหลด'}
                    </span>
                  </td>
                  <td style={tdStyle}>{formatDate(submission.submitted_at || submission.created_at)}</td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => navigate(`/submission-detail/${submission.submission_id || submission.id}`)}
                      style={actionBtn}
                    >
                      ดูรายละเอียด
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const thStyle = { padding: '12px 8px', fontWeight: 600, borderBottom: '1.5px solid #e0e0e0', textAlign: 'left' };
const tdStyle = { padding: '10px 8px', borderBottom: '1px solid #f4f5f7', color: '#222' };
const actionBtn = { background: '#e6fffb', color: '#009688', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, cursor: 'pointer', fontSize: 14 };
