import React from 'react';
import TopNav from '../components/TopNav';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
// Mock activities (copy from ActivitiesList.jsx)
const allActivities = [
  {
    id: 1,
    title: 'การประกวดผลงานสุขภาพชุมชน ครั้งที่ 5',
    category: 'เปิดรับสมัครตั้งแต่วันนี้ - 31 ตุลาคม 2568',
    date: 'คุณสมบัติ : นักเรียน นิสิต นักศึกษา ประชาชนทั่วไป',
    description: 'ประกาศทั่วไป',
  },
  {
    id: 2,
    title: 'ประกวดขับร้องร้องเพลง 3 ระดับ แบ่งการจัดงาน วันศุกร์ ปี 2568',
    category: '18/08/2025',
    date: 'เปิดรับสมัครตั้งแต่วันนี้ - 31 ตุลาคม 2568',
    description: 'คุณสมบัติ : นักเรียน นิสิต นักศึกษา',
  },
  {
    id: 3,
    title: 'ประกวดร้องเพลงชั้นมัธยมศึกษาฯ ครั้งที่ 7 “ปกป้องโลกด้วยกลอน กอดโลกด้วยเพลง”',
    category: '18/08/2025',
    date: 'เปิดรับสมัครตั้งแต่วันนี้ - 31 ตุลาคม 2568',
    description: 'คุณสมบัติ : ประชาชนทั่วไป',
  },
];

const AllCompetitions = () => (
  <>
    <TopNav />
    <Container className="my-5">
      <h2 style={{ fontWeight: 'bold', color: '#009688', fontSize: '1.3rem', marginBottom: 24 }}>กิจกรรมการแข่งขันทั้งหมด</h2>
      <Row xs={1} md={3} className="g-4">
        {allActivities.map(activity => (
          <Col key={activity.id}>
            {activity.title.includes('ประกวดร้องเพลงชั้นมัธยมศึกษาฯ') ? (
              <Link to="/contest-detail" style={{ textDecoration: 'none' }}>
                <Card className="h-100 shadow-sm d-flex flex-column align-items-center" style={{ maxWidth: 350, margin: '0 auto', cursor: 'pointer' }}>
                  <img src="/assets/images/hug.jpg" alt={activity.title} style={{ width: '100%', maxWidth: 320, height: 220, objectFit: 'cover', background: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
                  <Card.Body style={{ width: '100%', maxWidth: 320 }}>
                    <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold', color: '#009688' }}>{activity.title}</Card.Title>
                    <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>{activity.description}</Card.Text>
                    <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.category}</div>
                    <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.date}</div>
                  </Card.Body>
                </Card>
              </Link>
            ) : activity.title.includes('ขับร้องร้องเพลง 3 ระดับ') ? (
              <Card className="h-100 shadow-sm d-flex flex-column align-items-center" style={{ maxWidth: 350, margin: '0 auto' }}>
                <img src="/assets/images/kawee.jpg" alt={activity.title} style={{ width: '100%', maxWidth: 320, height: 220, objectFit: 'cover', background: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
                <Card.Body style={{ width: '100%', maxWidth: 320 }}>
                  <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold', color: '#009688' }}>{activity.title}</Card.Title>
                  <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>{activity.description}</Card.Text>
                  <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.category}</div>
                  <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.date}</div>
                </Card.Body>
              </Card>
            ) : (
              <Card className="h-100 shadow-sm d-flex flex-column align-items-center" style={{ maxWidth: 350, margin: '0 auto' }}>
                <div style={{ width: '100%', maxWidth: 320, height: 220, background: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
                <Card.Body style={{ width: '100%', maxWidth: 320 }}>
                  <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold', color: '#009688' }}>{activity.title}</Card.Title>
                  <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>{activity.description}</Card.Text>
                  <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.category}</div>
                  <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.date}</div>
                </Card.Body>
              </Card>
            )}
          </Col>
        ))}
      </Row>
    </Container>
  </>
);

export default AllCompetitions;
