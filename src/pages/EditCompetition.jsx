import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TopNav from "../components/TopNav";
import SidebarNav from "../components/SidebarNav";
import { SidebarNavContext } from "../components/SidebarNavContext";
import "../styles/EditCompetition.css";

const EditCompetition = () => {
  const { competitionId } = useParams();
  const navigate = useNavigate();
  const [sidebarPage, setSidebarPage] = useState('edit');
  const [loading, setLoading] = useState(true);
  
  // Handle sidebar navigation
  const handleSidebarNavigate = (page) => {
    if (page === 'overview') {
      navigate(`/competition/${competitionId}/manage`);
    } else if (page === 'submissions') {
      navigate(`/competition/${competitionId}/submissions`);
    } else if (page === 'edit') {
      // Already on edit page
      setSidebarPage(page);
    } else {
      setSidebarPage(page);
    }
  };
  
  // Form data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState("open");
  const [posterURL, setPosterURL] = useState("");
  const [registrationStart, setRegistrationStart] = useState("");
  const [registrationEnd, setRegistrationEnd] = useState("");
  const [maxScore, setMaxScore] = useState(10);
  const [levels, setLevels] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Available options
  const availableLevels = ["ประถม", "มัธยม", "มหาวิทยาลัย", "ประชาชนทั่วไป"];
  const availablePoemTypes = ["กลอนแปด", "กาพย์ยานี 11", "กาพย์ฉบัง 16", "โคลงสี่สุภาพ", "สักวา", "ดอกสร้อย", "อินทรวิเชียรฉันท์"];

  useEffect(() => {
    fetchCompetitionData();
  }, [competitionId]);

  const fetchCompetitionData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/competitions/${competitionId}`);
      const comp = res.data;
      
      setTitle(comp.title || "");
      setDescription(comp.description || "");
      setPurpose(comp.purpose || "");
      setStatus(comp.status || "open");
      setPosterURL(comp.poster_url || "");
      setRegistrationStart(comp.start_date ? comp.start_date.split('T')[0] : "");
      setRegistrationEnd(comp.end_date ? comp.end_date.split('T')[0] : "");
      setMaxScore(comp.max_score || 10);
      setLevels(comp.levels || []);
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch competition", err);
      alert("ไม่สามารถโหลดข้อมูลการประกวดได้");
      setLoading(false);
    }
  };

  const handleUpdateCompetition = async () => {
    if (!window.confirm("คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?")) {
      return;
    }
    
    try {
      // 1. อัพเดตข้อมูลการประกวดหลัก
      const payload = {
        title,
        description,
        purpose,
        status,
        poster_url: posterURL,
        registration_start: registrationStart,
        registration_end: registrationEnd,
        max_score: maxScore
      };

      await axios.put(`http://localhost:8080/api/v1/competitions/${competitionId}`, payload);
      
      // 2. อัพเดต scoring_criteria สำหรับแต่ละ level
      const updatePromises = levels
        .filter(level => level.competition_level_id) // มีเฉพาะ level ที่มี id แล้ว
        .map(level => {
          if (level.scoring_criteria && Array.isArray(level.scoring_criteria)) {
            return axios.put(
              `http://localhost:8080/api/v1/competition-levels/${level.competition_level_id}/criteria`,
              { scoring_criteria: level.scoring_criteria }
            ).catch(err => {
              console.error(`Failed to update criteria for level ${level.competition_level_id}:`, err);
              return null; // ไม่ให้ทั้งหมดล้มเหลว
            });
          }
          return Promise.resolve();
        });
      
      await Promise.all(updatePromises);
      
      alert("อัปเดตการประกวดสำเร็จ!");
      navigate(`/competition/${competitionId}/manage`);
    } catch (err) {
      console.error("Failed to update competition", err);
      alert("ไม่สามารถอัปเดตการประกวดได้: " + (err.response?.data?.error || err.message));
    }
  };
  
  const handleAddLevel = () => {
    setLevels([...levels, {
      level_name: availableLevels[0],
      poem_type_id: 1,
      rules: "",
      prizes: [],
      topic_enabled: false,
      topic_name: "",
      scoring_criteria: []
    }]);
  };
  
  const handleRemoveLevel = (index) => {
    if (!window.confirm(`คุณต้องการลบระดับที่ ${index + 1} หรือไม่?`)) {
      return;
    }
    setLevels(levels.filter((_, i) => i !== index));
  };
  
  const handleLevelChange = (index, field, value) => {
    const newLevels = [...levels];
    newLevels[index] = { ...newLevels[index], [field]: value };
    setLevels(newLevels);
  };
  
  const handleAddCriteria = (levelIndex) => {
    const newLevels = [...levels];
    if (!newLevels[levelIndex].scoring_criteria) {
      newLevels[levelIndex].scoring_criteria = [];
    }
    newLevels[levelIndex].scoring_criteria.push({ name: '', max_score: 10 });
    setLevels(newLevels);
  };
  
  const handleRemoveCriteria = (levelIndex, criteriaIndex) => {
    const newLevels = [...levels];
    newLevels[levelIndex].scoring_criteria = newLevels[levelIndex].scoring_criteria.filter((_, i) => i !== criteriaIndex);
    setLevels(newLevels);
  };
  
  const handleCriteriaChange = (levelIndex, criteriaIndex, field, value) => {
    const newLevels = [...levels];
    newLevels[levelIndex].scoring_criteria[criteriaIndex][field] = value;
    setLevels(newLevels);
  };
  
  const handlePosterUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB");
      return;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await axios.post('http://localhost:8080/api/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data && res.data.url) {
        setPosterURL(res.data.url);
        alert("อัพโหลดโปสเตอร์สำเร็จ!");
      }
    } catch (err) {
      console.error("Failed to upload poster", err);
      alert("ไม่สามารถอัพโหลดโปสเตอร์ได้: " + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCompetition = async () => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบการประกวดนี้? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/v1/competitions/${competitionId}`);
      alert("ลบการประกวดสำเร็จ");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete competition", err);
      alert("ไม่สามารถลบการประกวดได้");
    }
  };

  if (loading) {
    return (
      <SidebarNavContext.Provider value={{ sidebarPage, setSidebarPage }}>
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fb" }}>
          <SidebarNav current={sidebarPage} onNavigate={setSidebarPage} />
          <div style={{ flex: 1, marginLeft: 220 }}>
            <TopNav />
            <div style={{ padding: "120px 24px", textAlign: "center" }}>
              <div className="loading-spinner">กำลังโหลด...</div>
            </div>
          </div>
        </div>
      </SidebarNavContext.Provider>
    );
  }

  return (
    <SidebarNavContext.Provider value={{ sidebarPage, setSidebarPage }}>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fb" }}>
        <SidebarNav current={sidebarPage} onNavigate={handleSidebarNavigate} />
        
        <div style={{ flex: 1, marginLeft: 220 }}>
          <TopNav />
      
          <div className="edit-comp-container">
            {/* Header */}
            <div className="edit-comp-header">
              <button className="back-btn" onClick={() => navigate(`/competition/${competitionId}/manage`)}>
                ← กลับ
              </button>
              <h1 className="page-title">แก้ไขการประกวด</h1>
            </div>

            {/* Form */}
            <div className="edit-comp-form">
              {/* Basic Information */}
              <div className="form-section">
                <h2 className="section-title">ข้อมูลพื้นฐาน</h2>
                
                <div className="form-group">
                  <label className="form-label">ชื่อการประกวด</label>
                  <input
                    type="text"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ระบุชื่อการประกวด"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">คำอธิบาย</label>
                  <textarea
                    className="form-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="อธิบายรายละเอียดการประกวด"
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">วัตถุประสงค์</label>
                  <textarea
                    className="form-textarea"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="วัตถุประสงค์ของการประกวด"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">โปสเตอร์การประกวด</label>
                  
                  {/* Current Poster Preview */}
                  {posterURL && (
                    <div className="poster-preview">
                      <img 
                        src={posterURL} 
                        alt="Current poster" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '300px', 
                          objectFit: 'contain',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          marginBottom: '12px'
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <label 
                      htmlFor="poster-upload" 
                      className="upload-btn"
                      style={{ opacity: uploading ? 0.6 : 1 }}
                    >
                      {uploading ? "กำลังอัพโหลด..." : "📤 เลือกโปสเตอร์ใหม่"}
                    </label>
                    <input
                      id="poster-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePosterUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                    {posterURL && (
                      <button
                        type="button"
                        className="clear-poster-btn"
                        onClick={() => {
                          if (window.confirm("ต้องการลบโปสเตอร์หรือไม่?")) {
                            setPosterURL("");
                          }
                        }}
                      >
                        🗑️ ลบโปสเตอร์
                      </button>
                    )}
                  </div>
                  
                  {/* URL Input (optional manual entry) */}
                  <input
                    type="text"
                    className="form-input"
                    value={posterURL}
                    onChange={(e) => setPosterURL(e.target.value)}
                    placeholder="หรือใส่ URL โปสเตอร์โดยตรง"
                    style={{ marginTop: '12px' }}
                  />
                </div>
              </div>

              {/* Dates & Status */}
              <div className="form-section">
                <h2 className="section-title">วันที่และสถานะ</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">วันเปิดรับสมัคร</label>
                    <input
                      type="date"
                      className="form-input"
                      value={registrationStart}
                      onChange={(e) => setRegistrationStart(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">วันปิดรับสมัคร</label>
                    <input
                      type="date"
                      className="form-input"
                      value={registrationEnd}
                      onChange={(e) => setRegistrationEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">สถานะการประกวด</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="open">เปิดรับสมัคร</option>
                      <option value="closed">ปิดรับสมัคร</option>
                      <option value="judging">กำลังตัดสิน</option>
                      <option value="completed">เสร็จสิ้น</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">คะแนนเต็ม</label>
                    <input
                      type="number"
                      className="form-input"
                      value={maxScore}
                      onChange={(e) => setMaxScore(parseInt(e.target.value) || 10)}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Levels Information */}
              <div className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 className="section-title" style={{ margin: 0 }}>จัดการระดับการประกวด</h2>
                  <button 
                    type="button"
                    className="add-level-btn"
                    onClick={handleAddLevel}
                  >
                    + เพิ่มระดับ
                  </button>
                </div>
                
                {levels.length === 0 ? (
                  <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                    ยังไม่มีระดับการประกวด คลิก "เพิ่มระดับ" เพื่อเริ่มต้น
                  </p>
                ) : (
                  <div className="levels-list">
                    {levels.map((level, idx) => (
                      <div key={idx} className="level-item">
                        <div className="level-header">
                          <h4>ระดับที่ {idx + 1}</h4>
                          <button 
                            type="button"
                            className="remove-level-btn"
                            onClick={() => handleRemoveLevel(idx)}
                          >
                            🗑️ ลบ
                          </button>
                        </div>
                        
                        <div className="level-fields">
                          <div className="form-group">
                            <label className="form-label">ระดับ</label>
                            <select
                              className="form-select"
                              value={level.level_name || ""}
                              onChange={(e) => handleLevelChange(idx, 'level_name', e.target.value)}
                            >
                              {availableLevels.map(lvl => (
                                <option key={lvl} value={lvl}>{lvl}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label">กติกา/รายละเอียด</label>
                            <textarea
                              className="form-textarea"
                              value={level.rules || ""}
                              onChange={(e) => handleLevelChange(idx, 'rules', e.target.value)}
                              placeholder="ระบุกติกาและรายละเอียดสำหรับระดับนี้"
                              rows={3}
                            />
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">
                                <input
                                  type="checkbox"
                                  checked={level.topic_enabled || false}
                                  onChange={(e) => handleLevelChange(idx, 'topic_enabled', e.target.checked)}
                                  style={{ marginRight: '8px' }}
                                />
                                กำหนดหัวข้อบังคับ
                              </label>
                            </div>
                          </div>
                          
                          {level.topic_enabled && (
                            <div className="form-group">
                              <label className="form-label">หัวข้อ</label>
                              <input
                                type="text"
                                className="form-input"
                                value={level.topic_name || ""}
                                onChange={(e) => handleLevelChange(idx, 'topic_name', e.target.value)}
                                placeholder="ระบุหัวข้อบังคับ"
                              />
                            </div>
                          )}
                          
                          {/* Scoring Criteria Section */}
                          <div className="form-group" style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <label className="form-label" style={{ margin: 0, color: '#70136C' }}>
                                เกณฑ์การให้คะแนน <span style={{ color: '#e74c3c' }}>*</span>
                              </label>
                              <span style={{ fontSize: '14px', color: '#70136C', fontWeight: 600 }}>
                                คะแนนรวม: {(level.scoring_criteria || []).reduce((sum, c) => sum + (c.max_score || 0), 0)} คะแนน
                              </span>
                            </div>
                            
                            {(level.scoring_criteria || []).length > 0 ? (
                              <div style={{ display: 'grid', gap: '8px', marginBottom: '8px' }}>
                                {level.scoring_criteria.map((criteria, cidx) => (
                                  <div key={cidx} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    padding: '8px',
                                    background: '#f8f9fa',
                                    borderRadius: '6px',
                                    border: '1px solid #e0e0e0'
                                  }}>
                                    <div style={{ 
                                      background: '#70136C', 
                                      color: 'white', 
                                      width: '28px', 
                                      height: '28px', 
                                      borderRadius: '50%', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      fontWeight: 600,
                                      fontSize: '13px',
                                      flexShrink: 0
                                    }}>
                                      {cidx + 1}
                                    </div>
                                    
                                    <input
                                      type="text"
                                      value={criteria.name}
                                      onChange={(e) => handleCriteriaChange(idx, cidx, 'name', e.target.value)}
                                      placeholder="ชื่อเกณฑ์"
                                      style={{
                                        flex: 1,
                                        padding: '6px 10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                      }}
                                    />
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <input
                                        type="number"
                                        value={criteria.max_score}
                                        onChange={(e) => handleCriteriaChange(idx, cidx, 'max_score', parseInt(e.target.value) || 0)}
                                        style={{
                                          width: '70px',
                                          padding: '6px 8px',
                                          border: '1px solid #ddd',
                                          borderRadius: '4px',
                                          fontSize: '14px',
                                          textAlign: 'center'
                                        }}
                                      />
                                      <span style={{ fontSize: '13px', color: '#666', minWidth: '45px' }}>คะแนน</span>
                                    </div>
                                    
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCriteria(idx, cidx)}
                                      style={{
                                        background: '#e74c3c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '28px',
                                        height: '28px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        flexShrink: 0
                                      }}
                                      title="ลบเกณฑ์"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                            
                            <button
                              type="button"
                              onClick={() => handleAddCriteria(idx)}
                              style={{
                                width: '100%',
                                padding: '10px',
                                background: 'white',
                                border: '2px dashed #70136C',
                                borderRadius: '6px',
                                color: '#70136C',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                            >
                              + เพิ่มเกณฑ์การให้คะแนน
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button className="save-btn" onClick={handleUpdateCompetition}>
                  💾 บันทึกการเปลี่ยนแปลง
                </button>
                <button className="delete-btn" onClick={handleDeleteCompetition}>
                  🗑️ ลบการประกวด
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarNavContext.Provider>
  );
};

export default EditCompetition;
