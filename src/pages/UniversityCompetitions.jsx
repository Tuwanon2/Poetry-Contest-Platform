import React, { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const UniversityCompetitions = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests`);
        
        // กรองเฉพาะการประกวดระดับนักศึกษา
        const universityContests = (response.data || []).filter(contest => {
          const levels = contest.levels || [];
          return levels.some(level => 
            (level.level_name || level.name || '').includes('นักศึกษา') ||
            (level.level_name || level.name || '').includes('มหาวิทยาลัย')
          );
        });
        
        setContests(universityContests);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching contests:', err);
        setError('ไม่สามารถโหลดข้อมูลการประกวดได้');
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getContestStatus = (contest) => {
    const now = new Date();
    const startDate = new Date(contest.start_date || contest.StartDate);
    const endDate = new Date(contest.end_date || contest.EndDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'closed';
    return 'open';
  };

  const getPosterUrl = (contest) => {
    const posterPath = contest.poster_url || contest.PosterURL;
    if (!posterPath) return null;
    if (posterPath.startsWith('http')) return posterPath;
    return `http://localhost:8080${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
  };

  if (loading) {
    return (
      <>
        <TopNav />
        <Container style={{ paddingTop: '100px', textAlign: 'center' }}>
          <p style={{ color: '#5a0f56', fontSize: '1.1rem' }}>กำลังโหลดข้อมูล...</p>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopNav />
        <Container style={{ paddingTop: '100px', textAlign: 'center' }}>
          <p style={{ color: '#d32f2f', fontSize: '1.1rem' }}>{error}</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <TopNav />
      
      <Container style={{ paddingTop: '30px', paddingBottom: '50px' }}>
        
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

        {contests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>
              ไม่มีการประกวดสำหรับระดับนักศึกษาในขณะนี้
            </p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {contests.map(contest => {
              const status = getContestStatus(contest);
              const posterUrl = getPosterUrl(contest);
              const levels = contest.levels || [];
              const levelNames = levels.map(l => l.level_name || l.name || '').filter(Boolean).join(', ');
              const startDate = formatDate(contest.start_date || contest.StartDate);
              const endDate = formatDate(contest.end_date || contest.EndDate);
              
              return (
                <Col key={contest.competition_id || contest.id}>
                  <Link 
                    to={`/contest-detail/${contest.competition_id || contest.id}`} 
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
                      
                      <div style={{ height: '200px', backgroundColor: '#e9ecef', position: 'relative' }}>
                        {posterUrl ? (
                          <img 
                            src={posterUrl} 
                            alt={contest.title || contest.Title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => {e.target.style.display='none';}}
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100" style={{ color: '#6c757d', fontSize: '1rem' }}>
                            ไม่มีรูปภาพ
                          </div>
                        )}

                        {status === 'open' && (
                          <Badge bg="success" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.85rem', fontWeight: 'normal', padding: '6px 12px', borderRadius: '20px' }}>
                            เปิดรับสมัคร
                          </Badge>
                        )}
                        {status === 'upcoming' && (
                          <Badge bg="warning" text="dark" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.85rem', fontWeight: 'normal', padding: '6px 12px', borderRadius: '20px' }}>
                            เร็วๆ นี้
                          </Badge>
                        )}
                        {status === 'closed' && (
                          <Badge bg="secondary" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.85rem', fontWeight: 'normal', padding: '6px 12px', borderRadius: '20px' }}>
                            ปิดรับสมัคร
                          </Badge>
                        )}
                      </div>

                      <Card.Body className="d-flex flex-column p-4">
                        <Card.Title style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#000', marginBottom: '16px' }}>
                          {contest.title || contest.Title}
                        </Card.Title>
                        
                        <div className="mt-auto" style={{ fontSize: '0.9rem', color: '#333' }}>
                          <p className="mb-2">
                            <strong>คุณสมบัติ:</strong> {levelNames || 'ทุกระดับ'}
                          </p>
                          <p className="mb-0" style={{ color: '#5a0f56', fontWeight: 'bold' }}>
                            <span style={{ color: '#000', fontWeight: 'bold' }}>ระยะเวลา:</span> {startDate} - {endDate}
                          </p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </>
  );
};

export default UniversityCompetitions;