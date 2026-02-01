import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaUniversity, 
  FaUsers, 
  FaTrash, 
  FaPlus, 
  FaTimes, 
  FaRegCalendarAlt, 
  FaRegClock 
} from "react-icons/fa";
import TopNav from "../components/TopNav";
import InviteJudgeModal from "../components/InviteJudgeModal";
import styles from "./CreateCompetition.module.css";
import API_BASE_URL from '../config/api';
import { supabase } from '../supabaseClient';

// =========================
// Sub-Component: LevelSelectCard
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
// Sub-Component: UploadBox
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

  // --- Organization Logic ---
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
      
      const encodeNewlines = (str) => (str || '').replace(/\n/g, '/n');
      const encodedContestDescription = encodeNewlines(contestDescription);
      const encodedContestPurpose = encodeNewlines(contestPurpose);

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

  // ===========================================================================
  // RENDER
  // ===========================================================================
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

              <UploadBox file={poster} onSelect={async file => {
                setPoster(file);
                setPosterURL("");
                if (file) {
                  setPosterUploading(true);
                  try {
                    const fileName = `competition-posters/${Date.now()}-${file.name}`;
                    const { data, error } = await supabase.storage.from("poem-images").upload(fileName, file);
                    if (error) throw new Error("อัปโหลดโปสเตอร์ล้มเหลว");
                    const { data: urlData } = supabase.storage.from("poem-images").getPublicUrl(fileName);
                    setPosterURL(urlData.publicUrl);
                  } catch (err) {
                    alert('อัปโหลดโปสเตอร์ล้มเหลว');
                  } finally {
                    setPosterUploading(false);
                  }
                }
              }} />

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

                      {criteriaList.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                          <div style={{
                            width: 24, height: 24, background: '#70136C', color: 'white',
                            borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 12
                          }}>{index + 1}</div>
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
                          ><FaTrash /></button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddCriteria(level)}
                        className={styles.addBtnDashed}
                        style={{
                          background: 'white', border: '1px dashed #70136C', color: '#70136C',
                          width: '100%', padding: '8px', borderRadius: 6, cursor: 'pointer',
                          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 10
                        }}
                      ><FaPlus size={12} /> เพิ่มเกณฑ์คะแนน</button>
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
                <button className={styles.btnSecondary} onClick={() => setShowInviteJudgeModal(true)}>➕ เพิ่มกรรมการ</button>
              </div>
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
            <div className="fade-in">
              <style>{`
                .review-container { display: flex; gap: 30px; align-items: flex-start; width: 100%; }
                .review-main { flex: 7; }
                .review-sidebar { flex: 3; position: sticky; top: 20px; }
                .review-card { background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                .section-heading { color: #333; border-left: 4px solid #70136C; padding-left: 12px; line-height: 1.2; font-size: 1.2rem; font-weight: bold; margin-bottom: 20px; }
                .label-field { font-weight: bold; color: #666; font-size: 0.9rem; margin-bottom: 5px; }
                .value-highlight { fontSize: '2rem', fontWeight: '800', color: '#70136C', marginTop: '8px', lineHeight: '1.2' }
              `}</style>

              <div className="review-container">
                <div className="review-main">
                  <h1 style={{ marginBottom: 20 }}>ตรวจสอบข้อมูลการประกวด</h1>
                  <div className="review-card">
                    <div className="section-heading">ข้อมูลทั่วไป</div>
                    <div className="label-field">ชื่อการประกวด</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#70136C', marginBottom: 20 }}>{contestName}</div>
                    
                    <div className="label-field">ระดับที่เปิดแข่งขัน</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                      {selectedLevels.map(lvl => <span key={lvl} style={{ background: '#70136C', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 14 }}>{lvl}</span>)}
                    </div>
                    
                    <div className="label-field">รายละเอียดภาพรวม</div>
                    <div style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{contestDescription}</div>
                  </div>

                  <div className="review-card">
                    <div className="section-heading">เกณฑ์คะแนนแต่ละระดับ</div>
                    {selectedLevels.map((lvl) => (
                      <div key={lvl} style={{ marginBottom: 30, borderBottom: '1px solid #eee', paddingBottom: 20 }}>
                        <h4 style={{ color: '#70136C', fontSize: '1.1rem' }}>ระดับ: {lvl}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, margin: '10px 0' }}>
                          <div>
                            <div className="label-field">ประเภทกลอน</div>
                            <div>{levelPoemTypes[lvl]?.join(', ') || '-'}</div>
                          </div>
                          <div>
                            <div className="label-field">หัวข้อ</div>
                            <div>{levelTopics[lvl]?.topicEnabled ? `หัวข้อบังคับ: ${levelTopics[lvl].topicName}` : 'หัวข้ออิสระ'}</div>
                          </div>
                        </div>
                        <div className="label-field">เกณฑ์การให้คะแนน (คะแนนเต็ม {calculateTotalScore(lvl)})</div>
                        <table style={{ width: '100%', marginTop: 8 }}>
                          <tbody>
                            {(levelDetails[lvl + '_criteria'] || []).map((c, i) => (
                              <tr key={i} style={{ borderBottom: '1px dashed #f0f0f0' }}>
                                <td style={{ padding: '6px 0' }}>{c.title}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>{c.score}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-sidebar">
                  {posterURL && (
                    <div className="review-card">
                      <div className="label-field">โปสเตอร์</div>
                      <img src={posterURL} alt="Poster" style={{ width: '100%', borderRadius: 8, marginTop: 10 }} />
                    </div>
                  )}
                  <div className="review-card">
                    <div className="section-heading" style={{ fontSize: '1rem' }}>กำหนดการ</div>
                    <div className="label-field">เริ่มรับสมัคร</div>
                    <div style={{ marginBottom: 15 }}>{regOpen}</div>
                    <div className="label-field">สิ้นสุดรับสมัคร</div>
                    <div>{regClose}</div>
                  </div>
                  <div className="review-card">
                    <div className="section-heading" style={{ fontSize: '1rem' }}>กรรมการ</div>
                    {judges.length === 0 ? <p style={{ fontSize: '0.85rem', color: '#999' }}>ไม่มีรายชื่อกรรมการ</p> : 
                      judges.map((j, i) => <div key={i} style={{ fontSize: '0.9rem', marginBottom: 5 }}>• {j.full_name}</div>)
                    }
                  </div>
                </div>
              </div>

              <div className={styles.navButtonContainer} style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid #eee' }}>
                <button className={styles.btnSecondary} onClick={() => setStep(3)} disabled={loading}>ย้อนกลับ</button>
                <button className={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>{loading ? "กำลังบันทึก..." : "ยืนยันการสร้างประกวด"}</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <InviteJudgeModal 
        isOpen={showInviteJudgeModal} 
        onClose={() => setShowInviteJudgeModal(false)} 
        onJudgeAdded={handleJudgeAdded}
        availableLevels={selectedLevels}
      />
    </>
  );
}