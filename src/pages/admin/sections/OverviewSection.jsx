/* 📂 src/pages/admin/sections/OverviewSection.jsx */
import React, { useState } from 'react';
import Icon from '../../../components/Icon';
// import AddMemberModal from '../../../components/AddMemberModal'; // ปิดชั่วคราว

export default function OverviewSection() {
    const [isModalOpen, setModalOpen] = useState(false);

    console.log("OverviewSection render - isModalOpen:", isModalOpen);

    return (
        <div className="fade-in" style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '10px',
            minHeight: '600px' 
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 className="section-header" style={{ marginBottom: 0, color: '#70136C', fontSize: '24px' }}>ภาพรวมระบบ (Overview)</h2>
                <button className="btn-primary" onClick={() => alert('เปิด Modal (ปิดไว้ชั่วคราว)')}>
                    <span style={{ marginRight: 8 }}>➕</span>
                    เพิ่มสมาชิกใหม่
                </button>
            </div>

            {/* Grid 4 Columns ตาม CSS ของคุณ */}
            <div className="grid-4">
                <StatCard title="ผู้เข้าแข่งขัน" value="1,240" icon="users" color="#70136C" />
                <StatCard title="รายการประกวด" value="8" icon="trophy" color="#e67e22" />
                <StatCard title="กรรมการ" value="24" icon="scale" color="#27ae60" />
                <StatCard title="ผู้จัดการประกวด" value="5" icon="briefcase" color="#2980b9" />
                <StatCard title="ผู้ช่วยจัดการประกวด" value="12" icon="user-check" color="#8e44ad" />
                
            </div>

            <div className="grid-2">
                <div className="card">
                    <h3 className="sub-header">รายการล่าสุด</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>รายการ</th>
                                <th>สถานะ</th>
                                <th>วันที่</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>ประกวดถ่ายภาพ 2024</td>
                                <td><span className="badge-gray" style={{ color: 'green', background: '#e8f8f5' }}>เปิดรับสมัคร</span></td>
                                <td>12 ม.ค. 67</td>
                            </tr>
                            <tr>
                                <td>Hackathon Gen 5</td>
                                <td><span className="badge-gray">จบแล้ว</span></td>
                                <td>10 ม.ค. 67</td>
                            </tr>
                            <tr>
                                <td>Design Award</td>
                                <td><span className="badge-gray" style={{ color: 'orange', background: '#fef9e7' }}>กำลังตัดสิน</span></td>
                                <td>08 ม.ค. 67</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h3 className="sub-header">Logs การใช้งาน</h3>
                    <ul className="log-list">
                        <li>User <strong>Somchai</strong> ลงทะเบียนเข้าแข่งขัน <span style={{ color: '#999', fontSize: '12px', float: 'right' }}>2 นาทีที่แล้ว</span></li>
                        <li>Admin <strong>Admin01</strong> อนุมัติผลงาน ID #882 <span style={{ color: '#999', fontSize: '12px', float: 'right' }}>15 นาทีที่แล้ว</span></li>
                        <li>Judge <strong>Dr.Wichai</strong> ให้คะแนนทีม A <span style={{ color: '#999', fontSize: '12px', float: 'right' }}>1 ชม. ที่แล้ว</span></li>
                        <li>System สำรองข้อมูลประจำวันอัตโนมัติ <span style={{ color: '#999', fontSize: '12px', float: 'right' }}>3 ชม. ที่แล้ว</span></li>
                    </ul>
                </div>
            </div>

            {/* Modal Component - ปิดชั่วคราว */}
            {/* <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={() => alert('บันทึกข้อมูลเรียบร้อย!')}
            /> */}
        </div>
    );
}

// Sub-component เล็กๆ สำหรับแสดงการ์ดสถิติ
function StatCard({ title, value, icon, color }) {
    return (
        <div className="stat-card">
            <div className="stat-value-container">
                <div>
                    <span className="stat-title">{title}</span>
                    <div className="stat-value" style={{ color: color }}>{value}</div>
                </div>
                <div style={{ opacity: 0.2, color: color, fontSize: '40px' }}>
                    {/* ใช้ emoji แทน Icon ชั่วคราวเพื่อป้องกัน error */}
                    {icon === 'users' && '👥'}
                    {icon === 'trophy' && '🏆'}
                    {icon === 'scale' && '⚖️'}
                    {icon === 'briefcase' && '💼'}
                    {icon === 'user-check' && '✅'}
                </div>
            </div>
        </div>
    );
}