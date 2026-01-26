import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function SubmissionsSection() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, scored, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/submissions`);
      setSubmissions(response.data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (submissionId, newStatus) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะเป็น ${newStatus}?`)) return;
    
    try {
      await axios.put(`${API_BASE_URL}/admin/submissions/${submissionId}/status`, {
        status: newStatus
      });
      alert('เปลี่ยนสถานะสำเร็จ');
      fetchSubmissions();
    } catch (error) {
      console.error('Error changing status:', error);
      alert('ไม่สามารถเปลี่ยนสถานะได้');
    }
  };

  const handleDelete = async (submissionId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบผลงานนี้?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/admin/submissions/${submissionId}`);
      alert('ลบผลงานสำเร็จ');
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('ไม่สามารถลบผลงานได้');
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesFilter = filter === 'all' || sub.status === filter;
    const matchesSearch = 
      sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.author_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status, isScored) => {
    if (isScored) {
      return <span className="badge-gray" style={{ background: '#e8f8f5', color: '#27ae60' }}>ตรวจแล้ว</span>;
    }
    
    const statusConfig = {
      'pending': { bg: '#fef9e7', color: '#f39c12', text: 'รอตรวจ' },
      'approved': { bg: '#e8f8f5', color: '#27ae60', text: 'อนุมัติ' },
      'rejected': { bg: '#fee2e2', color: '#991b1b', text: 'ไม่ผ่าน' },
      'under_review': { bg: '#e3f2fd', color: '#2980b9', text: 'กำลังพิจารณา' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className="badge-gray" style={{ background: config.bg, color: config.color }}>{config.text}</span>;
  };

  if (loading) {
    return <div className="loading-spinner">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="fade-in">
      <h2 className="section-header">📝 จัดการผลงานที่ส่งเข้าประกวด (Submissions Management)</h2>

      {/* Filters */}
      <div className="card" style={{ marginTop: 20, padding: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 ค้นหาผลงาน (ชื่อผลงาน, ผู้ส่ง)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>ทั้งหมด</FilterButton>
          <FilterButton active={filter === 'pending'} onClick={() => setFilter('pending')}>รอตรวจ</FilterButton>
          <FilterButton active={filter === 'approved'} onClick={() => setFilter('approved')}>อนุมัติ</FilterButton>
          <FilterButton active={filter === 'rejected'} onClick={() => setFilter('rejected')}>ไม่ผ่าน</FilterButton>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card" style={{ marginTop: 20 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อผลงาน</th>
              <th>การประกวด</th>
              <th>ระดับ</th>
              <th>ผู้ส่ง</th>
              <th>คะแนนเฉลี่ย</th>
              <th>สถานะ</th>
              <th>วันที่ส่ง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  ไม่พบผลงาน
                </td>
              </tr>
            ) : (
              filteredSubmissions.map(sub => (
                <tr key={sub.submission_id}>
                  <td>#{sub.submission_id}</td>
                  <td>
                    <div 
                      style={{ fontWeight: '500', cursor: 'pointer', color: '#70136C' }}
                      onClick={() => navigate(`/admin/submission/${sub.submission_id}`)}
                    >
                      {sub.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999' }}>
                      {sub.poem_type}
                    </div>
                  </td>
                  <td style={{ fontSize: '13px' }}>{sub.competition_title}</td>
                  <td style={{ fontSize: '13px' }}>{sub.level_name}</td>
                  <td>
                    <div style={{ fontSize: '13px' }}>{sub.author_name}</div>
                    <div style={{ fontSize: '11px', color: '#999' }}>{sub.author_email}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {sub.average_score ? (
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: sub.average_score >= 8 ? '#27ae60' : sub.average_score >= 5 ? '#f39c12' : '#e74c3c' 
                      }}>
                        {sub.average_score.toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>-</span>
                    )}
                  </td>
                  <td>{getStatusBadge(sub.status, sub.is_scored)}</td>
                  <td style={{ fontSize: '12px' }}>
                    {new Date(sub.submitted_at).toLocaleDateString('th-TH')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                      <button 
                        className="btn-text" 
                        style={{ color: '#2980b9', fontSize: '12px' }}
                        onClick={() => navigate(`/admin/submission/${sub.submission_id}`)}
                      >
                        ดูรายละเอียด
                      </button>
                      <select
                        value={sub.status}
                        onChange={(e) => handleStatusChange(sub.submission_id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}
                      >
                        <option value="pending">รอตรวจ</option>
                        <option value="under_review">กำลังพิจารณา</option>
                        <option value="approved">อนุมัติ</option>
                        <option value="rejected">ไม่ผ่าน</option>
                      </select>
                      <button 
                        className="btn-text" 
                        style={{ color: '#e74c3c', fontSize: '12px' }}
                        onClick={() => handleDelete(sub.submission_id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* สถิติ */}
      <div className="grid-4" style={{ marginTop: 20 }}>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#70136C' }}>
            {submissions.length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>ผลงานทั้งหมด</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
            {submissions.filter(s => s.status === 'pending').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>รอตรวจ</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
            {submissions.filter(s => s.is_scored).length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>ตรวจแล้ว</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
            {submissions.filter(s => s.status === 'rejected').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>ไม่ผ่าน</div>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        border: active ? '2px solid #70136C' : '1px solid #e0e0e0',
        background: active ? '#f3e5f5' : 'white',
        color: active ? '#70136C' : '#666',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: active ? '600' : '400',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </button>
  );
}
