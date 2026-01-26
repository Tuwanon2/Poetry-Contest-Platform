import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../components/TopNav';
import '../components/ActivitiesList.css';

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
      month: 'short',
      day: 'numeric',
    });
  };

  // ฟอร์แมตระดับที่เปิดรับสมัคร
  const formatLevels = (levels) => {
    if (!levels || levels.length === 0) return 'ทุกระดับ';
    return levels.map(level => level.level_name || level.name || '').join(', ');
  };

  // สถานะการประกวด
  const getStatusBadge = (contest) => {
    const now = new Date();
    const startDate = new Date(contest.start_date || contest.StartDate);
    const endDate = new Date(contest.end_date || contest.EndDate);
    
    if (now < startDate) return { text: 'Coming Soon', bg: '#fff3cd', color: '#856404' };
    if (now > endDate) return { text: 'Closed', bg: '#e9ecef', color: '#495057' };
    return { text: 'Open', bg: '#d1e7dd', color: '#0f5132' };
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
      image: imageUrl,
      status: contest.status || contest.Status || 'open',
      levels: contest.levels || contest.Levels || [],
      endDate: contest.end_date || contest.EndDate || '',
      poetryType: contest.poetry_type || contest.PoetryType || '-',
      topicType: contest.topic_type || contest.TopicType || '-',
    };
  };

  const activities = contests.map(mapContestToActivity);

  return (
    <>
      <TopNav />
      <div className="activities-container" style={{ paddingTop: '80px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {activities.map(activity => {
                const badge = getStatusBadge(contests.find(c => (c.competition_id || c.ID || c.id) === activity.id) || {});
                return (
                  <Link key={activity.id} to={`/contest-detail/${activity.id}`} className="card-link-wrapper">
                    <div className="custom-card">
                      <div className="card-image-wrapper">
                        {activity.image ? (
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="card-img"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <div className="no-image-placeholder" style={{ display: activity.image ? 'none' : 'flex' }}>
                          ไม่มีรูปภาพ
                        </div>
                        <span className="status-badge" style={{ backgroundColor: badge.bg, color: badge.color }}>
                          {badge.text === 'Open' ? 'เปิดรับสมัคร' : badge.text === 'Closed' ? 'ปิดรับสมัคร' : 'เร็วๆ นี้'}
                        </span>
                      </div>
                      <div className="card-content">
                        <h3 className="card-title" title={activity.title}>
                          {activity.title}
                        </h3>
                        
                        <div className="card-row">
                          <span className="label-purple">ระดับ</span>
                          <span className="value-text">: {formatLevels(activity.levels)}</span>
                        </div>

                        <div className="card-row">
                          <span className="label-purple">ประเภท</span>
                          <span className="value-text">: {activity.poetryType}</span>
                        </div>

                        <div className="card-row">
                          <span className="label-purple">หัวข้อ</span>
                          <span className="value-text">: {activity.topicType}</span>
                        </div>
                        
                        <div className="modern-divider"></div>
                        
                        <div className="card-footer-row">
                          <svg className="icon-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span className="label-gray">ปิดรับสมัคร :</span>
                          <span className="value-date">{formatDate(activity.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SearchResults;
