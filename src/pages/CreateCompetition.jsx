import TopNav from "../components/TopNav";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaUniversity, FaUsers, FaSearch, FaEdit, FaTrash } from "react-icons/fa";

// =========================
// Level Card Component
// =========================
function LevelSelectCard({ label, icon, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        border: selected ? "2px solid #70136C" : "2px solid #e5e7eb",
        borderRadius: 14,
        padding: "8px 10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: selected ? "#f6e7f5" : "#fff",
        transition: "0.2s",
        minWidth: 0,
        boxShadow: selected ? "0 2px 8px rgba(112,19,108,0.15)" : "none",
      }}
    >
      <span style={{ fontSize: 26, color: selected ? "#70136C" : "#222" }}>
        {icon}
      </span>
      <span style={{ fontSize: "1.05rem", fontWeight: 500, color: selected ? "#70136C" : "#222" }}>
        {label}
      </span>
    </div>
  );
}

// =========================
// Upload Poster Box
// =========================
const UploadBox = ({ file, onSelect }) => (
  <div style={{ border: "2px dashed #cccccc", borderRadius: 12, padding: "40px 20px", textAlign: "center", color: "#555", background: "#fafafa" }}>
    <h3 style={{ marginBottom: 10 }}>อัปโหลดโปสเตอร์ประกวดได้เลย</h3>
    <p style={{ marginBottom: 20, color: "#888" }}>เลือกไฟล์รูป jpg หรือ png</p>
    <input
      type="file"
      accept="image/*"
      id="posterFile"
      onChange={(e) => onSelect(e.target.files[0])}
      style={{ display: "none" }}
    />
    <button
      onClick={() => document.getElementById("posterFile").click()}
      style={{ padding: "10px 24px", borderRadius: 8, background: "#70136C", color: "#fff", border: "none", cursor: "pointer" }}
    >
      เลือกไฟล์รูป
    </button>
    {file && <div style={{ marginTop: 20, fontSize: "0.95rem" }}>📄 {file.name}</div>}
  </div>
);

// =========================
// MAIN PAGE: CreateCompetition
// =========================
export default function CreateCompetition() {
  const location = useLocation();
  
  // ดึง organizationId จาก localStorage ก่อน ถ้าไม่มีค่อยดูจาก location.state
  const organizationIdFromStorage = localStorage.getItem('current_organization_id');
  const organizationIdFromState = location.state?.organizationId;
  const organizationId = organizationIdFromStorage 
    ? parseInt(organizationIdFromStorage) 
    : (organizationIdFromState || null);

  console.log('Organization ID for competition:', organizationId); // Debug log

  // Cleanup: ลบ localStorage เมื่อออกจากหน้าสร้างการประกวด
  useEffect(() => {
    return () => {
      localStorage.removeItem('current_organization_id');
    };
  }, []);
  
  // State declarations
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [poster, setPoster] = useState(null);
  const [contestName, setContestName] = useState("");
  const [step, setStep] = useState(1);
  const [regOpen, setRegOpen] = useState("");
  const [regClose, setRegClose] = useState("");
  const [contestDescription, setContestDescription] = useState('');
  const [contestPurpose, setContestPurpose] = useState('');
  
  // Level Details
  const [levelPoemTypes, setLevelPoemTypes] = useState({});
  const [levelTopics, setLevelTopics] = useState({});
  const [levelDetails, setLevelDetails] = useState({});

  // --- States Step 3 (Judge & Assistant) ---
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  
  // Assistants
  const [assistants, setAssistants] = useState([]);
  const [showAddAssistant, setShowAddAssistant] = useState(false);
  const [editingAssistantIndex, setEditingAssistantIndex] = useState(null);
  const defaultAssistantPermissions = [
    { key: 'can_view', label: 'ดูข้อมูลการประกวด', checked: true },
    { key: 'can_edit', label: 'แก้ไขข้อมูลการประกวด', checked: true },
    { key: 'can_manage_users', label: 'จัดการผู้เข้าแข่งขัน', checked: false },
  ];
  const [assistantForm, setAssistantForm] = useState({ 
    first_name: '', last_name: '', email: '', 
    permissions: JSON.parse(JSON.stringify(defaultAssistantPermissions)) 
  });

  // Judges
  const [judges, setJudges] = useState([]);
  const [showAddJudge, setShowAddJudge] = useState(false);
  const [editingJudgeIndex, setEditingJudgeIndex] = useState(null);
  const [judgeForm, setJudgeForm] = useState({ 
    first_name: '', last_name: '', email: '', 
    levels: [] // Levels ที่กรรมการคนนี้ดูแล
  });

  // Data
  const ALL_LEVELS = [
    { label: "ประถม", icon: <FaChalkboardTeacher /> },
    { label: "มัธยม", icon: <FaUserGraduate /> },
    { label: "มหาวิทยาลัย", icon: <FaUniversity /> },
    { label: "ประชาชนทั่วไป", icon: <FaUsers /> },
  ];

  const poemTypeOptions = [
    { label: "กลอนแปด", value: "กลอนแปด" },
    { label: "กาพย์ยานี 11", value: "กาพย์ยานี 11" },
    { label: "กาพย์ฉบัง 16", value: "กาพย์ฉบัง 16" },
    { label: "โคลงสี่สุภาพ", value: "โคลงสี่สุภาพ" },
    { label: "สักวา", value: "สักวา" },
    { label: "อินทรวิเชียรฉันท์", value: "อินทรวิเชียรฉันท์" },
  ];

  // --- Handlers ---
  const handleSelectLevel = (level) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter((l) => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  // Assistant Handlers
  const handleSaveAssistant = () => {
    if (!assistantForm.email || !assistantForm.first_name) return alert("กรุณากรอกข้อมูลให้ครบ");
    
    if (editingAssistantIndex !== null) {
      const newAssistants = [...assistants];
      newAssistants[editingAssistantIndex] = assistantForm;
      setAssistants(newAssistants);
    } else {
      setAssistants([...assistants, assistantForm]);
    }
    setShowAddAssistant(false);
  };

  const handleDeleteAssistant = (index) => {
    setAssistants(assistants.filter((_, i) => i !== index));
  };

  // Judge Handlers
  const handleSaveJudge = () => {
    if (!judgeForm.email || !judgeForm.first_name) return alert("กรุณากรอกข้อมูลให้ครบ");
    if (judgeForm.levels.length === 0) return alert("กรุณาเลือกระดับชั้นที่กรรมการดูแลอย่างน้อย 1 ระดับ");

    if (editingJudgeIndex !== null) {
      const newJudges = [...judges];
      newJudges[editingJudgeIndex] = judgeForm;
      setJudges(newJudges);
    } else {
      setJudges([...judges, judgeForm]);
    }
    setShowAddJudge(false);
  };

  const handleDeleteJudge = (index) => {
    setJudges(judges.filter((_, i) => i !== index));
  };

  return (
    <>
      <TopNav />

      <div className="container">
        <div className="main-card">
          <h1 className="page-title">สร้างการประกวดใหม่</h1>

          {/* Stepper */}
          <div className="stepper-container">
            {["รายละเอียด", "ข้อมูลระดับ", "กรรมการ/ผู้ช่วย", "ตรวจสอบ"].map((label, idx, arr) => (
              <React.Fragment key={label}>
                <div style={{ textAlign: "center" }}>
                  <div
                    className="step-circle"
                    style={{
                      background: idx + 1 === step ? "#70136C" : "#d1b3d1",
                      color: "#fff",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: idx + 1 === step ? "#70136C" : "#888" }}>{label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <div
                    className="step-line"
                    style={{
                      background: idx + 1 <= step ? "linear-gradient(90deg, #70136C, #d1b3d1)" : "#e0e0e0",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Details */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>ชื่อการประกวด</label>
                <input
                  className="form-input"
                  type="text"
                  value={contestName}
                  onChange={(e) => setContestName(e.target.value)}
                  placeholder="กรอกชื่อการประกวด..."
                />
              </div>

              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>เลือกระดับการแข่งขัน</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 28 }}>
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

              <UploadBox file={poster} onSelect={setPoster} />

              <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600 }}>วันที่เปิดรับสมัคร</label>
                  <input className="form-input" type="date" value={regOpen} onChange={e => setRegOpen(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600 }}>วันที่ปิดรับสมัคร</label>
                  <input className="form-input" type="date" value={regClose} onChange={e => setRegClose(e.target.value)} min={regOpen} />
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <label style={{ fontWeight: 600 }}>รายละเอียดการประกวด</label>
                <textarea
                  className="form-textarea"
                  value={contestDescription}
                  onChange={e => setContestDescription(e.target.value.slice(0, 600))}
                  rows={5}
                />
                
                <label style={{ fontWeight: 600, marginTop: 12, display: 'block' }}>วัตถุประสงค์</label>
                <textarea
                  className="form-textarea"
                  value={contestPurpose}
                  onChange={e => setContestPurpose(e.target.value.slice(0, 300))}
                  rows={3}
                />

                <div style={{ textAlign: "center", marginTop: 28 }}>
                  <button
                    className="btn-primary"
                    onClick={() => setStep(2)}
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Levels */}
          {step === 2 && (
            <>
              <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 18 }}>ข้อมูลระดับการแข่งขัน</h2>
              {selectedLevels.map((level) => (
                <div key={level} style={{ marginBottom: 28, border: "1px solid #eee", borderRadius: 10, padding: 18 }}>
                  <h3 style={{ color: "#70136C", fontWeight: 600, marginBottom: 10 }}>{`ระดับ${level}`}</h3>
                  
                  {/* Poem Types */}
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>ประเภทกลอน</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                    {poemTypeOptions.map((pt) => (
                      <label key={pt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#f7f7fb', borderRadius: 8, border: '1px solid #ccc' }}>
                        <input
                          type="checkbox"
                          checked={(levelPoemTypes[level] || []).includes(pt.value)}
                          onChange={() => {
                            const current = levelPoemTypes[level] || [];
                            const newArr = current.includes(pt.value) ? current.filter(v => v !== pt.value) : [...current, pt.value];
                            setLevelPoemTypes({ ...levelPoemTypes, [level]: newArr });
                          }}
                        />
                        {pt.label}
                      </label>
                    ))}
                  </div>

                  {/* Topics & Rules - Simplified for brevity based on previous context */}
                  <label style={{ fontWeight: 500 }}>กติกา</label>
                  <textarea
                    className="form-textarea"
                    placeholder="ระบุกติกา..."
                    value={levelDetails[`${level}_rules`] || ''}
                    onChange={e => setLevelDetails({...levelDetails, [`${level}_rules`]: e.target.value})}
                  />
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
                <button className="btn-secondary" onClick={() => setStep(1)}>ย้อนกลับ</button>
                <button className="btn-primary" onClick={() => setStep(3)}>ถัดไป</button>
              </div>
            </>
          )}

          {/* Step 3: Judges & Assistants */}
          {step === 3 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: '#70136C' }}>จัดการกรรมการและผู้ช่วย</h2>
                <button onClick={() => setShowRoleInfo(true)} style={{ background: 'none', border: 'none', color: '#70136C', cursor: 'pointer', textDecoration: 'underline' }}>
                   ดูสิทธิ์การใช้งาน
                </button>
              </div>

              {/* Assistants Section */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>ผู้ช่วยจัดการประกวด</h3>
                    <button className="btn-outline" onClick={() => {
                        setEditingAssistantIndex(null);
                        setAssistantForm({ first_name: '', last_name: '', email: '', permissions: JSON.parse(JSON.stringify(defaultAssistantPermissions)) });
                        setShowAddAssistant(true);
                    }}>
                        + เพิ่มผู้ช่วย
                    </button>
                </div>
                
                <div style={{ background: '#fafbfc', borderRadius: 8, border: '1px solid #eee', overflow: 'hidden' }}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ชื่อ-นามสกุล</th>
                                <th>อีเมล</th>
                                <th>สิทธิ์</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assistants.length === 0 ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999' }}>ยังไม่มีผู้ช่วย</td></tr>
                            ) : assistants.map((a, idx) => (
                                <tr key={idx}>
                                    <td>{a.first_name} {a.last_name}</td>
                                    <td>{a.email}</td>
                                    <td>{a.permissions.filter(p => p.checked).length} สิทธิ์</td>
                                    <td>
                                        <button className="action-btn-sm" onClick={() => {
                                            setEditingAssistantIndex(idx);
                                            setAssistantForm({...a});
                                            setShowAddAssistant(true);
                                        }}><FaEdit /></button>
                                        <button className="delete-btn-sm" onClick={() => handleDeleteAssistant(idx)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>

              {/* Judges Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>กรรมการตัดสิน</h3>
                    <button className="btn-outline" onClick={() => {
                         setEditingJudgeIndex(null);
                         setJudgeForm({ first_name: '', last_name: '', email: '', levels: [] });
                         setShowAddJudge(true);
                    }}>
                        + เพิ่มกรรมการ
                    </button>
                </div>
                
                <div style={{ background: '#fafbfc', borderRadius: 8, border: '1px solid #eee', overflow: 'hidden' }}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ชื่อ-นามสกุล</th>
                                <th>อีเมล</th>
                                <th>ระดับชั้นที่ตัดสิน</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {judges.length === 0 ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999' }}>ยังไม่มีกรรมการ</td></tr>
                            ) : judges.map((j, idx) => (
                                <tr key={idx}>
                                    <td>{j.first_name} {j.last_name}</td>
                                    <td>{j.email}</td>
                                    <td>
                                        {j.levels.map(l => (
                                            <span key={l} style={{ display: 'inline-block', background: '#e0e0e0', padding: '2px 8px', borderRadius: 4, fontSize: 12, marginRight: 4 }}>
                                                {l}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        <button className="action-btn-sm" onClick={() => {
                                            setEditingJudgeIndex(idx);
                                            setJudgeForm({...j});
                                            setShowAddJudge(true);
                                        }}><FaEdit /></button>
                                        <button className="delete-btn-sm" onClick={() => handleDeleteJudge(idx)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
                <button className="btn-secondary" onClick={() => setStep(2)}>ย้อนกลับ</button>
                <button className="btn-primary" onClick={() => setStep(4)}>ถัดไป</button>
              </div>
            </>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#70136C', marginBottom: 20 }}>ตรวจสอบความถูกต้อง</h2>
                <div style={{ textAlign: 'left', background: '#f9f9f9', padding: 20, borderRadius: 12, border: '1px solid #eee', marginBottom: 30 }}>
                    <p><strong>ชื่อการประกวด:</strong> {contestName}</p>
                    <p><strong>ระดับการแข่งขัน:</strong> {selectedLevels.join(', ')}</p>
                    <p><strong>ผู้ช่วย:</strong> {assistants.length} คน</p>
                    <p><strong>กรรมการ:</strong> {judges.length} ท่าน</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button className="btn-secondary" onClick={() => setStep(3)}>แก้ไขข้อมูล</button>
                    <button className="btn-primary" onClick={async () => {
                  try {
                    // build payload from state
                    const payload = {
                      title: contestName,
                      description: contestDescription,
                      purpose: contestPurpose,
                      type: selectedLevels.join(', '),
                      start_date: '',
                      end_date: '',
                      status: 'open',
                      organization_id: organizationId,
                      registration_start: regOpen || null,
                      registration_end: regClose || null,
                      levels: []
                    };
                    // construct levels array
                    payload.levels = selectedLevels.map(level => ({
                      level,
                      poem_types: levelPoemTypes[level] || [],
                      topic: levelTopics[level] || { topicEnabled: false, topicName: '' },
                      rules: levelDetails[level + '_rules'] || '',
                      prizes: [levelDetails[level + '_prize1'] || '', levelDetails[level + '_prize2'] || '', levelDetails[level + '_prize3'] || ''].filter(Boolean)
                    }));
                    // TODO: Send payload to backend
                    alert("บันทึกข้อมูลเรียบร้อย (Demo)");
                  } catch (error) {
                    console.error('Error:', error);
                  }
                }}>ยืนยันสร้างการประกวด</button>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      
      {/* Role Info Modal */}
      {showRoleInfo && (
        <div className="modal-overlay" onClick={() => setShowRoleInfo(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">สิทธิ์ของแต่ละบทบาท</h3>
                <div style={{ marginBottom: 20 }}>
                    <strong style={{ color: '#70136C' }}>ผู้ช่วยจัดการประกวด</strong>
                    <ul style={{ paddingLeft: 20, marginTop: 5 }}>
                        <li>สามารถแก้ไขข้อมูลการประกวดได้</li>
                        <li>จัดการผู้สมัครและส่งออกข้อมูลได้</li>
                    </ul>
                </div>
                <div>
                    <strong style={{ color: '#70136C' }}>กรรมการ</strong>
                    <ul style={{ paddingLeft: 20, marginTop: 5 }}>
                        <li>เข้าดูผลงานในระดับที่ได้รับมอบหมาย</li>
                        <li>ให้คะแนนผลงาน</li>
                        <li>ไม่สามารถแก้ไขข้อมูลการประกวด</li>
                    </ul>
                </div>
                <div style={{ textAlign: 'right', marginTop: 20 }}>
                    <button className="btn-primary" onClick={() => setShowRoleInfo(false)}>ปิด</button>
                </div>
            </div>
        </div>
      )}

      {/* Add Assistant Modal */}
      {showAddAssistant && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">{editingAssistantIndex !== null ? 'แก้ไขผู้ช่วย' : 'เพิ่มผู้ช่วย'}</h3>
                
                <div style={{ display: 'flex', gap: 10 }}>
                    <input 
                        className="form-input" 
                        placeholder="ค้นหาจาก Email..." 
                        value={assistantForm.email}
                        onChange={e => setAssistantForm({...assistantForm, email: e.target.value})}
                    />
                    <button className="btn-secondary" style={{ padding: '0 16px' }}><FaSearch /></button>
                </div>
                
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <input 
                        className="form-input" 
                        placeholder="ชื่อ" 
                        value={assistantForm.first_name}
                        onChange={e => setAssistantForm({...assistantForm, first_name: e.target.value})}
                    />
                    <input 
                        className="form-input" 
                        placeholder="นามสกุล" 
                        value={assistantForm.last_name}
                        onChange={e => setAssistantForm({...assistantForm, last_name: e.target.value})}
                    />
                </div>

                <div style={{ marginTop: 16 }}>
                    <label style={{ fontWeight: 600 }}>กำหนดสิทธิ์</label>
                    <div className="checkbox-grid">
                        {assistantForm.permissions.map((perm, idx) => (
                            <label key={perm.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input 
                                    type="checkbox" 
                                    checked={perm.checked}
                                    onChange={(e) => {
                                        const newPerms = [...assistantForm.permissions];
                                        newPerms[idx].checked = e.target.checked;
                                        setAssistantForm({...assistantForm, permissions: newPerms});
                                    }}
                                />
                                {perm.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setShowAddAssistant(false)}>ยกเลิก</button>
                    <button className="btn-primary" onClick={handleSaveAssistant}>บันทึก</button>
                </div>
            </div>
        </div>
      )}

      {/* Add Judge Modal */}
      {showAddJudge && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">{editingJudgeIndex !== null ? 'แก้ไขกรรมการ' : 'เพิ่มกรรมการ'}</h3>
                
                <input 
                    className="form-input" 
                    placeholder="อีเมลกรรมการ" 
                    value={judgeForm.email}
                    onChange={e => setJudgeForm({...judgeForm, email: e.target.value})}
                />
                
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <input 
                        className="form-input" 
                        placeholder="ชื่อ" 
                        value={judgeForm.first_name}
                        onChange={e => setJudgeForm({...judgeForm, first_name: e.target.value})}
                    />
                    <input 
                        className="form-input" 
                        placeholder="นามสกุล" 
                        value={judgeForm.last_name}
                        onChange={e => setJudgeForm({...judgeForm, last_name: e.target.value})}
                    />
                </div>

                <div style={{ marginTop: 16 }}>
                    <label style={{ fontWeight: 600 }}>ระดับชั้นที่รับผิดชอบ</label>
                    <div className="checkbox-grid">
                        {selectedLevels.map((lvl) => (
                            <label key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input 
                                    type="checkbox" 
                                    checked={judgeForm.levels.includes(lvl)}
                                    onChange={(e) => {
                                        const current = judgeForm.levels;
                                        const newLevels = e.target.checked 
                                            ? [...current, lvl] 
                                            : current.filter(l => l !== lvl);
                                        setJudgeForm({...judgeForm, levels: newLevels});
                                    }}
                                />
                                {lvl}
                            </label>
                        ))}
                    </div>
                    {selectedLevels.length === 0 && <p style={{ color: 'red', fontSize: 13 }}>กรุณาเลือกระดับการแข่งขันใน Step 1 ก่อน</p>}
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setShowAddJudge(false)}>ยกเลิก</button>
                    <button className="btn-primary" onClick={handleSaveJudge}>บันทึก</button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}