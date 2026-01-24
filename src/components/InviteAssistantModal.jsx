import React, { useState } from 'react';
import axios from 'axios';

const InviteAssistantModal = ({ isOpen, onClose, organizationId, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState({
    can_view: true,
    can_edit: false,
    can_view_scores: false,
    can_add_assistant: false,
    can_create_competition: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setError('กรุณาเข้าสู่ระบบ');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const invitedBy = user.user_id || user.id;

      await axios.post(`http://localhost:8080/api/v1/organizations/${organizationId}/assistants`, {
        email,
        invited_by: invitedBy,
        ...permissions
      });

      setEmail('');
      setPermissions({
        can_view: true,
        can_edit: false,
        can_view_scores: false,
        can_add_assistant: false,
        can_create_competition: false
      });
      onSuccess();
    } catch (err) {
      console.error('Error inviting assistant:', err);
      setError(err.response?.data?.error || 'ไม่สามารถเชิญผู้ช่วยได้');
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
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '520px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ color: '#70136C', marginBottom: '24px', fontSize: '1.4rem', fontWeight: 700 }}>
          เชิญผู้ช่วยจัดการ
        </h2>

        {error && (
          <div style={{
            padding: '12px',
            background: '#fee',
            color: '#c33',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333' }}>
              อีเมลผู้ช่วย
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0c7e7',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 700, color: '#70136C' }}>
              สิทธิการใช้งาน
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px',
                border: '1.5px solid #e0c7e7',
                borderRadius: '8px',
                cursor: 'pointer',
                background: permissions.can_view ? '#f8f4f9' : '#fff'
              }}>
                <input
                  type="checkbox"
                  checked={permissions.can_view}
                  onChange={(e) => setPermissions({...permissions, can_view: e.target.checked})}
                  style={{ marginRight: '12px', width: '18px', height: '18px' }}
                  disabled
                />
                <div>
                  <div style={{ fontWeight: 600, color: '#333' }}>ดูภาพรวม</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>ดูภาพรวมการประกวดทั้งหมด (ค่าเริ่มต้น)</div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px',
                border: '1.5px solid #e0c7e7',
                borderRadius: '8px',
                cursor: 'pointer',
                background: permissions.can_edit ? '#f8f4f9' : '#fff'
              }}>
                <input
                  type="checkbox"
                  checked={permissions.can_edit}
                  onChange={(e) => setPermissions({...permissions, can_edit: e.target.checked})}
                  style={{ marginRight: '12px', width: '18px', height: '18px' }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: '#333' }}>แก้ไขการประกวด</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>สามารถแก้ไขรายละเอียดการประกวดได้</div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px',
                border: '1.5px solid #e0c7e7',
                borderRadius: '8px',
                cursor: 'pointer',
                background: permissions.can_view_scores ? '#f8f4f9' : '#fff'
              }}>
                <input
                  type="checkbox"
                  checked={permissions.can_view_scores}
                  onChange={(e) => setPermissions({...permissions, can_view_scores: e.target.checked})}
                  style={{ marginRight: '12px', width: '18px', height: '18px' }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: '#333' }}>ดูคะแนน</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>สามารถดูคะแนนจากกรรมการได้</div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px',
                border: '1.5px solid #e0c7e7',
                borderRadius: '8px',
                cursor: 'pointer',
                background: permissions.can_add_assistant ? '#f8f4f9' : '#fff'
              }}>
                <input
                  type="checkbox"
                  checked={permissions.can_add_assistant}
                  onChange={(e) => setPermissions({...permissions, can_add_assistant: e.target.checked})}
                  style={{ marginRight: '12px', width: '18px', height: '18px' }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: '#333' }}>เชิญผู้ช่วยคนอื่น</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>สามารถเชิญผู้ช่วยเพิ่มเติมได้</div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px',
                border: '1.5px solid #e0c7e7',
                borderRadius: '8px',
                cursor: 'pointer',
                background: permissions.can_create_competition ? '#f8f4f9' : '#fff'
              }}>
                <input
                  type="checkbox"
                  checked={permissions.can_create_competition}
                  onChange={(e) => setPermissions({...permissions, can_create_competition: e.target.checked})}
                  style={{ marginRight: '12px', width: '18px', height: '18px' }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: '#333' }}>สร้างการประกวด</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>สามารถสร้างการประกวดใหม่ได้</div>
                </div>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: '2px solid #e0c7e7',
                borderRadius: '8px',
                background: '#fff',
                color: '#70136C',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: loading ? '#ccc' : '#70136C',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'กำลังเชิญ...' : 'ส่งคำเชิญ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteAssistantModal;
