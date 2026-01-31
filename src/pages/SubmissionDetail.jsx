import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import TopNav from '../components/TopNav';
import { FaArrowLeft, FaPrint } from 'react-icons/fa';

import API_BASE_URL from '../config/api';

const SubmissionDetail = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/submission/${submissionId}`);
        console.log('📄 Submission detail:', response.data);
        setSubmission(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching submission:', err);
        setError('ไม่สามารถโหลดข้อมูลผลงานได้');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const formatContent = (content) => {
    if (!content) return [];
    
    // แบ่งบทด้วย % 
    const sections = content.split('%');
    
    return sections.map(section => {
      // แบ่งวรรคด้วย &
      const verses = section.split('&')
        .map(verse => verse.trim())
        .filter(verse => verse.length > 0);
      return verses;
    }).filter(section => section.length > 0);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <TopNav />
        <Container style={{ paddingTop: '100px', textAlign: 'center' }}>
          <p style={{ color: '#70136C', fontSize: '1.1rem' }}>กำลังโหลดข้อมูล...</p>
        </Container>
      </>
    );
  }

  if (error || !submission) {
    return (
      <>
        <TopNav />
        <Container style={{ paddingTop: '100px', textAlign: 'center' }}>
          <p style={{ color: '#d32f2f', fontSize: '1.1rem' }}>{error || 'ไม่พบข้อมูลผลงาน'}</p>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/my-works')}
            style={{ marginTop: '20px' }}
          >
            กลับไปหน้าผลงาน
          </Button>
        </Container>
      </>
    );
  }

  const contentSections = formatContent(submission.content);

  return (
    <>
      <TopNav />
      <div className="no-print" style={{ paddingTop: '80px', paddingBottom: '20px', background: '#f5f5f5' }}>
        <Container>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/my-works')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FaArrowLeft /> กลับ
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={handlePrint}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FaPrint /> พิมพ์
            </Button>
          </div>
        </Container>
      </div>

      <Container style={{ paddingBottom: '50px', background: '#f5f5f5', minHeight: '100vh' }}>
        {/* กระดาษ A4 */}
        <div className="a4-paper">
          {/* Header - ข้อมูลการประกวด */}
          <div className="paper-header">
            <h6 style={{ color: '#666', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }}>
              {submission.contest_title || 'การประกวดกลอน'}
            </h6>
            <div style={{ 
              textAlign: 'center', 
              borderBottom: '2px solid #70136C', 
              paddingBottom: '12px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '12px', color: '#888' }}>
                ระดับ: {submission.level_name || '-'} | 
                ประเภท: {submission.poem_type || '-'}
              </span>
            </div>
          </div>

          {/* หัวข้อกลอน */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ 
              color: '#70136C', 
              fontWeight: 'bold', 
              fontSize: '24px',
              marginBottom: '8px'
            }}>
              {submission.title || 'ไม่มีชื่อผลงาน'}
            </h3>
            {submission.topic && (
              <p style={{ color: '#666', fontSize: '14px', fontStyle: 'italic' }}>
                หัวข้อ: {submission.topic}
              </p>
            )}
          </div>

          {/* เนื้อหากลอน */}
          <div className="poem-content">
            {contentSections.map((verses, sectionIndex) => (
              <div key={sectionIndex} className="poem-section">
                {/* หัวข้อบท */}
                {contentSections.length > 1 && (
                  <h6 style={{ 
                    color: '#70136C', 
                    fontSize: '15px', 
                    fontWeight: '600',
                    marginBottom: '16px',
                    marginTop: sectionIndex > 0 ? '32px' : '0'
                  }}>
                    บทที่ {sectionIndex + 1}
                  </h6>
                )}
                
                {/* แสดงวรรคแบบ 2 คอลัมน์ */}
                <div className="verses-grid">
                  {verses.map((verse, verseIndex) => {
                    const verseNumber = verseIndex + 1;
                    const isLeftColumn = verseIndex % 2 === 0;
                    
                    return (
                      <div 
                        key={verseIndex} 
                        className={`verse-item ${isLeftColumn ? 'left-col' : 'right-col'}`}
                      >
                        <div className="verse-number">{verseNumber}.</div>
                        <div className="verse-line">
                          {verse}
                          <div className="verse-underline"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer - ข้อมูลผู้ส่ง */}
          <div className="paper-footer">
            <div style={{ 
              borderTop: '1px solid #ddd', 
              paddingTop: '16px',
              marginTop: '40px',
              fontSize: '13px',
              color: '#666'
            }}>
              <p style={{ marginBottom: '4px' }}>
                ผู้ส่ง: {submission.name || '-'}
              </p>
              <p style={{ marginBottom: '0' }}>
                วันที่ส่ง: {new Date(submission.submitted_at).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        .a4-paper {
          background: white;
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 25mm 20mm;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          position: relative;
        }

        .paper-header {
          margin-bottom: 24px;
        }

        .poem-content {
          font-family: 'Sarabun', 'TH Sarabun New', sans-serif;
          font-size: 16px;
          color: #222;
          padding: 0 20px;
        }

        .poem-section {
          margin-bottom: 24px;
        }

        .verses-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 24px;
          row-gap: 20px;
        }

        .verse-item {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .verse-number {
          color: #666;
          font-size: 14px;
          font-weight: 500;
          min-width: 24px;
          padding-top: 2px;
        }

        .verse-line {
          flex: 1;
          position: relative;
          padding-bottom: 8px;
        }

        .verse-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: #d0d0d0;
        }

        .paper-footer {
          margin-top: auto;
        }

        /* Print styles */
        @media print {
          body {
            background: white;
          }

          .no-print {
            display: none !important;
          }

          .a4-paper {
            box-shadow: none;
            margin: 0;
            padding: 20mm 15mm;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }

        /* Responsive */
        @media screen and (max-width: 768px) {
          .a4-paper {
            width: 100%;
            min-height: auto;
            padding: 20px;
            box-shadow: none;
          }

          .poem-content {
            font-size: 15px;
            padding: 0 10px;
          }

          .verses-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default SubmissionDetail;
