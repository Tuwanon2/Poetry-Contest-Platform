import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserGraduate, FaChalkboardTeacher, FaUniversity, FaUsers, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import TopNav from "../components/TopNav";
import InviteJudgeModal from "../components/InviteJudgeModal";
import styles from "./CreateCompetition.module.css"; 

// =========================
// Level Card Component
// =========================
function LevelSelectCard({ label, icon, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`${styles.levelCard} ${selected ? styles.levelCardSelected : ''}`}
    >
      <span className={styles.levelIcon}>{icon}</span>
      <span className={styles.levelLabel}>{label}</span>
    </div>
  );
}

// =========================
// Upload Poster Box (Updated with Preview)
// =========================
const UploadBox = ({ file, onSelect }) => {
  const [preview, setPreview] = useState(null);

  // สร้าง URL สำหรับ Preview เมื่อไฟล์เปลี่ยน
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Cleanup function เพื่อคืน Memory เมื่อ component ถูกทำลายหรือเปลี่ยนไฟล์
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className={styles.uploadBox} style={{ position: 'relative' }}>
      <h3 style={{ marginBottom: 10 }}>อัปโหลดโปสเตอร์ประกวด</h3>
      <p style={{ marginBottom: 20, color: "#888" }}>เลือกไฟล์รูป jpg หรือ png</p>
      
      {/* Hidden Input */}
      <input
        type="file"
        accept="image/*"
        id="posterFile"
        onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
                onSelect(e.target.files[0]);
            }
        }}
        style={{ display: "none" }}
      />

      {/* Preview Area */}
      {preview ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
            <div style={{ position: 'relative', maxWidth: '300px' }}>
                <img 
                    src={preview} 
                    alt="Poster Preview" 
                    style={{ width: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
                />
                {/* Remove Button */}
                <button
                    onClick={() => onSelect(null)}
                    style={{
                        position: 'absolute', top: -10, right: -10,
                        background: '#ff4d4f', color: 'white', border: 'none',
                        borderRadius: '50%', width: 30, height: 30, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                    title="ลบรูปภาพ"
                >
                    <FaTimes />
                </button>
            </div>
            {file && <p style={{ fontSize: "0.9rem", color: "#666", marginTop: 10 }}>{file.name}</p>}
        </div>
      ) : (
        // Upload Button
        <button
            className={styles.uploadButton}
            onClick={() => document.getElementById("posterFile").click()}
        >
            เลือกไฟล์รูป
        </button>
      )}
    </div>
  );
};

// =========================
// MAIN PAGE: CreateCompetition
// =========================
export default function CreateCompetition() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Organization Logic
  const organizationIdFromStorage = localStorage.getItem('current_organization_id');
  const organizationIdFromState = location.state?.organizationId;
  const organizationId = organizationIdFromStorage 
    ? parseInt(organizationIdFromStorage) 
    : (organizationIdFromState || null);

  useEffect(() => {
    // Cleanup or Initial check
  }, []);
  
  // --- Constants ---
  const poemTypeOptions = [
    { label: "กลอนแปด", value: "กลอนแปด" },
    { label: "กาพย์ยานี 11", value: "กาพย์ยานี 11" },
    { label: "กาพย์ฉบัง 16", value: "กาพย์ฉบัง 16" },
    { label: "โคลงสี่สุภาพ", value: "โคลงสี่สุภาพ" },
    { label: "สักวา", value: "สักวา" },
    { label: "ดอกสร้อย", value: "ดอกสร้อย" },
    { label: "อินทรวิเชียรฉันท์", value: "อินทรวิเชียรฉันท์" },
  ];

  const ALL_LEVELS = [
    { label: "ประถม", icon: <FaChalkboardTeacher /> },
    { label: "มัธยม", icon: <FaUserGraduate /> },
    { label: "มหาวิทยาลัย", icon: <FaUniversity /> },
    { label: "ประชาชนทั่วไป", icon: <FaUsers /> },
  ];

  const defaultAssistantPermissions = [
    { key: 'can_view', label: 'ดูข้อมูลการประกวดทั้งหมด', checked: true },
    { key: 'can_edit', label: 'แก้ไขข้อมูลการประกวด', checked: true },
    { key: 'can_add_assistant', label: 'เพิ่มผู้ช่วยรายอื่น', checked: false },
    { key: 'can_view_scores', label: 'ดูคะแนนกรรมการ', checked: false },
  ];

  // --- States ---
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: General Info
  const [contestName, setContestName] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [poster, setPoster] = useState(null);
  const [posterURL, setPosterURL] = useState(""); // url string (จาก backend)
  const [posterUploading, setPosterUploading] = useState(false);
  const [regOpen, setRegOpen] = useState("");
  const [regClose, setRegClose] = useState("");
  const [contestDescription, setContestDescription] = useState('');
  const [contestPurpose, setContestPurpose] = useState('');

  // Step 2: Level Details & Scoring Criteria
  const [levelPoemTypes, setLevelPoemTypes] = useState({});
  const [levelTopics, setLevelTopics] = useState({});
  const [levelDetails, setLevelDetails] = useState({});

  // Step 3: Judges
  const [judges, setJudges] = useState([]);
  const [showInviteJudgeModal, setShowInviteJudgeModal] = useState(false);

  // --- Handlers ---

  const handleSelectLevel = (level) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter((l) => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  // --- Criteria Handlers ---
  const handleAddCriteria = (level) => {
    const currentList = levelDetails[level + '_criteria'] || [];
    const newList = [...currentList, { id: Date.now(), title: '', score: 10 }];
    setLevelDetails({ ...levelDetails, [level + '_criteria']: newList });
  };

  const handleRemoveCriteria = (level, index) => {
    const currentList = levelDetails[level + '_criteria'] || [];
    const newList = currentList.filter((_, i) => i !== index);
    setLevelDetails({ ...levelDetails, [level + '_criteria']: newList });
  };

  const handleCriteriaChange = (level, index, field, value) => {
    const currentList = levelDetails[level + '_criteria'] || [];
    const newList = [...currentList];
    newList[index] = { ...newList[index], [field]: value };
    setLevelDetails({ ...levelDetails, [level + '_criteria']: newList });
  };

  const calculateTotalScore = (level) => {
    const criteriaList = levelDetails[level + '_criteria'] || [];
    return criteriaList.reduce((sum, item) => sum + (Number(item.score) || 0), 0);
  };



  // --- Validation Handler ---
  const handleNext = () => {
    if (step === 1) {
        if (!contestName.trim()) return alert("กรุณากรอกชื่อการประกวด");
        if (selectedLevels.length === 0) return alert("กรุณาเลือกระดับการแข่งขันอย่างน้อย 1 ระดับ");
        // if (!poster) return alert("กรุณาอัปโหลดโปสเตอร์"); // ถ้าไม่บังคับคอมเมนต์บรรทัดนี้ได้
        if (!regOpen) return alert("กรุณาระบุวันเปิดรับสมัคร");
        if (!regClose) return alert("กรุณาระบุวันปิดรับสมัคร");
        if (new Date(regClose) < new Date(regOpen)) return alert("วันปิดรับสมัครต้องไม่ก่อนวันเปิดรับสมัคร");
        if (!contestDescription.trim()) return alert("กรุณากรอกรายละเอียดการประกวด");
        if (!contestPurpose.trim()) return alert("กรุณากรอกวัตถุประสงค์");
    }

    if (step === 2) {
        for (const level of selectedLevels) {
            if (!levelPoemTypes[level] || levelPoemTypes[level].length === 0) {
                return alert(`กรุณาเลือกประเภทกลอนสำหรับระดับ "${level}"`);
            }
            if (levelTopics[level]?.topicEnabled && !levelTopics[level]?.topicName.trim()) {
                return alert(`กรุณาระบุชื่อหัวข้อบังคับสำหรับระดับ "${level}"`);
            }
            if (!levelDetails[level + '_description']?.trim()) {
                return alert(`กรุณากรอกรายละเอียดเพิ่มเติมสำหรับระดับ "${level}"`);
            }
            const criteria = levelDetails[level + '_criteria'] || [];
            if (criteria.length === 0) {
                return alert(`กรุณาเพิ่มเกณฑ์การให้คะแนนอย่างน้อย 1 ข้อ สำหรับระดับ "${level}"`);
            }
            for (const c of criteria) {
                if (!c.title.trim()) return alert(`ระดับ "${level}": กรุณากรอกชื่อเกณฑ์การให้คะแนนให้ครบ`);
                if (Number(c.score) <= 0) return alert(`ระดับ "${level}": คะแนนเกณฑ์ต้องมากกว่า 0`);
            }
        }
    }

    setStep(prev => prev + 1);
  };

  // --- Submit Logic (Step 4) ---
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (poster && !posterURL) {
        alert('กรุณารออัปโหลดโปสเตอร์ให้เสร็จก่อน');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('name', contestName);
      formData.append('organization_id', organizationId);
      formData.append('registration_start', regOpen);
      formData.append('registration_end', regClose);
      formData.append('description', contestDescription);
      formData.append('objective', contestPurpose);
      // ส่ง poster_url (URL string ที่ได้จาก /api/v1/upload) แทนการแนบไฟล์
      if (posterURL) formData.append('poster_url', posterURL);
      formData.append('levels_json', JSON.stringify(selectedLevels.map(lvl => {
        const criteria = levelDetails[lvl + '_criteria'] || [];
        return {
          level_name: lvl,
          poem_types: levelPoemTypes[lvl] || [],
          topic_mode: levelTopics[lvl]?.topicEnabled ? 'fixed' : 'free',
          topic_name: levelTopics[lvl]?.topicName || '',
          description: levelDetails[lvl + '_description'] || '',
          criteria: criteria,
          scoring_criteria: criteria.map(c => ({ name: c.title, max_score: Number(c.score) })),
          total_score: calculateTotalScore(lvl),
          prizes: levelDetails[lvl + '_prize_enabled'] ? {
            prize_1: levelDetails[lvl + '_prize1'],
            prize_2: levelDetails[lvl + '_prize2'],
            prize_3: levelDetails[lvl + '_prize3'],
          } : null
        };
      })));
      if (judges.length > 0) {
        formData.append('judges_json', JSON.stringify(judges));
      }
      await axios.post('http://localhost:8080/api/v1/competitions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("สร้างการประกวดสำเร็จ!");
      navigate(`/organization/${organizationId}`);
    } catch (error) {
      console.error("Error creating competition:", error);
      const errorMsg = error.response?.data?.message || error.message || "เกิดข้อผิดพลาดในการสร้างการประกวด";
      alert(`เกิดข้อผิดพลาด: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopNav />

      <div className={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <button
            onClick={() => navigate(`/organization/${organizationId}`)}
            style={{
              padding: '8px 16px',
              background: 'white',
              border: '2px solid #70136C',
              borderRadius: 8,
              color: '#70136C',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 16,
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#f6e7f5';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(112,19,108,0.2)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ← กลับไปหน้า Organization
          </button>
        </div>
        
        <div className={styles.mainCard}>
          <h1 className={styles.title}>สร้างการประกวดใหม่</h1>

          {/* Stepper */}
          <div className={styles.stepperContainer}>
            {["รายละเอียด", "เกณฑ์การให้คะแนน", "ผู้ดูแล", "ตรวจสอบ"].map(
              (label, idx, arr) => (
                <React.Fragment key={label}>
                  <div className={styles.stepItem}>
                    <div className={`${styles.stepCircle} ${idx + 1 === step ? styles.stepCircleActive : ''} ${idx + 1 < step ? styles.stepCircleCompleted : ''}`}>
                      {idx + 1}
                    </div>
                    <span className={styles.stepLabel}>{label}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className={`${styles.stepLine} ${idx + 1 < step ? styles.stepLineActive : ''}`} />
                  )}
                </React.Fragment>
              )
            )}
          </div>

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>ชื่อการประกวด <span style={{color:'red'}}>*</span></label>
                <input
                  type="text"
                  value={contestName}
                  onChange={(e) => setContestName(e.target.value)}
                  placeholder="กรอกชื่อการประกวด..."
                  className={styles.input}
                />
              </div>

              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>
                เลือกระดับการแข่งขัน <span style={{color:'red'}}>*</span>
              </div>
              <div className={styles.levelGrid}>
                {ALL_LEVELS.map(({ label, icon }) => (
                  <LevelSelectCard
                    key={label}
                    label={label}
                    icon={icon}
                    selected={selectedLevels.includes(label)}
                    onClick={() => handleSelectLevel(label)}
                  />
                ))}
              </div>

              <UploadBox file={poster} onSelect={async file => {
                setPoster(file);
                setPosterURL("");
                if (file) {
                  setPosterUploading(true);
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await axios.post('http://localhost:8080/api/v1/upload', formData);
                    setPosterURL(res.data?.url || res.data?.file_url || "");
                  } catch (err) {
                    alert('อัปโหลดโปสเตอร์ล้มเหลว');
                  } finally {
                    setPosterUploading(false);
                  }
                }
              }} />

              {posterUploading && <div style={{marginTop:10, color:'#ff9800'}}>กำลังอัปโหลดโปสเตอร์...</div>}
              {posterURL && <div style={{marginTop:10}}><strong>โปสเตอร์:</strong> <a href={posterURL} target="_blank" rel="noopener noreferrer">ดูโปสเตอร์</a></div>}
              {poster && !posterURL && !posterUploading && <div style={{marginTop:10, color:'#ff4d4f'}}><strong>โปสเตอร์:</strong> {poster.name} (ยังไม่อัปโหลด)</div>}

              <div style={{ display: 'flex', gap: 24, marginTop: 32, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>วันที่เปิดรับสมัคร <span style={{color:'red'}}>*</span></label>
                  <input
                    type="date"
                    value={regOpen}
                    onChange={e => setRegOpen(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>วันที่ปิดรับสมัคร <span style={{color:'red'}}>*</span></label>
                  <input
                    type="date"
                    value={regClose}
                    onChange={e => setRegClose(e.target.value)}
                    min={regOpen}
                    className={styles.input}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                  <label className={styles.label}>รายละเอียด (ภาพรวม) <span style={{color:'red'}}>*</span></label>
                  <textarea
                    value={contestDescription}
                    onChange={e => setContestDescription(e.target.value)}
                    className={styles.textarea}
                    rows={4}
                  />
              </div>
               <div className={styles.formGroup}>
                  <label className={styles.label}>วัตถุประสงค์ <span style={{color:'red'}}>*</span></label>
                  <textarea
                    value={contestPurpose}
                    onChange={e => setContestPurpose(e.target.value)}
                    className={styles.textarea}
                    rows={3}
                  />
              </div>

              <div className={styles.buttonContainer}>
                <button className={styles.btnPrimary} onClick={handleNext}>
                  ถัดไป
                </button>
              </div>
            </>
          )}

          {/* ================= STEP 2: SCORING & RULES ================= */}
          {step === 2 && (
            <>
              <h2 style={{ marginBottom: 20 }}>ข้อมูลระดับและเกณฑ์การให้คะแนน</h2>
              {selectedLevels.length === 0 && <p style={{color:'red'}}>กรุณาเลือกระดับในขั้นตอนที่ 1 ก่อน</p>}
              
              {selectedLevels.map((level) => {
                const topicEnabled = levelTopics[level]?.topicEnabled || false;
                const topicName = levelTopics[level]?.topicName || "";
                const selectedPoemTypes = levelPoemTypes[level] || [];
                const criteriaList = levelDetails[level + '_criteria'] || [];
                const totalScore = calculateTotalScore(level);
                const levelDesc = levelDetails[level + '_description'] || '';

                return (
                  <div key={level} className={styles.levelDetailBox}>
                    <h3 className={styles.levelTitle}>ระดับ: {level}</h3>
                    
                    {/* Poem Types */}
                    <div style={{ marginBottom: 16 }}>
                      <label className={styles.label}>ประเภทกลอน <span style={{color:'red'}}>*</span></label>
                      <div className={styles.poemTypeContainer}>
                        {poemTypeOptions.map((pt) => (
                          <label key={pt.value} className={styles.poemTypeLabel}>
                            <input
                              type="checkbox"
                              checked={selectedPoemTypes.includes(pt.value)}
                              onChange={() => {
                                const current = selectedPoemTypes;
                                const newArr = current.includes(pt.value)
                                  ? current.filter(v => v !== pt.value)
                                  : [...current, pt.value];
                                setLevelPoemTypes({ ...levelPoemTypes, [level]: newArr });
                              }}
                              style={{ marginRight: 5 }}
                            />
                            {pt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Topic */}
                    <div className={styles.topicToggleContainer}>
                        <button
                          type="button"
                          className={`${styles.toggleBtnLeft} ${!topicEnabled ? styles.toggleActive : ''}`}
                          onClick={() => setLevelTopics({ ...levelTopics, [level]: { ...levelTopics[level], topicEnabled: false } })}
                        >หัวข้ออิสระ</button>
                        <button
                          type="button"
                          className={`${styles.toggleBtnRight} ${topicEnabled ? styles.toggleActive : ''}`}
                          onClick={() => setLevelTopics({ ...levelTopics, [level]: { ...levelTopics[level], topicEnabled: true } })}
                        >หัวข้อบังคับ</button>
                        
                        {topicEnabled && (
                          <input 
                            type="text" 
                            placeholder="ระบุชื่อหัวข้อ (จำเป็น)" 
                            value={topicName}
                            onChange={(e) => setLevelTopics({ ...levelTopics, [level]: { ...levelTopics[level], topicEnabled: true, topicName: e.target.value } })}
                            className={styles.input}
                            style={{marginLeft: 10, flex: 1, borderColor: (!topicName ? 'red' : '#ddd')}}
                          />
                        )}
                    </div>

                    {/* Description */}
                    <div style={{ marginTop: 20 }}>
                        <label className={styles.label}>รายละเอียดเพิ่มเติมสำหรับระดับ {level} <span style={{color:'red'}}>*</span></label>
                        <textarea
                            className={styles.textarea}
                            rows={3}
                            placeholder={`ระบุรายละเอียด กติกา หรือเงื่อนไขเฉพาะสำหรับระดับ ${level}...`}
                            value={levelDesc}
                            onChange={(e) => setLevelDetails({ ...levelDetails, [level + '_description']: e.target.value })}
                        />
                    </div>

                    {/* Criteria */}
                    <div style={{ marginTop: 25, background: '#f8f9fa', padding: 15, borderRadius: 8, border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <label className={styles.label} style={{marginBottom: 0}}>
                                 เกณฑ์การให้คะแนนและกติกา <span style={{color:'red'}}>*</span>
                            </label>
                            <div style={{ fontWeight: 'bold', color: '#70136C' }}>
                                คะแนนรวม: {totalScore} คะแนน
                            </div>
                        </div>

                        {criteriaList.length === 0 && (
                             <div style={{ textAlign: 'center', color: '#ff4d4f', padding: '10px 0', fontStyle: 'italic' }}>
                                 * กรุณาเพิ่มเกณฑ์การให้คะแนนอย่างน้อย 1 ข้อ
                             </div>
                        )}

                        {criteriaList.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                                <div style={{ 
                                    width: 24, height: 24, background: '#70136C', color: 'white', 
                                    borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 12 
                                }}>
                                    {index + 1}
                                </div>
                                
                                <input 
                                    type="text"
                                    className={styles.input}
                                    style={{ margin: 0, flex: 1 }}
                                    placeholder="ระบุเกณฑ์"
                                    value={item.title}
                                    onChange={(e) => handleCriteriaChange(level, index, 'title', e.target.value)}
                                />

                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <span style={{ fontSize: '0.9em', color: '#666' }}>เต็ม</span>
                                    <input 
                                        type="number"
                                        className={styles.input}
                                        style={{ margin: 0, width: 70, textAlign: 'center' }}
                                        value={item.score}
                                        onChange={(e) => handleCriteriaChange(level, index, 'score', e.target.value)}
                                    />
                                    <span style={{ fontSize: '0.9em', color: '#666' }}>คะแนน</span>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => handleRemoveCriteria(level, index)}
                                    style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: 5 }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}

                        <button 
                            type="button" 
                            onClick={() => handleAddCriteria(level)}
                            style={{ 
                                background: 'white', border: '1px dashed #70136C', color: '#70136C', 
                                width: '100%', padding: '8px', borderRadius: 6, cursor: 'pointer',
                                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5,
                                marginTop: 10
                            }}
                        >
                            <FaPlus size={12} /> เพิ่มเกณฑ์คะแนน
                        </button>
                    </div>

                  </div>
                );
              })}

              <div className={styles.navButtonContainer}>
                <button className={styles.btnSecondary} onClick={() => setStep(1)}>ย้อนกลับ</button>
                <button className={styles.btnPrimary} onClick={handleNext}>ถัดไป</button>
              </div>
            </>
          )}

          {/* ================= STEP 3: JUDGES ================= */}
          {step === 3 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>เตรียมเชิญกรรมการ</h2>
                <button 
                    className={styles.btnSecondary}
                    onClick={() => setShowInviteJudgeModal(true)}
                >
                    ➕ เพิ่มกรรมการ
                </button>
              </div>

              {/* Judges List Table */}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHeader}>
                      <th>ชื่อ-นามสกุล</th>
                      <th>อีเมล</th>
                      <th>ระดับที่รับผิดชอบ</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {judges.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: 20, color: '#999' }}>ยังไม่มีกรรมการ (สามารถข้ามได้)</td></tr>
                    ) : (
                      judges.map((j, idx) => (
                        <tr key={idx}>
                          <td>{j.full_name || `${j.first_name || ''} ${j.last_name || ''}`}</td>
                          <td>{j.email}</td>
                          <td>{j.levels ? j.levels.join(', ') : '-'}</td>
                          <td>
                            <button onClick={() => setJudges(judges.filter((_, i) => i !== idx))} style={{ border:'none', background:'transparent', color:'red', cursor:'pointer' }}>
                                <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className={styles.navButtonContainer} style={{ marginTop: 40 }}>
                <button className={styles.btnSecondary} onClick={() => setStep(2)}>ย้อนกลับ</button>
                <button className={styles.btnPrimary} onClick={() => setStep(4)}>ถัดไป</button>
              </div>
            </>
          )}

          {/* ================= STEP 4: REVIEW ================= */}
          {step === 4 && (
            <>
                <h2 style={{ textAlign: 'center', marginBottom: 30 }}>ตรวจสอบข้อมูลก่อนสร้าง</h2>
                
                <div className={styles.reviewBox}>
                    <h3>📌 ข้อมูลทั่วไป</h3>
                    <p><strong>ชื่อการประกวด:</strong> {contestName}</p>
                    <p><strong>รับสมัคร:</strong> {regOpen || '-'} ถึง {regClose || '-'}</p>
                    <p><strong>ระดับที่เลือก:</strong> {selectedLevels.join(', ')}</p>
                    {posterURL && <div style={{marginTop:10}}><strong>โปสเตอร์:</strong> <a href={posterURL} target="_blank" rel="noopener noreferrer">ดูโปสเตอร์</a></div>}
                    {poster && !posterURL && !posterUploading && <div style={{marginTop:10, color:'#ff4d4f'}}><strong>โปสเตอร์:</strong> {poster.name} (ยังไม่อัปโหลด)</div>}
                </div>

                {judges.length > 0 && (
                  <div className={styles.reviewBox}>
                      <h3>👨‍⚖️ กรรมการที่จะเชิญ ({judges.length} คน)</h3>
                      {judges.map((j, idx) => (
                        <div key={idx} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: '2px solid #70136C' }}>
                          <div><strong>{j.full_name || `${j.first_name || ''} ${j.last_name || ''}`}</strong> ({j.email})</div>
                          <div style={{ fontSize: '0.9em', color: '#666' }}>ระดับ: {j.levels.join(', ')}</div>
                        </div>
                      ))}
                  </div>
                )}

                <div className={styles.reviewBox}>
                    <h3>🏆 รายละเอียดและเกณฑ์คะแนน</h3>
                    {selectedLevels.map(lvl => (
                        <div key={lvl} style={{marginBottom: 15, paddingLeft: 10, borderLeft: '3px solid #70136C'}}>
                            <div style={{fontWeight: 'bold', fontSize: '1.1em'}}>{lvl}</div>
                            <div style={{fontSize: '0.9em', color: '#555', marginBottom: 5}}>
                                <div>ประเภท: {(levelPoemTypes[lvl] || []).join(', ') || '-'}</div>
                                <div>หัวข้อ: {levelTopics[lvl]?.topicEnabled ? levelTopics[lvl].topicName : 'อิสระ'}</div>
                            </div>
                            
                            {levelDetails[lvl + '_description'] && (
                                <div style={{ margin: '8px 0', fontSize: '0.9rem', color: '#333' }}>
                                    <strong>รายละเอียด:</strong> <br/>
                                    <span style={{whiteSpace:'pre-wrap'}}>{levelDetails[lvl + '_description']}</span>
                                </div>
                            )}
                            
                            <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 6, fontSize: '0.9em' }}>
                                <strong>เกณฑ์การให้คะแนน (รวม {calculateTotalScore(lvl)} คะแนน):</strong>
                                <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                                    {(levelDetails[lvl + '_criteria'] || []).map((c, i) => (
                                        <li key={i}>{c.title || '(ไม่มีชื่อ)'} : <b>{c.score}</b> คะแนน</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.navButtonContainer}>
                    <button className={styles.btnSecondary} onClick={() => setStep(3)}>แก้ไข</button>
                    <button 
                        className={styles.btnPrimary} 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'กำลังบันทึก...' : 'ยืนยันและสร้างการประกวด'}
                    </button>
                </div>
            </>
          )}

        </div>
      </div>

      {/* Invite Judge Modal - Prepare Mode */}
      <InviteJudgeModal
        isOpen={showInviteJudgeModal}
        onClose={() => setShowInviteJudgeModal(false)}
        competitionId={null} // null = prepare mode, ยังไม่สร้างการประกวด
        levels={selectedLevels}
        prepareMode={true} // บอกว่าอยู่ในโหมดเตรียมข้อมูล
        onSuccess={(newJudge) => {
          // Check duplicate
          if (judges.some(j => j.email === newJudge.email)) {
            alert('กรรมการคนนี้ถูกเพิ่มแล้ว');
            return;
          }
          // เพิ่มกรรมการเข้าไปใน list
          setJudges([...judges, newJudge]);
          setShowInviteJudgeModal(false);
        }}
      />

    </>
  );
}