import React, { useState } from "react";
import TopNav2 from "../components/TopNav2";

// Custom RadioCard for level selection (single choice)
function LevelRadioCard({ label, icon, checked, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        border: checked ? "2px solid #00b8a9" : "2px solid #e5e7eb",
        borderRadius: 14,
        padding: "4px 6px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: checked ? "#e6fffb" : "#fff",
        transition: "0.2s",
        minWidth: 0,
        boxShadow: checked ? "0 2px 8px rgba(0,184,169,0.08)" : "none",
        minHeight: 44,
        height: 44,
        maxHeight: 44,
      }}
    >
      {/* Custom radio button */}
      <span
        style={{
          display: 'inline-block',
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `2px solid ${checked ? '#00b8a9' : '#bdbdbd'}`,
          background: '#fff',
          marginRight: 4,
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {checked && (
          <span
            style={{
              display: 'block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#00b8a9',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </span>
      {/* Icon in a beautiful circle */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: checked ? '#f3d6f2' : '#f5f5f5',
          boxShadow: checked ? '0 2px 8px rgba(112,19,108,0.10)' : 'none',
          fontSize: 18,
          color: checked ? '#70136C' : '#b48bb4',
          marginRight: 2,
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        {icon}
      </span>
      <span style={{ fontSize: "0.98rem", fontWeight: 500, color: checked ? "#00b8a9" : "#222" }}>{label}</span>
      {/* Hidden native input for accessibility */}
      <input
        type="radio"
        checked={checked}
        readOnly
        tabIndex={-1}
        style={{ display: 'none' }}
      />
    </div>
  );
}


export default function SubmitCompetition() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    level: "",
    title: "",
      poemType: "กลอน 8", // เพิ่มประเภทกลอน
      poemLines: Array(8).fill(""), // เริ่มต้น 8 วรรค
    file: null,
  });
  const [step, setStep] = useState(0); // 0: personal, 1: poem, 2: confirm

  const levels = [
    { label: "ประถม", icon: <span role="img" aria-label="ประถม"></span> },
    { label: "มัธยม", icon: <span role="img" aria-label="มัธยม"></span> },
    { label: "มหาวิทยาลัย", icon: <span role="img" aria-label="มหาวิทยาลัย"></span> },
    { label: "ประชาชนทั่วไป", icon: <span role="img" aria-label="ประชาชนทั่วไป"></span> },
  ];
    // เพิ่มประเภทกลอน
    const poemTypes = [
      { label: "กลอน 8", value: "กลอน 8" },
      { label: "กลอนเปล่า", value: "กลอนเปล่า" },
      { label: "กลอนอิสระ", value: "กลอนอิสระ" },
      { label: "กาพย์ยานี 11", value: "กาพย์ยานี 11" },
      { label: "กาพย์ฉบัง 16", value: "กาพย์ฉบัง 16" },
      { label: "โคลงสี่สุภาพ", value: "โคลงสี่สุภาพ" },
    ];


    // จำนวนวรรคที่เพิ่มต่อ 1 ครั้ง (4 วรรค)
    const LINES_PER_ADD = 4;


    // เมื่อเปลี่ยนประเภทกลอน ให้ reset ช่องกรอก (เริ่ม 8 วรรค)
    const handlePoemTypeChange = (type) => {
      setForm(f => ({
        ...f,
        poemType: type,
        poemLines: Array(8).fill("")
      }));
    };

    // เพิ่มอีก 1 ชุด (4 วรรค)
    const handleAddStanza = () => {
      setForm(f => ({
        ...f,
        poemLines: [
          ...f.poemLines,
          ...Array(LINES_PER_ADD).fill("")
        ]
      }));
    };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // For poem lines
  const handlePoemLineChange = (idx, value) => {
    setForm(f => {
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
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Final confirmation step
    console.log("SUBMIT DATA:", form);
    alert("ส่งใบสมัครสำเร็จ!");
    // Optionally reset form or redirect
  };

  // Stepper steps
  const steps = ["รายละเอียดผู้ประกวด", "รายละเอียดกลอน", "ยืนยัน"];
    // ...existing code...

    // ในส่วน render ช่องกรอกกลอน (step === 1)
    // ให้เพิ่มปุ่มเลือกประเภทกลอนด้านบน
    // และ render ช่องกรอกตามประเภท

    // ตัวอย่าง render (ใส่ในส่วนที่แสดงช่องกรอกกลอน)
    // ...
    // <div style={{ marginBottom: 24 }}>
    //   <label style={{ fontWeight: 600, fontSize: '1.08rem', marginBottom: 8, display: 'block' }}>เลือกประเภทกลอน</label>
    //   <div style={{ display: 'flex', gap: 12 }}>
    //     {poemTypes.map(pt => (
    //       <button
    //         key={pt.value}
    //         type="button"
    //         style={{
    //           padding: '8px 18px',
    //           borderRadius: 8,
    //           border: form.poemType === pt.value ? '2px solid #70136C' : '1px solid #e0e0e0',
    //           background: form.poemType === pt.value ? '#f3e6f7' : '#fff',
    //           color: form.poemType === pt.value ? '#70136C' : '#333',
    //           fontWeight: 500,
    //           cursor: 'pointer',
    //           transition: '0.18s',
    //         }}
    //         onClick={() => handlePoemTypeChange(pt.value)}
    //       >
    //         {pt.label}
    //       </button>
    //     ))}
    //   </div>
    // </div>

    // <div style={{ marginTop: 18 }}>
    //   {form.poemLines.map((line, idx) => (
    //     <div key={idx} style={{ marginBottom: 12 }}>
    //       <label style={{ marginRight: 8 }}>บรรทัดที่ {idx + 1}</label>
    //       <input
    //         type="text"
    //         value={line}
    //         onChange={e => handlePoemLineChange(idx, e.target.value)}
    //         style={inputStyle}
    //       />
    //     </div>
    //   ))}
    // </div>
    // ...

  return (
    <>
      <TopNav2 />
      {/* คำโปรยด้านบน */}
      <div style={{ width: '100%', textAlign: 'center', marginTop: 24, marginBottom: -8 }}>
        <span style={{ fontSize: '1.13rem', color: '#70136C', fontWeight: 500, letterSpacing: 0.1 }}>
          ✏️ กรอกรายละเอียดกลอนของคุณอย่างประณีต เพื่อส่งเข้าประกวดในหัวข้อ…
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%', maxWidth: 1400, margin: '28px 0 40px 0', padding: '0 20px' }}>
        {/* Left side: poster and contest name, stick to left */}
        <div style={{ minWidth: 260, maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 12, marginRight: 32 }}>
          <img src="/assets/images/hug.jpg" alt="โปสเตอร์การแข่งขัน" style={{ width: '100%', maxWidth: 260, borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: 18 }} />
          <div style={{ fontSize: '1rem', fontWeight: 500, color: '#222', textAlign: 'left', marginTop: 0, marginLeft: 8, lineHeight: 1.5 }}>
            ประกวดเรื่องสั้นฉันทลักษณ์ ครั้งที่ 7<br />
            “ป้องโลกด้วยกอด กอดโลกด้วยกลอน”
          </div>
          {/* กติกาสั้น ๆ */}
          <div style={{ marginTop: 18, marginLeft: 8, background: '#f8f2f7', borderRadius: 10, padding: '16px 14px', color: '#70136C', fontSize: '1.01rem', boxShadow: '0 1px 6px rgba(112,19,108,0.06)' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>กติกาสำคัญ</div>
            <ul style={{ paddingLeft: 18, margin: 0, color: '#70136C', fontSize: '0.98rem', lineHeight: 1.7 }}>
              <li>ส่งกลอนจำนวน <b>12 วรรค</b> (6 บท)</li>
              <li>กลอนต้องเป็น <b>กลอนสุภาพ</b> เท่านั้น</li>
              <li>เนื้อหาต้องสอดคล้องกับหัวข้อประกวด</li>
              <li>ปิดรับสมัคร: <b>31 ธันวาคม 2568</b></li>
            </ul>
            <div style={{ color: '#a07ca0', fontSize: '0.97rem', marginTop: 8 }}>
              *โปรดตรวจสอบความถูกต้องก่อนส่งผลงาน
            </div>
          </div>
        </div>
        {/* Center: form card, always centered in available space */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #e0e0e0",
            borderRadius: 18,
            boxShadow: "0 4px 24px 0 rgba(60,60,60,0.10)",
            padding: "32px 36px 48px 36px",
            width: 900,
            flex: 1,
            maxWidth: 900,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 style={{ marginBottom: 10, marginTop: -18, fontSize: "2.1rem", fontWeight: 700, color: "#222" }}>
            ฟอร์มสมัครเข้าประกวด
          </h2>

          {/* Stepper */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
              marginBottom: 36,
              marginTop: 0,
              userSelect: "none",
            }}
          >
            {steps.map((stepLabel, idx, arr) => (
              <React.Fragment key={stepLabel}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 110,
                  }}
                >
                  <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: idx === step ? "#70136C" : "#e0e0e0",
                        color: idx === step ? "#fff" : "#888",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: 15,
                        marginBottom: 4,
                        transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {idx + 1}
                  </div>
                    <span style={{ fontSize: 14, color: idx === step ? "#70136C" : "#222", fontWeight: 500 }}>{stepLabel}</span>
                </div>
                {idx < arr.length - 1 && (
                  <div
                    style={{
                        flex: 1,
                        height: 2,
                        background: idx < step ? "#70136C" : "linear-gradient(90deg, #e0e0e0 60%, #70136C 100%)",
                        margin: "0 8px",
                        minWidth: 32,
                        borderRadius: 2,
                        transition: "background 0.2s",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={step === 2 ? handleSubmit : handleNext}>
            {/* ===================== Step 0: ข้อมูลส่วนตัว ===================== */}
            {step === 0 && (
              <>
                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>ชื่อ</label>
                      <input
                        name="firstName"
                        type="text"
                        value={form.firstName}
                        onChange={handleChange}
                        style={inputStyle}
                        
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>นามสกุล</label>
                      <input
                        name="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={handleChange}
                        style={inputStyle}
                        
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>อีเมล</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle}
                    
                  />
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>เบอร์โทรศัพท์</label>
                  <input
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    style={inputStyle}
                    
                  />
                </div>

                {/* ===================== เลือกระดับการแข่งขัน ===================== */}
                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>เลือกระดับการแข่งขัน</label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 16,
                      marginTop: 8,
                    }}
                  >
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

                {/* ===================== อัพโหลดไฟล์ยืนยันรับรอง ===================== */}
                <div style={{ marginBottom: 22 }}>
                  <div
                    style={{
                      border: "2px dashed #cccccc",
                      borderRadius: 12,
                      padding: "40px 20px 32px 20px",
                      textAlign: "center",
                      color: "#555",
                      background: "#fafafa",
                      marginTop: 8,
                    }}
                  >
                    <h3 style={{ marginBottom: 10, fontSize: '2rem', fontWeight: 600, color: '#555', letterSpacing: 0.2 }}>อัปโหลดไฟล์ยืนยันรับรองจากสถานศึกษา</h3>
                    <p style={{ marginBottom: 20, color: "#888", fontSize: '1.08rem' }}>เลือกไฟล์ pdf, jpg หรือ png</p>
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
                      onClick={() => document.getElementById("schoolCertFileInput").click()}
                      style={{
                        padding: "8px 20px",
                        borderRadius: 8,
                        background: "#70136C",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.98rem",
                        boxShadow: "0 2px 8px rgba(112,19,108,0.08)",
                        transition: "background 0.18s, box-shadow 0.18s",
                        minWidth: 120,
                        marginTop: 8,
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#4b0c47'}
                      onMouseOut={e => e.currentTarget.style.background = '#70136C'}
                    >
                      อัพโหลดไฟล์ยืนยันรับรอง
                    </button>
                    {form.file && (
                      <div style={{ marginTop: 20, fontSize: "0.97rem", color: "#70136C", wordBreak: "break-all" }}>
                        📄 {form.file.name}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ===================== Step 1: รายละเอียดกลอน ===================== */}
            {step === 1 && (
              <>
                {/* หัวข้อย่อยและคำอธิบาย */}
                <div style={{ marginBottom: 18, width: '100%', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.18rem', fontWeight: 700, color: '#70136C', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}></span> ขั้นตอนที่ 2: รายละเอียดกลอน
                  </div>
                  
                  <div style={{ width: 60, height: 3, background: '#f3d6f2', borderRadius: 2, margin: '12px auto 0 auto' }} />
                </div>
                <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ ...labelStyle, fontWeight: 700, color: '#70136C', marginBottom: 0 }}>หัวข้อกลอน</label>
                  <span
                    title="หัวข้อกลอนควรสอดคล้องกับธีมประกวด"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#f3d6f2',
                      color: '#70136C',
                      fontWeight: 700,
                      fontSize: 16,
                      cursor: 'help',
                      marginTop: 2,
                      boxShadow: '0 1px 4px rgba(112,19,108,0.08)',
                      transition: 'background 0.2s, color 0.2s',
                      border: '1.5px solid #e0c7e7',
                    }}
                  >
                    ?
                  </span>
                </div>
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  style={{ ...inputStyle, marginBottom: 18, border: '1.5px solid #e0c7e7', background: '#fcf7fd' }}
                  placeholder="เช่น กอดโลกด้วยกลอน..."
                />
                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <label style={{ ...labelStyle, fontWeight: 700, color: '#70136C', marginBottom: 0 }}>เนื้อหากลอน</label>
                    <span
                      title="กลอนต้องเป็นกลอนสุภาพ 12 วรรค (6 บท)"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: '#f3d6f2',
                        color: '#70136C',
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: 'help',
                        marginTop: 2,
                        boxShadow: '0 1px 4px rgba(112,19,108,0.08)',
                        transition: 'background 0.2s, color 0.2s',
                        border: '1.5px solid #e0c7e7',
                      }}
                    >
                      ?
                    </span>
                  </div>
                  <div
                    style={{
                      border: '2px solid #e0c7e7',
                      borderRadius: 6,
                      padding: 24,
                      background: '#fcf7fd',
                      marginTop: 8,
                      marginBottom: 0,
                      minHeight: 120,
                      maxWidth: 900,
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '14px 16px',
                        justifyItems: 'stretch',
                        alignItems: 'center',
                        minHeight: 40,
                      }}
                    >
                        {form.poemLines.map((line, idx) => (
                          <div key={idx} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: '#b48bb4', fontWeight: 600, minWidth: 22, textAlign: 'right', fontSize: 15 }}>{idx + 1}.</span>
                            <input
                              type="text"
                              value={line}
                              onChange={e => handlePoemLineChange(idx, e.target.value)}
                              style={{
                                flex: 1,
                                width: '100%',
                                minWidth: '260px',
                                border: 'none',
                                borderBottom: '1.5px solid #bdbdbd',
                                outline: 'none',
                                fontSize: '1.05rem',
                                background: 'transparent',
                                textAlign: 'center',
                                padding: '8px 6px',
                                marginBottom: 0,
                                letterSpacing: 0.01,
                              }}
                              placeholder={`กลอนวรรคที่ ${idx + 1} ...`}
                            />
                          </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                      <button
                        type="button"
                        onClick={handleAddStanza}
                        style={{
                          padding: '8px 22px',
                          borderRadius: 999,
                          border: '2px dashed #70136C',
                          background: '#fff',
                          color: '#70136C',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '1.05rem',
                        }}
                      >
                         เพิ่มอีก 1 บท
                      </button>
                    </div>
                  </div>
                </div>
                {/* ===================== ปุ่มเลือกประเภทกลอน ===================== */}
                <div style={{ marginBottom: 24, width: '100%' }}>
      <label style={{ fontWeight: 600, fontSize: '1.08rem', marginBottom: 8, display: 'block', color: '#70136C' }}>เลือกประเภทกลอน</label>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {poemTypes.map(pt => (
          <button
            key={pt.value}
            type="button"
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: form.poemType === pt.value ? '2px solid #70136C' : '1px solid #e0e0e0',
              background: form.poemType === pt.value ? '#f3e6f7' : '#fff',
              color: form.poemType === pt.value ? '#70136C' : '#333',
              fontWeight: 500,
              cursor: 'pointer',
              transition: '0.18s',
              minWidth: 120,
              fontSize: '1.05rem',
              boxShadow: form.poemType === pt.value ? '0 2px 8px rgba(112,19,108,0.10)' : 'none',
            }}
            onClick={() => handlePoemTypeChange(pt.value)}
          >
            {pt.label}
          </button>
        ))}
      </div>
    </div>
              </>
            )}

            {/* ===================== Step 2: ยืนยัน ===================== */}
            {step === 2 && (
              <>
                <div style={{ marginBottom: 22, fontSize: '1.1rem', color: '#222' }}>
                  <div style={{ marginBottom: 12 }}><b>ชื่อ:</b> {form.firstName} {form.lastName}</div>
                  <div style={{ marginBottom: 12 }}><span style={{fontSize:'1.08em',marginRight:6}}>📧</span><b>อีเมล:</b> {form.email}</div>
                  <div style={{ marginBottom: 12 }}><span style={{fontSize:'1.08em',marginRight:6}}>📞</span><b>เบอร์โทรศัพท์:</b> {form.phone}</div>
                  <div style={{ marginBottom: 12 }}><span style={{fontSize:'1.08em',marginRight:6}}>🎓</span><b>ระดับ:</b> {form.level}</div>
                  <div style={{ marginBottom: 12 }}><b>หัวข้อกลอน:</b> {form.title}</div>
                  <div style={{ marginBottom: 14 }}><b>เนื้อหากลอน:</b>
                    <div style={{
                      border: '2px solid #e0c7e7',
                      borderRadius: 6,
                      padding: 24,
                      background: '#fcf7fd',
                      marginTop: 8,
                      marginBottom: 0,
                      maxWidth: 900,
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '14px 16px',
                      justifyItems: 'stretch',
                      alignItems: 'center',
                    }}>
                      {form.poemLines.map((line, idx) => (
                        <div key={idx} style={{
                          width: '100%',
                          minWidth: '260px',
                          borderBottom: '1.5px solid #bdbdbd',
                          minHeight: 32,
                          fontSize: '1.05rem',
                          textAlign: 'center',
                          padding: '8px 6px',
                          marginBottom: 0,
                          color: line ? '#222' : '#bbb',
                          letterSpacing: 0.01,
                          background: 'transparent',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}><b>ไฟล์:</b> {form.file ? form.file.name : '-'}</div>
                </div>
              </>
            )}

            {/* ===================== Navigation Buttons ===================== */}
            <div style={{ textAlign: "center", marginTop: 40, display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                type="button"
                style={{
                  background: "#e0e0e0",
                  padding: "8px 28px",
                  borderRadius: 999,
                  color: "#333",
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  letterSpacing: 0.5,
                  transition: "background 0.18s, box-shadow 0.18s",
                  minWidth: 100,
                }}
                onClick={handleBack}
              >
                ย้อนกลับ
              </button>
              {step < 2 && (
                <button
                  type="submit"
                  style={{
                    background: "#70136C",
                    padding: "8px 28px",
                    borderRadius: 999,
                    color: "#fff",
                    fontSize: "1rem",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    boxShadow: "0 2px 8px rgba(112,19,108,0.08)",
                    letterSpacing: 0.5,
                    transition: "background 0.18s, box-shadow 0.18s",
                    minWidth: 100,
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#4b0c47'}
                  onMouseOut={e => e.currentTarget.style.background = '#70136C'}
                >
                  ถัดไป
                </button>
              )}
              {step === 2 && (
                <button
                  type="submit"
                  style={{
                    background: "#70136C",
                    padding: "8px 28px",
                    borderRadius: 999,
                    color: "#fff",
                    fontSize: "1rem",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    boxShadow: "0 2px 8px rgba(112,19,108,0.08)",
                    letterSpacing: 0.5,
                    transition: "background 0.18s, box-shadow 0.18s",
                    minWidth: 100,
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#4b0c47'}
                  onMouseOut={e => e.currentTarget.style.background = '#70136C'}
                >
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

const labelStyle = {
  display: "block",
  fontWeight: 600,
  fontSize: "1.1rem",
  marginBottom: 6,
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "7px 10px",
  fontSize: "1rem",
  borderRadius: 7,
  border: "1px solid #d2d2d2",
  outline: "none",
  transition: "border 0.2s",
  background: "#fafbfc",
};
