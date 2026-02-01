import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Components
import TopNav from '../../components/TopNav';
import ContestFilters from '../../components/ContestFilters';

// CSS: ใช้ไฟล์เดียวกับ ActivitiesList
import '../../components/ActivitiesList.css';

import API_BASE_URL from '../../config/api';

const PrimaryCompetitions = () => {
  // --- State ---
  const [contests, setContests] = useState([]);
  const [orgs, setOrgs] = useState({});
  const [loading, setLoading] = useState(true);

  // --- Filter States ---
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterPoetry, setFilterPoetry] = useState('all');

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests`);
        const allContests = response.data || [];
        
        // ✅ กรองเฉพาะ "ประถม" (Logic เดิม)
        const primaryContests = allContests.filter(contest => {
          const levels = contest.levels || contest.Levels || [];
          return levels.some(level => 
            (level.level_name || level.name || '').includes('ประถม')
          );
        });
        
        setContests(primaryContests);

        // --- Logic ดึงข้อมูล Organization ---
        const orgIds = Array.from(new Set(primaryContests.map(c => c.organization_id).filter(Boolean)));
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
        // ---------------------------------------

      } catch (err) {
        console.error('❌ Error fetching contests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // --- 2. Helper Functions ---
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (contest) => {
    const now = new Date();
    const startDate = new Date(contest.start_date || contest.StartDate);
    const endDate = new Date(contest.end_date || contest.EndDate);
    
    // Theme สี Pastel
    if (now < startDate) return { text: 'Coming Soon', bg: '#fff3cd', color: '#856404' }; // เหลือง
    if (now > endDate) return { text: 'Closed', bg: '#e9ecef', color: '#495057' }; // เทา
    return { text: 'Open', bg: '#d1e7dd', color: '#0f5132' }; // เขียว
  };

  const getPosterUrl = (contest) => {
    const posterPath = contest.poster_url || contest.PosterURL;
    if (!posterPath) return null;
    if (posterPath.startsWith('http')) return posterPath;
    const baseUrl = API_BASE_URL.replace(/\/api\/v1$/, '').replace(/\/$/, '');
    return `${baseUrl}${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
  };

  // --- 3. Filter Logic ---
  const handleResetFilters = () => {
    setFilterStatus('all');
    setFilterTopic('all');
    setFilterPoetry('all');
  };

  const filteredContests = contests.filter(contest => {
    const now = new Date();
    const startDate = new Date(contest.start_date || contest.StartDate);
    const endDate = new Date(contest.end_date || contest.EndDate);
    let statusKey = 'open';
    if (now < startDate) statusKey = 'upcoming';
    if (now > endDate) statusKey = 'finished';

    const matchStatus = filterStatus === 'all' || statusKey === filterStatus;
    const matchTopic = filterTopic === 'all' || (contest.topic_type === filterTopic);
    const matchPoetry = filterPoetry === 'all' || (contest.poetry_type === filterPoetry);
    
    return matchStatus && matchTopic && matchPoetry;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FFFFFF' }}>
      {/* Main Content */}
      <div style={{ flex: 1, transition: '0.3s' }}>
        <TopNav />

        <div className="activities-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
          
          {/* Header แบบ Center */}
          <div className="section-wrapper" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            marginBottom: '40px' 
          }}>
            <h2 className="section-title main-header" style={{ textAlign: 'center' }}>
              การประกวดสำหรับระดับประถม
            </h2>
            <div className="section-line thick"></div>
          </div>

          {/* Filter */}
          <ContestFilters 
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            filterTopic={filterTopic} setFilterTopic={setFilterTopic}
            filterPoetry={filterPoetry} setFilterPoetry={setFilterPoetry}
            onReset={handleResetFilters}
          />

          {/* Grid Content */}
          {loading ? (
            <div className="text-center mt-5" style={{fontFamily:'Kanit'}}>กำลังโหลดข้อมูล...</div>
          ) : (
            <Row xs={1} md={2} lg={4} className="g-4 mt-3">
              {filteredContests.length > 0 ? (
                filteredContests.map(contest => {
                  const badge = getStatusBadge(contest);
                  const posterUrl = getPosterUrl(contest);
                  const dateRange = formatDate(contest.end_date || contest.EndDate);
                  const org = contest.organization_id ? orgs[contest.organization_id] : null;

                  // --- Logic การดึงข้อมูลแบบเจาะลึก ---
                  const levelsList = contest.levels || contest.Levels || [];

                  // 1. Levels
                  const levelsStr = levelsList
                    .map(l => (l.level_name || l.name || ''))
                    .filter(Boolean)
                    .join(', ') || 'ไม่ระบุ';

                  // 2. Topics (หัวข้อ)
                  const rawTopics = levelsList.map(l => l.topic_name || l.topic || l.TopicName || l.Topic);
                  const uniqueTopics = [...new Set(rawTopics.filter(t => t && t !== '-' && t !== 'ไม่ระบุ' && t !== ''))];
                  const topicsStr = uniqueTopics.length > 0 ? uniqueTopics.join(', ') : '-';

                  // 3. Type (ประเภท) - [ฉบับแก้ไข: Logic ใหม่ที่ดักทุกทาง]
                  let collectedTypes = [];
                  // 3.1 หาจาก Root
                  const rootType = contest.type || contest.Type || contest.category || contest.Category;
                  if (rootType) collectedTypes.push(rootType);

                  // 3.2 วนลูปหาจาก Levels (เช็คทั้ง poem_type และอื่นๆ)
                  if (levelsList.length > 0) {
                    levelsList.forEach(l => {
                      const candidate = l.poem_type || l.poem_types || l.PoemTypes || l.type || l.Type || l.category || l.Category;
                      
                      if (Array.isArray(candidate)) {
                        collectedTypes.push(...candidate);
                      } else if (typeof candidate === 'string' && candidate.trim() !== '') {
                        if (candidate.startsWith('[') && candidate.endsWith(']')) {
                          try {
                            const parsed = JSON.parse(candidate);
                            if (Array.isArray(parsed)) collectedTypes.push(...parsed);
                          } catch (e) {
                            collectedTypes.push(candidate);
                          }
                        } else {
                          collectedTypes.push(candidate);
                        }
                      }
                    });
                  }
                  
                  // กรองตัวซ้ำ
                  const uniqueTypes = [...new Set(
                    collectedTypes.filter(t => t && typeof t === 'string' && t.trim() !== '' && t !== '-' && t !== 'ไม่ระบุ')
                  )];
                  const typeStr = uniqueTypes.length > 0 ? uniqueTypes.join(', ') : '-';

                  return (
                    <Col key={contest.competition_id || contest.id}>
                      <Link 
                        to={`/contest-detail/${contest.competition_id || contest.id}`} 
                        className="card-link-wrapper"
                      >
                        <div className="custom-card">
                          <div className="card-image-wrapper">
                            {posterUrl ? (
                              <img src={posterUrl} alt={contest.title} className="card-img" onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} />
                            ) : null}
                            <div className="no-image-placeholder" style={{ display: posterUrl ? 'none' : 'flex' }}>
                               <span>ไม่มีรูปภาพ</span>
                            </div>
                            <span className="status-badge" style={{ backgroundColor: badge.bg, color: badge.color }}>
                              {badge.text === 'Open' ? 'เปิดรับสมัคร' : badge.text === 'Closed' ? 'ปิดรับสมัคร' : 'เร็วๆ นี้'}
                            </span>
                          </div>

                          <div className="card-content">
                            <h3 className="card-title" title={contest.title}>
                                {contest.title}
                            </h3>
                            
                            {/* ORGANIZATION NAME */}
                            {org && (
                              <div className="card-row" style={{ marginBottom: 4 }}>
                                <span className="label-gray">จัดโดย</span>
                                <span className="value-text" style={{ color: '#009688', fontWeight: 600 }}> : {org.name || org.organization_name || '-'}</span>
                              </div>
                            )}

                            {/* เรียงลำดับใหม่: หัวข้อ -> ระดับ -> ประเภท */}
                            <div className="card-row">
                              <span className="label-purple">หัวข้อ</span>
                              <span className="value-text">: {topicsStr}</span>
                            </div>

                            <div className="card-row">
                              <span className="label-purple">ระดับ</span>
                              <span className="value-text">: {levelsStr}</span>
                            </div>

                            <div className="card-row">
                              <span className="label-purple">ประเภท</span>
                              <span className="value-text">: {typeStr}</span>
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
                    </Col>
                  );
                })
              ) : (
                <div style={{ width: '100%', textAlign: 'center', padding: '4rem', color: '#999' }}>
                   ไม่พบรายการที่ค้นหา
                </div>
              )}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrimaryCompetitions;