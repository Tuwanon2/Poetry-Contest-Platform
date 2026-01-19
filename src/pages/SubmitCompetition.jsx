import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TopNav2 from "../components/TopNav2"; 
// import "./SubmitCompetition.css"; // ไม่ใช้ CSS ไฟล์แยก
import { FaChalkboardTeacher, FaUserGraduate, FaUniversity, FaUsers } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:8080/api/v1';

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
    <div onClick={onClick} className={`level-card ${checked ? "selected" : ""}`} style={{
      cursor: 'pointer',
      border: checked ? '2px solid #70136c' : '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: checked ? '#fdf2ff' : '#fff',
      transition: 'all 0.2s'
    }}>
      <span className="radio-outer" style={{
        height: '20px', width: '20px', borderRadius: '50%', border: '2px solid #ccc',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {checked && <span className="radio-inner" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#70136c' }} />}
      </span>
      <span className="icon-circle" style={{ fontSize: '1.2rem' }}>{icon}</span>
      <span className="level-label" style={{ fontWeight: checked ? 'bold' : 'normal' }}>{label}</span>
    </div>
  );
}

export default function SubmitCompetition() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- เพิ่มส่วนนี้เพื่อแก้ปัญหา isMobile undefined ---
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // ------------------------------------------------

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

  // อัพเดต title เมื่อ level เปลี่ยน
  useEffect(() => {
    if (!contest || !contest.levels || !form.level) return;
    
    const selectedLevel = contest.levels.find(l => 
      (l.level_name || l.name) === form.level
    );
    
    if (selectedLevel && selectedLevel.topic_enabled && selectedLevel.topic_name) {
      setForm(prev => ({ ...prev, title: selectedLevel.topic_name }));
    } else if (form.title && contest.levels.some(l => l.topic_name === form.title)) {
      setForm(prev => ({ ...prev, title: '' }));
    }
  }, [form.level, contest]);

  // Helper functions
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

  const handleBack = () => {
    if (step === 0) {
      navigate(`/contest-detail/${id}`);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pattern = POEM_PATTERNS[form.poemType];
      const linesPerStanza = pattern.linesPerStanza;
      let formattedPoem = '';
      
      for (let i = 0; i < form.poemLines.length; i++) {
        formattedPoem += form.poemLines[i];
        if (i < form.poemLines.length - 1) {
          if ((i + 1) % linesPerStanza === 0) {
            formattedPoem += '%';
          } else {
            formattedPoem += '&';
          }
        }
      }
      
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
      navigate(`/contest-detail/${id}`);
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

  let posterUrl = '/assets/images/hug.jpg';
  if (contest && (contest.poster_url || contest.PosterURL)) {
    const posterPath = contest.poster_url || contest.PosterURL;
    if (posterPath.startsWith('http')) {
      posterUrl = posterPath;
    } else {
      posterUrl = `http://localhost:8080${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
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
          <div className="poem-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '15px' }}>
            {stanzaLines.map((line, localIdx) => {
              const globalIdx = startIndex + localIdx;
              return (
                <div key={globalIdx} className="poem-line-row">
                  <span className="poem-idx" style={{ marginRight: '5px', color: '#888', fontSize: '0.8rem' }}>{globalIdx + 1}.</span>
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => handlePoemLineChange(globalIdx, e.target.value)}
                    className="poem-input"
                    placeholder={`วรรคที่ ${globalIdx + 1}...`}
                    style={{ 
                        width: '90%', padding: '8px', borderRadius: '4px', 
                        border: '1px solid #ddd', backgroundColor: '#fdfaff'
                    }}
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
                <div className="confirm-poem-display" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
                    {stanzaLines.map((line, localIdx) => {
                          return (
                            <div key={localIdx} className={`display-line ${!line ? "empty" : ""}`} style={{ textAlign: 'center', padding: '5px' }}>
                                {line || <span style={{color:'#ccc'}}>-</span>}
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
        <TopNav2 />
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <p style={{ color: '#00796b', fontSize: '1.2rem' }}>กำลังโหลดข้อมูล...</p>
        </div>
      </>
    );
  }

  if (error || !contest) {
    return (
      <>
        <TopNav2 />
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <p style={{ color: '#d32f2f', fontSize: '1.2rem' }}>{error || 'ไม่พบข้อมูลการประกวด'}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav2 />
      
      {/* ใช้ isMobile เพื่อปรับ Flex Direction */}
      <div className="layout-container" style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: '30px', 
          padding: '40px', 
          maxWidth: '1200px', 
          margin: '0 auto', 
          paddingTop: '30px' 
      }}>
        
        {/* Sidebar ด้านซ้าย */}
        <div className="sidebar" style={{ flex: '1', maxWidth: isMobile ? '100%' : '350px', width: '100%' }}>
          <img 
            src={posterUrl} 
            alt="โปสเตอร์การแข่งขัน" 
            className="poster-img"
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '20px' }}
            onError={(e) => { 
              if (e.target.src !== `${window.location.origin}/assets/images/hug.jpg`) {
                e.target.src = '/assets/images/hug.jpg'; 
              }
            }}
          />
          <div className="contest-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#70136c', marginBottom: '15px' }}>
            {contest.title || contest.Title}
          </div>
          
          <div className="rules-box" style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
            {contest.description && (
                <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>รายละเอียด</div>
                    <div style={{ fontSize: '0.9rem', color: '#555', whiteSpace: 'pre-wrap' }}>
                        {contest.description}
                    </div>
                </div>
            )}
            
            {contest.levels && contest.levels.length > 0 && contest.levels.some(l => l.rules) && (
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>กติกาสำคัญ</div>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
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
                  <div style={{ marginTop: '10px', color: '#d32f2f', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    ปิดรับสมัคร: {formatDate(contest.end_date)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Form ด้านขวา */}
        <div className="form-card" style={{ flex: '2', backgroundColor: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%' }}>
          <h2 className="form-header" style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
            ฟอร์มสมัครเข้าประกวด
          </h2>

          {/* Stepper */}
          <div className="stepper-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px' }}>
            {steps.map((stepLabel, idx, arr) => (
              <React.Fragment key={stepLabel}>
                <div className="step-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <div style={{ 
                    width: '35px', height: '35px', borderRadius: '50%', 
                    backgroundColor: idx <= step ? '#70136c' : '#e0e0e0',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', marginBottom: '5px'
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: idx === step ? '#70136c' : '#999', fontWeight: idx === step ? 'bold' : 'normal' }}>
                    {stepLabel}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div style={{ height: '2px', width: '60px', backgroundColor: idx < step ? '#70136c' : '#e0e0e0', margin: '0 10px', position: 'relative', top: '-10px' }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={step === 2 ? handleSubmit : handleNext} style={{ width: '100%' }}>
            {step === 0 && (
              <>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>ชื่อ</label>
                      <input
                        name="firstName"
                        type="text"
                        value={form.firstName}
                        onChange={handleChange}
                        className="input-field"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>นามสกุล</label>
                      <input
                        name="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={handleChange}
                        className="input-field"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>อีเมล</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>เบอร์โทรศัพท์</label>
                  <input
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    className="input-field"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500 }}>เลือกระดับการแข่งขัน</label>
                  {levels.length === 1 ? (
                    <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: 8 }}>
                      <b>ระดับ:</b> {levels[0].label} 
                    </div>
                  ) : (
                    <div className="level-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
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
                  <div className="form-group" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ccc', textAlign: 'center' }}>
                    <div className="upload-box">
                      <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>อัปโหลดไฟล์ยืนยันรับรองจากสถานศึกษา</h3>
                      <p style={{ fontSize: '0.85rem', color: '#666' }}>เลือกไฟล์ pdf, jpg หรือ png</p>
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
                            padding: '8px 20px', backgroundColor: '#70136c', color: 'white', 
                            border: 'none', borderRadius: '20px', cursor: 'pointer', marginTop: '10px'
                        }}
                      >
                        อัพโหลดไฟล์
                      </button>
                      {form.file && (
                        <div style={{ marginTop: '10px', color: '#28a745', fontWeight: 500 }}>
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
                <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                   <h3 style={{ fontSize: '1.2rem', color: '#333' }}>ขั้นตอนที่ 2: รายละเอียดกลอน</h3>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>หัวข้อกลอน</label>
                    {isTopicLocked() ? (
                    <div style={{ padding: '12px', background: '#f0f0f0', borderRadius: 8, color: '#555' }}>
                        {form.title} <span style={{fontSize:'0.8rem', color:'#888'}}>(กำหนดโดยผู้จัด)</span>
                    </div>
                    ) : (
                    <input
                        name="title"
                        type="text"
                        value={form.title}
                        onChange={handleChange}
                        className="input-field input-highlight"
                        placeholder="เช่น กอดโลกด้วยกลอน..."
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #e0cce3' }}
                    />
                    )}
                </div>

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
                    <div className="poem-type-list" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      {poemTypes.map(pt => (
                        <button
                          key={pt.value}
                          type="button"
                          onClick={() => handlePoemTypeChange(pt.value)}
                          style={{
                              padding: '8px 16px',
                              borderRadius: '20px',
                              border: form.poemType === pt.value ? '2px solid #70136c' : '1px solid #ccc',
                              backgroundColor: form.poemType === pt.value ? '#70136c' : '#fff',
                              color: form.poemType === pt.value ? '#fff' : '#333',
                              cursor: 'pointer'
                          }}
                        >
                          {pt.label}
                        </button>
                      ))}
                    </div>
                  );
                })()}

                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ color: '#70136C', fontWeight: 'bold', margin: 0 }}>เนื้อหากลอน</label>
                    <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#999' }}>(กรอกตามผังฉันทลักษณ์)</span>
                  </div>
                  
                  <div className="poem-box" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                    {renderPoemInputs()}
                    
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button 
                        type="button" 
                        onClick={handleAddStanza} 
                        style={{ padding: '8px 15px', backgroundColor: '#e9ecef', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#333' }}
                      >
                        + เพิ่มอีก 1 บท
                      </button>

                      <button 
                        type="button" 
                        onClick={handleRemoveStanza} 
                        disabled={form.poemLines.length <= POEM_PATTERNS[form.poemType].linesPerStanza * POEM_PATTERNS[form.poemType].initialStanzas}
                        style={{ padding: '8px 15px', backgroundColor: '#fff', border: '1px solid #dc3545', borderRadius: '4px', cursor: 'pointer', color: '#dc3545', opacity: form.poemLines.length <= POEM_PATTERNS[form.poemType].linesPerStanza * POEM_PATTERNS[form.poemType].initialStanzas ? 0.5 : 1 }}
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
                <div className="confirm-box" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                  <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>ยืนยันข้อมูล</h3>
                  
                  <div style={{ display: 'grid', gap: '10px', fontSize: '1rem' }}>
                    <div><b>ชื่อ:</b> {form.firstName} {form.lastName}</div>
                    <div><b>อีเมล:</b> {form.email}</div>
                    <div><b>เบอร์โทรศัพท์:</b> {form.phone}</div>
                    <div><b>ระดับ:</b> {form.level}</div>
                    <div><b>ประเภทกลอน:</b> {form.poemType}</div>
                    <div><b>หัวข้อกลอน:</b> {form.title}</div>
                  </div>
                  
                  <div style={{ marginTop: '20px' }}><b>เนื้อหากลอน:</b>
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee', marginTop: '10px' }}>
                        {renderConfirmPoem()}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ปุ่ม Navigation (Back / Next / Submit) */}
            <div className="nav-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
                <button
                    type="button"
                    onClick={handleBack}
                    style={{
                        padding: '10px 30px',
                        borderRadius: '30px',
                        border: 'none',
                        backgroundColor: '#e0e0e0',
                        color: '#333',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {step === 0 ? 'ยกเลิก' : 'ย้อนกลับ'}
                </button>
                
                <button
                    type="submit"
                    style={{
                        padding: '10px 30px',
                        borderRadius: '30px',
                        border: 'none',
                        backgroundColor: '#70136c',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(112, 19, 108, 0.2)'
                    }}
                >
                    {step === 2 ? 'ยืนยันการส่ง' : 'ถัดไป'}
                </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}