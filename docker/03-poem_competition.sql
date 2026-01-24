\connect poem_competition

BEGIN;

-- users table (unchanged)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL, -- applicant, judge, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- organizations: represents organizing bodies/teams
CREATE TABLE IF NOT EXISTS organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    certificate_document TEXT,
    creator_user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'approved', -- pending, approved, rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- organization_members: tracks members with roles (creator, assistant, member)
CREATE TABLE IF NOT EXISTS organization_members (
    member_id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- creator, assistant, member
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
    -- Permissions for assistants
    can_view BOOLEAN DEFAULT TRUE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_view_scores BOOLEAN DEFAULT FALSE,
    can_add_assistant BOOLEAN DEFAULT FALSE,
    can_create_competition BOOLEAN DEFAULT FALSE,
    invited_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, user_id)
);

-- competitions: store global competition info (now linked to organizations)
CREATE TABLE IF NOT EXISTS competitions (
    competition_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    purpose TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'open',
    poster_url TEXT,
    max_score INTEGER DEFAULT 10,
    organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- poem_types: types/kinds of poems (create FIRST so competition_levels can reference it)
CREATE TABLE IF NOT EXISTS poem_types (
    poem_type_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Seed common poem types used by the frontend so they exist on first run
INSERT INTO poem_types (name) VALUES
('กลอนแปด'),
('กาพย์ยานี 11'),
('กาพย์ฉบัง 16'),
('โคลงสี่สุภาพ'),
('สักวา'),
('ดอกสร้อย'),
('อินทรวิเชียรฉันท์')
ON CONFLICT (name) DO NOTHING;

-- competition_levels: separate table for levels per competition
-- We create a master `levels` table to represent domain-levels (e.g. ประถม, มัธยม)
CREATE TABLE IF NOT EXISTS levels (
    level_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Seed master levels
INSERT INTO levels (name) VALUES
('ประถม'),
('มัธยม'),
('มหาวิทยาลัย'),
('ประชาชนทั่วไป')
ON CONFLICT (name) DO NOTHING;

-- competition_levels stores level-specific details for a competition
CREATE TABLE IF NOT EXISTS competition_levels (
    competition_level_id SERIAL PRIMARY KEY,
    competition_id INTEGER REFERENCES competitions(competition_id) ON DELETE CASCADE,
    level_id INTEGER REFERENCES levels(level_id) ON DELETE CASCADE,
    poem_type_id INTEGER REFERENCES poem_types(poem_type_id) ON DELETE SET NULL,
    rules TEXT,
    prizes JSONB,
    topic_enabled BOOLEAN DEFAULT FALSE,
    topic_name VARCHAR(255)
);

-- (We store poem type id directly on competition_levels and prizes as JSONB there)

-- applicants, works, judges, scores, assistants (unchanged structure)
-- submissions table (formerly applicants)
CREATE TABLE IF NOT EXISTS submissions (
    submission_id SERIAL PRIMARY KEY,
    competition_id INTEGER REFERENCES competitions(competition_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    level_name VARCHAR(100),
    document TEXT,
    title VARCHAR(255),
    poem_type VARCHAR(100),
    content TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS works (
    work_id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES submissions(submission_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- judges: กรรมการในการประกวดแต่ละรายการ (ไม่ link กับ organization)
CREATE TABLE IF NOT EXISTS judges (
    judge_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    competition_id INTEGER REFERENCES competitions(competition_id) ON DELETE CASCADE,
    level_id INTEGER REFERENCES levels(level_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
    invited_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, competition_id, level_id)
);

-- NOTE: assistants table ถูกรวมเข้ากับ organization_members แล้ว
-- ใช้ role='assistant' แทน

CREATE TABLE IF NOT EXISTS scores (
    score_id SERIAL PRIMARY KEY,
    judge_id INTEGER REFERENCES judges(judge_id) ON DELETE CASCADE,
    work_id INTEGER REFERENCES works(work_id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    comment TEXT,
    scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(judge_id, work_id)
);

-- submission_scores: กรรมการให้คะแนนแต่ละ submission
CREATE TABLE IF NOT EXISTS submission_scores (
    submission_score_id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES submissions(submission_id) ON DELETE CASCADE,
    judge_id INTEGER REFERENCES judges(judge_id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    comment TEXT,
    scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(judge_id, submission_id)
);

-- Trigger function to set all permissions to TRUE for creators
CREATE OR REPLACE FUNCTION set_creator_permissions()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'creator' THEN
        NEW.can_view := TRUE;
        NEW.can_edit := TRUE;
        NEW.can_view_scores := TRUE;
        NEW.can_add_assistant := TRUE;
        NEW.can_create_competition := TRUE;
        NEW.status := 'accepted';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to organization_members
DROP TRIGGER IF EXISTS trigger_set_creator_permissions ON organization_members;
CREATE TRIGGER trigger_set_creator_permissions
    BEFORE INSERT OR UPDATE ON organization_members
    FOR EACH ROW
    EXECUTE FUNCTION set_creator_permissions();

-- Update existing creators to have full permissions
UPDATE organization_members 
SET can_view = TRUE, 
    can_edit = TRUE, 
    can_view_scores = TRUE, 
    can_add_assistant = TRUE, 
    can_create_competition = TRUE,
    status = 'accepted'
WHERE role = 'creator';

COMMIT;

-- Ensure pgcrypto extension exists (for password hashing if used)
DO $$
BEGIN
    BEGIN
        PERFORM 1 FROM pg_extension WHERE extname = 'pgcrypto';
        IF NOT FOUND THEN
            EXECUTE 'CREATE EXTENSION IF NOT EXISTS pgcrypto';
        END IF;
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'pgcrypto not available or cannot be created.';
    END;
END$$;

-- create a default admin (demo only; password should be hashed in real deployments)
INSERT INTO users (username, password_hash, full_name, email, role)
SELECT 'admin', '123456', 'Administrator', 'admin@example.com', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- create a test user
INSERT INTO users (username, password_hash, full_name, email, role)
SELECT 'test', '123456', 'test test', 'test@gmail.com', 'applicant'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'test');

-- OPTIONAL: small migration helper (manual) to move `levels` JSONB into `competition_levels`.
-- If you previously stored a `levels` JSONB in `competitions`, run a script that reads competitions.levels
-- and inserts rows into `competition_levels` accordingly. This cannot be safely automated here.
