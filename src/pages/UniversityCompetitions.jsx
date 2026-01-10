import React from 'react';
import TopNav from '../components/TopNav';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/UniversityCompetitions.css'; 

const universityActivities = [
  {
    id: 1,
    title: 'การประกวดผลงานสุขภาพชุมชน ครั้งที่ 5',
    category: 'เปิดรับสมัครตั้งแต่วันนี้ - 31 ตุลาคม 2568',
    date: 'คุณสมบัติ : นิสิตนักศึกษา',
    description: 'ประกาศทั่วไป',
  },
  {
    id: 2,
    title: 'ประกวดขับร้องร้องเพลง 3 ระดับ',
    category: '18/08/2025',
    date: 'เปิดรับสมัครตั้งแต่วันนี้ - 31 ตุลาคม 2568',
    description: 'คุณสมบัติ : นิสิตนักศึกษา',
  },
];

const UniversityCompetitions = () => (
  <>
    <TopNav />
    <Container className="uc-container">
      <h2 className="uc-title">กิจกรรมสำหรับนิสิตนักศึกษา</h2>

      <Row xs={1} md={3} className="g-4">
        {universityActivities.map(activity => (
          <Col key={activity.id}>
            <Card className="uc-card">
              {activity.title.includes('ประกวดร้องเพลงชั้นมัธยมศึกษาฯ') ? (
                <img src="/assets/images/hug.jpg" alt={activity.title} className="uc-image" />
              ) : activity.title.includes('ขับร้องร้องเพลง 3 ระดับ') ? (
                <img src="/assets/images/kawee.jpg" alt={activity.title} className="uc-image" />
              ) : (
                <div className="uc-image placeholder" />
              )}

              <Card.Body className="uc-card-body">
                <Card.Title className="uc-card-title">{activity.title}</Card.Title>
                <Card.Text className="uc-description">{activity.description}</Card.Text>
                <div className="uc-meta">{activity.category}</div>
                <div className="uc-meta">{activity.date}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  </>
);

export default UniversityCompetitions;
