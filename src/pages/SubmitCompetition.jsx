import React, { useState } from "react";
import TopNav2 from "../components/TopNav2";
import "./SubmitCompetition.css";

const POEM_PATTERNS = {
  "กลอนแปด": { linesPerStanza: 4, initialStanzas: 2, label: "กลอนแปด" },
  "กาพย์ยานี 11": { linesPerStanza: 4, initialStanzas: 1, label: "กาพย์ยานี" },
  "กาพย์ฉบัง 16": { linesPerStanza: 3, initialStanzas: 1, label: "กาพย์ฉบัง" },
  "โคลงสี่สุภาพ": { linesPerStanza: 4, initialStanzas: 1, label: "โคลง" },
  "สักวา": { linesPerStanza: 4, initialStanzas: 1, label: "สักวา" },
  "ดอกสร้อย": { linesPerStanza: 4, initialStanzas: 1, label: "ดอกสร้อย" },
  "อินทรวิเชียรฉันท์": { linesPerStanza: 2, initialStanzas: 1, label: "ฉันท์" },
};

function LevelRadioCard({ label, icon, checked, onClick }) {
  return (
    <div onClick={onClick} className={`level-card ${checked ? "selected" : ""}`}>
      <span className="radio-outer">{checked && <span className="radio-inner" />}</span>
      <span className="icon-circle">{icon}</span>
      <span className="level-label">{label}</span>
    </div>
  );
}

export default function SubmitCompetition() {
  const defaultType = "กลอนแปด";
  const defaultPattern = POEM_PATTERNS[defaultType];

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    level: "",
    title: "",
    poemType: defaultType,
    poemLines: Array(
      defaultPattern.linesPerStanza * defaultPattern.initialStanzas
    ).fill(""),
    file: null,
  });

  const [step, setStep] = useState(0);

  const levels = [
    { label: "ประถม", icon: <span role="img" aria-label="ประถม">🎒</span> },
    { label: "มัธยม", icon: <span role="img" aria-label="มัธยม">🏫</span> },
    { label: "มหาวิทยาลัย", icon: <span role="img" aria-label="มหาวิทยาลัย">🎓</span> },
    { label: "ประชาชนทั่วไป", icon: <span role="img" aria-label="ประชาชนทั่วไป">🏢</span> },
  ];

  const poemTypes = [
    { label: "กลอนแปด", value: "กลอนแปด" },
    { label: "กาพย์ยานี 11", value: "กาพย์ยานี 11" },
    { label: "กาพย์ฉบัง 16", value: "กาพย์ฉบัง 16" },
    { label: "โคลงสี่สุภาพ", value: "โคลงสี่สุภาพ" },
    { label: "สักวา", value: "สักวา" },
    { label: "ดอกสร้อย", value: "ดอกสร้อย" },
    { label: "อินทรวิเชียรฉันท์", value: "อินทรวิเชียรฉันท์" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- แก้ไข: เช็คก่อนเปลี่ยนประเภทกลอน ---
  const handlePoemTypeChange = (type) => {
    // ถ้าประเภทที่เลือกเหมือนเดิม ไม่ต้องทำอะไร
    if (type === form.poemType) return;

    // เช็คว่ามีข้อความเขียนไว้หรือยัง
    const hasContent = form.poemLines.some(line => line && line.trim() !== "");

    if (hasContent) {
      const confirmChange = window.confirm("หากเปลี่ยนประเภทกลอน เนื้อหาที่กรอกไว้จะถูกลบทั้งหมด คุณแน่ใจหรือไม่?");
      if (!confirmChange) return; // ถ้ากด Cancel ให้ยกเลิกการเปลี่ยน
    }

    // ถ้าไม่มีข้อความ หรือ ยืนยันแล้ว -> เปลี่ยนได้
    const pattern = POEM_PATTERNS[type];
    setForm((f) => ({
      ...f,
      poemType: type,
      poemLines: Array(
        pattern.linesPerStanza * pattern.initialStanzas
      ).fill(""),
    }));
  };

  const handleAddStanza = () => {
    const pattern = POEM_PATTERNS[form.poemType];
    setForm((f) => ({
      ...f,
      poemLines: [
        ...f.poemLines,
        ...Array(pattern.linesPerStanza).fill(""),
      ],
    }));
  };

  const handleRemoveStanza = () => {
    const pattern = POEM_PATTERNS[form.poemType];
    const linesPerStanza = pattern.linesPerStanza;
    const minLines = linesPerStanza * pattern.initialStanzas;
    
    if (form.poemLines.length <= minLines) return;

    const startIndex = form.poemLines.length - linesPerStanza;
    const lastStanzaLines = form.poemLines.slice(startIndex);
    const hasContent = lastStanzaLines.some(line => line && line.trim() !== "");

    if (hasContent) {
      const confirmDelete = window.confirm("บทสุดท้ายมีเนื้อหาอยู่ คุณแน่ใจหรือไม่ที่จะลบ?");
      if (!confirmDelete) return;
    }

    setForm((f) => ({
      ...f,
      poemLines: f.poemLines.slice(0, startIndex),
    }));
  };

  const handlePoemLineChange = (idx, value) => {
    setForm((f) => {
      const lines = [...f.poemLines];
      lines[idx] = value;
      return { ...f, poemLines: lines };
    });
  };

  const handleFile = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleNext = (e) => {
    e.preventDefault();

    // === ตรวจสอบหน้า 1 ===
    if (step === 0) {
      if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.level) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง และเลือกระดับการแข่งขัน");
        return;
      }
      if (form.level !== "ประชาชนทั่วไป" && !form.file) {
        alert("กรุณาอัปโหลดไฟล์ยืนยันรับรองจากสถานศึกษา");
        return;
      }
      setStep(1);
    } 
    // === ตรวจสอบหน้า 2 ===
    else if (step === 1) {
      if (!form.title || form.title.trim() === "") {
        alert("กรุณากรอกหัวข้อกลอน");
        return;
      }

      const pattern = POEM_PATTERNS[form.poemType];
      const linesPerStanza = pattern.linesPerStanza;
      const minLines = linesPerStanza * pattern.initialStanzas;
      
      let currentLines = [...form.poemLines];
      
      // Auto-Clean บทว่างท้ายสุด
      while (currentLines.length > minLines) {
        const lastStanzaStart = currentLines.length - linesPerStanza;
        const lastStanzaLines = currentLines.slice(lastStanzaStart);
        const isLastStanzaEmpty = lastStanzaLines.every(line => !line || line.trim() === "");

        if (isLastStanzaEmpty) {
          currentLines = currentLines.slice(0, lastStanzaStart);
        } else {
          break;
        }
      }

      // เช็คว่าวรรคที่เหลือมีช่องว่างไหม
      const hasEmptyLineInRemaining = currentLines.some(line => !line || line.trim() === "");
      if (hasEmptyLineInRemaining) {
        alert("กรุณากรอกเนื้อหากลอนให้ครบทุกวรรค");
        return;
      }

      setForm(prev => ({ ...prev, poemLines: currentLines }));
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT DATA:", form);
    alert("ส่งใบสมัครสำเร็จ!");
  };

  const steps = ["รายละเอียดผู้ประกวด", "รายละเอียดกลอน", "ยืนยัน"];

  const renderPoemInputs = () => {
    const pattern = POEM_PATTERNS[form.poemType];
    const linesPerStanza = pattern.linesPerStanza;
    const totalStanzas = Math.ceil(form.poemLines.length / linesPerStanza);

    return Array.from({ length: totalStanzas }).map((_, stanzaIdx) => {
      const startIndex = stanzaIdx * linesPerStanza;
      const stanzaLines = form.poemLines.slice(startIndex, startIndex + linesPerStanza);

      return (
        <div key={stanzaIdx} className="stanza-block" style={{ marginBottom: "20px", borderBottom: "1px dashed #eee", paddingBottom: "10px" }}>
          <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "8px" }}>บทที่ {stanzaIdx + 1}</div>
          <div className="poem-grid">
            {stanzaLines.map((line, localIdx) => {
              const globalIdx = startIndex + localIdx;
              
              return (
                <div key={globalIdx} className="poem-line-row">
                  <span className="poem-idx">{globalIdx + 1}.</span>
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => handlePoemLineChange(globalIdx, e.target.value)}
                    className="poem-input"
                    placeholder={`วรรคที่ ${globalIdx + 1}...`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const renderConfirmPoem = () => {
    const pattern = POEM_PATTERNS[form.poemType];
    const linesPerStanza = pattern.linesPerStanza;
    const totalStanzas = Math.ceil(form.poemLines.length / linesPerStanza);

    return Array.from({ length: totalStanzas }).map((_, stanzaIdx) => {
        const startIndex = stanzaIdx * linesPerStanza;
        const stanzaLines = form.poemLines.slice(startIndex, startIndex + linesPerStanza);

        return (
            <div key={stanzaIdx} style={{ marginBottom: 15, paddingBottom: 10, borderBottom: '1px dotted #e0e0e0' }}> 
                <div className="confirm-poem-display" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {stanzaLines.map((line, localIdx) => {
                          return (
                            <div key={localIdx} className={`display-line ${!line ? "empty" : ""}`}>
                                {line}
                            </div>
                          );
                    })}
                </div>
            </div>
        );
    });
  };

  return (
    <>
      <TopNav2 />
      <div className="top-text-container">
        <span className="top-text">
          ✏️ กรอกรายละเอียดกลอนของคุณอย่างประณีต เพื่อส่งเข้าประกวดในหัวข้อ…
        </span>
      </div>

      <div className="layout-container">
        <div className="sidebar">
          <img src="/assets/images/hug.jpg" alt="โปสเตอร์การแข่งขัน" className="poster-img" />
          <div className="contest-title">
            ประกวดเรื่องสั้นฉันทลักษณ์ ครั้งที่ 7<br />
            “ป้องโลกด้วยกอด กอดโลกด้วยกลอน”
          </div>
          <div className="rules-box">
            <div className="rules-title">กติกาสำคัญ</div>
            <ul className="rules-list">
              <li>ส่งกลอนจำนวน <b>12 วรรค</b> (6 บท)</li>
              <li>กลอนต้องเป็น <b>กลอนสุภาพ</b> เท่านั้น</li>
              <li>เนื้อหาต้องสอดคล้องกับหัวข้อประกวด</li>
              <li>ปิดรับสมัคร: <b>31 ธันวาคม 2568</b></li>
            </ul>
            <div className="rules-note">
              *โปรดตรวจสอบความถูกต้องก่อนส่งผลงาน
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2 className="form-header">
            ฟอร์มสมัครเข้าประกวด
          </h2>

          <div className="stepper-container">
            {steps.map((stepLabel, idx, arr) => (
              <React.Fragment key={stepLabel}>
                <div className="step-item">
                  <div className={`step-circle ${idx === step ? "active" : ""}`}>
                    {idx + 1}
                  </div>
                  <span className={`step-label ${idx === step ? "active" : ""}`}>
                    {stepLabel}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div className={`step-line ${idx < step ? "filled" : (idx === step ? "half" : "")}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={step === 2 ? handleSubmit : handleNext} style={{ width: '100%' }}>
            {step === 0 && (
              <>
                <div className="form-group">
                  <div className="form-row">
                    <div className="form-col">
                      <label className="input-label">ชื่อ</label>
                      <input
                        name="firstName"
                        type="text"
                        value={form.firstName}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div className="form-col">
                      <label className="input-label">นามสกุล</label>
                      <input
                        name="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">อีเมล</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">เบอร์โทรศัพท์</label>
                  <input
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">เลือกระดับการแข่งขัน</label>
                  <div className="level-grid">
                    {levels.map(({ label, icon }) => (
                      <LevelRadioCard
                        key={label}
                        label={label}
                        icon={icon}
                        checked={form.level === label}
                        onClick={() => setForm({ ...form, level: label })}
                      />
                    ))}
                  </div>
                </div>

                {form.level && form.level !== "ประชาชนทั่วไป" && (
                  <div className="form-group">
                    <div className="upload-box">
                      <h3 className="upload-title">อัปโหลดไฟล์ยืนยันรับรองจากสถานศึกษา</h3>
                      <p className="upload-desc">เลือกไฟล์ pdf, jpg หรือ png</p>
                      <input
                        name="schoolCertFile"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        id="schoolCertFileInput"
                        onChange={handleFile}
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        className="btn-upload"
                        onClick={() => document.getElementById("schoolCertFileInput").click()}
                      >
                        อัพโหลดไฟล์ยืนยันรับรอง
                      </button>
                      {form.file && (
                        <div className="file-name-display">
                          📄 {form.file.name}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
              </>
            )}

            {step === 1 && (
              <>
                <div className="step2-header">
                  <div className="step2-title">
                    <span style={{ fontSize: 22 }}></span> ขั้นตอนที่ 2: รายละเอียดกลอน
                  </div>
                  <div className="step2-divider" />
                </div>

                <div className="label-with-tooltip">
                  <label className="input-label" style={{ color: '#70136C', marginBottom: 0 }}>หัวข้อกลอน</label>
                  <span className="tooltip-icon" title="หัวข้อกลอนควรสอดคล้องกับธีมประกวด">?</span>
                </div>
                
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  className="input-field input-highlight"
                  placeholder="เช่น กอดโลกด้วยกลอน..."
                  style={{ marginBottom: 18 }}
                />

                <div className="poem-type-wrapper">
                  <label className="poem-type-label">เลือกประเภทกลอน</label>
                  <div className="poem-type-list">
                    {poemTypes.map(pt => (
                      <button
                        key={pt.value}
                        type="button"
                        className={`btn-poem-type ${form.poemType === pt.value ? "selected" : ""}`}
                        onClick={() => handlePoemTypeChange(pt.value)}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <div className="label-with-tooltip">
                    <label className="input-label" style={{ color: '#70136C', marginBottom: 0 }}>เนื้อหากลอน</label>
                    <span className="tooltip-icon" title="กลอนต้องเป็นกลอนสุภาพตามรูปแบบที่เลือก">?</span>
                  </div>
                  
                  <div className="poem-box">
                    {renderPoemInputs()}
                    
                    <div className="poem-action-buttons">
                      <button 
                        type="button" 
                        onClick={handleAddStanza} 
                        className="btn-add-stanza"
                      >
                        เพิ่มอีก 1 บท
                      </button>

                      <button 
                        type="button" 
                        onClick={handleRemoveStanza} 
                        className="btn-remove-stanza"
                        disabled={form.poemLines.length <= POEM_PATTERNS[form.poemType].linesPerStanza * POEM_PATTERNS[form.poemType].initialStanzas}
                      >
                        ลบบทล่าสุด
                      </button>
                    </div>

                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="confirm-box">
                  <div className="confirm-row"><b>ชื่อ:</b> {form.firstName} {form.lastName}</div>
                  <div className="confirm-row"><span className="confirm-icon">📧</span><b>อีเมล:</b> {form.email}</div>
                  <div className="confirm-row"><span className="confirm-icon">📞</span><b>เบอร์โทรศัพท์:</b> {form.phone}</div>
                  <div className="confirm-row"><span className="confirm-icon">🎓</span><b>ระดับ:</b> {form.level}</div>
                  <div className="confirm-row"><b>ประเภทกลอน:</b> {form.poemType}</div>
                  <div className="confirm-row"><b>หัวข้อกลอน:</b> {form.title}</div>
                  <div style={{ marginBottom: 14 }}><b>เนื้อหากลอน:</b>
                    <div className="poem-box" style={{ padding: '20px' }}>
                      {renderConfirmPoem()}
                    </div>
                  </div>
                  
                  {form.level && form.level !== "ประชาชนทั่วไป" && (
                    <div style={{ marginBottom: 10 }}><b>ไฟล์รับรอง:</b> {form.file ? form.file.name : <span style={{color:'red'}}>ยังไม่ได้อัปโหลด</span>}</div>
                  )}
                  
                </div>
              </>
            )}

            <div className="nav-buttons">
              <button type="button" className="btn-back" onClick={handleBack}>
                ย้อนกลับ
              </button>
              {step < 2 && (
                <button type="submit" className="btn-next">
                  ถัดไป
                </button>
              )}
              {step === 2 && (
                <button type="submit" className="btn-submit">
                  ส่งใบสมัคร
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  ); 
}