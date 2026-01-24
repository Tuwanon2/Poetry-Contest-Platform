import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InviteJudgeModal = ({ isOpen, onClose, competitionId, levels, onSuccess }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Search users by email
  useEffect(() => {
    if (searchEmail.length >= 3) {
      const delaySearch = setTimeout(async () => {
        try {
          setSearching(true);
          const res = await axios.get(`http://localhost:8080/api/v1/users/search?q=${searchEmail}`);
          setSearchResults(res.data || []);
        } catch (err) {
          console.error('Failed to search users:', err);
          setSearchResults([]);
        } finally {
          setSearching(false);
        }
      }, 300);
      
      return () => clearTimeout(delaySearch);
    } else {
      setSearchResults([]);
    }
  }, [searchEmail]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchEmail(user.email);
    setSearchResults([]);
  };

  const handleInvite = async () => {
    if (!selectedUser) {
      alert('กรุณาเลือกผู้ใช้');
      return;
    }

    if (!selectedLevel) {
      alert('กรุณาเลือกระดับที่ต้องการให้ตรวจสอบ');
      return;
    }

    setLoading(true);
    try {
      const currentUserId = parseInt(localStorage.getItem('user_id') || sessionStorage.getItem('user_id'));
      
      const payload = {
        user_id: selectedUser.id,
        level_id: parseInt(selectedLevel),
        invited_by: currentUserId
      };

      await axios.post(`http://localhost:8080/api/v1/contests/${competitionId}/judges`, payload);
      alert('เชิญกรรมการสำเร็จ!');
      
      // Reset form
      setSearchEmail('');
      setSelectedUser(null);
      setSelectedLevel('');
      setSearchResults([]);
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to invite judge:', err);
      alert('ไม่สามารถเชิญกรรมการได้: ' + (err.response?.data?.error || err.message));
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
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <h2 style={{ margin: '0 0 24px 0', color: '#70136C' }}>เชิญกรรมการ</h2>

        {/* Email Search */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            ค้นหาผู้ใช้ (อีเมล)
          </label>
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => {
              setSearchEmail(e.target.value);
              setSelectedUser(null);
            }}
            placeholder="พิมพ์อีเมลเพื่อค้นหา..."
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              border: '1px solid #d0d0d0',
              borderRadius: '8px',
              boxSizing: 'border-box',
            }}
          />
          
          {/* Search Results Dropdown */}
          {searching && (
            <div style={{ marginTop: '8px', padding: '12px', color: '#666', fontSize: '14px' }}>
              กำลังค้นหา...
            </div>
          )}
          
          {searchResults.length > 0 && !selectedUser && (
            <div style={{
              marginTop: '8px',
              border: '1px solid #d0d0d0',
              borderRadius: '8px',
              maxHeight: '200px',
              overflow: 'auto',
              background: 'white',
            }}>
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  <div style={{ fontWeight: '600', color: '#333' }}>{user.full_name || user.username}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{user.email}</div>
                </div>
              ))}
            </div>
          )}

          {selectedUser && (
            <div style={{
              marginTop: '8px',
              padding: '12px',
              background: '#e8f5e9',
              borderRadius: '8px',
              border: '1px solid #27ae60',
            }}>
              <div style={{ fontWeight: '600', color: '#27ae60' }}>✓ เลือกแล้ว:</div>
              <div style={{ fontSize: '14px', color: '#333', marginTop: '4px' }}>
                {selectedUser.full_name || selectedUser.username} ({selectedUser.email})
              </div>
            </div>
          )}
        </div>

        {/* Level Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            เลือกระดับที่ต้องการให้ตรวจสอบ
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              border: '1px solid #d0d0d0',
              borderRadius: '8px',
              boxSizing: 'border-box',
            }}
          >
            <option value="">-- เลือกระดับ --</option>
            {levels && levels.map((level, idx) => (
              <option key={idx} value={level.level_id}>
                {level.level_name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#666',
              border: '1px solid #d0d0d0',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleInvite}
            disabled={loading || !selectedUser || !selectedLevel}
            style={{
              padding: '12px 24px',
              background: (!selectedUser || !selectedLevel) ? '#ccc' : '#70136C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: (!selectedUser || !selectedLevel || loading) ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'กำลังเชิญ...' : 'เชิญกรรมการ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteJudgeModal;
