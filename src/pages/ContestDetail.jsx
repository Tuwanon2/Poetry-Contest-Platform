import React from "react";
import TopNav from "../components/TopNav";
import { useNavigate } from "react-router-dom";

const ContestDetail = () => {
  const navigate = useNavigate();
  return (
    <>
      <TopNav />
      <div style={{ width: '100vw', maxWidth: '100vw', margin: 0, background: '#fff', borderRadius: 0, boxShadow: 'none', padding: 0, display: 'flex', flexDirection: 'row', minHeight: '100vh', fontSize: '15px' }}>
        {/* Main Content */}
        <div style={{ flex: 2, minWidth: 0, padding: '0 0 18px 0' }}>
          <div style={{ width: '100%', background: '#fff', borderRadius: 0, boxShadow: 'none', padding: 0 }}>
            <div style={{ padding: '18px 18px 0 18px' }}>
              <div style={{ color: "#00796b", fontWeight: 400, fontSize: 24, marginBottom: 10, textAlign: 'left', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 400, fontSize: 24 }}>
                  ประกวดเรื่องสั้นฉันทลักษณ์ ครั้งที่ 7
                </span>
                <span style={{ fontWeight: 400, fontSize: 24, marginLeft: 8 }}>
                  “ป้องโลกด้วยกอด กอดโลกด้วยกลอน”
                </span>
              </div>
              {/* สมัครผลงานถึงวันที่ ... */}
              <div style={{ textAlign: 'left', fontSize: 15, color: '#222', margin: '14px 0 6px 0', fontWeight: 400 }}>
                เปิดรับผลงานถึงวันที่ 15 ตุลาคม 2568
              </div>
              {/* Countdown bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0', padding: '7px 0 5px 0', marginBottom: 6 }}>
                {["12", "05", "23", "44"].map((num, idx) => (
                  <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ color: '#d84315', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>{num}</div>
                    <div style={{ color: '#444', fontSize: 11, marginTop: 1 }}>
                      {['Days', 'Hours', 'Minutes', 'Seconds'][idx]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <img src="/assets/images/hug.jpg" alt="โปสเตอร์ประกวดเรื่องสั้นฉันทลักษณ์" style={{ width: "100%", maxHeight: 320, objectFit: "contain", borderRadius: 0, margin: 0, background: '#e0f2f1', display: 'block' }} />
            <div style={{ padding: '18px' }}>
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ color: "#00695c", fontSize: 16, marginBottom: 6 }}>แนวคิดการประกวด</h2>
                <ul style={{ paddingLeft: 16, color: "#333", fontSize: 13 }}>
                  <li>ถูกหลักฉันทลักษณ์ มีความเป็นวรรณศิลป์ และสะท้อนภาพสังคมไทยในปัจจุบัน</li>
                  <li>ตระหนักถึงปัญหาทรัพยากรและสิ่งแวดล้อม วิกฤตขยะ การแย่งชิงทรัพยากร</li>
                  <li>ผลงานควรเป็นกระบอกเสียงชี้ให้เห็นปัญหาและเสนอทางออกด้วยพลังวรรณศิลป์</li>
                </ul>
              </section>
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ color: "#00695c", fontSize: 16, marginBottom: 6 }}>กติกาการประกวด</h2>
                <ul style={{ paddingLeft: 16, color: "#333", fontSize: 13 }}>
                  <li>เป็นผลงานร้อยกรองประเภทเรื่องสั้น มีโครงเรื่อง ตัวละคร บทสนทนา</li>
                  <li>แต่งด้วยฉันทลักษณ์ชนิดใดก็ได้ (โคลง ฉันท์ กาพย์ กลอน ร่าย ฯลฯ) ความยาว 80-100 บท</li>
                  <li>ไม่รับกลอนเปล่าหรือฉันทลักษณ์ที่คิดขึ้นเอง</li>
                  <li>พิมพ์ต้นฉบับฟอนต์ TH SarabunPSK ขนาด 16 บนกระดาษ A4 ไม่ระบุชื่อผู้แต่งในผลงาน</li>
                  <li>ส่งไฟล์ pdf และ doc ผ่าน Google Form <a href="https://forms.gle/qiP4QNcJaq1i6rWb6" target="_blank" rel="noopener noreferrer">[คลิกที่นี่]</a></li>
                  <li>ผลงานต้องไม่เคยเผยแพร่หรือได้รับรางวัลมาก่อน</li>
                  <li>1 คนส่งได้ 1 ผลงานเท่านั้น</li>
                </ul>
              </section>
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ color: "#00695c", fontSize: 16, marginBottom: 6 }}>ระยะเวลาการจัดกิจกรรม</h2>
                <ul style={{ paddingLeft: 16, color: "#333", fontSize: 13 }}>
                  <li>เปิดรับผลงาน: 15 สิงหาคม – 15 ตุลาคม 2568</li>
                  <li>ประกาศรายชื่อผลงานที่ส่งเข้าประกวด: 25 ตุลาคม 2568</li>
                  <li>ประกาศ Longlist: 15 พฤศจิกายน 2568</li>
                  <li>ประกาศ Shortlist: 30 พฤศจิกายน 2568</li>
                  <li>ประกาศผลและพิธีมอบรางวัล: 10 ธันวาคม 2568 (วันนักกลอน)</li>
                </ul>
              </section>
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ color: "#00695c", fontSize: 16, marginBottom: 6 }}>รางวัล</h2>
                <ul style={{ paddingLeft: 16, color: "#333", fontSize: 13 }}>
                  <li>รางวัลชนะเลิศ โล่พระราชทานฯ + เกียรติบัตร + เงินรางวัล 10,000 บาท</li>
                  <li>รองชนะเลิศอันดับ 1 โล่เกียรติยศ + เกียรติบัตร + เงินรางวัล 7,000 บาท</li>
                  <li>รองชนะเลิศอันดับ 2 โล่เกียรติยศ + เกียรติบัตร + เงินรางวัล 5,000 บาท</li>
                  <li>รางวัลชมเชย 2 รางวัล เกียรติบัตร + เงินรางวัล 3,000 บาท</li>
                  <li>ผู้ส่งผลงานทุกคนได้รับ E-Certificate</li>
                </ul>
              </section>
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ color: "#00695c", fontSize: 16, marginBottom: 6 }}>ติดต่อสอบถาม</h2>
                <ul style={{ paddingLeft: 16, color: "#333", fontSize: 13 }}>
                  <li>เพจเฟซบุ๊ก: <a href="https://www.facebook.com/profile.php?id=100069233838120" target="_blank" rel="noopener noreferrer">สมาคมนักกลอนแห่งประเทศไทย</a></li>
                  <li>โทรศัพท์: 08 2297 5968 (นายอมรศักดิ์ ศรีสุขกลาง)</li>
                </ul>
              </section>
            </div>
            {/* สมัครเข้าประกวด (moved to bottom) */}
            <div style={{ textAlign: 'center', margin: '24px 0 0 0' }}>
              <button
                style={{
                  padding: '8px 18px',
                  background: '#00b8a9',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,184,169,0.08)',
                  transition: 'background 0.18s',
                }}
                onClick={() => navigate('/submit-competition')}
              >
                สมัครเข้าประกวดนี้
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div style={{ flex: 1, minWidth: 220, maxWidth: 280, borderLeft: '1px solid #eee', background: '#fafbfc', padding: '18px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <h2 style={{ fontSize: 15, color: '#222', fontWeight: 700, marginBottom: 8 }}>คุณสมบัติผู้สมัคร</h2>
            <ul style={{ color: '#009688', fontSize: 12, margin: 0, paddingLeft: 12, fontWeight: 500 }}>
              <li>นักเรียน</li>
              <li>นิสิต นักศึกษา</li>
              <li>ประชาชนทั่วไป</li>
            </ul>
          </div>
         
        </div>
      </div>
    </>
  );
};

export default ContestDetail;
