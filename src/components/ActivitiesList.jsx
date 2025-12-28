import React, { useState } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// ====================
// Data
// ====================
const allActivities = [
  {
    id: 1,
    title: 'การประกวดผลงานสุขภาพชุมชน ครั้งที่ 5',
    category: 'เปิดรับสมัครตั้งแต่วันนี้ - 31 ตุลาคม 2568',
    date: 'คุณสมบัติ : นักเรียน นิสิต นักศึกษา ประชาชนทั่วไป',
    description: 'ประกาศทั่วไป',
    image: '/assets/images/klon.jpg',
  },
  {
    id: 2,
    title: 'ประกวดขับร้องร้องเพลง 3 ระดับ แบ่งการจัดงาน วันศุกร์ ปี 2568',
    category: '18/08/2025',
    date: 'เปิดรับสมัครตั้งแต่วันนี้ - 31 ตุลาคม 2568',
    description: 'คุณสมบัติ : นักเรียน นิสิต นักศึกษา',
    image: '/assets/images/kawee.jpg',
  },
  {
    id: 3,
    title: 'ประกวดร้องเพลงชั้นมัธยมศึกษาฯ ครั้งที่ 7 “ปกป้องโลกด้วยกลอน กอดโลกด้วยเพลง”',
    category: '18/08/2025',
    date: 'เปิดรับสมัครตั้งแต่วันนี้ - 31 ตุลาคม 2568',
    description: 'คุณสมบัติ : ประชาชนทั่วไป',
    image: '/assets/images/hug.jpg',
  },
];

const activitySections = [
  {
    section: 'กิจกรรมการแข่งขันทั้งหมด',
    color: '#70136C',
    activities: [allActivities[0], allActivities[1], allActivities[2]],
  },
  {
    section: 'นักศึกษา / ประชาชน',
    color: '#70136C',
    activities: [allActivities[0], allActivities[1], allActivities[2]],
  },
  {
    section: 'หัวข้ออิสระ',
    color: '#70136C',
    activities: [allActivities[0], allActivities[1], allActivities[2]],
  },
];

// ====================
// Component
// ====================
const ActivitiesList = ({ filterCategory }) => {
  const [showAll, setShowAll] = useState(false);

  // ================================
  // เมื่อมี filterCategory
  // ================================
  if (filterCategory && !showAll) {
    const normalizedCategory =
      filterCategory === 'นิสิต' ? 'นักศึกษา' : filterCategory;

    const filteredActivities = Array.from(
      new Map(
        activitySections
          .flatMap(section => section.activities)
          .map(activity => {
            const desc = activity.description.replace(/นิสิต ?/g, '');
            return { ...activity, description: desc };
          })
          .filter(activity =>
            activity.description.includes(normalizedCategory)
          )
          .map(activity => [activity.id, activity])
      ).values()
    );

    return (
      <Container className="my-5">
        <div style={{ marginBottom: 32 }}>
          <h2 className="mb-1" style={{ fontWeight: 'bold', color: '#70136C', fontSize: '1.15rem' }}>
            {normalizedCategory === 'นักเรียน' && 'สำหรับนักเรียน'}
            {normalizedCategory === 'นักศึกษา' && 'สำหรับนักศึกษา'}
            {normalizedCategory === 'ประชาชนทั่วไป' && 'สำหรับประชาชนทั่วไป'}
          </h2>

          <div style={{ borderBottom: '4px solid #999', marginBottom: 2 }} />
          <div style={{ borderBottom: '2px solid #bbb', marginBottom: 16 }} />

          <Row xs={1} md={3} className="g-4">
            {filteredActivities.length === 0 ? (
              <Col>
                <p style={{ color: '#999' }}>ไม่พบกิจกรรมที่ตรงกับหมวดหมู่</p>
              </Col>
            ) : (
              filteredActivities.map(activity => (
                <Col key={activity.id}>
                  {activity.title.includes('ประกวดร้องเพลงชั้นมัธยมศึกษาฯ') ? (
                    <Link to="/contest-detail" style={{ textDecoration: 'none' }}>
                      <Card className="h-100 shadow-sm d-flex flex-column align-items-center" style={{ maxWidth: 350, margin: '0 auto', cursor: 'pointer' }}>
                        <img
                          src={activity.image}
                          alt={activity.title}
                          style={{
                            width: '100%',
                            maxWidth: 320,
                            height: 220,
                            objectFit: 'cover',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }}
                        />
                        <Card.Body style={{ width: '100%', maxWidth: 320 }}>
                          <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold', color: '#009688' }}>
                            {activity.title}
                          </Card.Title>
                          <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                            {activity.description}
                          </Card.Text>
                          <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.category}</div>
                          <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.date}</div>
                        </Card.Body>
                      </Card>
                    </Link>
                  ) : (
                    <Card className="h-100 shadow-sm d-flex flex-column align-items-center"
                      style={{ maxWidth: 350, margin: '0 auto' }}>
                      <img
                        src={activity.image}
                        alt={activity.title}
                        style={{
                          width: '100%',
                          maxWidth: 320,
                          height: 220,
                          objectFit: 'cover',
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      />
                      <Card.Body style={{ width: '100%', maxWidth: 320 }}>
                        <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold', color: '#009688' }}>
                          {activity.title}
                        </Card.Title>
                        <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                          {activity.description}
                        </Card.Text>
                        <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.category}</div>
                        <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.date}</div>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              ))
            )}
          </Row>
        </div>
      </Container>
    );
  }

  // ================================
  // Default: แสดงทุก section
  // ================================
  return (
    <Container className="my-5">
      {activitySections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: 32 }}>
          {section.section === 'กิจกรรมการแข่งขันทั้งหมด' ? (
            <Link
              to="/all-competitions"
              style={{
                fontWeight: 'bold',
                color: '#70136C',
                fontSize: '1.15rem',
                textDecoration: 'underline',
                marginBottom: 8,
                display: 'inline-block',
              }}
            >
              {section.section}
            </Link>
          ) : (
            <h2 className="mb-1" style={{ fontWeight: 'bold', color: section.color, fontSize: '1.15rem' }}>
              {section.section}
            </h2>
          )}

          <div style={{ borderBottom: '4px solid #999', marginBottom: 2 }} />
          <div style={{ borderBottom: '2px solid #bbb', marginBottom: 16 }} />

          <Row xs={1} md={3} className="g-4">
            {section.activities.map(activity => (
              <Col key={activity.id}>
                {activity.title.includes('ประกวดร้องเพลงชั้นมัธยมศึกษาฯ') ? (
                  <Link to="/contest-detail" style={{ textDecoration: 'none' }}>
                    <Card className="h-100 shadow-sm d-flex flex-column align-items-center" style={{ maxWidth: 350, margin: '0 auto', cursor: 'pointer' }}>
                      <img
                        src={activity.image}
                        alt={activity.title}
                        style={{
                          width: '100%',
                          maxWidth: 320,
                          height: 220,
                          objectFit: 'cover',
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      />
                      <Card.Body style={{ width: '100%', maxWidth: 320 }}>
                        <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold', color: '#70136C' }}>
                          {activity.title}
                        </Card.Title>
                        <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                          {activity.description}
                        </Card.Text>
                        <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.category}</div>
                        <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.date}</div>
                      </Card.Body>
                    </Card>
                  </Link>
                ) : (
                  <Card className="h-100 shadow-sm d-flex flex-column align-items-center"
                    style={{ maxWidth: 350, margin: '0 auto' }}>
                    <img
                      src={activity.image}
                      alt={activity.title}
                      style={{
                        width: '100%',
                        maxWidth: 320,
                        height: 220,
                        objectFit: 'cover',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    />
                    <Card.Body style={{ width: '100%', maxWidth: 320 }}>
                      <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold', color: '#70136C' }}>
                        {activity.title}
                      </Card.Title>
                      <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                        {activity.description}
                      </Card.Text>
                      <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.category}</div>
                      <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.date}</div>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default ActivitiesList;
