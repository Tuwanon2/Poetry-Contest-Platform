import React, { useState } from 'react';
import axios from 'axios';

const InviteMemberModal = ({ isOpen, onClose, organizationId, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  // ค้นหา user เมื่อพิมพ์ email
  const handleEmailChange = async (value) => {
    setEmail(value);
    
    if (value.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      setSearching(true);
      const res = await axios.get(`http://localhost:8080/api/v1/users/search?email=${value}`);
      setSearchResults(res.data || []);
      setShowDropdown(res.data && res.data.length > 0);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setEmail(user.email);
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`http://localhost:8080/api/v1/organizations/${organizationId}/invite`, {
        email
      });

      setSuccess('ส่งคำเชิญสำเร็จ!');
      setEmail('');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error inviting member:', err);
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
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ 
          margin: '0 0 24px 0',
          color: '#70136C',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          เชิญสมาชิกเข้า Organization
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Email ของผู้ที่ต้องการเชิญ
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onFocus={() => email.length >= 2 && searchResults.length > 0 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              required
              placeholder="พิมพ์ email เพื่อค้นหา..."
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocusCapture={(e) => e.target.style.borderColor = '#70136C'}
              onBlurCapture={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            
            {searching && (
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '44px',
                color: '#999',
                fontSize: '14px'
              }}>
                กำลังค้นหา...
              </div>
            )}

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '2px solid #70136C',
                borderRadius: '8px',
                marginTop: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000
              }}>
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    style={{
                      padding: '12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f6e7f5'}
                    onMouseLeave={(e) => e.target.style.background = 'white'}
                  >
                    <div style={{ fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                      {user.full_name || user.username}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {user.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px',
              background: '#FFEBEE',
              borderLeft: '4px solid #F44336',
              borderRadius: '4px',
              marginBottom: '16px',
              color: '#C62828',
              fontSize: '14px'
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
              color: '#2E7D32',
              fontSize: '14px'
            }}>
              {success}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                background: 'white',
                color: '#666',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              ยกเลิก
            </button>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: loading ? '#9C27B0' : '#70136C',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'กำลังส่งคำเชิญ...' : 'ส่งคำเชิญ'}
            </button>
          </div>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: '#F5F5F5',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#666'
        }}>
          💡 <strong>หมายเหตุ:</strong> ผู้ที่ถูกเชิญจะได้รับคำเชิญและสามารถยอมรับหรือปฏิเสธได้ที่หน้า "Organizations ของฉัน"
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;
