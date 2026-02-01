import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ActivitiesList.css';

import API_BASE_URL from '../config/api';

const ActivitiesList = ({ filterCategory }) => {
  const [contests, setContests] = useState([]);
  const [orgs, setOrgs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests`);
        // console.log("Debug API Data:", response.data); // ลองเปิดบรรทัดนี้เพื่อดูโครงสร้างข้อมูลจริงใน Console
        const contestsData = response.data || [];
        setContests(contestsData);
        setError(null);

        const orgIds = Array.from(new Set(contestsData.map(c => c.organization_id).filter(Boolean)));
        const orgsMap = {};
        await Promise.all(orgIds.map(async (orgId) => {
          try {
            const res = await axios.get(`${API_BASE_URL}/organizations/${orgId}`);
            orgsMap[orgId] = res.data;
          } catch {
            orgsMap[orgId] = null;
          }
        }));
        setOrgs(orgsMap);
      } catch (err) {
        console.error('Error fetching contests:', err);
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
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const getStatusBadge = (contest) => {
    const now = new Date();
    const startDate = new Date(contest.start_date || contest.StartDate);
    const endDate = new Date(contest.end_date || contest.EndDate);
    
    if (now < startDate) return { text: 'Coming Soon', bg: '#fff3cd', color: '#856404' };
    if (now > endDate) return { text: 'Closed', bg: '#e9ecef', color: '#495057' };
    return { text: 'Open', bg: '#d1e7dd', color: '#0f5132' };
  };

  const getPosterUrl = (contest) => {
    const posterPath = contest.poster_url || contest.PosterURL;
    if (!posterPath) return null;
    if (posterPath.startsWith('http')) return posterPath;
    const baseUrl = API_BASE_URL.replace(/\/api\/v1$/, '').replace(/\/$/, '');
    return `${baseUrl}${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
  };

  const filterByLevel = (allContests) => {
    if (!filterCategory) return allContests;
    const normalizedCategory = filterCategory === 'นิสิต' ? 'มหาวิทยาลัย' : filterCategory;
    return allContests.filter(contest => {
      const levels = contest.levels || contest.Levels || [];
      if (levels.length > 0) {
        return levels.some(level => {
          const levelName = level.level_name || level.name || '';
          return levelName.includes(normalizedCategory);
        });
      }
      return true;
    });
  };

  // --- Helper Component (แก้ไขจุดนี้) ---
  const ContestCard = ({ contest }) => {
    const badge = getStatusBadge(contest);
    const posterUrl = getPosterUrl(contest);
    const org = contest.organization_id ? orgs[contest.organization_id] : null;
    const dateRange = formatDate(contest.end_date || contest.EndDate);

    // 1. ดึง levels ออกมาเตรียมไว้
    const levelsList = contest.levels || contest.Levels || [];

    // --- ส่วนแสดงผล ระดับชั้น ---
    const levelsStr = levelsList
      .map(l => (l.level_name || l.name || ''))
      .filter(Boolean)
      .join(', ') || 'ไม่ระบุ';

    // --- ส่วนแสดงผล หัวข้อ (Topic) ---
    // ลองดึงจากหลายๆ ชื่อตัวแปรที่เป็นไปได้ และกรองตัวซ้ำออก
    const rawTopics = levelsList.map(l => l.topic_name || l.topic || l.TopicName || l.Topic);
    // กรองค่าว่างและค่าซ้ำ (Unique)
    const uniqueTopics = [...new Set(rawTopics.filter(t => t && t !== '-' && t !== 'ไม่ระบุ' && t !== ''))];
    const topicsStr = uniqueTopics.length > 0 ? uniqueTopics.join(', ') : '-';

    // --- ส่วนแสดงผล ประเภท (Type) ---
    // 1. ลองหาที่ตัว contest หลักก่อน
    let typeVal = contest.type || contest.Type || contest.category || contest.Category;
    
    // 2. ถ้าที่หลักไม่มี ให้ลองไปค้นใน levels ตัวแรก (เพราะบางที type อยู่ใน levels)
    if (!typeVal && levelsList.length > 0) {
        const firstLevel = levelsList[0];
        typeVal = firstLevel.type || firstLevel.Type || firstLevel.category || firstLevel.Category;
    }
    const typeStr = typeVal || '-';

    return (
      <Link 
        to={`/contest-detail/${contest.competition_id || contest.id}`} 
        className="card-link-wrapper"
      >
        <div className="custom-card">
          <div className="card-image-wrapper">
            {posterUrl ? (
              <img src={posterUrl} alt={contest.title} className="card-img" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            ) : null}
            <div className="no-image-placeholder" style={{ display: posterUrl ? 'none' : 'flex' }}>
               <span>ไม่มีรูปภาพ</span>
            </div>
            <span className="status-badge" style={{ backgroundColor: badge.bg, color: badge.color }}>
              {badge.text === 'Open' ? 'เปิดรับสมัคร' : badge.text === 'Closed' ? 'ปิดรับสมัคร' : 'เร็วๆ นี้'}
            </span>
          </div>

          <div className="card-content">
            <h3 className="card-title" title={contest.title || contest.Title}>
                {contest.title || contest.Title}
            </h3>
            
            {/* ORGANIZATION NAME */}
            {org && (
              <div className="card-row" style={{ marginBottom: 4 }}>
                <span className="label-gray">จัดโดย</span>
                <span className="value-text" style={{ color: '#009688', fontWeight: 600 }}> : {org.name || org.organization_name || '-'}</span>
              </div>
            )}

            {/* TYPE (ประเภท) */}
            <div className="card-row">
              <span className="label-purple">ประเภท</span>
              <span className="value-text">: {typeStr}</span>
            </div>

            {/* TOPIC (หัวข้อ) */}
            <div className="card-row">
              <span className="label-purple">หัวข้อ</span>
              <span className="value-text">: {topicsStr}</span>
            </div>

            {/* LEVEL (ระดับ) */}
            <div className="card-row">
              <span className="label-purple">ระดับ</span>
              <span className="value-text">: {levelsStr}</span>
            </div>

            <div className="modern-divider"></div>
            
            <div className="card-footer-row">
              <svg className="icon-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <circle cx="12" cy="12" r="10"></circle>
                 <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="label-gray">ปิดรับสมัคร :</span>
              <span className="value-date">{dateRange}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // --- Logic ---
  const allFilteredContests = filterByLevel(contests);

  const sortedContests = [...allFilteredContests].sort((a, b) => {
    const endA = new Date(a.end_date || a.EndDate);
    const endB = new Date(b.end_date || b.EndDate);
    const now = new Date();
    const isExpiredA = endA < now;
    const isExpiredB = endB < now;

    if (isExpiredA && !isExpiredB) return 1;
    if (!isExpiredA && isExpiredB) return -1;
    return endA - endB;
  });

  const recommendedContests = sortedContests.slice(0, 4);
  const generalContests = sortedContests.slice(4);

  if (loading) return <div className="text-center mt-5" style={{fontFamily:'Kanit'}}>กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center mt-5 text-danger" style={{fontFamily:'Kanit'}}>{error}</div>;

  return (
    <Container className="activities-container">
      {allFilteredContests.length === 0 ? (
         <div className="text-center py-5">
            <p style={{ color: '#999', fontSize: '1.2rem' }}>ไม่พบการประกวดในหมวดหมู่นี้</p>
         </div>
      ) : (
        <>
          {recommendedContests.length > 0 && (
            <div className="mb-5">
              <div className="section-wrapper">
                <h2 className="section-title main-header">การประกวดแนะนำ</h2>
                <div className="section-line thick"></div>
              </div>
              <Row xs={1} md={2} lg={4} className="g-4"> 
                {recommendedContests.map((contest) => (
                  <Col key={contest.competition_id || contest.id}>
                    <ContestCard contest={contest} />
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {generalContests.length > 0 && (
            <div className="mt-5">
              <div className="section-wrapper">
                <h2 className="section-title main-header">การประกวดทั้งหมด</h2>
                <div className="section-line thick"></div>
              </div>
              <Row xs={1} md={2} lg={4} className="g-4">
                {generalContests.map((contest) => (
                  <Col key={contest.competition_id || contest.id}>
                    <ContestCard contest={contest} />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ActivitiesList;
