package klon

import (
    "context"
    "database/sql"
    "errors"
    "fmt"
    _ "github.com/lib/pq"
    "time"
)

type PostgresKlonDB struct {
    db *sql.DB
}

func NewPostgresKlonDB(connStr string) (*PostgresKlonDB, error) {
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        return nil, fmt.Errorf("failed to open klon db: %v", err)
    }
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(10)
    db.SetConnMaxLifetime(5 * time.Minute)

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := db.PingContext(ctx); err != nil {
        return nil, fmt.Errorf("failed to ping klon db: %v", err)
    }
    return &PostgresKlonDB{db: db}, nil
}

// Minimal stub implementations to satisfy the KlonDatabase interface.
// Replace with real SQL queries as needed.

func (p *PostgresKlonDB) GetUserByID(ctx context.Context, id int) (User, error) {
    return User{}, errors.New("not implemented")
}

func (p *PostgresKlonDB) CreateUser(ctx context.Context, user User) (User, error) {
    return User{}, errors.New("not implemented")
}

func (p *PostgresKlonDB) ListUsers(ctx context.Context) ([]User, error) {
    rows, err := p.db.QueryContext(ctx, `
        SELECT user_id, username, full_name, email, role, created_at
        FROM users
        ORDER BY user_id
        LIMIT 100
    `)
    if err != nil {
        return nil, fmt.Errorf("failed to query users: %w", err)
    }
    defer rows.Close()

    users := make([]User, 0)
    for rows.Next() {
        var u User
        if err := rows.Scan(&u.ID, &u.Username, &u.FullName, &u.Email, &u.Role, &u.CreatedAt); err != nil {
            return nil, fmt.Errorf("failed to scan user row: %w", err)
        }
        users = append(users, u)
    }
    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("rows error: %w", err)
    }
    return users, nil
}

// Auth: simple register/login implementations (passwords stored as-is for demo)
func (p *PostgresKlonDB) Register(ctx context.Context, user User, password string) (User, error) {
    var id int
    err := p.db.QueryRowContext(ctx, `
        INSERT INTO users (username,password_hash,full_name,email,role)
        VALUES ($1,$2,$3,$4,$5) RETURNING user_id
    `, user.Username, password, user.FullName, user.Email, user.Role).Scan(&id)
    if err != nil {
        return User{}, fmt.Errorf("failed to register user: %w", err)
    }
    user.ID = id
    return user, nil
}

func (p *PostgresKlonDB) Login(ctx context.Context, username, password string) (User, error) {
    var u User
    err := p.db.QueryRowContext(ctx, `SELECT user_id, username, full_name, email, role, created_at FROM users WHERE username=$1 AND password_hash=$2`, username, password).Scan(&u.ID, &u.Username, &u.FullName, &u.Email, &u.Role, &u.CreatedAt)
    if err != nil {
        return User{}, fmt.Errorf("login failed: %w", err)
    }
    return u, nil
}

func (p *PostgresKlonDB) Logout(ctx context.Context, userID int) error { return nil }

// Contests & search
func (p *PostgresKlonDB) ListContests(ctx context.Context) ([]Competition, error) {
    rows, err := p.db.QueryContext(ctx, `SELECT competition_id, title, description, type, start_date, end_date, status, created_at FROM competitions ORDER BY competition_id`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    res := make([]Competition, 0)
    for rows.Next() {
        var c Competition
        if err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.Type, &c.StartDate, &c.EndDate, &c.Status, &c.CreatedAt); err != nil {
            return nil, err
        }
        res = append(res, c)
    }
    return res, nil
}

func (p *PostgresKlonDB) GetContestByID(ctx context.Context, id int) (Competition, error) {
    var c Competition
    err := p.db.QueryRowContext(ctx, `SELECT competition_id, title, description, type, start_date, end_date, status, created_at FROM competitions WHERE competition_id=$1`, id).Scan(&c.ID, &c.Title, &c.Description, &c.Type, &c.StartDate, &c.EndDate, &c.Status, &c.CreatedAt)
    if err != nil {
        return Competition{}, err
    }
    return c, nil
}

func (p *PostgresKlonDB) SearchContests(ctx context.Context, q string) ([]Competition, error) {
    rows, err := p.db.QueryContext(ctx, `SELECT competition_id, title, description, type, start_date, end_date, status, created_at FROM competitions WHERE title ILIKE $1 ORDER BY competition_id`, "%"+q+"%")
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    res := make([]Competition, 0)
    for rows.Next() {
        var c Competition
        if err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.Type, &c.StartDate, &c.EndDate, &c.Status, &c.CreatedAt); err != nil {
            return nil, err
        }
        res = append(res, c)
    }
    return res, nil
}

// Results: compute avg score per work for a contest
func (p *PostgresKlonDB) GetResults(ctx context.Context, contestID int) ([]map[string]interface{}, error) {
    rows, err := p.db.QueryContext(ctx, `
        SELECT w.work_id, w.title, AVG(s.score) as avg_score
        FROM works w
        JOIN applicants a ON w.applicant_id = a.applicant_id
        JOIN scores s ON s.work_id = w.work_id
        WHERE a.competition_id = $1
        GROUP BY w.work_id, w.title
        ORDER BY avg_score DESC
        LIMIT 10
    `, contestID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    var out []map[string]interface{}
    for rows.Next() {
        var workID int
        var title string
        var avg sql.NullFloat64
        if err := rows.Scan(&workID, &title, &avg); err != nil {
            return nil, err
        }
        m := map[string]interface{}{"work_id": workID, "title": title, "avg_score": nil}
        if avg.Valid {
            m["avg_score"] = avg.Float64
        }
        out = append(out, m)
    }
    return out, nil
}

// Submissions
func (p *PostgresKlonDB) CreateSubmission(ctx context.Context, userID int, contestID int, title, content string) (Work, error) {
    // ensure applicant exists
    var applicantID int
    err := p.db.QueryRowContext(ctx, `INSERT INTO applicants (user_id, competition_id) VALUES ($1,$2) ON CONFLICT (user_id, competition_id) DO UPDATE SET user_id = EXCLUDED.user_id RETURNING applicant_id`, userID, contestID).Scan(&applicantID)
    if err != nil {
        return Work{}, err
    }
    var workID int
    err = p.db.QueryRowContext(ctx, `INSERT INTO works (applicant_id, title, content) VALUES ($1,$2,$3) RETURNING work_id, submitted_at`, applicantID, title, content).Scan(&workID, &sql.NullTime{})
    if err != nil {
        return Work{}, err
    }
    return Work{ID: workID, ApplicantID: applicantID, Title: title, Content: content}, nil
}

func (p *PostgresKlonDB) GetSubmission(ctx context.Context, workID int) (Work, error) {
    var w Work
    err := p.db.QueryRowContext(ctx, `SELECT work_id, applicant_id, title, content, submitted_at FROM works WHERE work_id=$1`, workID).Scan(&w.ID, &w.ApplicantID, &w.Title, &w.Content, &w.SubmittedAt)
    if err != nil {
        return Work{}, err
    }
    return w, nil
}

func (p *PostgresKlonDB) UpdateSubmission(ctx context.Context, workID int, title, content string) (Work, error) {
    _, err := p.db.ExecContext(ctx, `UPDATE works SET title=$1, content=$2 WHERE work_id=$3`, title, content, workID)
    if err != nil {
        return Work{}, err
    }
    return p.GetSubmission(ctx, workID)
}

func (p *PostgresKlonDB) DeleteSubmission(ctx context.Context, workID int) error {
    _, err := p.db.ExecContext(ctx, `DELETE FROM works WHERE work_id=$1`, workID)
    return err
}

func (p *PostgresKlonDB) GetSubmissionStatus(ctx context.Context, workID int) (map[string]interface{}, error) {
    // return average score and number of scores
    var avg sql.NullFloat64
    var cnt int
    err := p.db.QueryRowContext(ctx, `SELECT AVG(score), COUNT(*) FROM scores WHERE work_id=$1`, workID).Scan(&avg, &cnt)
    if err != nil {
        return nil, err
    }
    m := map[string]interface{}{"work_id": workID, "scores_count": cnt, "avg_score": nil}
    if avg.Valid {
        m["avg_score"] = avg.Float64
    }
    return m, nil
}

// Profile
func (p *PostgresKlonDB) GetProfile(ctx context.Context, userID int) (User, error) {
    var u User
    err := p.db.QueryRowContext(ctx, `SELECT user_id, username, full_name, email, role, created_at FROM users WHERE user_id=$1`, userID).Scan(&u.ID, &u.Username, &u.FullName, &u.Email, &u.Role, &u.CreatedAt)
    if err != nil {
        return User{}, err
    }
    return u, nil
}

func (p *PostgresKlonDB) UpdateProfile(ctx context.Context, userID int, updates map[string]interface{}) (User, error) {
    if full, ok := updates["full_name"].(string); ok {
        if _, err := p.db.ExecContext(ctx, `UPDATE users SET full_name=$1 WHERE user_id=$2`, full, userID); err != nil {
            return User{}, err
        }
    }
    if email, ok := updates["email"].(string); ok {
        if _, err := p.db.ExecContext(ctx, `UPDATE users SET email=$1 WHERE user_id=$2`, email, userID); err != nil {
            return User{}, err
        }
    }
    return p.GetProfile(ctx, userID)
}

func (p *PostgresKlonDB) GetCompetitionByID(ctx context.Context, id int) (Competition, error) {
    var c Competition
    err := p.db.QueryRowContext(ctx, `SELECT competition_id, title, description, type, start_date, end_date, status, created_at, COALESCE(organizer_id,0) FROM competitions WHERE competition_id=$1`, id).Scan(&c.ID, &c.Title, &c.Description, &c.Type, &c.StartDate, &c.EndDate, &c.Status, &c.CreatedAt, &c.OrganizerID)
    if err != nil {
        return Competition{}, err
    }
    return c, nil
}

func (p *PostgresKlonDB) ListCompetitions(ctx context.Context) ([]Competition, error) {
    rows, err := p.db.QueryContext(ctx, `SELECT competition_id, title, description, type, start_date, end_date, status, created_at, COALESCE(organizer_id,0) FROM competitions ORDER BY competition_id`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    res := make([]Competition, 0)
    for rows.Next() {
        var c Competition
        if err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.Type, &c.StartDate, &c.EndDate, &c.Status, &c.CreatedAt, &c.OrganizerID); err != nil {
            return nil, err
        }
        res = append(res, c)
    }
    return res, nil
}

func (p *PostgresKlonDB) CreateCompetition(ctx context.Context, comp Competition) (Competition, error) {
    // ensure organizer_id column exists
    _, _ = p.db.ExecContext(ctx, `ALTER TABLE competitions ADD COLUMN IF NOT EXISTS organizer_id INTEGER`)
    var id int
    err := p.db.QueryRowContext(ctx, `INSERT INTO competitions (title, description, type, start_date, end_date, status, organizer_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING competition_id`, comp.Title, comp.Description, comp.Type, comp.StartDate, comp.EndDate, comp.Status, comp.OrganizerID).Scan(&id)
    if err != nil {
        return Competition{}, err
    }
    comp.ID = id
    return comp, nil
}

func (p *PostgresKlonDB) UpdateCompetition(ctx context.Context, id int, comp Competition) (Competition, error) {
    _, err := p.db.ExecContext(ctx, `UPDATE competitions SET title=$1, description=$2, type=$3, start_date=$4, end_date=$5, status=$6 WHERE competition_id=$7`, comp.Title, comp.Description, comp.Type, comp.StartDate, comp.EndDate, comp.Status, id)
    if err != nil {
        return Competition{}, err
    }
    return p.GetCompetitionByID(ctx, id)
}

func (p *PostgresKlonDB) DeleteCompetition(ctx context.Context, id int) error {
    _, err := p.db.ExecContext(ctx, `DELETE FROM competitions WHERE competition_id=$1`, id)
    return err
}

func (p *PostgresKlonDB) MyContests(ctx context.Context, userID int) ([]Competition, error) {
    rows, err := p.db.QueryContext(ctx, `SELECT competition_id, title, description, type, start_date, end_date, status, created_at, COALESCE(organizer_id,0) FROM competitions WHERE organizer_id=$1 OR EXISTS (SELECT 1 FROM coorganizers c WHERE c.competition_id = competitions.competition_id AND c.user_id = $1) ORDER BY competition_id`, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    res := make([]Competition, 0)
    for rows.Next() {
        var c Competition
        if err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.Type, &c.StartDate, &c.EndDate, &c.Status, &c.CreatedAt, &c.OrganizerID); err != nil {
            return nil, err
        }
        res = append(res, c)
    }
    return res, nil
}

func (p *PostgresKlonDB) OpenContest(ctx context.Context, id int) error {
    _, err := p.db.ExecContext(ctx, `UPDATE competitions SET status='open' WHERE competition_id=$1`, id)
    return err
}

func (p *PostgresKlonDB) CloseContest(ctx context.Context, id int) error {
    _, err := p.db.ExecContext(ctx, `UPDATE competitions SET status='closed' WHERE competition_id=$1`, id)
    return err
}

func (p *PostgresKlonDB) AddCoOrganizer(ctx context.Context, competitionID int, userID int) (int, error) {
    // create table if missing
    _, _ = p.db.ExecContext(ctx, `CREATE TABLE IF NOT EXISTS coorganizers (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE, competition_id INTEGER REFERENCES competitions(competition_id) ON DELETE CASCADE)`)
    var id int
    err := p.db.QueryRowContext(ctx, `INSERT INTO coorganizers (user_id, competition_id) VALUES ($1,$2) RETURNING id`, userID, competitionID).Scan(&id)
    if err != nil {
        return 0, err
    }
    return id, nil
}

func (p *PostgresKlonDB) RemoveCoOrganizer(ctx context.Context, coOrganizerID int) error {
    _, err := p.db.ExecContext(ctx, `DELETE FROM coorganizers WHERE id=$1`, coOrganizerID)
    return err
}

func (p *PostgresKlonDB) RemoveJudge(ctx context.Context, judgeID int) error {
    _, err := p.db.ExecContext(ctx, `DELETE FROM judges WHERE judge_id=$1`, judgeID)
    return err
}

func (p *PostgresKlonDB) ListSubmissionsForContest(ctx context.Context, competitionID int) ([]Work, error) {
    rows, err := p.db.QueryContext(ctx, `SELECT w.work_id, w.applicant_id, w.title, w.content, w.submitted_at FROM works w JOIN applicants a ON w.applicant_id = a.applicant_id WHERE a.competition_id=$1 ORDER BY w.work_id`, competitionID)
    if err != nil { return nil, err }
    defer rows.Close()
    res := make([]Work, 0)
    for rows.Next() {
        var w Work
        if err := rows.Scan(&w.ID, &w.ApplicantID, &w.Title, &w.Content, &w.SubmittedAt); err != nil { return nil, err }
        res = append(res, w)
    }
    return res, nil
}

func (p *PostgresKlonDB) ContestProgress(ctx context.Context, competitionID int) (map[string]int, error) {
    var total int
    err := p.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM works w JOIN applicants a ON w.applicant_id = a.applicant_id WHERE a.competition_id=$1`, competitionID).Scan(&total)
    if err != nil { return nil, err }
    var scored int
    err = p.db.QueryRowContext(ctx, `SELECT COUNT(DISTINCT s.work_id) FROM scores s JOIN works w ON s.work_id = w.work_id JOIN applicants a ON w.applicant_id = a.applicant_id WHERE a.competition_id=$1`, competitionID).Scan(&scored)
    if err != nil { return nil, err }
    return map[string]int{"total_submissions": total, "scored_submissions": scored}, nil
}

func (p *PostgresKlonDB) PostResults(ctx context.Context, competitionID int) error {
    _, err := p.db.ExecContext(ctx, `UPDATE competitions SET status='results_published' WHERE competition_id=$1`, competitionID)
    return err
}

// Invitations & comments & judge helpers
func (p *PostgresKlonDB) ListInvitations(ctx context.Context, userID int) ([]Invitation, error) {
    // ensure table
    _, _ = p.db.ExecContext(ctx, `CREATE TABLE IF NOT EXISTS invitations (id SERIAL PRIMARY KEY, competition_id INTEGER REFERENCES competitions(competition_id) ON DELETE CASCADE, from_user_id INTEGER REFERENCES users(user_id), to_user_id INTEGER REFERENCES users(user_id), status VARCHAR(20) DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)
    rows, err := p.db.QueryContext(ctx, `SELECT id, competition_id, from_user_id, to_user_id, status, created_at FROM invitations WHERE to_user_id=$1 ORDER BY id`, userID)
    if err != nil { return nil, err }
    defer rows.Close()
    out := make([]Invitation, 0)
    for rows.Next() {
        var inv Invitation
        if err := rows.Scan(&inv.ID, &inv.CompetitionID, &inv.FromUserID, &inv.ToUserID, &inv.Status, &inv.CreatedAt); err != nil { return nil, err }
        out = append(out, inv)
    }
    return out, nil
}

func (p *PostgresKlonDB) AcceptInvitation(ctx context.Context, invitationID int) error {
    // mark accepted and create judge assignment
    var compID, toUser int
    tx, err := p.db.BeginTx(ctx, nil)
    if err != nil { return err }
    defer func() { if err != nil { tx.Rollback() } }()
    if err := tx.QueryRowContext(ctx, `SELECT competition_id, to_user_id FROM invitations WHERE id=$1 FOR UPDATE`, invitationID).Scan(&compID, &toUser); err != nil { tx.Rollback(); return err }
    if _, err := tx.ExecContext(ctx, `UPDATE invitations SET status='accepted' WHERE id=$1`, invitationID); err != nil { tx.Rollback(); return err }
    // insert into judges (if not exists)
    var jid int
    err = tx.QueryRowContext(ctx, `INSERT INTO judges (user_id, competition_id) VALUES ($1,$2) ON CONFLICT (user_id, competition_id) DO UPDATE SET assigned_at = CURRENT_TIMESTAMP RETURNING judge_id`, toUser, compID).Scan(&jid)
    if err != nil { tx.Rollback(); return err }
    return tx.Commit()
}

func (p *PostgresKlonDB) ListJudgeContests(ctx context.Context, userID int) ([]Competition, error) {
    rows, err := p.db.QueryContext(ctx, `SELECT c.competition_id, c.title, c.description, c.type, c.start_date, c.end_date, c.status, c.created_at, COALESCE(c.organizer_id,0) FROM competitions c JOIN judges j ON j.competition_id = c.competition_id WHERE j.user_id=$1 ORDER BY c.competition_id`, userID)
    if err != nil { return nil, err }
    defer rows.Close()
    res := make([]Competition, 0)
    for rows.Next() {
        var c Competition
        if err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.Type, &c.StartDate, &c.EndDate, &c.Status, &c.CreatedAt, &c.OrganizerID); err != nil { return nil, err }
        res = append(res, c)
    }
    return res, nil
}

func (p *PostgresKlonDB) ListJudgeContestSubmissions(ctx context.Context, userID int, competitionID int) ([]Work, error) {
    // ensure judge is assigned
    var exists bool
    err := p.db.QueryRowContext(ctx, `SELECT EXISTS(SELECT 1 FROM judges WHERE user_id=$1 AND competition_id=$2)`, userID, competitionID).Scan(&exists)
    if err != nil { return nil, err }
    if !exists { return nil, fmt.Errorf("judge not assigned to competition") }
    return p.ListSubmissionsForContest(ctx, competitionID)
}

func (p *PostgresKlonDB) AddComment(ctx context.Context, comment Comment) (Comment, error) {
    _, _ = p.db.ExecContext(ctx, `CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, work_id INTEGER REFERENCES works(work_id) ON DELETE CASCADE, judge_id INTEGER REFERENCES judges(judge_id) ON DELETE CASCADE, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)
    var id int
    err := p.db.QueryRowContext(ctx, `INSERT INTO comments (work_id, judge_id, content) VALUES ($1,$2,$3) RETURNING id, created_at`, comment.WorkID, comment.JudgeID, comment.Content).Scan(&id, &comment.CreatedAt)
    if err != nil { return Comment{}, err }
    comment.ID = id
    return comment, nil
}

func (p *PostgresKlonDB) AddScore(ctx context.Context, score Score) (Score, error) {
    // ensure judge exists and is assigned
    _, _ = p.db.ExecContext(ctx, `CREATE TABLE IF NOT EXISTS scores (score_id SERIAL PRIMARY KEY, judge_id INTEGER REFERENCES judges(judge_id) ON DELETE CASCADE, work_id INTEGER REFERENCES works(work_id) ON DELETE CASCADE, score NUMERIC(5,2) NOT NULL, comment TEXT, scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(judge_id, work_id))`)
    var id int
    err := p.db.QueryRowContext(ctx, `INSERT INTO scores (judge_id, work_id, score, comment) VALUES ($1,$2,$3,$4) RETURNING score_id, scored_at`, score.JudgeID, score.WorkID, score.Score, score.Comment).Scan(&id, &score.ScoredAt)
    if err != nil { return Score{}, err }
    score.ID = id
    return score, nil
}

func (p *PostgresKlonDB) GetJudgeSummary(ctx context.Context, userID int, competitionID int) (map[string]interface{}, error) {
    // compute number of works assigned and number scored and average score given by judge for the competition
    var totalAssigned int
    err := p.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM works w JOIN applicants a ON w.applicant_id = a.applicant_id WHERE a.competition_id=$1`, competitionID).Scan(&totalAssigned)
    if err != nil { return nil, err }
    var scoredCount int
    var avg sql.NullFloat64
    err = p.db.QueryRowContext(ctx, `SELECT COUNT(s.score_id), AVG(s.score) FROM scores s JOIN works w ON s.work_id = w.work_id JOIN applicants a ON w.applicant_id = a.applicant_id WHERE s.judge_id IN (SELECT judge_id FROM judges WHERE user_id=$1 AND competition_id=$2)`, userID, competitionID).Scan(&scoredCount, &avg)
    if err != nil { return nil, err }
    out := map[string]interface{}{"total_assigned": totalAssigned, "scored_count": scoredCount, "avg_score": nil}
    if avg.Valid { out["avg_score"] = avg.Float64 }
    return out, nil
}

func (p *PostgresKlonDB) ApplyCompetition(ctx context.Context, applicant Applicant) (Applicant, error) {
    return Applicant{}, errors.New("not implemented")
}

func (p *PostgresKlonDB) ListApplicants(ctx context.Context, competitionID int) ([]Applicant, error) {
    return []Applicant{}, nil
}

func (p *PostgresKlonDB) SubmitWork(ctx context.Context, work Work) (Work, error) {
    return Work{}, errors.New("not implemented")
}

func (p *PostgresKlonDB) ListWorks(ctx context.Context, competitionID int) ([]Work, error) {
    return []Work{}, nil
}

func (p *PostgresKlonDB) AssignJudge(ctx context.Context, judge Judge) (Judge, error) {
    return Judge{}, errors.New("not implemented")
}

func (p *PostgresKlonDB) ListJudges(ctx context.Context, competitionID int) ([]Judge, error) {
    return []Judge{}, nil
}

func (p *PostgresKlonDB) ListScores(ctx context.Context, workID int) ([]Score, error) {
    return []Score{}, nil
}

func (p *PostgresKlonDB) Close() error {
    if p.db == nil {
        return nil
    }
    return p.db.Close()
}

func (p *PostgresKlonDB) Ping() error {
    if p.db == nil {
        return fmt.Errorf("db not initialized")
    }
    return p.db.Ping()
}
