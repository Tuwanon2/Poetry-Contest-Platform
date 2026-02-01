import API_BASE_URL from '../config/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';
import { supabase } from '../supabaseClient';
import '../styles/CreateOrganization.css';

const CreateOrganization = () => {
  const navigate = useNavigate();
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // -------- ฟังก์ชันอัปโหลดไฟล์ไป Supabase ----------
const uploadToSupabase = async (file, folder) => {
    if (!file) return "";

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    
    // ✅ กำหนด path ให้ชัดเจน (เช่น product-images/12345.png)
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("product-images") // ✅ ชื่อ Bucket ต้องตรงกับในรูปที่นายส่งมา
      .upload(filePath, file);

    if (error) {
      console.error("Upload Detail:", error);
      throw new Error(`อัปโหลดไฟล์ไม่สำเร็จ: ${error.message}`);
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("กรุณากรอกชื่อ Organization");
      return;
    }

    if (!formData.certificate) {
      setError("กรุณาอัปโหลดใบรับรองความเป็น Organization");
      return;
    }

    try {
      setLoading(true);
      const userId =
        localStorage.getItem("user_id") ||
        sessionStorage.getItem("user_id");

      // ---- อัปโหลดรูปปก (ถ้ามี) ----
      let coverImageUrl = "";
      if (formData.coverImage) {
        coverImageUrl = await uploadToSupabase(
          formData.coverImage,
          "product-images"
        );
      }

      // ---- อัปโหลดใบรับรอง (ต้องมี) ----
      const certificateUrl = await uploadToSupabase(
        formData.certificate,
        "org-certificates"
      );

      // ---- ส่งข้อมูลไป Backend ----
      const orgData = {
        name: formData.name,
        description: formData.description || "",
        cover_image: coverImageUrl,
        certificate_document: certificateUrl,
        creator_user_id: Number(userId),
      };

      await axios.post(`${API_BASE_URL}/organizations`, orgData);

      alert("สร้าง Organization สำเร็จ! รอการอนุมัติจากผู้ดูแลระบบ");
      navigate("/my-organizations");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "ไม่สามารถสร้าง Organization ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <TopNav />

        <div className="create-org-container">
          <div className="create-org-header">
            <button
              className="back-btn"
              onClick={() => navigate('/my-organizations')}
            >
              ← กลับ
            </button>
            <h1>สร้าง Organization</h1>
          </div>

          <form className="create-org-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label>ชื่อ Organization *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="เช่น สมาคมกวีไทย"
                required
              />
            </div>

            <div className="form-group">
              <label>คำอธิบาย</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>รูปปก</label>
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/*"
              />
              {previews.coverImage && (
                <div className="image-preview">
                  <img
                    src={previews.coverImage}
                    alt="Cover preview"
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>ใบรับรองความเป็น Organization *</label>
              <input
                type="file"
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
                {loading ? "กำลังสร้าง..." : "สร้าง Organization"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
