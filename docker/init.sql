-- สร้าง Database ถ้ายังไม่มี

SELECT 'CREATE DATABASE klon'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'klon');

\c klon

BEGIN;

-- ตารางผู้ใช้ (นักเรียน/นิสิต/บุคคลทั่วไป/กรรมการ/แอดมิน)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL, -- applicant, judge, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางการแข่งขันกลอน (klon competitions)
CREATE TABLE IF NOT EXISTS competitions (
    competition_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- เช่น นักเรียน, นิสิต, บุคคลทั่วไป
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางผู้สมัครเข้าร่วมการแข่งขันกลอน
CREATE TABLE IF NOT EXISTS applicants (
    applicant_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    competition_id INTEGER REFERENCES competitions(competition_id) ON DELETE CASCADE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, competition_id)
);

-- ตารางผลงานกลอนที่ส่งเข้าประกวด
CREATE TABLE IF NOT EXISTS works (
    work_id SERIAL PRIMARY KEY,
    applicant_id INTEGER REFERENCES applicants(applicant_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางกรรมการกลอน (mapping user กับ klon competition ที่เป็นกรรมการ)
CREATE TABLE IF NOT EXISTS judges (
    judge_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    competition_id INTEGER REFERENCES competitions(competition_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, competition_id)
);

-- ตารางคะแนนกลอนที่กรรมการให้แต่ละผลงาน
CREATE TABLE IF NOT EXISTS scores (
    score_id SERIAL PRIMARY KEY,
    judge_id INTEGER REFERENCES judges(judge_id) ON DELETE CASCADE,
    work_id INTEGER REFERENCES works(work_id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    comment TEXT,
    scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(judge_id, work_id)
);

COMMIT;
-- เพิ่มตัวอย่างผู้ใช้ 2 แถวในฐานข้อมูล klon
INSERT INTO users (username, password_hash, full_name, email, role)
VALUES
    ('alice', 'placeholder_hash', 'Alice Example', 'alice@example.com', 'applicant'),
    ('bob',   'placeholder_hash', 'Bob Example',   'bob@example.com',   'judge');

    SELECT 'CREATE DATABASE poem_competition'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'poem_competition');

    \c poem_competition

    BEGIN;

    -- ตารางผู้ใช้ (นักเรียน/นิสิต/บุคคลทั่วไป/กรรมการ/แอดมิน)
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(20) NOT NULL, -- applicant, judge, admin
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- ตารางการแข่งขัน
    CREATE TABLE IF NOT EXISTS competitions (
        competition_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50), -- เช่น นักเรียน, นิสิต, บุคคลทั่วไป
        start_date DATE,
        end_date DATE,
        status VARCHAR(20) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- ตารางผู้สมัครเข้าร่วมการแข่งขัน
    CREATE TABLE IF NOT EXISTS applicants (
        applicant_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        competition_id INTEGER REFERENCES competitions(competition_id) ON DELETE CASCADE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, competition_id)
    );

    -- ตารางผลงานที่ส่งเข้าประกวด
    CREATE TABLE IF NOT EXISTS works (
        work_id SERIAL PRIMARY KEY,
        applicant_id INTEGER REFERENCES applicants(applicant_id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- ตารางกรรมการ (mapping user กับ competition ที่เป็นกรรมการ)
    CREATE TABLE IF NOT EXISTS judges (
        judge_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        competition_id INTEGER REFERENCES competitions(competition_id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, competition_id)
    );

    -- ตารางคะแนนที่กรรมการให้แต่ละผลงาน
    CREATE TABLE IF NOT EXISTS scores (
        score_id SERIAL PRIMARY KEY,
        judge_id INTEGER REFERENCES judges(judge_id) ON DELETE CASCADE,
        work_id INTEGER REFERENCES works(work_id) ON DELETE CASCADE,
        score NUMERIC(5,2) NOT NULL,
        comment TEXT,
        scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(judge_id, work_id)
    );

    COMMIT;