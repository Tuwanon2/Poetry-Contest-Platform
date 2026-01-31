import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TopNav from "../components/TopNav";
import "../styles/SubmitCompetition.css";
import { FaChalkboardTeacher, FaUserGraduate, FaUniversity, FaUsers } from "react-icons/fa";
import API_BASE_URL from '../config/api';

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
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultType = "กลอนแปด";
  const defaultPattern = POEM_PATTERNS[defaultType];

  // Mockup poem for default
  const mockupPoem = [
    "แสงอรุณอุ่นฟ้าพาใจฝัน",
    "ปลุกชีวันให้ตื่นจากคืนเหงา",
    "เสียงลมแผ่วแว่วผ่านลานบ้านเรา",
    "ดั่งบอกเล่าความหวังยังคงมี",
    "แม้เส้นทางขวากหนามตามขวางกั้น",
    "อย่าหวั่นไหวให้ใจนั้นหมองศรี",
    "ก้าวด้วยศรัทธาพาฝันสู่วันดี",
    "เพียรวันนี้พรุ่งนี้ย่อมงดงาม"
  ];

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    level: "",
    title: "",
    poemType: defaultType,
    poemLines: mockupPoem,
    file: null,
  });

  // Autofill user info from localStorage/sessionStorage
  useEffect(() => {
    let userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        let firstName = '';
        let lastName = '';
        // 1. Try full_name
        if (user.full_name) {
          const nameParts = user.full_name.trim().split(' ');
          if (nameParts.length === 1) {
            firstName = nameParts[0];
            lastName = '';
          } else if (nameParts.length > 1) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          }
        }
        // 2. Fallback to firstName/lastName
        if ((!firstName || !lastName) && (user.firstName || user.firstname)) {
          firstName = user.firstName || user.firstname;
        }
        if ((!firstName || !lastName) && (user.lastName || user.lastname)) {
          lastName = user.lastName || user.lastname;
        }
        // 3. Fallback to name
        if ((!firstName || !lastName) && user.name) {
          const nameParts = user.name.trim().split(' ');
          if (nameParts.length === 1) {
            firstName = nameParts[0];
            lastName = '';
          } else if (nameParts.length > 1) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          }
        }
        setForm(prev => ({
          ...prev,
          firstName,
          lastName,
          email: user.email || '',
        }));
      } catch (err) {
        // ignore
      }
    }
  }, []);

  const [step, setStep] = useState(0);

  // Fetch contest data
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests/${id}`);
        console.log('🔍 Contest data for submission:', response.data);
        setContest(response.data);
        
        // ตั้งค่า default ตาม contest
        const levels = response.data.levels || [];
        if (levels.length === 1) {
          // ถ้ามีระดับเดียว ล็อคเลย
          const singleLevel = levels[0].level_name || levels[0].name;
          const topicName = levels[0].topic_enabled && levels[0].topic_name ? levels[0].topic_name : '';
          setForm(prev => ({ ...prev, level: singleLevel, title: topicName }));
        }
        
        // ตั้งค่า poem type ตาม level แรก
        if (levels.length > 0 && levels[0].poem_types && levels[0].poem_types.length > 0) {
          const firstType = levels[0].poem_types[0];
          const pattern = POEM_PATTERNS[firstType] || defaultPattern;
          setForm(prev => ({
            ...prev,
            poemType: firstType,
            poemLines: Array(pattern.linesPerStanza * pattern.initialStanzas).fill("")
          }));
        }
        
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching contest:', err);
        setError('ไม่สามารถโหลดข้อมูลการประกวดได้');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContest();
    }
  }, [id]);

  // อัพเดต title เมื่อ level เปลี่ยน (สำหรับ topic ที่ล็อค)
  useEffect(() => {
    if (!contest || !contest.levels || !form.level) return;
    
    const selectedLevel = contest.levels.find(l => 
      (l.level_name || l.name) === form.level
    );
    
    if (selectedLevel && selectedLevel.topic_enabled && selectedLevel.topic_name) {
      // ถ้า level นี้ล็อคหัวข้อ ตั้งค่าหัวข้อตาม level
      setForm(prev => ({ ...prev, title: selectedLevel.topic_name }));
    } else if (form.title && contest.levels.some(l => l.topic_name === form.title)) {
      // ถ้าเปลี่ยนไป level ที่ไม่ล็อคหัวข้อ และ title เดิมเป็นหัวข้อที่ล็อคของ level อื่น ให้ลบออก
      setForm(prev => ({ ...prev, title: '' }));
    }
  }, [form.level, contest]);

  // Dynamic levels และ poem types ตาม contest
  const getAvailableLevels = () => {
    if (!contest || !contest.levels) return [];
    
    const levelIcons = {
      "ประถม": <span role="img" aria-label="ประถม">🎒</span>,
      "มัธยม": <span role="img" aria-label="มัธยม">🏫</span>,
      "มหาวิทยาลัย": <span role="img" aria-label="มหาวิทยาลัย">🎓</span>,
      "ประชาชนทั่วไป": <span role="img" aria-label="ประชาชนทั่วไป">🏢</span>
    };
    
    return contest.levels.map(level => {
      const levelName = level.level_name || level.name;
      return {
        label: levelName,
        icon: levelIcons[levelName] || <span>📝</span>
      };
    });
  };

  const getAvailablePoemTypes = () => {
    if (!contest || !contest.levels || !form.level) return [];
    
    // หา level ที่เลือก
    const selectedLevel = contest.levels.find(l => 
      (l.level_name || l.name) === form.level
    );
    
    if (!selectedLevel || !selectedLevel.poem_types) return [];
    
    return selectedLevel.poem_types.map(type => ({
      label: type,
      value: type
    }));
  };
  
  const isTopicLocked = () => {
    if (!contest || !contest.levels) return false;
    const selectedLevel = contest.levels.find(l => 
      (l.level_name || l.name) === form.level
    );
    return selectedLevel?.topic_enabled && selectedLevel?.topic_name;
  };

  const levels = getAvailableLevels();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePoemTypeChange = (type) => {
    if (type === form.poemType) return;

    const hasContent = form.poemLines.some(line => line && line.trim() !== "");

    if (hasContent) {
      const confirmChange = window.confirm("หากเปลี่ยนประเภทกลอน เนื้อหาที่กรอกไว้จะถูกลบทั้งหมด คุณแน่ใจหรือไม่?");
      if (!confirmChange) return;
    }

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
    else if (step === 1) {
      // เช็คหัวข้อ (ถ้าไม่ล็อคต้องกรอก)
      const topicLocked = isTopicLocked();
      if (!topicLocked && (!form.title || form.title.trim() === "")) {
        alert("กรุณากรอกหัวข้อกลอน");
        return;
      }

      const pattern = POEM_PATTERNS[form.poemType];
      const linesPerStanza = pattern.linesPerStanza;
      const minLines = linesPerStanza * pattern.initialStanzas;
      
      let currentLines = [...form.poemLines];
      
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

      const hasEmptyLineInRemaining = currentLines.some(line => !line || line.trim() === "");
      if (hasEmptyLineInRemaining) {
        alert("กรุณากรอกเนื้อหากลอนให้ครบทุกวรรค");
        return;
      }

      setForm(prev => ({ ...prev, poemLines: currentLines }));
      setStep(2);
    }
  };

  // 3. แก้ไขฟังก์ชัน handleBack
  const handleBack = () => {
    if (step === 0) {
      // หากอยู่หน้าแรก ให้ย้อนกลับไปหน้า contest-detail
      navigate("/contest-detail");
    } else {
      // หากอยู่หน้าอื่น ให้ย้อนกลับไปขั้นตอนก่อนหน้า
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // แปลง poemLines เป็นรูปแบบ & และ %
      const pattern = POEM_PATTERNS[form.poemType];
      const linesPerStanza = pattern.linesPerStanza;
      let formattedPoem = '';
      
      for (let i = 0; i < form.poemLines.length; i++) {
        formattedPoem += form.poemLines[i];
        
        // ถ้าไม่ใช่บรรทัดสุดท้าย
        if (i < form.poemLines.length - 1) {
          // ถ้าเป็นบรรทัดสุดท้ายของบท ใส่ %
          if ((i + 1) % linesPerStanza === 0) {
            formattedPoem += '%';
          } else {
            // ถ้าไม่ใช่ ใส่ &
            formattedPoem += '&';
          }
        }
      }
      
      // ดึง user_id จาก localStorage/sessionStorage
      let userId = null;
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id || user.ID || user.user_id;
        } catch (err) {
          console.error('Failed to parse user:', err);
        }
      }
      
      const submissionData = {
        competition_id: parseInt(id),
        user_id: userId,
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        level_name: form.level,
        title: form.title,
        poem_type: form.poemType,
        content: formattedPoem,
        document: form.file ? await uploadFile(form.file) : null
      };
      
      console.log('📤 Submitting:', submissionData);
      
      const response = await axios.post(`${API_BASE_URL}/submissions`, submissionData);
      console.log('✅ Submission successful:', response.data);
      
      alert("ส่งใบสมัครสำเร็จ!");
      navigate('/my-works');
    } catch (err) {
      console.error('❌ Submission error:', err);
      alert("เกิดข้อผิดพลาดในการส่งใบสมัคร: " + (err.response?.data?.error || err.message));
    }
  };
  
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/upload`, formData);
    return response.data.url;
  };

  const steps = ["รายละเอียดผู้ประกวด", "รายละเอียดกลอน", "ยืนยัน"];

  // จัดการ poster URL
  let posterUrl = '/assets/images/hug.jpg';
  if (contest && (contest.poster_url || contest.PosterURL)) {
    const posterPath = contest.poster_url || contest.PosterURL;
    if (posterPath.startsWith('http')) {
      posterUrl = posterPath;
    } else {
      posterUrl = `${API_BASE_URL.replace('/api/v1','')}${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

  if (loading) {
    return (
      <>
        <TopNav />
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <p style={{ color: '#00796b', fontSize: '1.2rem' }}>กำลังโหลดข้อมูล...</p>
        </div>
      </>
    );
  }

  if (error || !contest) {
    return (
      <>
        <TopNav />
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <p style={{ color: '#d32f2f', fontSize: '1.2rem' }}>{error || 'ไม่พบข้อมูลการประกวด'}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <div className="top-text-container">
        <span className="top-text">
          ✏️ กรอกรายละเอียดกลอนของคุณอย่างประณีต เพื่อส่งเข้าประกวด {contest.title}
        </span>
      </div>

      <div className="layout-container">
        {/* แก้ไขตรงนี้: เพิ่ม style={{ borderRight: 'none' }} เพื่อลบเส้นขอบ */}
        <div className="sidebar" style={{ borderRight: 'none' }}>
          <img 
            src={posterUrl} 
            alt="โปสเตอร์การแข่งขัน" 
            className="poster-img"
            onError={(e) => { 
              if (e.target.src !== `${window.location.origin}/assets/images/hug.jpg`) {
                e.target.src = '/assets/images/hug.jpg'; 
              }
            }}
          />
          <div className="contest-title">
            {contest.title || contest.Title}
          </div>
          {contest.levels && contest.levels.length > 0 && contest.levels.some(l => l.rules) && (
            <div className="rules-box">
              <div className="rules-title">กติกาสำคัญ</div>
              <div style={{ padding: '10px', fontSize: '13px', color: '#333', whiteSpace: 'pre-wrap' }}>
                {contest.levels.map((level, idx) => (
                  level.rules && (
                    <div key={idx} style={{ marginBottom: 10 }}>
                      {contest.levels.length > 1 && (
                        <div style={{ fontWeight: 600, marginBottom: 5 }}>
                          {level.level_name || level.name}:
                        </div>
                      )}
                      {level.rules}
                    </div>
                  )
                ))}
              </div>
              {contest.end_date && (
                <div className="rules-note">
                  ปิดรับสมัคร: {formatDate(contest.end_date)}
                </div>
              )}
            </div>
          )}
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
                        className="input-field"
                        readOnly
                        style={{ background: '#f5f5f5', color: '#888' }}
                      />
                    </div>
                    <div className="form-col">
                      <label className="input-label">นามสกุล</label>
                      <input
                        name="lastName"
                        type="text"
                        value={form.lastName}
                        className="input-field"
                        readOnly
                        style={{ background: '#f5f5f5', color: '#888' }}
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
                    className="input-field"
                    readOnly
                    style={{ background: '#f5f5f5', color: '#888' }}
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
                  {levels.length === 1 ? (
                    <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: 8, marginBottom: 10 }}>
                      <b>ระดับ:</b> {levels[0].label} 
                    </div>
                  ) : (
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
                  )}
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
                </div>
                
                {isTopicLocked() ? (
                  <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: 8, marginBottom: 18 }}>
                    <b>หัวข้อ:</b> {form.title} 
                  </div>
                ) : (
                  <input
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    className="input-field input-highlight"
                    placeholder="เช่น กอดโลกด้วยกลอน..."
                    style={{ marginBottom: 18 }}
                  />
                )}

                {(() => {
                  const poemTypes = getAvailablePoemTypes();
                  
                  if (poemTypes.length === 1) {
                    return (
                      <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: 8, marginBottom: 18 }}>
                        <b>ประเภท:</b> {poemTypes[0].label} (ล็อคตามการประกวด)
                      </div>
                    );
                  }
                  
                  return (
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
                  );
                })()}

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
                <div className="confirm-box minimal-confirm-box">
                  <div className="minimal-confirm-title">ตรวจสอบข้อมูลก่อนยืนยัน</div>
                  <div className="minimal-confirm-list">
                    <div className="minimal-confirm-row"><span className="minimal-label">ชื่อ-นามสกุล</span><span>{form.firstName} {form.lastName}</span></div>
                    <div className="minimal-confirm-row"><span className="minimal-label">อีเมล</span><span>{form.email}</span></div>
                    <div className="minimal-confirm-row"><span className="minimal-label">เบอร์โทรศัพท์</span><span>{form.phone}</span></div>
                    <div className="minimal-confirm-row"><span className="minimal-label">ระดับ</span><span>{form.level}</span></div>
                    <div className="minimal-confirm-row"><span className="minimal-label">ประเภทกลอน</span><span>{form.poemType}</span></div>
                    <div className="minimal-confirm-row"><span className="minimal-label">หัวข้อกลอน</span><span>{form.title}</span></div>
                    {form.level && form.level !== "ประชาชนทั่วไป" && (
                      <div className="minimal-confirm-row">
                        <span className="minimal-label">ไฟล์รับรอง</span>
                        <span>
                          {form.file ? (
                            <button
                              type="button"
                              className="view-cert-btn"
                              onClick={() => {
                                const url = URL.createObjectURL(form.file);
                                window.open(url, '_blank');
                              }}
                            >ดูไฟล์รับรอง</button>
                          ) : (
                            <span style={{color:'red'}}>ยังไม่ได้อัปโหลด</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="minimal-confirm-section">
                    <div className="minimal-label" style={{marginBottom:8}}>เนื้อหากลอน</div>
                    <div className="poem-box" style={{ padding: '20px', background: '#fafbfc', border: '1.5px solid #e0e0e0', borderRadius: 8 }}>
                      {renderConfirmPoem()}
                    </div>
                  </div>
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