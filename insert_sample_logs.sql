-- Sample activity logs
INSERT INTO activity_logs (user_id, user_type, user_name, action, entity_type, entity_id, ip_address) 
VALUES 
(1, 'admin', 'Administrator', 'เข้าสู่ระบบ', 'user', 1, '127.0.0.1'),
(2, 'user', 'test test', 'ส่งผลงาน "บทกลอนทดสอบ"', 'submission', 1, '192.168.1.100'),
(1, 'admin', 'Administrator', 'อนุมัติองค์กร "มหาวิทยาลัยราชภัฏ"', 'organization', 1, '127.0.0.1'),
(1, 'organizer', 'นาย A', 'สร้างการประกวด "ประกวดกลอน 2026"', 'competition', 1, '192.168.1.50'),
(NULL, 'system', 'System', 'สำรองข้อมูลอัตโนมัติ', 'system', NULL, NULL),
(1, 'admin', 'Administrator', 'แก้ไขการตั้งค่าระบบ', 'settings', NULL, '127.0.0.1'),
(2, 'judge', 'test', 'ให้คะแนนผลงาน "ฤดูใบไม้ร่วง"', 'submission', 2, '192.168.1.75');

