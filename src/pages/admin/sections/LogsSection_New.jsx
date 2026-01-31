import React, { useState, useEffect } from 'react';
import axios from 'axios';

import API_BASE_URL from '../../config/api';

export default function LogsSection() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, user, admin, judge, system
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchLogs();
  }, [filter, dateRange]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/logs`, {
        params: {
          user_type: filter !== 'all' ? filter : undefined,
          start_date: dateRange.start,
          end_date: dateRange.end
        }
      });
      setLogs(response.data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (action) => {
    if (action.includes('login') || action.includes('logout')) return '🔐';
    if (action.includes('สร้าง')) return '➕';
    if (action.includes('แก้ไข')) return '✏️';
    if (action.includes('ลบ')) return '🗑️';
    if (action.includes('อนุมัติ')) return '✅';
    if (action.includes('ปฏิเสธ')) return '❌';
    if (action.includes('ให้คะแนน')) return '⭐';
    if (action.includes('สำรอง')) return '💾';
    return '📝';
  };

  const getLogColor = (userType) => {
    const colors = {
      'admin': '#e74c3c',
      'organizer': '#e67e22',
      'judge': '#27ae60',
      'user': '#3498db',
      'system': '#7f8c8d'
    };
    return colors[userType] || '#666';
  };

  if (loading) {
    return <div className="loading-spinner">กำลังโหลด Logs...</div>;
  }

  return (
    <div className="fade-in">
      <h2 className="section-header">📜 Logs & Audit Trail</h2>

      {/* Filters */}
      <div className="card" style={{ marginTop: 20, padding: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 5, fontSize: '13px', fontWeight: '500' }}>
              ประเภท Log
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="all">ทั้งหมด</option>
              <option value="admin">Admin</option>
              <option value="organizer">ผู้จัดการประกวด</option>
              <option value="judge">กรรมการ</option>
              <option value="user">ผู้ใช้ทั่วไป</option>
              <option value="system">ระบบ</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 5, fontSize: '13px', fontWeight: '500' }}>
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 5, fontSize: '13px', fontWeight: '500' }}>
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button 
              className="btn-primary" 
              onClick={fetchLogs}
              style={{ background: '#2980b9' }}
            >
              🔍 ค้นหา
            </button>
          </div>

          <div style={{ marginTop: 'auto', marginLeft: 'auto' }}>
            <button 
              className="btn-primary" 
              onClick={() => alert('ฟีเจอร์ Export Logs ยังไม่พร้อมใช้งาน')}
              style={{ background: '#27ae60' }}
            >
              📥 Export Logs
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card" style={{ marginTop: 20 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th style={{ width: '150px' }}>วันที่/เวลา</th>
              <th style={{ width: '120px' }}>ประเภท</th>
              <th style={{ width: '150px' }}>ผู้ใช้</th>
              <th>กิจกรรม</th>
              <th style={{ width: '120px' }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  ไม่พบ Logs
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center', fontSize: '20px' }}>
                    {getLogIcon(log.action)}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {new Date(log.created_at).toLocaleString('th-TH')}
                  </td>
                  <td>
                    <span 
                      className="badge-gray" 
                      style={{ 
                        background: `${getLogColor(log.user_type)}20`,
                        color: getLogColor(log.user_type),
                        fontSize: '12px'
                      }}
                    >
                      {log.user_type}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    {log.user_name || 'System'}
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    {log.action}
                    {log.details && (
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                        {log.details}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: '#999' }}>
                    {log.ip_address || 'N/A'}
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
            {logs.length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Logs ทั้งหมด</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
            {logs.filter(l => l.user_type === 'admin').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Admin Actions</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
            {logs.filter(l => l.user_type === 'judge').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Judge Actions</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7f8c8d' }}>
            {logs.filter(l => l.user_type === 'system').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>System Events</div>
        </div>
      </div>
    </div>
  );
}
