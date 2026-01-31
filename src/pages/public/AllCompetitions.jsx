import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Components
import TopNav from '../../components/TopNav';
import ContestFilters from '../../components/ContestFilters';

// CSS: ใช้ไฟล์เดียวกับ ActivitiesList (ต้องมีไฟล์ ActivitiesList.css ในโฟลเดอร์เดียวกัน)
import '../../components/ActivitiesList.css';

import API_BASE_URL from '../../config/api';

const AllCompetitions = () => {
  // --- State ---
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Filter State ---
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterPoetry, setFilterPoetry] = useState('all');

  // --- Fetch Data ---
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contests`);
        setContests(response.data || []);
      } catch (err) {
        console.error('Error fetching contests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // --- Helpers ---
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
    
    // Theme Colors
    if (now < startDate) return { text: 'Coming Soon', bg: '#fff3cd', color: '#856404' }; // เหลือง
    if (now > endDate) return { text: 'Closed', bg: '#e9ecef', color: '#495057' }; // เทา
    return { text: 'Open', bg: '#d1e7dd', color: '#0f5132' }; // เขียว
  };

  const getPosterUrl = (contest) => {
    const posterPath = contest.poster_url || contest.PosterURL;
    if (!posterPath) return null;
    if (posterPath.startsWith('http')) return posterPath;
    return `${API_BASE_URL.replace('/api/v1','')}${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
  };

  // --- Filter Logic ---
  const handleResetFilters = () => {
    setFilterStatus('all');
    setFilterTopic('all');
    setFilterPoetry('all');
  };

  const filteredContests = contests.filter(contest => {
    const now = new Date();
    const startDate = new Date(contest.start_date);
    const endDate = new Date(contest.end_date);
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
          
          {/* ✅ ปรับปรุงส่วน Header ให้จัดกึ่งกลาง */}
          <div className="section-wrapper" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', /* จัดแกนขวาง (แนวนอน) ให้กึ่งกลาง */
            justifyContent: 'center', 
            marginBottom: '40px' 
          }}>
            <h2 className="section-title main-header" style={{ textAlign: 'center' }}>การประกวดทั้งหมด</h2>
            <div className="section-line thick"></div>
          </div>

          <ContestFilters 
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterTopic={filterTopic}
            setFilterTopic={setFilterTopic}
            filterPoetry={filterPoetry}
            setFilterPoetry={setFilterPoetry}
            onReset={handleResetFilters}
          />

          {loading ? (
            <div className="text-center mt-5" style={{fontFamily:'Kanit'}}>กำลังโหลดข้อมูล...</div>
          ) : (
            // Grid Layout
            <div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', // ✅ ปรับลดขนาดลงเพื่อให้ใส่ได้ 4 ช่อง
  gap: '24px',
  marginTop: '30px'
}}>
              {filteredContests.length > 0 ? (
                filteredContests.map(contest => {
                  const badge = getStatusBadge(contest);
                  const posterUrl = getPosterUrl(contest);
                  const dateRange = formatDate(contest.end_date || contest.EndDate);
                  const levels = (contest.levels || []).map(l => l.level_name || l.name).join(', ') || 'ไม่ระบุ';
                  const poetryType = contest.poetry_type || '-';
                  const topicType = contest.topic_type || '-';

                  return (
                    <Link 
                      key={contest.competition_id || contest.id} 
                      to={`/contest-detail/${contest.competition_id || contest.id}`}
                      className="card-link-wrapper"
                    >
                      <div className="custom-card">
                        {/* Image */}
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

                        {/* Content */}
                        <div className="card-content">
                          <h3 className="card-title" title={contest.title}>
                             {contest.title}
                          </h3>
                          
                          <div className="card-row">
                            <span className="label-purple">ระดับ</span>
                            <span className="value-text">: {levels}</span>
                          </div>
                          <div className="card-row">
                            <span className="label-purple">ประเภท</span>
                            <span className="value-text">: {poetryType}</span>
                          </div>
                          <div className="card-row">
                             <span className="label-purple">หัวข้อ</span>
                             <span className="value-text">: {topicType}</span>
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
                })
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#999' }}>
                   ไม่พบรายการที่ค้นหา
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCompetitions;