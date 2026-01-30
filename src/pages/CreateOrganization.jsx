import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';

// เอา import SidebarHome ออกแล้ว
import '../styles/CreateOrganization.css';

const CreateOrganization = () => {
  const navigate = useNavigate();
  // ลบ state sidebarOpen ออก เพราะไม่ได้ใช้แล้ว
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: null,
    certificate: null
  });

  const [previews, setPreviews] = useState({
    coverImage: null,
    certificate: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('กรุณากรอกชื่อ Organization');
      return;
    }

    if (!formData.certificate) {
      setError('กรุณาอัปโหลดใบรับรองความเป็น Organization');
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
      
      // Upload files first
      const formDataToSend = new FormData();
      let coverImageUrl = '';
      
      if (formData.coverImage) {
        formDataToSend.append('file', formData.coverImage);
        const coverRes = await axios.post('http://localhost:8080/api/v1/upload', formDataToSend);
        coverImageUrl = coverRes.data?.url || coverRes.data?.file_url;
      }
      
      const certFormData = new FormData();
      certFormData.append('file', formData.certificate);
      const certRes = await axios.post('http://localhost:8080/api/v1/upload', certFormData);
      const certificateUrl = certRes.data?.url || certRes.data?.file_url;

      // Create organization
      const orgData = {
        name: formData.name,
        description: formData.description,
        cover_image: coverImageUrl || '',
        certificate_document: certificateUrl,
        creator_user_id: parseInt(userId)
      };

      await axios.post('http://localhost:8080/api/v1/organizations', orgData);
      
      // Navigate back to My Organizations page
      alert('สร้าง Organization สำเร็จ! รอการอนุมัติจากผู้ดูแลระบบ');
      navigate('/my-organizations');
    } catch (err) {
      console.error('Error creating organization:', err);
      setError(err.response?.data?.error || 'ไม่สามารถสร้าง Organization ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ลบ <SidebarHome /> ออกแล้ว */}
      
      <div style={{
        flex: 1,
        marginLeft: 0, // ปรับเป็น 0 เพราะไม่มี Sidebar
        minWidth: 0,
        transition: 'margin-left 0.25s cubic-bezier(.4,0,.2,1)',
      }}>
        <TopNav />

        <div className="create-org-container">
          <div className="create-org-header">
            <button className="back-btn" onClick={() => navigate('/my-organizations')}>
              ← กลับ
            </button>
            <h1>สร้าง Organization</h1>
            
          </div>

          <form className="create-org-form" onSubmit={handleSubmit}>
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">ชื่อ Organization *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="เช่น สมาคมกวีไทย, มหาวิทยาลัยXYZ"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">คำอธิบาย</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="บอกเล่าเกี่ยวกับ Organization ของคุณ..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverImage">รูปปก</label>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/*"
              />
              {previews.coverImage && (
                <div className="image-preview">
                  <img src={previews.coverImage} alt="Cover preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="certificate">ใบรับรองความเป็น Organization *</label>
              <input
                type="file"
                id="certificate"
                name="certificate"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              
              {previews.certificate && (
                <div className="file-preview">
                  📄 {formData.certificate.name}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/my-organizations')}
                disabled={loading}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'กำลังสร้าง...' : 'สร้าง Organization'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;