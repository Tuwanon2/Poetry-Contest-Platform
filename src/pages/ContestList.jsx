import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function ContestList() {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/contests`);
      setContests(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching contests:', err);
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContest = () => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนสร้างการประกวด');
      navigate('/login');
      return;
    }
    navigate('/create-competition');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getLevels = (contest) => {
    const levels = contest.levels || contest.Levels || [];
    return levels.map(l => l.level_name || l.name).join(', ') || '-';
  };

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>กำลังโหลดข้อมูล...</div>;
  if (error) return <div style={{ padding: 32, textAlign: 'center', color: '#e74c3c' }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#009688', margin: 0 }}>รายการประกวดทั้งหมด</h2>
        <button 
          onClick={handleCreateContest}
          style={{ background: '#00b8a9', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,184,169,0.08)' }}
        >
          + สร้างการประกวดใหม่
        </button>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24 }}>
        {contests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            ไม่พบข้อมูลการประกวด
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ background: '#f4f5f7', color: '#222' }}>
                <th style={thStyle}>ชื่อประกวด</th>
                <th style={thStyle}>ระดับที่เปิดรับ</th>
                <th style={thStyle}>วันที่เปิด</th>
                <th style={thStyle}>วันที่ปิด</th>
                <th style={thStyle}>สถานะ</th>
                <th style={thStyle}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => (
                <tr key={contest.competition_id || contest.id}>
                  <td style={tdStyle}>{contest.title || contest.Title}</td>
                  <td style={tdStyle}>{getLevels(contest)}</td>
                  <td style={tdStyle}>{formatDate(contest.start_date || contest.StartDate)}</td>
                  <td style={tdStyle}>{formatDate(contest.end_date || contest.EndDate)}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 600,
                      background: contest.status === 'open' ? '#d1e7dd' : '#e9ecef',
                      color: contest.status === 'open' ? '#0f5132' : '#495057'
                    }}>
                      {contest.status === 'open' ? 'เปิดรับ' : 'ปิดรับ'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => navigate(`/edit-competition/${contest.competition_id || contest.id}`)}
                      style={actionBtn}
                    >
                      แก้ไข
                    </button>
                    <button 
                      onClick={() => navigate(`/contest-detail/${contest.competition_id || contest.id}`)}
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
const actionBtn = { background: '#e6fffb', color: '#009688', border: 'none', borderRadius: 6, padding: '6px 14px', marginRight: 6, fontWeight: 500, cursor: 'pointer', fontSize: 14 };
