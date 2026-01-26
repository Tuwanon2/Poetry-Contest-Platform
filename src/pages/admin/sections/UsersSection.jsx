import React, { useState, useEffect } from "react";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, applicant, judge, organizer, admin
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/users`);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะเปลี่ยนบทบาทผู้ใช้เป็น ${newRole}?`)) return;
    
    try {
      await axios.put(`${API_BASE_URL}/admin/users/${userId}/role`, { role: newRole });
      alert('เปลี่ยนบทบาทสำเร็จ');
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
      alert('ไม่สามารถเปลี่ยนบทบาทได้');
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    const action = isActive ? 'ระงับ' : 'ปลดแบน';
    if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะ${action}ผู้ใช้นี้?`)) return;
    
    try {
      await axios.put(`${API_BASE_URL}/admin/users/${userId}/status`, { 
        is_active: !isActive 
      });
      alert(`${action}ผู้ใช้สำเร็จ`);
      fetchUsers();
    } catch (error) {
      console.error('Error changing status:', error);
      alert(`ไม่สามารถ${action}ผู้ใช้ได้`);
    }
  };

  const handleResetPassword = async (userId, email) => {
    if (!window.confirm(`ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${email}?`)) return;
    
    try {
      await axios.post(`${API_BASE_URL}/admin/users/${userId}/reset-password`);
      alert('ส่งลิงก์รีเซ็ตรหัสผ่านสำเร็จ');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านได้');
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRoleBadge = (role) => {
    const roleConfig = {
      'admin': { bg: '#fee2e2', color: '#991b1b', text: 'Admin' },
      'organizer': { bg: '#fef9e7', color: '#f39c12', text: 'ผู้จัดการประกวด' },
      'judge': { bg: '#e8f8f5', color: '#27ae60', text: 'กรรมการ' },
      'assistant': { bg: '#e3f2fd', color: '#2980b9', text: 'ผู้ช่วย' },
      'applicant': { bg: '#f3e5f5', color: '#8e44ad', text: 'ผู้สมัคร' }
    };
    const config = roleConfig[role] || { bg: '#f3f4f6', color: '#6b7280', text: role };
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
      <h2 className="section-header">👥 จัดการผู้ใช้งาน (Users Management)</h2>

      {/* Filters */}
      <div className="card" style={{ marginTop: 20, padding: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 ค้นหาผู้ใช้ (ชื่อ, อีเมล)..."
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
          <FilterButton active={filter === 'applicant'} onClick={() => setFilter('applicant')}>ผู้สมัคร</FilterButton>
          <FilterButton active={filter === 'judge'} onClick={() => setFilter('judge')}>กรรมการ</FilterButton>
          <FilterButton active={filter === 'organizer'} onClick={() => setFilter('organizer')}>ผู้จัด</FilterButton>
          <FilterButton active={filter === 'admin'} onClick={() => setFilter('admin')}>Admin</FilterButton>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ marginTop: 20 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อ-สกุล</th>
              <th>อีเมล</th>
              <th>บทบาท</th>
              <th>สถานะ</th>
              <th>วันที่สมัคร</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  ไม่พบผู้ใช้
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.user_id}>
                  <td>#{user.user_id}</td>
                  <td style={{ fontWeight: '500' }}>{user.name || 'ไม่ระบุชื่อ'}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '13px'
                      }}
                    >
                      <option value="applicant">ผู้สมัคร</option>
                      <option value="judge">กรรมการ</option>
                      <option value="organizer">ผู้จัดการประกวด</option>
                      <option value="assistant">ผู้ช่วย</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span style={{ 
                      padding: "4px 10px", 
                      borderRadius: 4, 
                      background: user.is_active ? "#e8f8f5" : "#fbe9e7", 
                      color: user.is_active ? "#27ae60" : "#c0392b",
                      fontSize: '13px'
                    }}>
                      {user.is_active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    {new Date(user.created_at).toLocaleDateString('th-TH')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                      <button 
                        className="btn-text" 
                        style={{ color: user.is_active ? '#c0392b' : '#27ae60', fontSize: '12px' }} 
                        onClick={() => handleStatusChange(user.user_id, user.is_active)}
                      >
                        {user.is_active ? "ระงับบัญชี" : "ปลดแบน"}
                      </button>
                      <button 
                        className="btn-text" 
                        style={{ color: '#2980b9', fontSize: '12px' }}
                        onClick={() => handleResetPassword(user.user_id, user.email)}
                      >
                        รีเซ็ตรหัสผ่าน
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
            {users.length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>ผู้ใช้ทั้งหมด</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8e44ad' }}>
            {users.filter(u => u.role === 'applicant').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>ผู้สมัคร</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
            {users.filter(u => u.role === 'judge').length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>กรรมการ</div>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
            {users.filter(u => !u.is_active).length}
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>ถูกระงับ</div>
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