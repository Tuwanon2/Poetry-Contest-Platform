import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserGraduate, FaChalkboardTeacher, FaUniversity, FaUsers, FaTrash, FaPlus, FaTimes, FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import TopNav from "../components/TopNav";
import { supabase } from '../supabaseClient';
import InviteJudgeModal from "../components/InviteJudgeModal";
import styles from "./CreateCompetition.module.css";
import API_BASE_URL from '../config/api';

// =========================
// Helper Component: Level Card
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
// Helper Component: Upload Box UI
// =========================
const UploadBox = ({ file, onSelect }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className={styles.uploadBox} style={{ position: 'relative' }}>
      <h3 style={{ marginBottom: 10 }}>อัปโหลดโปสเตอร์ประกวด</h3>
      <p style={{ marginBottom: 20, color: "#888" }}>เลือกไฟล์รูป jpg หรือ png</p>

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

      {preview ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
          <div style={{ position: 'relative', maxWidth: '300px' }}>
            <img
              src={preview}
              alt="Poster Preview"
              style={{ width: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
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

  // --- States ---
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: General Info
  const [contestName, setContestName] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [poster, setPoster] = useState(null);
  const [posterURL, setPosterURL] = useState("");
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

  // --- Judge Handler ---
  const handleJudgeAdded = (newJudgeData) => {
    setJudges([...judges, newJudgeData]);
    setShowInviteJudgeModal(false);
  };

  // --- Validation Handler ---
  const handleNext = () => {
    if (step === 1) {
      if (!contestName.trim()) return alert("กรุณากรอกชื่อการประกวด");
      if (selectedLevels.length === 0) return alert("กรุณาเลือกระดับการแข่งขันอย่างน้อย 1 ระดับ");
      if (posterUploading) return alert("กรุณารออัปโหลดรูปภาพให้เสร็จสักครู่");
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
      // --- Encode newlines as /n ---
      const encodeNewlines = (str) => (str || '').replace(/\n/g, '/n');
      const encodedContestDescription = encodeNewlines(contestDescription);
      const encodedContestPurpose = encodeNewlines(contestPurpose);
      // For level descriptions
      const encodedLevelDetails = { ...levelDetails };
      Object.keys(encodedLevelDetails).forEach(key => {
        if (key.endsWith('_description')) {
          encodedLevelDetails[key] = encodeNewlines(encodedLevelDetails[key]);
        }
      });

      const formData = new FormData();
      formData.append('name', contestName);
      formData.append('organization_id', organizationId);
      formData.append('registration_start', regOpen);
      formData.append('registration_end', regClose);
      formData.append('description', encodedContestDescription);
      formData.append('objective', encodedContestPurpose);

      if (posterURL) formData.append('poster_url', posterURL);

      formData.append('levels_json', JSON.stringify(selectedLevels.map(lvl => {
        const criteria = levelDetails[lvl + '_criteria'] || [];
        return {
          level_name: lvl,
          poem_types: levelPoemTypes[lvl] || [],
          topic_mode: levelTopics[lvl]?.topicEnabled ? 'fixed' : 'free',
          topic_name: levelTopics[lvl]?.topicName || '',
          description: encodedLevelDetails[lvl + '_description'] || '',
          criteria: criteria,
          scoring_criteria: criteria.map(c => ({ name: c.title, max_score: Number(c.score) })),
          total_score: calculateTotalScore(lvl),
        };
      })));

      if (judges.length > 0) {
        formData.append('judges_json', JSON.stringify(judges));
      }

      await axios.post(`${API_BASE_URL}/competitions`, formData, {
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
            className={styles.backButton}
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
          >
            กลับไปหน้า Organization
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
                <label className={styles.label}>ชื่อการประกวด <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  value={contestName}
                  onChange={(e) => setContestName(e.target.value)}
                  placeholder="กรอกชื่อการประกวด..."
                  className={styles.input}
                />
              </div>

              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>
                เลือกระดับการแข่งขัน <span style={{ color: 'red' }}>*</span>
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

              {/* ✅ FIXED: Upload Direct to Supabase */}
              <UploadBox
                file={poster}
                onSelect={async (file) => {
                  setPoster(file);
                  setPosterURL(""); // Reset URL
                  
                  if (file) {
                    setPosterUploading(true);
                    
                    try {
                      const fileExt = file.name.split('.').pop();
                      const fileName = `poster-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
                      const filePath = `competition-posters/${fileName}`;

                      // ⚠️ Make sure bucket name matches your Supabase setup
                      const { error: uploadError } = await supabase.storage
                        .from("product-images") 
                        .upload(filePath, file);

                      if (uploadError) throw uploadError;

                      const { data } = supabase.storage
                        .from("product-images")
                        .getPublicUrl(filePath);

                      setPosterURL(data.publicUrl);
                      console.log("Upload Success, URL:", data.publicUrl);

                    } catch (err) {
                      console.error("Upload Failed:", err);
                      alert(`อัปโหลดไม่ผ่าน: ${err.message}`);
                      setPoster(null);
                    } finally {
                      setPosterUploading(false);
                    }
                  }
                }}
              />

              {posterUploading && <div style={{ marginTop: 10, color: '#ff9800' }}>กำลังอัปโหลดโปสเตอร์...</div>}

              <div style={{ display: 'flex', gap: 24, marginTop: 32, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>วันที่เปิดรับสมัคร <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="date"
                    value={regOpen}
                    onChange={e => setRegOpen(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>วันที่ปิดรับสมัคร <span style={{ color: 'red' }}>*</span></label>
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
                <label className={styles.label}>รายละเอียด (ภาพรวม) <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  value={contestDescription}
                  onChange={e => setContestDescription(e.target.value)}
                  className={styles.textarea}
                  rows={4}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>วัตถุประสงค์ <span style={{ color: 'red' }}>*</span></label>
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

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <>
              <h2 style={{ marginBottom: 20 }}>ข้อมูลระดับและเกณฑ์การให้คะแนน</h2>
              {selectedLevels.length === 0 && <p style={{ color: 'red' }}>กรุณาเลือกระดับในขั้นตอนที่ 1 ก่อน</p>}

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
                    <div style={{ marginBottom: 16 }}>
                      <label className={styles.label}>
                        ประเภทกลอน (เลือกได้ 1 ประเภท) <span style={{ color: 'red' }}>*</span>
                      </label>
                      <div className={styles.formGroup}>
                        <select
                          className={styles.selectInput}
                          value={selectedPoemTypes?.[0] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLevelPoemTypes({
                              ...levelPoemTypes,
                              [level]: val ? [val] : []
                            });
                          }}
                        >
                          <option value="" disabled>-- กรุณาเลือกประเภทกลอน --</option>
                          {poemTypeOptions.map((pt) => (
                            <option key={pt.value} value={pt.value}>{pt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
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
                          style={{ marginLeft: 10, flex: 1, borderColor: (!topicName ? 'red' : '#ddd') }}
                        />
                      )}
                    </div>
                    <div style={{ marginTop: 20 }}>
                      <label className={styles.label}>รายละเอียดเพิ่มเติมสำหรับระดับ {level} <span style={{ color: 'red' }}>*</span></label>
                      <textarea
                        className={styles.textarea}
                        rows={3}
                        placeholder={`ระบุรายละเอียด กติกา หรือเงื่อนไขเฉพาะสำหรับระดับ ${level}...`}
                        value={levelDesc}
                        onChange={(e) => setLevelDetails({ ...levelDetails, [level + '_description']: e.target.value })}
                      />
                    </div>
                    <div style={{ marginTop: 25, background: '#f8f9fa', padding: 15, borderRadius: 8, border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <label className={styles.label} style={{ marginBottom: 0 }}>
                          เกณฑ์การให้คะแนนและกติกา <span style={{ color: 'red' }}>*</span>
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

          {/* ================= STEP 3 ================= */}
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
                            <button onClick={() => setJudges(judges.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'transparent', color: 'red', cursor: 'pointer' }}>
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

          {/* ================= STEP 4 (REVIEW) ================= */}
          {step === 4 && (
            <>
              <style>{`
                .review-container {
                  max-width: 1140px;
                  margin: 0 auto;
                  display: flex;
                  gap: 30px;
                  align-items: flex-start;
                  width: 100%;
                }
                .review-main {
                  flex: 7;
                  width: 100%;
                }
                .review-sidebar {
                  flex: 3;
                  width: 100%;
                  position: sticky;
                  top: 20px;
                }
                @media (max-width: 992px) {
                  .review-container {
                    flex-direction: column;
                    gap: 24px;
                  }
                  .review-sidebar {
                    position: relative;
                    top: auto;
                  }
                }
              `}</style>

              <div className="review-container">
                {/* --- Left Column --- */}
                <div className="review-main">
                  <h1 className={styles.reviewTitle}>ตรวจสอบข้อมูลการประกวด</h1>
                  {posterURL && (
                    <div className={styles.posterSection}>
                      <div className={styles.posterImage}>
                        <div className={styles.posterLabel}>โปสเตอร์ประกวด</div>
                        <img
                          src={posterURL}
                          alt="Contest Poster"
                          className={styles.posterImg}
                          style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 20 }}
                        />
                      </div>
                    </div>
                  )}
                  <div className={styles.reviewCard}>
                    <div className={styles.sectionHeading}>ข้อมูลทั่วไป</div>

                    <div className={styles.gridTwoColumn} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
                      <div>
                        <div className={styles.labelField} style={{ fontWeight: 'bold', color: '#666' }}>ชื่อการประกวด</div>

                        <div className={styles.valueField} style={{
                          fontSize: '2rem',       // เพิ่มขนาด (จากเดิม 16)
                          fontWeight: '800',      // เพิ่มความหนา
                          color: '#70136C',       // ใส่สี Theme (สีม่วงตามปุ่ม)
                          marginTop: '8px',
                          lineHeight: '1.2'
                        }}>
                          {contestName || "-"}
                        </div>
                      </div>
                      
                    </div>
                    <hr className={styles.dividerLine} style={{ border: 0, borderTop: '1px solid #eee', margin: '15px 0' }} />
                    <div>
                      <div className={styles.labelField} style={{ fontWeight: 'bold', color: '#666', marginBottom: 5 }}>ระดับที่เลือก</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {selectedLevels.map((lvl, idx) => (
                          <span key={idx} className={styles.levelBadge} style={{ background: '#70136C', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 13 }}>
                            {lvl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.reviewCard} style={{ marginTop: 20 }}>
                    <div className={styles.sectionHeading} style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>รายละเอียดและเกณฑ์คะแนน</div>
                    {selectedLevels.map((lvl, levelIdx) => (
                      <div key={lvl} className={styles.levelDetailItem} style={{
                        marginBottom: levelIdx === selectedLevels.length - 1 ? 0 : '25px',
                        paddingBottom: levelIdx === selectedLevels.length - 1 ? 0 : '25px',
                        borderBottom: levelIdx === selectedLevels.length - 1 ? 'none' : '1px solid #f0f0f0'
                      }}>
                        <div className={styles.levelDetailTitle} style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>
                          ระดับ: <span style={{ color: '#70136C' }}>{lvl}</span>
                        </div>

                        <div className={styles.gridTwoColumn} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                          <div>
                            <div className={styles.labelField} style={{ color: '#666' }}>ประเภทกลอน</div>
                            <div className={styles.valueField} style={{ fontWeight: 500 }}>
                              {(levelPoemTypes[lvl] || []).join(', ') || '-'}
                            </div>
                          </div>
                          <div>
                            <div className={styles.labelField} style={{ color: '#666' }}>หัวข้อ</div>
                            <div className={styles.valueField} style={{ fontWeight: 500 }}>
                              {levelTopics[lvl]?.topicEnabled ? levelTopics[lvl].topicName : 'อิสระ'}
                            </div>
                          </div>
                        </div>

                        {levelDetails[lvl + '_description'] && (
                          <div style={{ marginBottom: '14px', background: '#fafafa', padding: 10, borderRadius: 6 }}>
                            <div className={styles.labelField} style={{ color: '#666', fontSize: 13 }}>รายละเอียด/กติกาเพิ่มเติม</div>
                            <div className={styles.descriptionsBox} style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>
                              {levelDetails[lvl + '_description']}
                            </div>
                          </div>
                        )}

                        <div className={styles.scoringBox} style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
                          <div className={styles.scoringHeader} style={{ background: '#f5f5f5', padding: '8px 15px', display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600 }}>
                            <span>เกณฑ์การให้คะแนน</span>
                            <span style={{ color: '#70136C' }}>รวม {calculateTotalScore(lvl)} คะแนน</span>
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {(levelDetails[lvl + '_criteria'] || []).map((crit, cIdx) => (
                              <li key={cIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 15px', borderBottom: '1px solid #f9f9f9' }}>
                                <span>{crit.title}</span>
                                <span style={{ fontWeight: 'bold' }}>{crit.score}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- Right Column (Sidebar) --- */}
                <div className="review-sidebar">
                  <div style={{ background: 'white', padding: 20, borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                    <h3 style={{ fontSize: 16, marginTop: 0, marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>สรุปข้อมูล</h3>

                    <div style={{ marginBottom: 15 }}>
                      <div style={{ fontSize: 12, color: '#888' }}>วันเปิดรับสมัคร</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                        <FaRegCalendarAlt color="#70136C" />
                        {regOpen || '-'}
                      </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 12, color: '#888' }}>วันปิดรับสมัคร</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                        <FaRegClock color="#70136C" />
                        {regClose || '-'}
                      </div>
                    </div>

                    <div style={{ background: '#e3f2fd', color: '#1565c0', padding: '10px', borderRadius: 6, fontSize: 13, textAlign: 'center' }}>
                      สถานะ: กำลังสร้าง (Draft)
                    </div>
                  </div>

                  <div style={{ marginTop: 20, background: 'white', padding: 20, borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ color: '#666' }}>กรรมการ</span>
                      <span style={{ fontWeight: 'bold' }}>{judges.length} ท่าน</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>ระดับชั้น</span>
                      <span style={{ fontWeight: 'bold' }}>{selectedLevels.length} ระดับ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 40, paddingBottom: 40 }}>
                <button
                  className={styles.btnSecondary}
                  onClick={() => setStep(3)}
                  style={{ padding: '12px 30px', fontSize: 16 }}
                >
                  ย้อนกลับแก้ไข
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    padding: '12px 40px',
                    borderRadius: '50px',
                    border: 'none',
                    background: loading ? '#ccc' : 'linear-gradient(90deg, #70136c 0%, #90188c 100%)',
                    color: 'white',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(112, 19, 108, 0.3)'
                  }}
                >
                  {loading ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันสร้างการประกวด'}
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      <InviteJudgeModal
        isOpen={showInviteJudgeModal}
        onClose={() => setShowInviteJudgeModal(false)}
        onInvite={handleJudgeAdded}
        availableLevels={selectedLevels}
      />
    </>
  );
}