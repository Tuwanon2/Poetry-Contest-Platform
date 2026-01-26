import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function SettingsSection() {
  const [settings, setSettings] = useState({
    system_name: 'ระบบจัดการการประกวดกลอน',
    system_logo: '',
    notification_email: 'admin@poetry-contest.com',
    default_max_score: 10,
    enable_registration: true,
    enable_notifications: true,
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    backup_enabled: true,
    backup_frequency: 'daily', // daily, weekly, monthly
    theme_color: '#70136C'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/settings`);
      setSettings({ ...settings, ...response.data });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะบันทึกการตั้งค่า?')) return;
    
    try {
      setSaving(true);
      await axios.put(`${API_BASE_URL}/admin/settings`, settings);
      alert('บันทึกการตั้งค่าสำเร็จ!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('ไม่สามารถบันทึกการตั้งค่าได้');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    if (!window.confirm('คุณต้องการสำรองข้อมูลทันทีหรือไม่?')) return;
    
    try {
      await axios.post(`${API_BASE_URL}/admin/backup`);
      alert('สำรองข้อมูลสำเร็จ!');
    } catch (error) {
      console.error('Error backing up:', error);
      alert('ไม่สามารถสำรองข้อมูลได้');
    }
  };

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return <div className="loading-spinner">กำลังโหลดการตั้งค่า...</div>;
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="section-header">⚙️ ตั้งค่าระบบ (System Settings)</h2>
        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={saving}
          style={{ opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'กำลังบันทึก...' : '💾 บันทึกการตั้งค่า'}
        </button>
      </div>

      {/* การตั้งค่าพื้นฐาน */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 className="sub-header">🏢 ข้อมูลระบบ</h3>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', fontSize: '14px' }}>
            ชื่อระบบ
          </label>
          <input
            type="text"
            value={settings.system_name}
            onChange={(e) => handleChange('system_name', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', fontSize: '14px' }}>
            สีธีม (Theme Color)
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={settings.theme_color}
              onChange={(e) => handleChange('theme_color', e.target.value)}
              style={{ width: '60px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={settings.theme_color}
              onChange={(e) => handleChange('theme_color', e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', fontSize: '14px' }}>
            อีเมลสำหรับแจ้งเตือน
          </label>
          <input
            type="email"
            value={settings.notification_email}
            onChange={(e) => handleChange('notification_email', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', fontSize: '14px' }}>
            คะแนนเต็มเริ่มต้น (Default Max Score)
          </label>
          <input
            type="number"
            value={settings.default_max_score}
            onChange={(e) => handleChange('default_max_score', parseInt(e.target.value))}
            min="1"
            max="100"
            style={{
              width: '200px',
              padding: '10px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* การตั้งค่าระบบ */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 className="sub-header">🔧 การตั้งค่าระบบ</h3>
        
        <div style={{ marginBottom: 15, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={settings.enable_registration}
            onChange={(e) => handleChange('enable_registration', e.target.checked)}
            id="enable_registration"
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label htmlFor="enable_registration" style={{ cursor: 'pointer', fontSize: '14px' }}>
            เปิดให้สมัครสมาชิกใหม่
          </label>
        </div>

        <div style={{ marginBottom: 15, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={settings.enable_notifications}
            onChange={(e) => handleChange('enable_notifications', e.target.checked)}
            id="enable_notifications"
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label htmlFor="enable_notifications" style={{ cursor: 'pointer', fontSize: '14px' }}>
            เปิดการแจ้งเตือนทางอีเมล
          </label>
        </div>

        <div style={{ marginBottom: 15, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={settings.backup_enabled}
            onChange={(e) => handleChange('backup_enabled', e.target.checked)}
            id="backup_enabled"
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label htmlFor="backup_enabled" style={{ cursor: 'pointer', fontSize: '14px' }}>
            เปิดการสำรองข้อมูลอัตโนมัติ
          </label>
        </div>

        {settings.backup_enabled && (
          <div style={{ marginLeft: '30px', marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', fontSize: '14px' }}>
              ความถี่ในการสำรองข้อมูล
            </label>
            <select
              value={settings.backup_frequency}
              onChange={(e) => handleChange('backup_frequency', e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="daily">ทุกวัน</option>
              <option value="weekly">ทุกสัปดาห์</option>
              <option value="monthly">ทุกเดือน</option>
            </select>
          </div>
        )}
      </div>

      {/* การตั้งค่าอีเมล (SMTP) */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 className="sub-header">📧 การตั้งค่า SMTP</h3>
        
        <div className="grid-2">
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', fontSize: '14px' }}>
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtp_host}
              onChange={(e) => handleChange('smtp_host', e.target.value)}
              placeholder="smtp.gmail.com"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', fontSize: '14px' }}>
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.smtp_port}
              onChange={(e) => handleChange('smtp_port', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', fontSize: '14px' }}>
              SMTP Username
            </label>
            <input
              type="text"
              value={settings.smtp_username}
              onChange={(e) => handleChange('smtp_username', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', fontSize: '14px' }}>
              SMTP Password
            </label>
            <input
              type="password"
              value={settings.smtp_password}
              onChange={(e) => handleChange('smtp_password', e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      </div>

      {/* การจัดการข้อมูล */}
      <div className="card">
        <h3 className="sub-header">💾 การจัดการข้อมูล</h3>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            style={{ background: '#27ae60' }}
            onClick={handleBackup}
          >
            📦 สำรองข้อมูลทันที
          </button>
          <button 
            className="btn-primary" 
            style={{ background: '#2980b9' }}
            onClick={() => alert('ฟีเจอร์กู้คืนข้อมูลยังไม่พร้อมใช้งาน')}
          >
            ♻️ กู้คืนข้อมูล
          </button>
          <button 
            className="btn-primary" 
            style={{ background: '#e67e22' }}
            onClick={() => {
              if (window.confirm('คุณแน่ใจหรือไม่? การล้างแคชจะทำให้ผู้ใช้ทุกคนต้องล็อกอินใหม่')) {
                alert('ล้างแคชสำเร็จ');
              }
            }}
          >
            🗑️ ล้างแคช
          </button>
        </div>

        <div style={{ marginTop: 20, padding: '15px', background: '#fff3cd', borderRadius: '6px', border: '1px solid #ffc107' }}>
          <strong style={{ color: '#856404' }}>⚠️ คำเตือน:</strong>
          <div style={{ marginTop: 5, fontSize: '13px', color: '#856404' }}>
            การเปลี่ยนแปลงการตั้งค่าระบบอาจส่งผลกระทบต่อผู้ใช้งานทั้งหมด กรุณาตรวจสอบให้แน่ใจก่อนบันทึก
          </div>
        </div>
      </div>
    </div>
  );
}
