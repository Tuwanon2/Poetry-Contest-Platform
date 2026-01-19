import React from 'react';
import TopNav from '../components/TopNav';
import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const secondaryActivities = [
  {
    id: 1,
    title: 'การประกวดสุนทรพจน์เยาวชน ครั้งที่ 5',
    type: 'ประเภทเดี่ยว',
    qualification: 'นักเรียนมัธยมศึกษาตอนต้น (ม.1-3)',
    dateRange: 'วันนี้ - 31 ต.ค. 2568',
    image: '/assets/images/speech.jpg',
    status: 'open'
  },
  {
    id: 2,
    title: 'กวีวัจนะ: สืบสานตำนานไทย (ระดับมัธยม)',
    type: 'ประเภททีม 3 คน',
    qualification: 'นักเรียนมัธยมศึกษาตอนปลาย (ม.4-6)',
    dateRange: '1 ส.ค. - 30 ก.ย. 2568',
    image: '/assets/images/kawee.jpg',
    status: 'open'
  },
  {
    id: 3,
    title: 'ประกวดแต่งกลอนสด หัวข้อ "โลกยุคใหม่"',
    type: 'ประเภทเดี่ยว',
    qualification: 'นักเรียนมัธยมศึกษาทุกระดับชั้น',
    dateRange: 'วันนี้ - 15 พ.ย. 2568',
    image: null,
    status: 'open'
  },
];

const SecondaryCompetitions = () => (
  <>
    <TopNav />
    
    {/* ปรับ Layout ให้ชิดด้านบน (paddingTop: 30px) และเว้นด้านล่างพอประมาณ */}
    <Container style={{ paddingTop: '30px', paddingBottom: '50px' }}>
      
      {/* Header: สีม่วงเข้ม (#5a0f56) ตัวหนา จัดกึ่งกลาง */}
      <div className="text-center mb-4">
        <h2 style={{ 
          fontWeight: 'bold', 
          color: '#5a0f56', 
          fontSize: '2rem', 
          margin: 0 
        }}>
          การประกวดระดับมัธยม
        </h2>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
          {secondaryActivities.map(activity => (
            <Col key={activity.id}>
              {/* Link ครอบ Card เพื่อให้คลิกได้ทั้งใบ */}
              <Link 
                to={`/secondary/${activity.id}`} 
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

export default SecondaryCompetitions;