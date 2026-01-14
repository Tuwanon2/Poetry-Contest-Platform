package klon

import (
    "context"
    "database/sql"
    "errors"
    "time"
    "fmt"
)

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

// AssignAssistant assigns or updates an assistant for a competition
func (p *PostgresKlonDB) AssignAssistant(ctx context.Context, assistant Assistant) (Assistant, error) {
    // ensure assistants table exists
    _, _ = p.db.ExecContext(ctx, `CREATE TABLE IF NOT EXISTS assistants (assistant_id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE, competition_id INTEGER REFERENCES competitions(competition_id) ON DELETE CASCADE, permissions JSONB, assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id, competition_id))`)

    // insert or update
    _, err := p.db.ExecContext(ctx, `INSERT INTO assistants (user_id, competition_id, permissions) VALUES ($1,$2,$3) ON CONFLICT (user_id, competition_id) DO UPDATE SET permissions = EXCLUDED.permissions, assigned_at = CURRENT_TIMESTAMP`, assistant.UserID, assistant.CompetitionID, nil)
    if err != nil {
        return Assistant{}, err
    }

    var id int
    var assignedAt time.Time
    err = p.db.QueryRowContext(ctx, `SELECT assistant_id, assigned_at FROM assistants WHERE user_id=$1 AND competition_id=$2`, assistant.UserID, assistant.CompetitionID).Scan(&id, &assignedAt)
    if err != nil {
        return Assistant{}, err
    }
    assistant.ID = id
    assistant.AssignedAt = assignedAt
    return assistant, nil
}

// InviteAssistant invites a user to be an assistant for a competition
func (p *PostgresKlonDB) InviteAssistant(ctx context.Context, assistant Assistant) (Assistant, error) {
    var id int
    err := p.db.QueryRowContext(ctx, `
        INSERT INTO assistants (user_id, competition_id, status, can_view, can_edit, can_view_scores, can_add_assistant)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id, competition_id) DO UPDATE SET
            status = EXCLUDED.status,
            can_view = EXCLUDED.can_view,
            can_edit = EXCLUDED.can_edit,
            can_view_scores = EXCLUDED.can_view_scores,
            can_add_assistant = EXCLUDED.can_add_assistant,
            assigned_at = CURRENT_TIMESTAMP
        RETURNING assistant_id
    `, assistant.UserID, assistant.CompetitionID, assistant.Status, assistant.CanView, assistant.CanEdit, assistant.CanViewScores, assistant.CanAddAssistant).Scan(&id)
    
    if err != nil {
        return Assistant{}, err
    }

    assistant.ID = id
    assistant.AssignedAt = time.Now()
    return assistant, nil
}

func (p *PostgresKlonDB) ListScores(ctx context.Context, workID int) ([]Score, error) {
    return []Score{}, nil
}
