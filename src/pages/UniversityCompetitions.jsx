import React from 'react';
import TopNav from '../components/TopNav';
import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import '../styles/UniversityCompetitions.css'; // ไม่ต้องใช้ไฟล์ CSS แยกแล้ว เพราะใช้ Inline Style เพื่อให้เหมือนต้นแบบเป๊ะ

// ข้อมูลจำลองสำหรับระดับอุดมศึกษา
const universityActivities = [
  {
    id: 1,
    title: 'การประกวดวรรณกรรมสร้างสรรค์ "เสียงคนรุ่นใหม่"',
    type: 'ประเภทเรื่องสั้น',
    qualification: 'นิสิตนักศึกษาระดับปริญญาตรี',
    dateRange: 'วันนี้ - 31 ต.ค. 2568',
    image: '/assets/images/story.jpg', // ใส่ Path รูปจริง
    status: 'open'
  },
  {
    id: 2,
    title: 'โครงการประกวดบทกวีนิพนธ์ อุดมศึกษาครั้งที่ 3',
    type: 'ประเภทบทกวี (ฉันทลักษณ์ไทย)',
    qualification: 'นิสิตนักศึกษาทุกชั้นปี',
    dateRange: '15 ส.ค. - 15 ต.ค. 2568',
    image: '/assets/images/poetry.jpg',
    status: 'open'
  },
  {
    id: 3,
    title: 'การแข่งขันแปลบทกวีภาษาอังกฤษ-ไทย',
    type: 'ประเภทเดี่ยว',
    qualification: 'นิสิตนักศึกษา และประชาชนทั่วไป',
    dateRange: 'วันนี้ - 30 พ.ย. 2568',
    image: null, // กรณีไม่มีรูป
    status: 'open'
  },
];

const UniversityCompetitions = () => (
  <>
    <TopNav />
    
    {/* ปรับ Layout ให้ชิดด้านบน (paddingTop: 30px) */}
    <Container style={{ paddingTop: '30px', paddingBottom: '50px' }}>
      
      {/* Header: สีม่วงเข้ม ตัวหนา จัดกึ่งกลาง */}
      <div className="text-center mb-4">
        <h2 style={{ 
          fontWeight: 'bold', 
          color: '#5a0f56', 
          fontSize: '2rem',
          margin: 0 
        }}>
          กิจกรรมสำหรับนักศึกษา
        </h2>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
          {universityActivities.map(activity => (
            <Col key={activity.id}>
              {/* Link ครอบ Card เพื่อให้คลิกได้ทั้งใบ */}
              <Link 
                to={`/university/${activity.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card 
                  className="h-100 shadow-sm border-0" 
                  style={{ 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                  }}
                >
                  
                  {/* Image Section */}
                  <div style={{ height: '200px', backgroundColor: '#e9ecef', position: 'relative' }}>
                    {activity.image ? (
                      <img 
                        src={activity.image} 
                        alt={activity.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {e.target.style.display='none';}}
                      />
                    ) : (
                      // Placeholder
                      <div className="d-flex align-items-center justify-content-center h-100" style={{ color: '#6c757d', fontSize: '1rem' }}>
                        ไม่มีรูปภาพ
                      </div>
                    )}

                    {/* Badge */}
                    {activity.status === 'open' && (
                      <Badge 
                        bg="success" 
                        style={{ 
                          position: 'absolute', 
                          top: '12px', 
                          right: '12px',
                          fontSize: '0.85rem',
                          fontWeight: 'normal',
                          padding: '6px 12px',
                          borderRadius: '20px'
                        }}
                      >
                        เปิดรับสมัคร
                      </Badge>
                    )}
                  </div>

                  {/* Content Body */}
                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Title style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#000', marginBottom: '16px' }}>
                      {activity.title}
                    </Card.Title>
                    
                    <div className="mt-auto" style={{ fontSize: '0.9rem', color: '#333' }}>
                      <p className="mb-2">
                        <strong>ประเภท:</strong> {activity.type}
                      </p>
                      <p className="mb-2">
                        <strong>คุณสมบัติ:</strong> {activity.qualification}
                      </p>
                      <p className="mb-0" style={{ color: '#5a0f56', fontWeight: 'bold' }}>
                        <span style={{ color: '#000', fontWeight: 'bold' }}>ระยะเวลา:</span> {activity.dateRange}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
      </Row>
    </Container>
  </>
);

export default UniversityCompetitions;