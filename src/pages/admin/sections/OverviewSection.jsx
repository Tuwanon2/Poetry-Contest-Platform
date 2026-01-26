/* 📂 src/pages/admin/sections/OverviewSection.jsx */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/Icon';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function OverviewSection() {
    const [stats, setStats] = useState({
        totalCompetitions: 0,
        totalSubmissions: 0,
        submissionsByStatus: {
            pending: 0,
            underReview: 0,
            scored: 0
        },
        totalUsers: 0,
        usersByRole: {
            applicants: 0,
            judges: 0,
            organizers: 0,
            assistants: 0
        },
        openCompetitions: [],
        closingSoonCompetitions: [],
        recentActivities: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-spinner">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="fade-in" style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '10px',
            minHeight: '600px' 
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 className="section-header" style={{ marginBottom: 0, color: '#70136C', fontSize: '24px' }}>
                    📊 ภาพรวมระบบ (Dashboard)
                </h2>
                <button className="btn-primary" onClick={fetchDashboardStats}>
                    <span style={{ marginRight: 8 }}>🔄</span>
                    รีเฟรช
                </button>
            </div>

            {/* สถิติหลัก */}
            <div className="grid-4">
                <StatCard 
                    title="การประกวดทั้งหมด" 
                    value={stats.totalCompetitions} 
                    icon="trophy" 
                    color="#e67e22" 
                />
                <StatCard 
                    title="ผลงานที่ส่งเข้ามา" 
                    value={stats.totalSubmissions} 
                    icon="file" 
                    color="#70136C" 
                    subtitle={`รอตรวจ: ${stats.submissionsByStatus.pending}`}
                />
                <StatCard 
                    title="ผู้ใช้งานทั้งหมด" 
                    value={stats.totalUsers} 
                    icon="users" 
                    color="#27ae60" 
                />
                <StatCard 
                    title="กรรมการ" 
                    value={stats.usersByRole.judges} 
                    icon="scale" 
                    color="#2980b9" 
                />
            </div>

            {/* สถิติตามบทบาท */}
            <div style={{ marginTop: 20 }}>
                <h3 className="sub-header">📈 สถิติผู้ใช้งานตามบทบาท</h3>
                <div className="grid-4">
                    <SmallStatCard title="ผู้สมัคร" value={stats.usersByRole.applicants} color="#8e44ad" />
                    <SmallStatCard title="กรรมการ" value={stats.usersByRole.judges} color="#2980b9" />
                    <SmallStatCard title="ผู้จัดการประกวด" value={stats.usersByRole.organizers} color="#e67e22" />
                    <SmallStatCard title="ผู้ช่วย" value={stats.usersByRole.assistants} color="#27ae60" />
                </div>
            </div>

            {/* สถิติผลงาน */}
            <div style={{ marginTop: 20 }}>
                <h3 className="sub-header">📝 สถานะผลงาน</h3>
                <div className="grid-4">
                    <SmallStatCard title="รอตรวจ" value={stats.submissionsByStatus.pending} color="#f39c12" />
                    <SmallStatCard title="กำลังพิจารณา" value={stats.submissionsByStatus.underReview} color="#3498db" />
                    <SmallStatCard title="ตรวจแล้ว" value={stats.submissionsByStatus.scored} color="#27ae60" />
                </div>
            </div>

            {/* Grid 2 Columns */}
            <div className="grid-2" style={{ marginTop: 30 }}>
                {/* การประกวดที่เปิดรับสมัคร */}
                <div className="card">
                    <h3 className="sub-header">🏆 การประกวดที่กำลังเปิดรับสมัคร</h3>
                    {stats.openCompetitions.length === 0 ? (
                        <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                            ไม่มีการประกวดที่เปิดรับสมัคร
                        </p>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ชื่อการประกวด</th>
                                    <th>ผลงานที่ส่ง</th>
                                    <th>วันปิดรับสมัคร</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.openCompetitions.map((comp, index) => (
                                    <tr key={index}>
                                        <td>{comp.title}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="badge-gray" style={{ background: '#e8f8f5', color: '#27ae60' }}>
                                                {comp.submissions_count} ผลงาน
                                            </span>
                                        </td>
                                        <td>{new Date(comp.end_date).toLocaleDateString('th-TH')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* การประกวดที่ใกล้ปิดรับผลงาน */}
                <div className="card">
                    <h3 className="sub-header">⏰ การประกวดที่ใกล้ปิดรับผลงาน</h3>
                    {stats.closingSoonCompetitions.length === 0 ? (
                        <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                            ไม่มีการประกวดที่ใกล้ปิดรับผลงาน
                        </p>
                    ) : (
                        <ul className="log-list">
                            {stats.closingSoonCompetitions.map((comp, index) => (
                                <li key={index}>
                                    <strong>{comp.title}</strong>
                                    <span style={{ color: '#e74c3c', fontSize: '12px', float: 'right' }}>
                                        ปิดในอีก {comp.days_remaining} วัน
                                    </span>
                                    {!comp.has_judges && (
                                        <div style={{ color: '#e67e22', fontSize: '12px', marginTop: '4px' }}>
                                            ⚠️ ยังไม่มอบหมายกรรมการ
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* กิจกรรมล่าสุด */}
            <div className="card" style={{ marginTop: 20 }}>
                <h3 className="sub-header">📜 กิจกรรมล่าสุด (Recent Activities)</h3>
                {stats.recentActivities.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                        ยังไม่มีกิจกรรม
                    </p>
                ) : (
                    <ul className="log-list">
                        {stats.recentActivities.map((activity, index) => (
                            <li key={index}>
                                {activity.user_type} <strong>{activity.user_name}</strong> {activity.action}
                                <span style={{ color: '#999', fontSize: '12px', float: 'right' }}>
                                    {formatTimeAgo(activity.created_at)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

// Helper function สำหรับแสดงเวลาที่ผ่านมา
function formatTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'เมื่อสักครู่';
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชม. ที่แล้ว`;
    return `${diffDays} วันที่แล้ว`;
}

// Sub-component สำหรับแสดงการ์ดสถิติหลัก
function StatCard({ title, value, icon, color, subtitle }) {
    return (
        <div className="stat-card">
            <div className="stat-value-container">
                <div>
                    <span className="stat-title">{title}</span>
                    <div className="stat-value" style={{ color: color }}>{value}</div>
                    {subtitle && (
                        <span style={{ fontSize: '12px', color: '#999' }}>{subtitle}</span>
                    )}
                </div>
                <div style={{ opacity: 0.2, color: color, fontSize: '40px' }}>
                    {icon === 'users' && '👥'}
                    {icon === 'trophy' && '🏆'}
                    {icon === 'scale' && '⚖️'}
                    {icon === 'briefcase' && '💼'}
                    {icon === 'user-check' && '✅'}
                    {icon === 'file' && '📄'}
                </div>
            </div>
        </div>
    );
}

// Sub-component สำหรับการ์ดสถิติเล็ก
function SmallStatCard({ title, value, color }) {
    return (
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: color }}>{value}</div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>{title}</div>
        </div>
    );
}