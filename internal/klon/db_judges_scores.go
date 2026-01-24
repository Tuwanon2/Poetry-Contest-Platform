package klon

import (
    "context"
    "database/sql"
    "errors"
    "time"
    "fmt"
)

// CreateJudge - Create a judge invitation for a contest
func (p *PostgresKlonDB) CreateJudge(ctx context.Context, judge Judge) (Judge, error) {
    var id int
    err := p.db.QueryRowContext(ctx,
        `INSERT INTO judges (user_id, competition_id, level_id, status, invited_by, assigned_at) 
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) 
         RETURNING judge_id, assigned_at`,
        judge.UserID, judge.CompetitionID, judge.LevelID, judge.Status, judge.InvitedBy,
    ).Scan(&id, &judge.AssignedAt)
    
    if err != nil {
        return Judge{}, err
    }
    
    judge.ID = id
    return judge, nil
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
    rows, err := p.db.QueryContext(ctx, `
        SELECT COALESCE(c.competition_id, j.competition_id), 
               COALESCE(c.title, 'การประกวดถูกลบแล้ว'), 
               COALESCE(c.description, 'การประกวดนี้ถูกลบออกจากระบบแล้ว'), 
               COALESCE(c.start_date::text, CURRENT_TIMESTAMP::text), 
               COALESCE(c.end_date::text, CURRENT_TIMESTAMP::text), 
               COALESCE(c.status, 'completed'), 
               COALESCE(c.created_at, CURRENT_TIMESTAMP), 
               COALESCE(c.organization_id, 0)
        FROM judges j 
        LEFT JOIN competitions c ON j.competition_id = c.competition_id 
        WHERE j.user_id=$1 AND j.status='accepted'
        ORDER BY j.competition_id`, userID)
    if err != nil { return nil, err }
    defer rows.Close()
    res := make([]Competition, 0)
    for rows.Next() {
        var c Competition
        var startDate, endDate string
        if err := rows.Scan(&c.ID, &c.Title, &c.Description, &startDate, &endDate, &c.Status, &c.CreatedAt, &c.OrganizationID); err != nil { 
            return nil, err 
        }
        c.StartDate = startDate
        c.EndDate = endDate
        res = append(res, c)
    }
    return res, nil
}

// ListJudgeInvitations - Get pending judge invitations
func (p *PostgresKlonDB) ListJudgeInvitations(ctx context.Context, userID int) ([]map[string]interface{}, error) {
    rows, err := p.db.QueryContext(ctx, `
        SELECT j.judge_id, j.competition_id, j.level_id, j.status, j.invited_by, j.assigned_at,
               COALESCE(c.title, 'การประกวดถูกลบแล้ว'), 
               COALESCE(c.description, ''), 
               COALESCE(l.name, '')
        FROM judges j
        LEFT JOIN competitions c ON j.competition_id = c.competition_id
        LEFT JOIN levels l ON j.level_id = l.level_id
        WHERE j.user_id=$1 AND j.status='pending'
        ORDER BY j.assigned_at DESC`, userID)
    if err != nil { return nil, err }
    defer rows.Close()
    
    var result []map[string]interface{}
    for rows.Next() {
        var judgeID, competitionID, levelID, invitedBy int
        var status, title, description, levelName string
        var assignedAt time.Time
        
        if err := rows.Scan(&judgeID, &competitionID, &levelID, &status, &invitedBy, &assignedAt, &title, &description, &levelName); err != nil {
            continue
        }
        
        result = append(result, map[string]interface{}{
            "id": judgeID,
            "judge_id": judgeID,
            "competition_id": competitionID,
            "level_id": levelID,
            "level_name": levelName,
            "status": status,
            "invited_by": invitedBy,
            "assigned_at": assignedAt,
            "title": title,
            "description": description,
        })
    }
    
    return result, nil
}

// RejectJudgeInvitation - Reject a judge invitation
func (p *PostgresKlonDB) RejectJudgeInvitation(ctx context.Context, judgeID int) error {
    _, err := p.db.ExecContext(ctx, `UPDATE judges SET status='rejected' WHERE judge_id=$1`, judgeID)
    return err
}

func (p *PostgresKlonDB) ListJudgeContestSubmissions(ctx context.Context, userID int, competitionID int) ([]map[string]interface{}, error) {
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
    var id int
    err := p.db.QueryRowContext(ctx, `
        INSERT INTO judges (user_id, competition_id, level_id, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, competition_id, level_id) DO UPDATE SET
            status = EXCLUDED.status,
            assigned_at = CURRENT_TIMESTAMP
        RETURNING judge_id
    `, judge.UserID, judge.CompetitionID, judge.LevelID, judge.Status).Scan(&id)
    
    if err != nil {
        return Judge{}, err
    }
    
    judge.ID = id
    judge.AssignedAt = time.Now()
    return judge, nil
}

func (p *PostgresKlonDB) ListJudges(ctx context.Context, competitionID int) ([]Judge, error) {
    return []Judge{}, nil
}

// NOTE: AssignAssistant and InviteAssistant ถูกย้ายไป db_organizations.go แล้ว
// เพราะ assistants ตอนนี้เป็น org-level ไม่ใช่ competition-level
func (p *PostgresKlonDB) ListScores(ctx context.Context, workID int) ([]Score, error) {
    return []Score{}, nil
}