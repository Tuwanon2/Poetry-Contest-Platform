import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function CompetitionsSection() {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, open, closed, draft
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/competitions`);
      setCompetitions(response.data || []);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (competitionId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบการประกวดนี้?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/admin/competitions/${competitionId}`);
      alert('ลบการประกวดสำเร็จ');
      fetchCompetitions();
    } catch (error) {
      console.error('Error deleting competition:', error);
      alert('ไม่สามารถลบการประกวดได้');
    }
  };

  const handleStatusChange = async (competitionId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/competitions/${competitionId}/status`, {
        status: newStatus
      });
      alert('เปลี่ยนสถานะสำเร็จ');
      fetchCompetitions();
    } catch (error) {
      console.error('Error changing status:', error);
      alert('ไม่สามารถเปลี่ยนสถานะได้');
    }
  };

  // Filter competitions
  const filteredCompetitions = competitions.filter(comp => {
    const matchesFilter = filter === 'all' || comp.status === filter;
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'draft': { bg: '#f3f4f6', color: '#6b7280', text: 'Draft' },
      'open': { bg: '#dcfce7', color: '#166534', text: 'เปิดรับสมัคร' },
      'closed': { bg: '#fee2e2', color: '#991b1b', text: 'ปิดรับสมัคร' },
      'judging': { bg: '#fef9e7', color: '#f39c12', text: 'กำลังตัดสิน' },
      'announced': { bg: '#e8f8f5', color: '#27ae60', text: 'ประกาศผลแล้ว' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className="badge-gray" style={{ background: config.bg, color: config.color }}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return <div className="loading-spinner">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>🏆 จัดการการประกวด</h2>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/create-competition')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>➕</span> สร้างการประกวดใหม่
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginTop: 20, padding: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 ค้นหาการประกวด..."
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
          <FilterButton active={filter === 'open'} onClick={() => setFilter('open')}>เปิดรับสมัคร</FilterButton>
          <FilterButton active={filter === 'closed'} onClick={() => setFilter('closed')}>ปิดแล้ว</FilterButton>
          <FilterButton active={filter === 'draft'} onClick={() => setFilter('draft')}>Draft</FilterButton>
        </div>
      </div>

      {/* Competitions Table */}
      <div className="card" style={{ marginTop: 20 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>ชื่อการประกวด</th>
              <th>สถานะ</th>
              <th>ระดับ</th>
              <th>ผลงาน</th>
              <th>กรรมการ</th>
              <th>วันที่เปิด-ปิด</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetitions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  ไม่พบการประกวด
                </td>
              </tr>
            ) : (
              filteredCompetitions.map((comp) => (
                <tr key={comp.competition_id}>
                  <td>
                    <div 
                      style={{ fontWeight: 'bold', cursor: 'pointer', color: '#70136C' }}
                      onClick={() => navigate(`/admin/competition/${comp.competition_id}`)}
                    >
                      {comp.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      {comp.poem_type || 'ทุกประเภท'}
                    </div>
                  </td>
                  <td>{getStatusBadge(comp.status)}</td>
                  <td style={{ textAlign: 'center' }}>
                    {comp.levels_count || 0} ระดับ
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge-gray" style={{ background: '#e8f8f5', color: '#27ae60' }}>
                      {comp.submissions_count || 0} ผลงาน
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {comp.judges_count || 0} คน
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    <div>เปิด: {new Date(comp.start_date).toLocaleDateString('th-TH')}</div>
                    <div>ปิด: {new Date(comp.end_date).toLocaleDateString('th-TH')}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      <button 
                        className="btn-text" 
                        style={{ color: '#2980b9', fontSize: '12px' }}
                        onClick={() => navigate(`/edit-competition/${comp.competition_id}`)}
                      >
                        แก้ไข
                      </button>
                      <button 
                        className="btn-text" 
                        style={{ color: '#27ae60', fontSize: '12px' }}
                        onClick={() => navigate(`/admin/competition/${comp.competition_id}/results`)}
                      >
                        ผลการแข่ง
                      </button>
                      <button 
                        className="btn-text" 
                        style={{ color: '#e74c3c', fontSize: '12px' }}
                        onClick={() => handleDelete(comp.competition_id)}
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

      {/* สถิติด้านล่าง */}
      <div className="grid-4" style={{ marginTop: 20 }}>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#70136C' }}>
            {competitions.length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
            การประกวดทั้งหมด
          </div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
            {competitions.filter(c => c.status === 'open').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
            เปิดรับสมัคร
          </div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e67e22' }}>
            {competitions.filter(c => c.status === 'judging').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
            กำลังตัดสิน
          </div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280' }}>
            {competitions.filter(c => c.status === 'draft').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
            Draft
          </div>
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
