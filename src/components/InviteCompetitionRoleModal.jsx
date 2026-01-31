import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InviteCompetitionRoleModal = ({ 
  isOpen, 
  onClose, 
  competitionId, 
  organizationId, 
  roleType, // 'judge' or 'assistant'
  onSuccess 
}) => {
  const [organizationMembers, setOrganizationMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [levels, setLevels] = useState([]);
  const [permissions, setPermissions] = useState({
    can_view: true,
    can_edit: false,
    can_view_scores: false,
    can_add_assistant: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen && organizationId) {
      fetchOrganizationMembers();
    }
    if (isOpen && competitionId && roleType === 'judge') {
      fetchCompetitionLevels();
    }
  }, [isOpen, organizationId, competitionId, roleType]);

  const fetchOrganizationMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/organizations/${organizationId}/members`);
      setOrganizationMembers(res.data || []);
    } catch (err) {
      console.error('Error fetching organization members:', err);
    }
  };

  const fetchCompetitionLevels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/contests/${competitionId}`);
      // สมมุติว่า API ส่ง levels กลับมา
      if (res.data.levels) {
        setLevels(JSON.parse(res.data.levels));
      }
    } catch (err) {
      console.error('Error fetching competition levels:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (roleType === 'judge') {
        await axios.post(`${API_BASE_URL}/contests/${competitionId}/judges`, {
          user_id: parseInt(selectedUserId),
          level_id: parseInt(selectedLevelId)
        });
        setSuccess('เชิญกรรมการสำเร็จ!');
      } else if (roleType === 'assistant') {
        await axios.post(`${API_BASE_URL}/contests/${competitionId}/assistants`, {
          user_id: parseInt(selectedUserId),
          ...permissions
        });
        setSuccess('เชิญผู้ช่วยสำเร็จ!');
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error inviting role:', err);
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการส่งคำเชิญ');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ 
          margin: '0 0 24px 0',
          color: '#70136C',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          {roleType === 'judge' ? 'เชิญกรรมการ' : 'เชิญผู้ช่วย'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Select Member */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              เลือกสมาชิกจาก Organization
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none'
              }}
            >
              <option value="">-- เลือกสมาชิก --</option>
              {organizationMembers
                .filter(m => m.status === 'accepted')
                .map((member) => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.full_name} ({member.email})
                  </option>
                ))}
            </select>
          </div>

          {/* Level Selection (for Judge only) */}
          {roleType === 'judge' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#333'
              }}>
                เลือกระดับที่ตรวจ
              </label>
              <select
                value={selectedLevelId}
                onChange={(e) => setSelectedLevelId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none'
                }}
              >
                <option value="">-- เลือกระดับ --</option>
                {levels.map((level, idx) => (
                  <option key={idx} value={level.level_id}>
                    {level.level_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Permissions (for Assistant only) */}
          {roleType === 'assistant' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontWeight: '500',
                color: '#333'
              }}>
                สิทธิ์การเข้าถึง
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={permissions.can_view}
                    onChange={(e) => setPermissions({...permissions, can_view: e.target.checked})}
                  />
                  <span>ดูข้อมูลได้</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={permissions.can_edit}
                    onChange={(e) => setPermissions({...permissions, can_edit: e.target.checked})}
                  />
                  <span>แก้ไขข้อมูลได้</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={permissions.can_view_scores}
                    onChange={(e) => setPermissions({...permissions, can_view_scores: e.target.checked})}
                  />
                  <span>ดูคะแนนได้</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={permissions.can_add_assistant}
                    onChange={(e) => setPermissions({...permissions, can_add_assistant: e.target.checked})}
                  />
                  <span>เพิ่มผู้ช่วยคนอื่นได้</span>
                </label>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px',
              background: '#FFEBEE',
              borderLeft: '4px solid #F44336',
              borderRadius: '4px',
              marginBottom: '16px',
              color: '#C62828'
            }}>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{
              padding: '12px',
              background: '#E8F5E9',
              borderLeft: '4px solid #4CAF50',
              borderRadius: '4px',
              marginBottom: '16px',
              color: '#2E7D32'
            }}>
              {success}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                background: 'white',
                color: '#666',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 32px',
                border: 'none',
                borderRadius: '8px',
                background: loading ? '#ccc' : '#70136C',
                color: 'white',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {loading ? 'กำลังส่งคำเชิญ...' : 'ส่งคำเชิญ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteCompetitionRoleModal;
