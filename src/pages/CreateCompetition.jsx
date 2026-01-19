import TopNav2 from "../components/TopNav2";
import React, { useState } from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaUniversity, FaUsers } from "react-icons/fa";

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
      <span
        style={{
          fontSize: "1.05rem",
          fontWeight: 500,
          color: selected ? "#70136C" : "#222",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// =========================
// Upload Poster Box
// =========================
const UploadBox = ({ file, onSelect }) => (
  <div
    style={{
      border: "2px dashed #cccccc",
      borderRadius: 12,
      padding: "40px 20px",
      textAlign: "center",
      color: "#555",
      background: "#fafafa",
    }}
  >
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
      style={{
        padding: "10px 24px",
        borderRadius: 8,
        background: "#70136C",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      }}
    >
      เลือกไฟล์รูป
    </button>

    {file && (
      <div style={{ marginTop: 20, fontSize: "0.95rem" }}>📄 {file.name}</div>
    )}
  </div>
);

// =========================
// MAIN PAGE: CreateCompetition
// =========================
export default function CreateCompetition() {
  // ...existing code...
  // ประเภทกลอน (เลือกได้หลายข้อ)
  const poemTypeOptions = [
    { label: "กลอนแปด", value: "กลอนแปด" },
    { label: "กาพย์ยานี 11", value: "กาพย์ยานี 11" },
    { label: "กาพย์ฉบัง 16", value: "กาพย์ฉบัง 16" },
    { label: "โคลงสี่สุภาพ", value: "โคลงสี่สุภาพ" },
    { label: "สักวา", value: "สักวา" },
    { label: "ดอกสร้อย", value: "ดอกสร้อย" },
    { label: "อินทรวิเชียรฉันท์", value: "อินทรวิเชียรฉันท์" },
  ];
  const [levelPoemTypes, setLevelPoemTypes] = useState({});
  const [contestDescription, setContestDescription] = useState('');
  const [contestPurpose, setContestPurpose] = useState('');
      // Modal for adding judge
      const [showAddJudge, setShowAddJudge] = useState(false);
      const [judgeForm, setJudgeForm] = useState({ user_id: null, first_name: '', last_name: '', email: '', levels: [] }); // levels = array of level names
      const [judgeError, setJudgeError] = useState('');
      const [judgeSearchResults, setJudgeSearchResults] = useState([]);
      const [showJudgeSearchDropdown, setShowJudgeSearchDropdown] = useState(false);
      const [editingJudgeIndex, setEditingJudgeIndex] = useState(null);
    // Judge creation modal state and form (removed old mockup states)
    const [showCreateJudge, setShowCreateJudge] = useState(false);
    const [judges, setJudges] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [poster, setPoster] = useState(null);
  const [contestName, setContestName] = useState("");
  const [step, setStep] = useState(1);
  const [levelDetails, setLevelDetails] = useState({});
  const [maxScore, setMaxScore] = useState(10);
  // For each level: { [level]: { topicEnabled: boolean, topicName: string, detail: string } }
  const [levelTopics, setLevelTopics] = useState({});
  const [regOpen, setRegOpen] = useState("");
  const [regClose, setRegClose] = useState("");
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  // Modal: เพิ่มผู้ช่วย
  const [showAddAssistant, setShowAddAssistant] = useState(false);
  const [searchUserEmail, setSearchUserEmail] = useState('');
  const [searchResultUser, setSearchResultUser] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const defaultAssistantPermissions = [
    { key: 'can_view', label: 'ดูข้อมูลการประกวดทั้งหมด', checked: true },
    { key: 'can_edit', label: 'แก้ไขข้อมูลการประกวด', checked: true },
    { key: 'can_add_assistant', label: 'เพิ่มผู้ช่วยรายอื่น', checked: false },
    { key: 'can_view_scores', label: 'ดูคะแนนกรรมการ', checked: false },
  ];
  const [assistantForm, setAssistantForm] = useState({ user_id: null, first_name: '', last_name: '', email: '', permissions: defaultAssistantPermissions.map(p => ({ ...p })) });
  const [assistantError, setAssistantError] = useState('');
  const [assistants, setAssistants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [viewPermissionsData, setViewPermissionsData] = useState(null);
  const [editingAssistantIndex, setEditingAssistantIndex] = useState(null);

  const ALL_LEVELS = [
    { label: "ประถม", icon: <FaChalkboardTeacher /> },
    { label: "มัธยม", icon: <FaUserGraduate /> },
    { label: "มหาวิทยาลัย", icon: <FaUniversity /> },
    { label: "ประชาชนทั่วไป", icon: <FaUsers /> },
  ];

  const handleSelectLevel = (level) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter((l) => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  return (
    <>
      <TopNav2 />

      <div style={{ maxWidth: 900, margin: "28px auto 40px auto", padding: "0 20px" }}>
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #e0e0e0",
            borderRadius: 18,
            boxShadow: "0 4px 24px rgba(60,60,60,0.10)",
            padding: "18px 36px 48px 36px",
          }}
        >
          <h1 style={{ marginBottom: 28, fontSize: "2.1rem", fontWeight: 700 }}>
            สร้างการประกวดใหม่
          </h1>

          {/* Stepper */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 36,
            }}
          >
            {["รายละเอียด", "ข้อมูลระดับ", "กรรมการ", "ตรวจสอบ"].map(
              (label, idx, arr) => (
                <React.Fragment key={label}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: idx + 1 === step ? "#70136C" : "#d1b3d1",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
                  </div>

                  {idx < arr.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: "linear-gradient(90deg, #e0e0e0 60%, #70136C 100%)",
                        margin: "0 8px",
                        borderRadius: 2,
                      }}
                    />
                  )}
                </React.Fragment>
              )
            )}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>ชื่อการประกวด</label>
                <input
                  type="text"
                  value={contestName}
                  onChange={(e) => setContestName(e.target.value)}
                  placeholder="กรอกชื่อการประกวด..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: "1rem",
                    border: "1px solid #ccc",
                    background: "#fafbfc",
                    marginTop: 4,
                  }}
                />
              </div>

              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>
                เลือกระดับการแข่งขัน
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 24,
                  marginBottom: 28,
                }}
              >
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

              {/* Registration Dates */}
              <div style={{ display: 'flex', gap: 24, marginTop: 32, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>วันที่เปิดรับสมัคร</label>
                  <input
                    type="date"
                    value={regOpen}
                    onChange={e => setRegOpen(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      fontSize: '1rem',
                      border: '1px solid #ccc',
                      background: '#fafbfc',
                      marginTop: 4,
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>วันที่ปิดรับสมัคร</label>
                  <input
                    type="date"
                    value={regClose}
                    onChange={e => setRegClose(e.target.value)}
                    min={regOpen}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      fontSize: '1rem',
                      border: '1px solid #ccc',
                      background: '#fafbfc',
                      marginTop: 4,
                    }}
                  />
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <label style={{ fontWeight: 600 }}>รายละเอียดการประกวด</label>
                <textarea
                  value={contestDescription}
                  onChange={e => setContestDescription(e.target.value.slice(0, 600))}
                  placeholder={`กรอกรายละเอียดการประกวด`}
                  maxLength={600}
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: "1rem",
                    border: "1px solid #ccc",
                    background: "#fafbfc",
                    marginTop: 4,
                    resize: "vertical",
                    minHeight: 120,
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ fontSize: 13, color: '#888', marginTop: 6, textAlign: 'right' }}>
                  {contestDescription.length} / 600 ตัวอักษร
                </div>

                <label style={{ fontWeight: 600, marginTop: 12, display: 'block' }}>วัตถุประสงค์ของการจัดประกวด</label>
                <textarea
                  value={contestPurpose}
                  onChange={e => setContestPurpose(e.target.value.slice(0, 300))}
                  placeholder="กรอกวัตถุประสงค์ของการจัดประกวด..."
                  maxLength={300}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: "1rem",
                    border: "1px solid #ccc",
                    background: "#fafbfc",
                    marginTop: 4,
                    resize: "vertical",
                    minHeight: 80,
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ fontSize: 13, color: '#888', marginTop: 6, textAlign: 'right' }}>
                  {contestPurpose.length} / 300 ตัวอักษร
                </div>

                <div style={{ textAlign: "center", marginTop: 18 }}>
                  <button
                    style={{
                      padding: "10px 32px",
                      background: "#70136C",
                      color: "#fff",
                      border: "none",
                      borderRadius: 999,
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => setStep(2)}
                    disabled={!contestName || selectedLevels.length === 0 || !regOpen || !regClose}
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 18 }}>
                ข้อมูลระดับการแข่งขัน
              </h2>

              {selectedLevels.map((level) => {
                const topicEnabled = levelTopics[level]?.topicEnabled || false;
                const topicName = levelTopics[level]?.topicName || "";
                const selectedPoemTypes = levelPoemTypes[level] || [];
                return (
                  <div
                    key={level}
                    style={{
                      marginBottom: 28,
                      border: "1px solid #eee",
                      borderRadius: 10,
                      padding: 18,
                    }}
                  >
                    <h3
                      style={{
                        color: "#70136C",
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      {`ระดับ${level}`}
                    </h3>

                    {/* ประเภทกลอน (เลือกได้หลายข้อ) */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>ประเภทกลอน (เลือกได้หลายข้อ)</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        {poemTypeOptions.map((pt) => (
                          <label key={pt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 400, fontSize: 15, background: '#f7f7fb', borderRadius: 8, padding: '4px 12px', border: selectedPoemTypes.includes(pt.value) ? '2px solid #70136C' : '1px solid #ccc', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={selectedPoemTypes.includes(pt.value)}
                              onChange={e => {
                                let newArr = selectedPoemTypes.includes(pt.value)
                                  ? selectedPoemTypes.filter(v => v !== pt.value)
                                  : [...selectedPoemTypes, pt.value];
                                setLevelPoemTypes({ ...levelPoemTypes, [level]: newArr });
                              }}
                              style={{ accentColor: '#70136C', marginRight: 4 }}
                            />
                            {pt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Topic selection: two buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <button
                        type="button"
                        style={{
                          background: !topicEnabled ? '#70136C' : '#eee',
                          color: !topicEnabled ? '#fff' : '#70136C',
                          border: 'none',
                          borderRadius: '999px 0 0 999px',
                          padding: '4px 18px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          fontSize: 15,
                          marginRight: 0,
                          outline: !topicEnabled ? '2px solid #70136C' : 'none',
                          zIndex: 1,
                        }}
                        onClick={() => setLevelTopics({
                          ...levelTopics,
                          [level]: { ...levelTopics[level], topicEnabled: false, topicName: '' }
                        })}
                      >
                        หัวข้ออิสระ
                      </button>
                      <button
                        type="button"
                        style={{
                          background: topicEnabled ? '#70136C' : '#eee',
                          color: topicEnabled ? '#fff' : '#70136C',
                          border: 'none',
                          borderRadius: '0 999px 999px 0',
                          padding: '4px 18px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          fontSize: 15,
                          marginLeft: -1,
                          outline: topicEnabled ? '2px solid #70136C' : 'none',
                        }}
                        onClick={() => setLevelTopics({
                          ...levelTopics,
                          [level]: { ...levelTopics[level], topicEnabled: true }
                        })}
                      >
                        หัวข้อบังคับ
                      </button>
                      {topicEnabled && (
                        <input
                          type="text"
                          value={topicName}
                          onChange={e => setLevelTopics({
                            ...levelTopics,
                            [level]: { ...levelTopics[level], topicName: e.target.value, topicEnabled: true }
                          })}
                          placeholder="กรอกชื่อหัวข้อ..."
                          style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: '1px solid #ccc',
                            fontSize: '1rem',
                            minWidth: 180,
                            marginLeft: 12,
                          }}
                        />
                      )}
                    </div>


                    {/* Rules textarea */}
                    <label style={{ fontWeight: 500, marginTop: 16, display: 'block' }}>
                      เงื่อนไข/กติกาการส่งผลงาน
                    </label>
                    <textarea
                      value={levelDetails[level + '_rules'] || ''}
                      onChange={e => {
                        const val = e.target.value.slice(0, 500);
                        setLevelDetails({ ...levelDetails, [level + '_rules']: val });
                      }}
                      placeholder="กรอกเงื่อนไขหรือกติกาการส่งผลงาน..."
                      maxLength={500}
                      rows={5}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        fontSize: "1rem",
                        border: "1px solid #ccc",
                        background: "#fafbfc",
                        marginTop: 4,
                        resize: "vertical",
                        minHeight: 100,
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={{ fontSize: 13, color: '#888', marginTop: 2, textAlign: 'right' }}>
                      {(levelDetails[level + '_rules'] || '').length} / 500 ตัวอักษร
                    </div>

                    {/* Prize toggle and fields */}
                    <div style={{ marginTop: 18, marginBottom: 2 }}>
                      <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={levelDetails[level + '_prize_enabled'] || false}
                          onChange={e => setLevelDetails({ ...levelDetails, [level + '_prize_enabled']: e.target.checked })}
                          style={{ accentColor: '#70136C', width: 18, height: 18 }}
                        />
                        เพิ่มช่องกรอกรางวัล
                      </label>
                    </div>
                    <div style={{
                      opacity: levelDetails[level + '_prize_enabled'] ? 1 : 0.5,
                      pointerEvents: levelDetails[level + '_prize_enabled'] ? 'auto' : 'none',
                      transition: 'opacity 0.2s',
                      marginTop: 8,
                    }}>
                      <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>รางวัล</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input
                          type="text"
                          value={levelDetails[level + '_prize1'] || ''}
                          onChange={e => setLevelDetails({ ...levelDetails, [level + '_prize1']: e.target.value })}
                          placeholder="– รางวัลที่ 1: ................................................................."
                          disabled={!levelDetails[level + '_prize_enabled']}
                          style={{
                            width: '100%',
                            padding: '8px 14px',
                            borderRadius: 8,
                            fontSize: '1rem',
                            border: '1px solid #ccc',
                            background: '#fafbfc',
                          }}
                        />
                        <input
                          type="text"
                          value={levelDetails[level + '_prize2'] || ''}
                          onChange={e => setLevelDetails({ ...levelDetails, [level + '_prize2']: e.target.value })}
                          placeholder="– รางวัลที่ 2: ................................................................."
                          disabled={!levelDetails[level + '_prize_enabled']}
                          style={{
                            width: '100%',
                            padding: '8px 14px',
                            borderRadius: 8,
                            fontSize: '1rem',
                            border: '1px solid #ccc',
                            background: '#fafbfc',
                          }}
                        />
                        <input
                          type="text"
                          value={levelDetails[level + '_prize3'] || ''}
                          onChange={e => setLevelDetails({ ...levelDetails, [level + '_prize3']: e.target.value })}
                          placeholder="– รางวัลที่ 3: ................................................................."
                          disabled={!levelDetails[level + '_prize_enabled']}
                          style={{
                            width: '100%',
                            padding: '8px 14px',
                            borderRadius: 8,
                            fontSize: '1rem',
                            border: '1px solid #ccc',
                            background: '#fafbfc',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 32,
                }}
              >
                <button
                  style={{
                    padding: "8px 28px",
                    background: "#eee",
                    color: "#70136C",
                    border: "none",
                    borderRadius: 999,
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setStep(1)}
                >
                  ย้อนกลับ
                </button>

                <button
                  style={{
                    padding: "8px 28px",
                    background: "#70136C",
                    color: "#fff",
                    border: "none",
                    borderRadius: 999,
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setStep(3)}
                >
                  ถัดไป
                </button>
              </div>
            </>
          )}
        {step === 3 && (
          <>
            {/* Header */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e0e0e0', boxShadow: '0 2px 8px rgba(112,19,108,0.07)', padding: '24px 20px', marginBottom: 32 }}>
              <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8, color: '#70136C', display: 'flex', alignItems: 'center', gap: 12 }}>
                จัดการกรรมการและผู้ช่วยจัดการประกวด
                
              </h2>
              {/* Guide Box */}
              <div style={{ background: '#f6e7f5', borderRadius: 8, padding: '10px 18px', marginBottom: 18, color: '#70136C', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>💡</span>
                คุณสามารถเชิญกรรมการผ่านอีเมลหรือสร้างบัญชีกรรมการใหม่ได้ หากต้องการให้มีผู้ช่วยจัดการประกวด คุณสามารถเพิ่มได้จากปุ่มด้านบน
              </div>
              {/* Modal: Role Info */}
              {showRoleInfo && (
                <div style={{
                  position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
                  background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(60,60,60,0.18)', padding: '32px 28px', maxWidth: 420, width: '90%', color: '#222', position: 'relative' }}>
                    <h3 style={{ fontWeight: 700, fontSize: 22, color: '#70136C', marginBottom: 18 }}>สิทธิ์ของแต่ละบทบาท</h3>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontWeight: 600, color: '#70136C', marginBottom: 6 }}>ผู้ช่วยจัดการประกวด</div>
                      <ul style={{ marginLeft: 18, marginBottom: 10, fontSize: 15 }}>
                        <li>แก้ไขข้อมูลการประกวด</li>
                        <li>เพิ่ม/แก้ไข/ลบผู้เข้าแข่งขัน</li>
                        <li>จัดการคะแนน (ถ้ามีสิทธิ์)</li>
                      </ul>
                      <div style={{ fontWeight: 600, color: '#70136C', marginBottom: 6 }}>กรรมการ</div>
                      <ul style={{ marginLeft: 18, fontSize: 15 }}>
                        <li>ให้คะแนนผลงาน</li>
                        <li>ดูข้อมูลการประกวด</li>
                        <li>ไม่สามารถแก้ไขข้อมูลการประกวดหรือผู้เข้าแข่งขัน</li>
                      </ul>
                    </div>
                    <button
                      style={{ background: '#70136C', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 24px', fontSize: 16, cursor: 'pointer', position: 'absolute', right: 18, bottom: 18 }}
                      onClick={() => setShowRoleInfo(false)}
                    >
                      ปิด
                    </button>
                  </div>
                </div>
              )}
              <h3 style={{ fontWeight: 600, fontSize: 18, color: '#70136C', marginBottom: 10 }}>เพิ่มผู้ช่วยจัดการประกวด</h3>
              
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <button
                  style={{ background: '#fff', color: '#70136C', border: '2px solid #70136C', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                  onClick={() => {
                    setAssistantForm({ user_id: null, first_name: '', last_name: '', email: '', permissions: defaultAssistantPermissions.map(p => ({ ...p })) });
                    setAssistantError('');
                    setSearchUserEmail('');
                    setSearchResultUser(null);
                    setSearchError('');
                    setEditingAssistantIndex(null);
                    setShowAddAssistant(true);
                  }}
                >
                  + เพิ่มผู้ช่วยจัดการประกวด
                </button>
              </div>
              {/* List of assistants (sample) */}
              <div style={{ background: '#fafbfc', borderRadius: 8, border: '1px solid #eee', padding: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                  <thead>
                    <tr style={{ background: '#f6e7f5', color: '#70136C' }}>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>ชื่อ</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>นามสกุล</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>อีเมล</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>สิทธิ์</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assistants.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: 12 }}>ยังไม่มีผู้ช่วย</td></tr>
                    ) : assistants.map((a, idx) => (
                      <tr key={a.email + idx}>
                        <td style={{ padding: '6px' }}>{a.first_name}</td>
                        <td style={{ padding: '6px' }}>{a.last_name}</td>
                        <td style={{ padding: '6px' }}>{a.email}</td>
                        <td style={{ padding: '6px' }}>
                          <button
                            style={{ background: '#70136C', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 14 }}
                            onClick={() => {
                              setViewPermissionsData(a.permissions);
                              setShowPermissionsModal(true);
                            }}
                          >
                            ดูรายละเอียด
                          </button>
                        </td>
                        <td style={{ padding: '6px', display: 'flex', gap: 8 }}>
                          <button
                            style={{ color: '#70136C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => {
                              setAssistantForm({ ...a });
                              setEditingAssistantIndex(idx);
                              setShowAddAssistant(true);
                            }}
                          >แก้ไข</button>
                          <button
                            style={{ color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => setAssistants(assistants.filter((_, i) => i !== idx))}
                          >ลบ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Zone 2: Judges */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e0e0e0', boxShadow: '0 2px 8px rgba(112,19,108,0.07)', padding: '24px 20px', marginBottom: 32 }}>
              <h3 style={{ fontWeight: 600, fontSize: 18, color: '#70136C', marginBottom: 10 }}>กรรมการ</h3>
              {/* Max Score Field */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 4, color: '#70136C' }}>คะแนนเต็มที่กรรมการสามารถให้ได้</label>
                <input
                  type="number"
                  value={maxScore}
                  onChange={e => {
                    const val = parseInt(e.target.value) || 0;
                    if (val >= 0 && val <= 100) {
                      setMaxScore(val);
                    }
                  }}
                  min="1"
                  max="100"
                  style={{ width: 120, padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, background: '#fff' }}
                  placeholder="10"
                />
                <span style={{ marginLeft: 8, color: '#888', fontSize: 14 }}>(กำหนดคะแนนเต็มสำหรับการตัดสิน 1-100)</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <button
                  style={{ background: '#fff', color: '#70136C', border: '2px solid #70136C', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                  onClick={() => {
                    setJudgeForm({ user_id: null, first_name: '', last_name: '', email: '', levels: [] });
                    setEditingJudgeIndex(null);
                    setShowAddJudge(true);
                    setJudgeError('');
                  }}
                >
                  + เชิญกรรมการ (อีเมล)
                </button>
              <button style={{ background: '#fff', color: '#70136C', border: '2px solid #70136C', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                onClick={() => setShowCreateJudge(true)}>
                + สร้างบัญชีกรรมการ
              </button>
              </div>
              {/* List of judges (sample) */}
              <div style={{ background: '#fafbfc', borderRadius: 8, border: '1px solid #eee', padding: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                  <thead>
                    <tr style={{ background: '#f6e7f5', color: '#70136C' }}>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>ชื่อ</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>นามสกุล</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>อีเมล</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>ระดับที่ได้รับ</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {judges.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: 12 }}>ยังไม่มีกรรมการ</td></tr>
                    ) : judges.map((j, idx) => (
                      <tr key={j.email + idx}>
                        <td style={{ padding: '6px' }}>{j.first_name}</td>
                        <td style={{ padding: '6px' }}>{j.last_name}</td>
                        <td style={{ padding: '6px' }}>{j.email}</td>
                        <td style={{ padding: '6px' }}>{j.levels.join(', ')}</td>
                        <td style={{ padding: '6px', display: 'flex', gap: 8 }}>
                          <button
                            style={{ color: '#70136C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => {
                              setJudgeForm({ ...j });
                              setEditingJudgeIndex(idx);
                              setShowAddJudge(true);
                            }}
                          >แก้ไข</button>
                          <button
                            style={{ color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => setJudges(judges.filter((_, i) => i !== idx))}
                          >ลบ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                        {/* Modal: Create Judge */}
                        {showCreateJudge && (
                          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(60,60,60,0.18)', padding: '32px 28px', maxWidth: 420, width: '90%', color: '#222', position: 'relative' }}>
                              <h3 style={{ fontWeight: 700, fontSize: 20, color: '#70136C', marginBottom: 18 }}>สร้างบัญชีกรรมการ</h3>
                              <form onSubmit={e => {
                                e.preventDefault();
                                // Validate
                                if (!judgeForm.name.trim()) {
                                  setJudgeError('กรุณากรอกชื่อ-นามสกุล');
                                  return;
                                }
                                if (!judgeForm.email.trim()) {
                                  setJudgeError('กรุณากรอกอีเมล');
                                  return;
                                }
                                if (!/^\S+@\S+\.\S+$/.test(judgeForm.email)) {
                                  setJudgeError('รูปแบบอีเมลไม่ถูกต้อง');
                                  return;
                                }
                                if (!judgeForm.password.trim()) {
                                  setJudgeError('กรุณากรอกรหัสผ่านชั่วคราว');
                                  return;
                                }
                                // Check duplicate email
                                if (judges.some(j => j.email === judgeForm.email)) {
                                  setJudgeError('อีเมลนี้ถูกเพิ่มแล้ว');
                                  return;
                                }
                                // Add judge
                                setJudges([
                                  ...judges,
                                  { ...judgeForm, status: '✔ ยืนยันแล้ว' }
                                ]);
                                setShowCreateJudge(false);
                              }}>
                                <div style={{ marginBottom: 14 }}>
                                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>ชื่อบัญชี<span style={{ color: 'red' }}>*</span></label>
                                  <input
                                    type="text"
                                    value={judgeForm.name}
                                    onChange={e => setJudgeForm({ ...judgeForm, name: e.target.value })}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                                    autoFocus
                                  />
                                </div>
                               
                               
                                <div style={{ marginBottom: 14 }}>
                                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>รหัสผ่านชั่วคราว <span style={{ color: 'red' }}>*</span></label>
                                  <input
                                    type="text"
                                    value={judgeForm.password}
                                    onChange={e => setJudgeForm({ ...judgeForm, password: e.target.value })}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                                    placeholder="สร้างรหัสผ่านให้กรรมการ"
                                  />
                                </div>
                               
                                {judgeError && <div style={{ color: 'red', marginBottom: 10 }}>{judgeError}</div>}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                  <button
                                    type="button"
                                    style={{ background: '#eee', color: '#70136C', border: 'none', borderRadius: 999, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }}
                                    onClick={() => setShowCreateJudge(false)}
                                  >
                                    ❌ ยกเลิก
                                  </button>
                                  <button
                                    type="submit"
                                    style={{ background: '#70136C', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }}
                                  >
                                    ✔️ สร้างกรรมการ
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        )}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
              <button
                style={{
                  padding: '8px 28px',
                  background: '#eee',
                  color: '#70136C',
                  border: 'none',
                  borderRadius: 999,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
                onClick={() => setStep(2)}
              >
                ย้อนกลับ
              </button>
              <button
                style={{
                  padding: '8px 28px',
                  background: '#70136C',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 999,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
                onClick={() => setStep(4)}
              >
                ถัดไป
              </button>
            </div>

            {/* Modals (placeholders) */}
            {/* Modal: เชิญกรรมการ */}
            {showAddJudge && (
              <div style={{
                position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(60,60,60,0.18)', padding: '32px 28px', maxWidth: 500, width: '90%', color: '#222', position: 'relative' }}>
                  <h3 style={{ fontWeight: 700, fontSize: 20, color: '#70136C', marginBottom: 18 }}>
                    {editingJudgeIndex !== null ? 'แก้ไขกรรมการ' : 'เชิญกรรมการ'}
                  </h3>
                  <form onSubmit={async e => {
                    e.preventDefault();
                    console.log('Form submitted, judgeForm:', judgeForm);
                    // Validate
                    if (!judgeForm.user_id) {
                      setJudgeError('กรุณาเลือกผู้ใช้จากระบบ');
                      return;
                    }
                    if (judgeForm.levels.length === 0) {
                      setJudgeError('กรุณาเลือกอย่างน้อย 1 ระดับ');
                      return;
                    }
                    // Check duplicate (only when adding new)
                    if (editingJudgeIndex === null && judges.some(j => j.user_id === judgeForm.user_id)) {
                      setJudgeError('ผู้ใช้นี้ถูกเพิ่มแล้ว');
                      return;
                    }
                    // Update or add
                    if (editingJudgeIndex !== null) {
                      const updated = [...judges];
                      updated[editingJudgeIndex] = { ...judgeForm, status: 'รอรับเชิญ' };
                      setJudges(updated);
                      setEditingJudgeIndex(null);
                    } else {
                      setJudges([
                        ...judges,
                        { ...judgeForm, status: 'รอรับเชิญ' }
                      ]);
                    }
                    setJudgeForm({ user_id: null, first_name: '', last_name: '', email: '', levels: [] });
                    setShowAddJudge(false);
                    setJudgeError('');
                  }}>
                    
                    <div style={{ marginBottom: 14, position: 'relative' }}>
                      <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>อีเมล <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="email"
                        value={judgeForm.email}
                        disabled={editingJudgeIndex !== null}
                        onChange={async e => {
                          const email = e.target.value;
                          setJudgeForm({ ...judgeForm, email });
                          if (email.length > 2) {
                            try {
                              const res = await fetch(`http://localhost:8080/api/v1/users/search?email=${encodeURIComponent(email)}`);
                              const users = await res.json();
                              setJudgeSearchResults(users || []);
                              setShowJudgeSearchDropdown(true);
                            } catch (err) {
                              console.error(err);
                              setJudgeSearchResults([]);
                            }
                          } else {
                            setJudgeSearchResults([]);
                            setShowJudgeSearchDropdown(false);
                          }
                        }}
                        onFocus={() => { if (judgeSearchResults.length > 0 && editingJudgeIndex === null) setShowJudgeSearchDropdown(true); }}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, background: editingJudgeIndex !== null ? '#f3f3f3' : '#fff', cursor: editingJudgeIndex !== null ? 'not-allowed' : 'text' }}
                        placeholder="ค้นหาอีเมลผู้ใช้..."
                      />
                      {showJudgeSearchDropdown && judgeSearchResults.length > 0 && editingJudgeIndex === null && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: 8,
                          marginTop: 4,
                          maxHeight: 200,
                          overflowY: 'auto',
                          zIndex: 1000,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                          {judgeSearchResults.map(user => (
                            <div
                              key={user.id}
                              onClick={() => {
                                console.log('Selected user:', user);
                                const nameParts = (user.full_name || '').split(' ');
                                const firstName = nameParts[0] || '';
                                const lastName = nameParts.slice(1).join(' ') || '';
                                setJudgeForm({ 
                                  user_id: user.id,
                                  first_name: firstName,
                                  last_name: lastName,
                                  email: user.email,
                                  levels: judgeForm.levels
                                });
                                setShowJudgeSearchDropdown(false);
                                setJudgeError('');
                              }}
                              style={{
                                padding: '10px 12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            >
                              <div style={{ fontWeight: 500 }}>{user.email}</div>
                              <div style={{ fontSize: 14, color: '#666' }}>{user.full_name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>ระดับที่รับผิดชอบ <span style={{ color: 'red' }}>*</span></label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {selectedLevels.map(level => (
                          <label key={level} style={{ fontWeight: 400, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                              type="checkbox"
                              checked={judgeForm.levels.includes(level)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setJudgeForm({ ...judgeForm, levels: [...judgeForm.levels, level] });
                                } else {
                                  setJudgeForm({ ...judgeForm, levels: judgeForm.levels.filter(l => l !== level) });
                                }
                              }}
                              style={{ accentColor: '#70136C', width: 16, height: 16 }}
                            />
                            {level}
                          </label>
                        ))}
                      </div>
                      {selectedLevels.length === 0 && (
                        <div style={{ color: '#888', fontSize: 14, marginTop: 8 }}>กรุณาเลือกระดับการแข่งขันในขั้นตอนที่ 1 ก่อน</div>
                      )}
                    </div>

                    {judgeError && <div style={{ color: 'red', marginBottom: 10 }}>{judgeError}</div>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button
                        type="button"
                        style={{ background: '#eee', color: '#70136C', border: 'none', borderRadius: 999, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }}
                        onClick={() => {
                          setShowAddJudge(false);
                          setJudgeForm({ user_id: null, first_name: '', last_name: '', email: '', levels: [] });
                          setJudgeError('');
                          setShowJudgeSearchDropdown(false);
                          setEditingJudgeIndex(null);
                        }}
                      >
                        ❌ ยกเลิก
                      </button>
                      <button
                        type="submit"
                        style={{ background: '#70136C', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }}
                      >
                        ✔️ ส่งคำเชิญ
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: ดูรายละเอียดสิทธิ์ */}
            {showPermissionsModal && (
              <div style={{
                position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(60,60,60,0.18)', padding: '28px 24px', maxWidth: 380, width: '90%', color: '#222', position: 'relative' }}>
                  <h3 style={{ fontWeight: 700, fontSize: 18, color: '#70136C', marginBottom: 14 }}>รายละเอียดสิทธิ์</h3>
                  <div style={{ marginBottom: 18 }}>
                    {viewPermissionsData && viewPermissionsData.map(p => (
                      <div key={p.key} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{p.checked ? '✅' : '❌'}</span>
                        <span style={{ fontSize: 15, color: p.checked ? '#222' : '#999' }}>{p.label}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    style={{ background: '#70136C', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 24px', fontSize: 16, cursor: 'pointer', float: 'right' }}
                    onClick={() => {
                      setShowPermissionsModal(false);
                      setViewPermissionsData(null);
                    }}
                  >
                    ปิด
                  </button>
                </div>
              </div>
            )}

            {/* Modal: เพิ่มผู้ช่วยจัดการประกวด */}
            {showAddAssistant && (
              <div style={{
                position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(60,60,60,0.18)', padding: '32px 28px', maxWidth: 420, width: '90%', color: '#222', position: 'relative' }}>
                  <h3 style={{ fontWeight: 700, fontSize: 20, color: '#70136C', marginBottom: 18 }}>
                    {editingAssistantIndex !== null ? 'แก้ไขผู้ช่วยจัดการประกวด' : 'เพิ่มผู้ช่วยจัดการประกวด'}
                  </h3>
                  <form onSubmit={async e => {
                    e.preventDefault();
                    console.log('Form submitted, assistantForm:', assistantForm);
                    // Validate
                    if (!assistantForm.user_id) {
                      setAssistantError('กรุณาเลือกผู้ใช้จากระบบ');
                      return;
                    }
                    // Check duplicate (only when adding new)
                    if (editingAssistantIndex === null && assistants.some(a => a.user_id === assistantForm.user_id)) {
                      setAssistantError('ผู้ใช้นี้ถูกเพิ่มแล้ว');
                      return;
                    }
                    // Update or add
                    if (editingAssistantIndex !== null) {
                      const updated = [...assistants];
                      updated[editingAssistantIndex] = { ...assistantForm, status: 'รอรับเชิญ' };
                      setAssistants(updated);
                      setEditingAssistantIndex(null);
                    } else {
                      setAssistants([
                        ...assistants,
                        { ...assistantForm, status: 'รอรับเชิญ' }
                      ]);
                    }
                    setAssistantForm({ user_id: null, first_name: '', last_name: '', email: '', permissions: defaultAssistantPermissions.map(p => ({ ...p })) });
                    setShowAddAssistant(false);
                    setAssistantError('');
                  }}>
                    
                    <div style={{ marginBottom: 14, position: 'relative' }}>
                      <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>อีเมล <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="email"
                        value={assistantForm.email}
                        disabled={editingAssistantIndex !== null}
                        onChange={async e => {
                          const email = e.target.value;
                          setAssistantForm({ ...assistantForm, email });
                          if (email.length > 2) {
                            try {
                              const res = await fetch(`http://localhost:8080/api/v1/users/search?email=${encodeURIComponent(email)}`);
                              const users = await res.json();
                              setSearchResults(users || []);
                              setShowSearchDropdown(true);
                            } catch (err) {
                              console.error(err);
                              setSearchResults([]);
                            }
                          } else {
                            setSearchResults([]);
                            setShowSearchDropdown(false);
                          }
                        }}
                        onFocus={() => { if (searchResults.length > 0 && editingAssistantIndex === null) setShowSearchDropdown(true); }}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, background: editingAssistantIndex !== null ? '#f3f3f3' : '#fff', cursor: editingAssistantIndex !== null ? 'not-allowed' : 'text' }}
                        placeholder="ค้นหาอีเมลผู้ใช้..."
                      />
                      {showSearchDropdown && searchResults.length > 0 && editingAssistantIndex === null && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: 8,
                          marginTop: 4,
                          maxHeight: 200,
                          overflowY: 'auto',
                          zIndex: 1000,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                          {searchResults.map(user => (
                            <div
                              key={user.id}
                              onClick={() => {
                                console.log('Selected user:', user);
                                const nameParts = (user.full_name || '').split(' ');
                                const firstName = nameParts[0] || '';
                                const lastName = nameParts.slice(1).join(' ') || '';
                                setAssistantForm({ 
                                  user_id: user.id,
                                  first_name: firstName,
                                  last_name: lastName,
                                  email: user.email,
                                  permissions: assistantForm.permissions 
                                });
                                setShowSearchDropdown(false);
                                setAssistantError('');
                              }}
                              style={{
                                padding: '10px 12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                                ':hover': { background: '#f5f5f5' }
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            >
                              <div style={{ fontWeight: 500 }}>{user.email}</div>
                              <div style={{ fontSize: 14, color: '#666' }}>{user.full_name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>สิทธิ์ที่สามารถทำได้</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(assistantForm.permissions || []).map((perm, idx) => (
                          <label key={perm.key} style={{ fontWeight: 400, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                              type="checkbox"
                              checked={perm.checked}
                              onChange={e => {
                                const newPerms = (assistantForm.permissions || []).map((p, i) => i === idx ? { ...p, checked: e.target.checked } : p);
                                setAssistantForm({ ...assistantForm, permissions: newPerms });
                              }}
                              style={{ accentColor: '#70136C', width: 16, height: 16 }}
                            />
                            {perm.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {assistantError && <div style={{ color: 'red', marginBottom: 10 }}>{assistantError}</div>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button
                        type="button"
                        style={{ background: '#eee', color: '#70136C', border: 'none', borderRadius: 999, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }}
                        onClick={() => {
                          setShowAddAssistant(false);
                          setAssistantForm({ user_id: null, first_name: '', last_name: '', email: '', permissions: defaultAssistantPermissions.map(p => ({ ...p })) });
                          setAssistantError('');
                          setShowSearchDropdown(false);
                          setEditingAssistantIndex(null);
                        }}
                      >
                        ❌ ยกเลิก
                      </button>
                      <button
                        type="submit"
                        style={{ background: '#70136C', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }}
                      >
                        ✔️ ส่งคำเชิญ
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 4: Review Summary */}
        {step === 4 && (
          <>
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8, color: '#70136C', textAlign: 'center' }}>
              📋 สรุปข้อมูลการประกวด
            </h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: 32, fontSize: 15 }}>
              กรุณาตรวจสอบข้อมูลทั้งหมดก่อนยืนยันการสร้างการประกวด
            </p>

            {/* Section 1: Basic Info */}
            <div style={{ background: '#fff', border: '2px solid #70136C', borderRadius: 12, padding: '20px 24px', marginBottom: 20, boxShadow: '0 2px 8px rgba(112,19,108,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 600, fontSize: 18, color: '#70136C', margin: 0 }}>📝 ข้อมูลพื้นฐาน</h3>
                <button
                  style={{ background: 'none', border: 'none', color: '#70136C', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}
                  onClick={() => setStep(1)}
                >
                  แก้ไข
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px 24px', fontSize: 15 }}>
                <div style={{ fontWeight: 600, color: '#555' }}>ชื่อการประกวด:</div>
                <div>{contestName || '-'}</div>
                
                <div style={{ fontWeight: 600, color: '#555' }}>ระดับการแข่งขัน:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedLevels.map(level => (
                    <span key={level} style={{ background: '#f6e7f5', color: '#70136C', padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 500 }}>
                      {level}
                    </span>
                  ))}
                  {selectedLevels.length === 0 && <span style={{ color: '#999' }}>-</span>}
                </div>
                
                <div style={{ fontWeight: 600, color: '#555' }}>วันที่เปิดรับสมัคร:</div>
                <div>{regOpen ? new Date(regOpen).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</div>
                
                <div style={{ fontWeight: 600, color: '#555' }}>วันที่ปิดรับสมัคร:</div>
                <div>{regClose ? new Date(regClose).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</div>
                
                <div style={{ fontWeight: 600, color: '#555' }}>โปสเตอร์:</div>
                <div>
                  {poster ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>📄 {poster.name}</span>
                      {poster.type.startsWith('image/') && (
                        <img src={URL.createObjectURL(poster)} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }} />
                      )}
                    </div>
                  ) : (
                    <span style={{ color: '#999' }}>ไม่มีโปสเตอร์</span>
                  )}
                </div>
              </div>

              {contestDescription && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #eee' }}>
                  <div style={{ fontWeight: 600, color: '#555', marginBottom: 6 }}>รายละเอียดการประกวด:</div>
                  <div style={{ background: '#fafbfc', padding: '12px 14px', borderRadius: 8, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {contestDescription}
                  </div>
                </div>
              )}

              {contestPurpose && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, color: '#555', marginBottom: 6 }}>วัตถุประสงค์:</div>
                  <div style={{ background: '#fafbfc', padding: '12px 14px', borderRadius: 8, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {contestPurpose}
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Level Details */}
            <div style={{ background: '#fff', border: '2px solid #70136C', borderRadius: 12, padding: '20px 24px', marginBottom: 20, boxShadow: '0 2px 8px rgba(112,19,108,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 600, fontSize: 18, color: '#70136C', margin: 0 }}>📚 ข้อมูลแต่ละระดับ</h3>
                <button
                  style={{ background: 'none', border: 'none', color: '#70136C', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}
                  onClick={() => setStep(2)}
                >
                  แก้ไข
                </button>
              </div>

              {selectedLevels.map((level, idx) => {
                const poemTypes = levelPoemTypes[level] || [];
                const topicInfo = levelTopics[level] || {};
                const rules = levelDetails[level + '_rules'] || '';
                const prizeEnabled = levelDetails[level + '_prize_enabled'];
                const prize1 = levelDetails[level + '_prize1'] || '';
                const prize2 = levelDetails[level + '_prize2'] || '';
                const prize3 = levelDetails[level + '_prize3'] || '';

                return (
                  <div key={level} style={{ marginBottom: idx < selectedLevels.length - 1 ? 20 : 0, paddingBottom: idx < selectedLevels.length - 1 ? 20 : 0, borderBottom: idx < selectedLevels.length - 1 ? '1px solid #eee' : 'none' }}>
                    <h4 style={{ fontWeight: 600, color: '#70136C', marginBottom: 10, fontSize: 16 }}>ระดับ{level}</h4>
                    
                    <div style={{ marginLeft: 12 }}>
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ fontWeight: 500, color: '#555' }}>ประเภทกลอน: </span>
                        {poemTypes.length > 0 ? (
                          <span>{poemTypes.join(', ')}</span>
                        ) : (
                          <span style={{ color: '#999' }}>ไม่ระบุ</span>
                        )}
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <span style={{ fontWeight: 500, color: '#555' }}>หัวข้อ: </span>
                        {topicInfo.topicEnabled ? (
                          <span style={{ background: '#fff3cd', color: '#856404', padding: '2px 10px', borderRadius: 999, fontSize: 14 }}>
                            📌 {topicInfo.topicName || 'ยังไม่ระบุชื่อหัวข้อ'}
                          </span>
                        ) : (
                          <span style={{ color: '#555' }}>หัวข้ออิสระ</span>
                        )}
                      </div>

                      {rules && (
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontWeight: 500, color: '#555', marginBottom: 4 }}>เงื่อนไข/กติกา:</div>
                          <div style={{ background: '#fafbfc', padding: '10px 12px', borderRadius: 6, fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap', marginLeft: 0 }}>
                            {rules}
                          </div>
                        </div>
                      )}

                      {prizeEnabled && (prize1 || prize2 || prize3) && (
                        <div>
                          <div style={{ fontWeight: 500, color: '#555', marginBottom: 4 }}>รางวัล:</div>
                          <ul style={{ marginLeft: 20, marginTop: 4, fontSize: 14 }}>
                            {prize1 && <li>{prize1}</li>}
                            {prize2 && <li>{prize2}</li>}
                            {prize3 && <li>{prize3}</li>}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {selectedLevels.length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>ยังไม่มีข้อมูลระดับ</div>
              )}
            </div>

            {/* Section 3: Judges & Assistants */}
            <div style={{ background: '#fff', border: '2px solid #70136C', borderRadius: 12, padding: '20px 24px', marginBottom: 20, boxShadow: '0 2px 8px rgba(112,19,108,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 600, fontSize: 18, color: '#70136C', margin: 0 }}>👥 กรรมการและผู้ช่วย</h3>
                <button
                  style={{ background: 'none', border: 'none', color: '#70136C', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}
                  onClick={() => setStep(3)}
                >
                  แก้ไข
                </button>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 500, color: '#555', marginBottom: 6 }}>คะแนนเต็ม: <span style={{ fontSize: 20, fontWeight: 600, color: '#70136C' }}>{maxScore}</span> คะแนน</div>
              </div>

              {/* Assistants */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontWeight: 600, fontSize: 16, color: '#70136C', marginBottom: 10 }}>ผู้ช่วยจัดการประกวด ({assistants.length} คน)</h4>
                {assistants.length > 0 ? (
                  <div style={{ background: '#fafbfc', borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                      <thead>
                        <tr style={{ background: '#f6e7f5' }}>
                          <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#70136C' }}>ชื่อ-นามสกุล</th>
                          <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#70136C' }}>อีเมล</th>
                          <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#70136C' }}>สิทธิ์</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assistants.map((a, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < assistants.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                            <td style={{ padding: '10px' }}>{a.first_name} {a.last_name}</td>
                            <td style={{ padding: '10px' }}>{a.email}</td>
                            <td style={{ padding: '10px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {a.permissions.filter(p => p.checked).map(p => (
                                  <span key={p.key} style={{ background: '#e3f2fd', color: '#1565c0', padding: '2px 8px', borderRadius: 999, fontSize: 12 }}>
                                    {p.label}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#999', padding: '16px', background: '#fafbfc', borderRadius: 8 }}>
                    ไม่มีผู้ช่วยจัดการประกวด
                  </div>
                )}
              </div>

              {/* Judges */}
              <div>
                <h4 style={{ fontWeight: 600, fontSize: 16, color: '#70136C', marginBottom: 10 }}>กรรมการ ({judges.length} คน)</h4>
                {judges.length > 0 ? (
                  <div style={{ background: '#fafbfc', borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                      <thead>
                        <tr style={{ background: '#f6e7f5' }}>
                          <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#70136C' }}>ชื่อ-นามสกุล</th>
                          <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#70136C' }}>อีเมล</th>
                          <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#70136C' }}>ระดับที่รับผิดชอบ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {judges.map((j, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < judges.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                            <td style={{ padding: '10px' }}>{j.first_name} {j.last_name}</td>
                            <td style={{ padding: '10px' }}>{j.email}</td>
                            <td style={{ padding: '10px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {j.levels.map(level => (
                                  <span key={level} style={{ background: '#f6e7f5', color: '#70136C', padding: '2px 10px', borderRadius: 999, fontSize: 13, fontWeight: 500 }}>
                                    {level}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#999', padding: '16px', background: '#fafbfc', borderRadius: 8 }}>
                    ไม่มีกรรมการ
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32, paddingTop: 24, borderTop: '2px solid #eee' }}>
              <button
                style={{
                  padding: '12px 36px',
                  background: '#fff',
                  color: '#70136C',
                  border: '2px solid #70136C',
                  borderRadius: 999,
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => setStep(3)}
                onMouseEnter={e => e.currentTarget.style.background = '#f6e7f5'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                ← ย้อนกลับ
              </button>
              <button
                style={{
                  padding: '12px 48px',
                  background: '#70136C',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 999,
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(112,19,108,0.3)',
                  transition: 'all 0.2s',
                }}
                onClick={async () => {
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
                                    organizer_id: null,
                                    registration_start: regOpen || null,
                                    registration_end: regClose || null,
                                    max_score: maxScore,
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

                                  // include judges and assistants from state if present
                                  if (judges && judges.length > 0) {
                                    payload.judges = judges.map(j => ({ 
                                      user_id: j.user_id, 
                                      email: j.email, 
                                      levels: j.levels // array of level names
                                    }));
                                    console.log('Sending judges to backend:', payload.judges);
                                  }
                                  if (assistants && assistants.length > 0) {
                                    payload.assistants = assistants.map(a => {
                                      const perms = {};
                                      a.permissions.forEach(p => {
                                        perms[p.key] = p.checked;
                                      });
                                      return {
                                        user_id: a.user_id,
                                        ...perms
                                      };
                                    });
                                    console.log('Sending assistants to backend:', payload.assistants);
                                  }

                                  console.log('Final payload:', JSON.stringify(payload, null, 2));

                                  // upload poster if present
                                  let posterUrl = null;
                                  if (poster) {
                                    const form = new FormData();
                                    form.append('file', poster);
                                    const uploadRes = await fetch('http://localhost:8080/api/v1/upload', { method: 'POST', body: form });
                                    const up = await uploadRes.json();
                                    posterUrl = up.url || null;
                                  }
                                  if (posterUrl) payload.poster_url = posterUrl;

                                  // send to backend
                                  const res = await fetch('http://localhost:8080/api/v1/contests', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                  });
                                  if (!res.ok) {
                                    const err = await res.json();
                                    alert('สร้างการประกวดไม่สำเร็จ: ' + (err.error || res.statusText));
                                    return;
                                  }
                                  alert('ส่งข้อมูลการประกวดเรียบร้อยแล้ว');
                                  // redirect or reset
                                  window.location.href = '/';
                                } catch (e) {
                                  console.error(e);
                                  alert('เกิดข้อผิดพลาดขณะส่งข้อมูล');
                                }
                                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(112,19,108,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(112,19,108,0.3)';
                }}
              >
                ✓ ยืนยันและสร้างการประกวด
              </button>
            </div>
          </>
        )}
                      </div>
                    </div>
                  </>
                );
              }
