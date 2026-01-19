import React from 'react';
import TopNav from '../components/TopNav';
import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// ข้อมูลจำลองสำหรับประชาชนทั่วไป
const generalActivities = [
  {
    id: 1,
    title: 'ประกวดร้องเพลง "ลูกทุ่งเสียงทอง" ครั้งที่ 7',
    type: 'ประเภทเดี่ยว (ไม่จำกัดแนวเพลง)',
    qualification: 'ประชาชนทั่วไป ไม่จำกัดอายุ',
    dateRange: 'วันนี้ - 31 ต.ค. 2568',
    image: '/assets/images/hug.jpg', // ใช้รูปเดิมตามที่คุณมี
    status: 'open'
  },
  {
    id: 2,
    title: 'การประกวดถ่ายภาพ "วิถีไทย วิถีธรรม"',
    type: 'ประเภทผลงานภาพถ่าย',
    qualification: 'ประชาชนทั่วไป และช่างภาพอิสระ',
    dateRange: '1 ก.ย. - 30 พ.ย. 2568',
    image: '/assets/images/photo.jpg', // สมมติรูป (ถ้าไม่มีจะขึ้นสีเทา)
    status: 'open'
  },
  {
    id: 3,
    title: 'ประกวดคำขวัญรณรงค์ "รักษ์โลก รักษ์เรา"',
    type: 'ประเภทงานเขียน',
    qualification: 'ประชาชนทั่วไป',
    dateRange: 'วันนี้ - 15 ธ.ค. 2568',
    image: null, // กรณีไม่มีรูป
    status: 'open'
  },
];

const GeneralCompetitions = () => (
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
          การประกวดระดับประชาชนทั่วไป
        </h2>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
          {generalActivities.map(activity => (
            <Col key={activity.id}>
              {/* Link ครอบ Card เพื่อให้คลิกได้ทั้งใบ */}
              <Link 
                to={`/general/${activity.id}`} 
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
                      // Placeholder กรณีไม่มีรูป
                      <div className="d-flex align-items-center justify-content-center h-100" style={{ color: '#6c757d', fontSize: '1rem' }}>
                        ไม่มีรูปภาพ
                      </div>
                    )}

                    {/* Badge มุมขวาบน */}
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

export default GeneralCompetitions;