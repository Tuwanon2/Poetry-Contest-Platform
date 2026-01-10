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
      // Modal for adding judge (invite or select existing)
      const [showAddJudge, setShowAddJudge] = useState(false);
      const [addJudgeTab, setAddJudgeTab] = useState('email');
      const [inviteEmail, setInviteEmail] = useState('');
      const [inviteError, setInviteError] = useState('');
      // Mock existing users
      const existingJudges = [
        { id: 1, name: 'นาย B', email: 'b@email.com' },
        { id: 2, name: 'นางสาว C', email: 'c@email.com' }
      ];
      // Search state for existing users
      const [searchExistingJudge, setSearchExistingJudge] = useState('');
    // Judge creation modal state and form
    const [showCreateJudge, setShowCreateJudge] = useState(false);
    const [judgeForm, setJudgeForm] = useState({ name: '', email: '', phone: '', password: '', role: 'กรรมการ' });
    const [judgeError, setJudgeError] = useState('');
    const [judges, setJudges] = useState([
      {
        name: 'นาย A',
        email: 'a@email.com',
        phone: '',
        role: 'กรรมการ',
        status: '✔ ยืนยันแล้ว'
      }
    ]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [poster, setPoster] = useState(null);
  const [contestName, setContestName] = useState("");
  const [step, setStep] = useState(1);
  const [levelDetails, setLevelDetails] = useState({});
  // For each level: { [level]: { topicEnabled: boolean, topicName: string, detail: string } }
  const [levelTopics, setLevelTopics] = useState({});
  const [regOpen, setRegOpen] = useState("");
  const [regClose, setRegClose] = useState("");
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  // Modal: เพิ่มผู้ช่วย
  const [showAddAssistant, setShowAddAssistant] = useState(false);
  const defaultAssistantPermissions = [
    { key: 'view', label: 'ดูข้อมูลการประกวดทั้งหมด', checked: true },
    { key: 'edit', label: 'แก้ไขข้อมูลการประกวด (ยกเว้นบางส่วน)', checked: true },
    { key: 'manageApplicants', label: 'จัดการผู้สมัคร (ดูรายชื่อ, ตรวจสอบเอกสาร, แก้ไขสถานะ)', checked: true },
    { key: 'uploadPoster', label: 'อัปโหลด/แก้ไขโปสเตอร์หรือข้อมูลกิจกรรม', checked: true },
    { key: 'manageLevels', label: 'จัดการระดับการแข่งขัน (เพิ่ม/แก้ไขรายละเอียด)', checked: true },
    { key: 'viewScores', label: 'ดูคะแนนกรรมการ (แต่แก้ไขหรือให้คะแนนไม่ได้)', checked: true },
    { key: 'sendEmail', label: 'ส่งอีเมลแจ้งเตือนผู้สมัคร', checked: true },
    { key: 'addAssistant', label: 'เพิ่มผู้ช่วยรายอื่น (ถ้าผู้สร้างอนุญาต)', checked: true },
    { key: 'viewReport', label: 'ดูรายงาน/สถิติของการประกวด', checked: true },
  ];
  const [assistantForm, setAssistantForm] = useState({ name: '', email: '', role: 'ผู้ช่วยทั่วไป', permissions: defaultAssistantPermissions.map(p => ({ ...p })) });
  const [assistantError, setAssistantError] = useState('');
  const [assistants, setAssistants] = useState([
    {
      name: 'นางสาว B',
      email: 'b@email.com',
      role: 'ผู้ช่วยทั่วไป',
      status: 'รอรับเชิญ',
      permissions: defaultAssistantPermissions
    }
  ]);

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
              <div style={{ textAlign: "center", marginTop: 40 }}>
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
                const detail = levelDetails[level] || "";
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
                    <label style={{ fontWeight: 500 }}>
                      รายละเอียดการประกวด
                    </label>
                    <textarea
                      value={detail}
                      onChange={e => {
                        const val = e.target.value.slice(0, 600);
                        setLevelDetails({ ...levelDetails, [level]: val });
                      }}
                      placeholder={`กรอกรายละเอียด`}
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
                    <div style={{ fontSize: 13, color: '#888', marginTop: 2, textAlign: 'right' }}>
                      {detail.length} / 600 ตัวอักษร
                    </div>

                    {/* Purpose textarea */}
                    <label style={{ fontWeight: 500, marginTop: 16, display: 'block' }}>
                      วัตถุประสงค์ของการจัดประกวด
                    </label>
                    <textarea
                      value={levelDetails[level + '_purpose'] || ''}
                      onChange={e => {
                        const val = e.target.value.slice(0, 300);
                        setLevelDetails({ ...levelDetails, [level + '_purpose']: val });
                      }}
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
                    <div style={{ fontSize: 13, color: '#888', marginTop: 2, textAlign: 'right' }}>
                      {(levelDetails[level + '_purpose'] || '').length} / 300 ตัวอักษร
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
                    setAssistantForm({ name: '', email: '', role: 'ผู้ช่วยทั่วไป', permissions: defaultAssistantPermissions.map(p => ({ ...p })) });
                    setAssistantError('');
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
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>อีเมล</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>สิทธิ์</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>สถานะ</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assistants.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: 12 }}>ยังไม่มีผู้ช่วย</td></tr>
                    ) : assistants.map((a, idx) => (
                      <tr key={a.email + idx}>
                        <td style={{ padding: '6px' }}>{a.name}</td>
                        <td style={{ padding: '6px' }}>{a.email}</td>
                        <td style={{ padding: '6px' }}>
                          {a.role === 'ผู้ช่วยหลัก' ? 'ผู้ช่วยหลัก' : 'กำหนดเอง'}
                        </td>
                        <td style={{ padding: '6px', color: '#f39c12' }}>{a.status === 'รอรับเชิญ' ? '✉ รอรับเชิญ' : a.status}</td>
                        <td style={{ padding: '6px' }}>
                          <button
                            style={{ color: '#70136C', background: 'none', border: 'none', cursor: 'pointer', marginRight: 10 }}
                            onClick={() => {/* TODO: Add edit logic/modal here */}}
                          >แก้ไข</button>
                          <button
                            style={{ color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer' }}
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
                  value={10}
                  readOnly
                  style={{ width: 120, padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, background: '#f3f3f3' }}
                  placeholder="10"
                />
                <span style={{ marginLeft: 8, color: '#888', fontSize: 14 }}>(กำหนดคะแนนเต็มสำหรับการตัดสิน)</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <button style={{ background: '#fff', color: '#70136C', border: '2px solid #70136C', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                  onClick={() => {
                    setShowAddJudge(true);
                    setAddJudgeTab('email');
                    setInviteEmail('');
                    setInviteError('');
                  }}>
                  + เพิ่มกรรมการ
                </button>
                            {/* Modal: Add Judge (invite or select) */}
                            {showAddJudge && (
                              <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(60,60,60,0.18)', padding: '32px 28px', maxWidth: 420, width: '90%', color: '#222', position: 'relative' }}>
                                  <h3 style={{ fontWeight: 700, fontSize: 20, color: '#70136C', marginBottom: 18 }}>เพิ่มกรรมการ</h3>
                                  <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                                    <button
                                      style={{ flex: 1, background: addJudgeTab === 'email' ? '#70136C' : '#eee', color: addJudgeTab === 'email' ? '#fff' : '#70136C', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer' }}
                                      onClick={() => setAddJudgeTab('email')}
                                    >เชิญผ่านอีเมล</button>
                                    <button
                                      style={{ flex: 1, background: addJudgeTab === 'existing' ? '#70136C' : '#eee', color: addJudgeTab === 'existing' ? '#fff' : '#70136C', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer' }}
                                      onClick={() => setAddJudgeTab('existing')}
                                    >เลือกจากผู้ใช้ในระบบ</button>
                                  </div>
                                  {addJudgeTab === 'email' && (
                                    <form onSubmit={e => {
                                      e.preventDefault();
                                      if (!inviteEmail.trim()) {
                                        setInviteError('กรุณากรอกอีเมล');
                                        return;
                                      }
                                      if (!/^\S+@\S+\.\S+$/.test(inviteEmail)) {
                                        setInviteError('รูปแบบอีเมลไม่ถูกต้อง');
                                        return;
                                      }
                                      if (judges.some(j => j.email === inviteEmail)) {
                                        setInviteError('อีเมลนี้ถูกเพิ่มแล้ว');
                                        return;
                                      }
                                      setJudges([
                                        ...judges,
                                        { name: inviteEmail.split('@')[0], email: inviteEmail, phone: '', status: '✉ รอรับเชิญ' }
                                      ]);
                                      setShowAddJudge(false);
                                    }}>
                                      <div style={{ marginBottom: 14 }}>
                                        <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>อีเมล <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                          type="email"
                                          value={inviteEmail}
                                          onChange={e => setInviteEmail(e.target.value)}
                                          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                                        />
                                      </div>
                                      {inviteError && <div style={{ color: 'red', marginBottom: 10 }}>{inviteError}</div>}
                                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                        <button
                                          type="button"
                                          style={{ background: '#eee', color: '#70136C', border: 'none', borderRadius: 999, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }}
                                          onClick={() => setShowAddJudge(false)}
                                        >❌ ยกเลิก</button>
                                        <button
                                          type="submit"
                                          style={{ background: '#70136C', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }}
                                        >✔️ เชิญกรรมการ</button>
                                      </div>
                                    </form>
                                  )}
                                  {addJudgeTab === 'existing' && (
                                    <div>
                                      <div style={{ marginBottom: 10, fontWeight: 500 }}>เลือกจากผู้ใช้ที่มีอยู่ในระบบ</div>
                                      <input
                                        type="text"
                                        value={searchExistingJudge}
                                        onChange={e => setSearchExistingJudge(e.target.value)}
                                        placeholder="ค้นหาชื่อหรืออีเมล..."
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginBottom: 12 }}
                                      />
                                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {existingJudges
                                          .filter(user =>
                                            user.name.toLowerCase().includes(searchExistingJudge.toLowerCase()) ||
                                            user.email.toLowerCase().includes(searchExistingJudge.toLowerCase())
                                          )
                                          .map(user => (
                                            <li key={user.id} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                              <span>{user.name} ({user.email})</span>
                                              <button
                                                style={{ background: '#70136C', color: '#fff', border: 'none', borderRadius: 999, padding: '4px 16px', fontSize: 15, cursor: 'pointer' }}
                                                onClick={() => {
                                                  if (judges.some(j => j.email === user.email)) return;
                                                  setJudges([
                                                    ...judges,
                                                    { name: user.name, email: user.email, phone: '', status: '✔ ยืนยันแล้ว' }
                                                  ]);
                                                  setShowAddJudge(false);
                                                }}
                                              >เพิ่ม</button>
                                            </li>
                                          ))}
                                        {existingJudges.filter(user =>
                                          user.name.toLowerCase().includes(searchExistingJudge.toLowerCase()) ||
                                          user.email.toLowerCase().includes(searchExistingJudge.toLowerCase())
                                        ).length === 0 && (
                                          <li style={{ color: '#aaa', textAlign: 'center', padding: 10 }}>ไม่พบผู้ใช้ที่ตรงกับคำค้นหา</li>
                                        )}
                                      </ul>
                                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
                                        <button
                                          type="button"
                                          style={{ background: '#eee', color: '#70136C', border: 'none', borderRadius: 999, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }}
                                          onClick={() => setShowAddJudge(false)}
                                        >❌ ยกเลิก</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
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
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>อีเมล</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>เบอร์โทร</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>สถานะ</th>
                      
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {judges.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: 12 }}>ยังไม่มีกรรมการ</td></tr>
                    ) : judges.map((j, idx) => (
                      <tr key={j.email + idx}>
                        <td style={{ padding: '6px' }}>{j.name}</td>
                        <td style={{ padding: '6px' }}>{j.email}</td>
                        <td style={{ padding: '6px' }}>{j.phone || '-'}</td>
                        <td style={{ padding: '6px', color: '#2ecc40' }}>{j.status}</td>

                        <td style={{ padding: '6px' }}>
                          <button
                            style={{ color: '#70136C', background: 'none', border: 'none', cursor: 'pointer', marginRight: 10 }}
                            onClick={() => {/* TODO: Add edit logic/modal here */}}
                          >แก้ไข</button>
                          <button style={{ color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setJudges(judges.filter((_, i) => i !== idx))}>ลบ</button>
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
            {/* Modal: เพิ่มผู้ช่วยจัดการประกวด */}
            {showAddAssistant && (
              <div style={{
                position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(60,60,60,0.18)', padding: '32px 28px', maxWidth: 420, width: '90%', color: '#222', position: 'relative' }}>
                  <h3 style={{ fontWeight: 700, fontSize: 20, color: '#70136C', marginBottom: 18 }}>เพิ่มผู้ช่วยจัดการประกวด</h3>
                  <form onSubmit={e => {
                    e.preventDefault();
                    // Validate
                    if (!assistantForm.name.trim()) {
                      setAssistantError('กรุณากรอกชื่อ');
                      return;
                    }
                    if (!assistantForm.email.trim()) {
                      setAssistantError('กรุณากรอกอีเมล');
                      return;
                    }
                    // Simple email regex
                    if (!/^\S+@\S+\.\S+$/.test(assistantForm.email)) {
                      setAssistantError('รูปแบบอีเมลไม่ถูกต้อง');
                      return;
                    }
                    // Check duplicate email
                    if (assistants.some(a => a.email === assistantForm.email)) {
                      setAssistantError('อีเมลนี้ถูกเพิ่มแล้ว');
                      return;
                    }
                    // Add
                    setAssistants([
                      ...assistants,
                      { ...assistantForm, status: 'รอรับเชิญ' }
                    ]);
                    setShowAddAssistant(false);
                  }}>
                    
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>อีเมล <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="email"
                        value={assistantForm.email}
                        onChange={e => setAssistantForm({ ...assistantForm, email: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                      />
                    </div>
                    {/* เบอร์โทรถูกลบออก */}
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>บทบาท</label>
                      <select
                        value={assistantForm.role}
                        onChange={e => {
                          const role = e.target.value;
                          setAssistantForm({
                            ...assistantForm,
                            role,
                            permissions: role === 'ผู้ช่วยทั่วไป' || role === 'ผู้ช่วยหลัก'
                              ? defaultAssistantPermissions.map(p => ({ ...p }))
                              : defaultAssistantPermissions.map(p => ({ ...p, checked: false }))
                          });
                        }}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                      >
                        {/* <option value="ผู้ช่วยทั่วไป">ผู้ช่วยทั่วไป</option> */}
                        <option value="ผู้ช่วยหลัก">ผู้ช่วยหลัก</option>
                        <option value="custom">กำหนดสิทธิ์เอง</option>
                      </select>
                    </div>
                    {(assistantForm.role === 'custom' || assistantForm.role === 'ผู้ช่วยทั่วไป' || assistantForm.role === 'ผู้ช่วยหลัก') && (
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
                    )}
                    {assistantError && <div style={{ color: 'red', marginBottom: 10 }}>{assistantError}</div>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button
                        type="button"
                        style={{ background: '#eee', color: '#70136C', border: 'none', borderRadius: 999, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }}
                        onClick={() => setShowAddAssistant(false)}
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

        {/* Step 4: Review/Submit placeholder */}
        {step === 4 && (
          <>
            <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 18, color: '#70136C' }}>
              ตรวจสอบข้อมูลก่อนส่ง
            </h2>
            <div style={{ textAlign: 'center', color: '#888', fontSize: 18, margin: '40px 0' }}>
              (หน้านี้สำหรับตรวจสอบข้อมูลก่อนส่ง - สามารถเพิ่มเนื้อหาได้ภายหลัง)
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
              <button
                style={{
                  padding: '8px 28px',
                  background: '#eee',
                  color: '#70136C',
                  border: 'none',
                  borderRadius: 999,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginRight: 16,
                }}
                onClick={() => setStep(3)}
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
                              onClick={() => {
                                // Add submit logic here
                                alert('ส่งข้อมูลการประกวดเรียบร้อยแล้ว');
                              }}
                            >
                              ส่งข้อมูล
                            </button>
                          </div>
                        </>
                      )}
                      </div>
                    </div>
                  </>
                );
              }
