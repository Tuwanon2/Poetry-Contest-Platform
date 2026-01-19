import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ActivitiesList.css';

// API Base URL - ปรับตาม backend ของคุณ
const API_BASE_URL = 'http://localhost:8080/api/v1';

// ====================
// Component
// ====================
const ActivitiesList = ({ filterCategory }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests`);
        console.log('🔍 API Response:', response.data);
        setContests(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching contests:', err);
        setError('ไม่สามารถโหลดข้อมูลการประกวดได้');
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // ฟอร์แมตวันที่
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ฟอร์แมตระดับที่เปิดรับสมัคร
  const formatLevels = (levels) => {
    if (!levels || levels.length === 0) return 'ทุกระดับ';
    return levels.map(level => level.level_name || level.name || '').join(', ');
  };

  // แปลงข้อมูล contest ให้เป็นรูปแบบ activity
  const mapContestToActivity = (contest) => {
    // จัดการ poster_url ให้เป็น full URL
    let imageUrl = null;
    
    if (contest.poster_url || contest.PosterURL) {
      const posterPath = contest.poster_url || contest.PosterURL;
      console.log(`🖼️ Contest "${contest.title}" - Poster path:`, posterPath);
      // ถ้า posterPath เป็น full URL (ขึ้นต้นด้วย http) ใช้เลย
      if (posterPath.startsWith('http')) {
        imageUrl = posterPath;
      } else {
        // ถ้าเป็น relative path เติม base URL
        imageUrl = `http://localhost:8080${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
      }
      console.log(`   → Final image URL:`, imageUrl);
    }

    console.log('🔍 Contest data (full object):', JSON.stringify(contest, null, 2));
    console.log('   → levels field:', contest.levels);
    console.log('   → Levels field:', contest.Levels);

    const mappedActivity = {
      id: contest.competition_id || contest.ID || contest.id,
      title: contest.title || contest.Title || '',
      category: contest.start_date 
        ? formatDate(contest.start_date) 
        : contest.StartDate 
          ? formatDate(contest.StartDate)
          : '',
      date: contest.end_date
        ? `เปิดรับสมัครถึงวันที่ ${formatDate(contest.end_date)}`
        : contest.EndDate
          ? `เปิดรับสมัครถึงวันที่ ${formatDate(contest.EndDate)}`
          : 'เปิดรับสมัครอยู่',
      description: contest.description || contest.Description || '',
      purpose: contest.purpose || contest.Purpose || '',
      image: imageUrl,
      status: contest.status || contest.Status || 'open',
      levels: contest.levels || contest.Levels || [],
    };
    
    console.log(`✅ Mapped levels:`, mappedActivity.levels);
    return mappedActivity;
  };

  // กรองตามระดับหาก filterCategory มี
  const filterByLevel = (activities) => {
    if (!filterCategory) return activities;

    const normalizedCategory = filterCategory === 'นิสิต' ? 'นักศึกษา' : filterCategory;
    
    return activities.filter(activity => {
      // ตรวจสอบ levels ของการประกวด
      if (activity.levels && activity.levels.length > 0) {
        return activity.levels.some(level => {
          const levelName = level.level_name || level.name || '';
          return levelName.includes(normalizedCategory);
        });
      }
      // ถ้าไม่มี levels หรือเป็นทุกระดับ
      return true;
    });
  };

  // แสดงข้อความกำลังโหลด
  if (loading) {
    return (
      <Container className="my-5">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#70136C', fontSize: '1.1rem' }}>กำลังโหลดข้อมูล...</p>
        </div>
      </Container>
    );
  }

  // แสดงข้อความ error
  if (error) {
    return (
      <Container className="my-5">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#d32f2f', fontSize: '1.1rem' }}>{error}</p>
        </div>
      </Container>
    );
  }

  // แปลง contests เป็น activities
  const allActivities = contests.map(mapContestToActivity);
  
  // กรองตามสถานะ (เฉพาะที่เปิดรับสมัคร)
  const openActivities = allActivities.filter(activity => activity.status === 'open');

  // ================================
  // เมื่อมี filterCategory
  // ================================
  if (filterCategory) {
    const filteredActivities = filterByLevel(openActivities);

    return (
      <Container className="my-5">
        <div style={{ marginBottom: 32 }}>
          <h2 className="mb-1" style={{ fontWeight: 'bold', color: '#70136C', fontSize: '1.15rem' }}>
            {filterCategory === 'นักเรียน' && 'สำหรับนักเรียน'}
            {(filterCategory === 'นักศึกษา' || filterCategory === 'นิสิต') && 'สำหรับนักศึกษา / นิสิต'}
            {filterCategory === 'ประชาชนทั่วไป' && 'สำหรับประชาชนทั่วไป'}
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
                  <Link to={`/contest-detail/${activity.id}`} style={{ textDecoration: 'none' }}>
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
                        onError={(e) => {
                          e.target.src = '/assets/images/klon.jpg';
                        }}
                      />
                      <Card.Body style={{ width: '100%', maxWidth: 320 }}>
                        <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold', color: '#70136C' }}>
                          {activity.title}
                        </Card.Title>
                        <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                          ระดับ: {formatLevels(activity.levels)}
                        </Card.Text>
                        <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.date}</div>
                      </Card.Body>
                    </Card>
                  </Link>
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
  
  // จัดกลุ่ม contests ตาม sections
  const activitySections = [
    {
      section: 'กิจกรรมการแข่งขันทั้งหมด',
      color: '#70136C',
      activities: openActivities,
    },
  ];

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
            {section.activities.length === 0 ? (
              <Col>
                <p style={{ color: '#999', textAlign: 'center', width: '100%' }}>
                  ยังไม่มีการประกวดที่เปิดรับสมัครในขณะนี้
                </p>
              </Col>
            ) : (
              section.activities.map(activity => (
                <Col key={activity.id}>
                  <Link to={`/contest-detail/${activity.id}`} style={{ textDecoration: 'none' }}>
                    <Card className="h-100 shadow-sm d-flex flex-column align-items-center" style={{ maxWidth: 350, margin: '0 auto', cursor: 'pointer' }}>
                      {activity.image ? (
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
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          maxWidth: 320,
                          height: 220,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f5f5f5',
                          color: '#999',
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}>
                          ไม่พบรูป
                        </div>
                      )}
                      <Card.Body style={{ width: '100%', maxWidth: 320 }}>
                        <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold', color: '#70136C' }}>
                          {activity.title}
                        </Card.Title>
                        <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                          ระดับ: {formatLevels(activity.levels)}
                        </Card.Text>
                        <div style={{ fontSize: '0.9rem', color: '#888' }}>{activity.date}</div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))
            )}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default ActivitiesList;
