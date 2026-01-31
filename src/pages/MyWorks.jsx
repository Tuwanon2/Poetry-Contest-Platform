import React, { useState, useEffect } from 'react';
import { Container, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';

import API_BASE_URL from '../config/api';

const MyWorks = () => {
  const [submissions, setSubmissions] = useState([]);
  const [contests, setContests] = useState({}); // { contestId: contestData }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMySubmissions = async () => {
      try {
        setLoading(true);
        const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
        if (!userId) {
          setError('กรุณาเข้าสู่ระบบ');
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/submissions/user/${userId}`);
        const submissionsData = response.data || [];
        setSubmissions(submissionsData);
        setError(null);

        // Fetch contest info for each submission
        const contestIds = Array.from(new Set(submissionsData.map(s => s.contest_id || s.competition_id).filter(Boolean)));
        const contestResults = {};
        await Promise.all(contestIds.map(async (cid) => {
          try {
            // Try /contests/:id first, fallback to /competitions/:id if needed
            let contestRes;
            try {
              contestRes = await axios.get(`${API_BASE_URL}/contests/${cid}`);
            } catch (e) {
              contestRes = await axios.get(`${API_BASE_URL}/competitions/${cid}`);
            }
            contestResults[cid] = contestRes.data;
          } catch (e) {
            // ignore error, just don't set
          }
        }));
        setContests(contestResults);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('ไม่สามารถโหลดข้อมูลผลงานได้');
      } finally {
        setLoading(false);
      }
    };
    fetchMySubmissions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" text="dark">รอดำเนินการ</Badge>;
      case 'reviewing':
        return <Badge bg="info">กำลังตรวจ</Badge>;
      case 'completed':
        return <Badge bg="success">ประกาศผลแล้ว</Badge>;
      case 'rejected':
        return <Badge bg="danger">ไม่ผ่านการพิจารณา</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
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
      <Container style={{ paddingTop: '100px', paddingBottom: '50px', maxWidth: '800px' }}>
        <h2 style={{ color: '#70136C', marginBottom: '30px', fontWeight: 'bold', textAlign: 'center' }}>
          ผลงานที่ส่งประกวด
        </h2>

        {submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>
              คุณยังไม่ได้ส่งผลงานเข้าประกวด
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {submissions.map((submission) => {
              // Get contest info for this submission
              const contestId = submission.contest_id || submission.competition_id;
              const contest = contestId ? contests[contestId] : null;
              let posterUrl = null;
              if (contest && (contest.poster_url || contest.PosterURL)) {
                const posterPath = contest.poster_url || contest.PosterURL;
                posterUrl = posterPath.startsWith('http')
                  ? posterPath
                  : `${API_BASE_URL.replace('/api/v1','')}${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
              }
              return (
                <Card 
                  key={submission.submission_id} 
                  style={{ 
                    borderRadius: '10px', 
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  className="submission-card"
                >
                  <Card.Body style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      {/* Poster image on the left */}
                      <div style={{ minWidth: '70px', maxWidth: '90px', flexShrink: 0 }}>
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt="โปสเตอร์การประกวด"
                            style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '7px', background: '#f5f5f5' }}
                          />
                        ) : (
                          <div style={{ width: '80px', height: '100px', background: '#eee', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '12px' }}>
                            ไม่มีโปสเตอร์
                          </div>
                        )}
                      </div>
                      {/* Details on the right */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h5 style={{ color: '#70136C', fontWeight: 'bold', marginBottom: '0', fontSize: '16px' }}>
                            {submission.contest_title || 'ไม่ระบุชื่อการประกวด'}
                          </h5>
                          <div>
                            {getStatusBadge(submission.status || 'pending')}
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          borderTop: '1px solid #e0e0e0',
                          paddingTop: '12px'
                        }}>
                          <span style={{ fontSize: '12px', color: '#888' }}>
                            ส่งเมื่อ: {formatDate(submission.submitted_at)}
                          </span>
                          <Link 
                            to={`/submission/${submission.submission_id}`}
                            style={{
                              color: '#70136C',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}
                          >
                            ดูรายละเอียด →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}
      </Container>

      <style>{`
        .submission-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </>
  );
};

export default MyWorks;
