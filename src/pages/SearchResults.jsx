import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import TopNav from '../components/TopNav';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests/search?q=${encodeURIComponent(query)}`);
        console.log('🔍 Search results:', response.data);
        setContests(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error searching contests:', err);
        setError('ไม่สามารถค้นหาข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

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

  // แปลงข้อมูล contest
  const mapContestToActivity = (contest) => {
    let imageUrl = null;
    
    if (contest.poster_url || contest.PosterURL) {
      const posterPath = contest.poster_url || contest.PosterURL;
      if (posterPath.startsWith('http')) {
        imageUrl = posterPath;
      } else {
        imageUrl = `http://localhost:8080${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
      }
    }

    return {
      id: contest.competition_id || contest.ID || contest.id,
      title: contest.title || contest.Title || '',
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
  };

  const activities = contests.map(mapContestToActivity);

  return (
    <>
      <TopNav />
      <Container className="my-5" style={{ paddingTop: '80px' }}>
        <h2 style={{ color: '#70136C', marginBottom: '20px' }}>
          ผลการค้นหา{query && `: "${query}"`}
        </h2>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#70136C', fontSize: '1.1rem' }}>กำลังค้นหา...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#d32f2f', fontSize: '1.1rem' }}>{error}</p>
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>
              ไม่พบการประกวดที่ตรงกับคำค้นหา "{query}"
            </p>
          </div>
        )}

        {!loading && !error && activities.length > 0 && (
          <>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              พบ {activities.length} รายการ
            </p>
            <Row xs={1} md={3} className="g-4">
              {activities.map(activity => (
                <Col key={activity.id}>
                  <Link to={`/contest-detail/${activity.id}`} style={{ textDecoration: 'none' }}>
                    <Card 
                      className="h-100 shadow-sm d-flex flex-column align-items-center" 
                      style={{ maxWidth: 350, margin: '0 auto', cursor: 'pointer' }}
                    >
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
              ))}
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default SearchResults;
