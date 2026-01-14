package klon

import (
    "context"
    "database/sql"
)

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
