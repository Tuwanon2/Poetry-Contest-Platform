package klon

import (
    "context"
    "database/sql"
)

// Submissions
func (p *PostgresKlonDB) CreateSubmission(ctx context.Context, competitionID int, userID *int, name, email, phone, levelName, title, poemType, content, document string) (map[string]interface{}, error) {
    var submissionID int
    var submittedAt sql.NullTime
    
    // First, get level_id from level_name
    var levelID sql.NullInt64
    levelQuery := `SELECT level_id FROM levels WHERE name = $1`
    err := p.db.QueryRowContext(ctx, levelQuery, levelName).Scan(&levelID)
    if err != nil && err != sql.ErrNoRows {
        return nil, err
    }
    
    query := `
        INSERT INTO submissions 
        (competition_id, user_id, name, email, phone, level_id, level_name, title, poem_type, content, document, submitted_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP) 
        RETURNING submission_id, submitted_at
    `
    
    err = p.db.QueryRowContext(
        ctx, 
        query,
        competitionID,
        userID,
        name,
        email,
        phone,
        levelID,
        levelName,
        title,
        poemType,
        content,
        document,
    ).Scan(&submissionID, &submittedAt)
    
    if err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "submission_id": submissionID,
        "competition_id": competitionID,
        "user_id": userID,
        "name": name,
        "email": email,
        "phone": phone,
        "level_id": levelID,
        "level_name": levelName,
        "title": title,
        "poem_type": poemType,
        "content": content,
        "document": document,
        "submitted_at": submittedAt.Time,
    }, nil
}

func (p *PostgresKlonDB) GetSubmission(ctx context.Context, submissionID int) (map[string]interface{}, error) {
    var submission struct {
        SubmissionID  int
        CompetitionID int
        UserID        sql.NullInt64
        Name          string
        Email         string
        Phone         sql.NullString
        LevelName     string
        Title         string
        PoemType      string
        Content       string
        Document      sql.NullString
        Status        string
        SubmittedAt   string
    }
    
    query := `
        SELECT submission_id, competition_id, user_id, name, email, phone, 
               level_name, title, poem_type, content, document, status, submitted_at
        FROM submissions 
        WHERE submission_id=$1
    `
    
    err := p.db.QueryRowContext(ctx, query, submissionID).Scan(
        &submission.SubmissionID,
        &submission.CompetitionID,
        &submission.UserID,
        &submission.Name,
        &submission.Email,
        &submission.Phone,
        &submission.LevelName,
        &submission.Title,
        &submission.PoemType,
        &submission.Content,
        &submission.Document,
        &submission.Status,
        &submission.SubmittedAt,
    )
    
    if err != nil {
        return nil, err
    }
    
    result := map[string]interface{}{
        "submission_id":  submission.SubmissionID,
        "competition_id": submission.CompetitionID,
        "name":          submission.Name,
        "email":         submission.Email,
        "level_name":    submission.LevelName,
        "title":         submission.Title,
        "poem_type":     submission.PoemType,
        "content":       submission.Content,
        "status":        submission.Status,
        "submitted_at":  submission.SubmittedAt,
    }
    
    if submission.UserID.Valid {
        result["user_id"] = submission.UserID.Int64
    }
    if submission.Phone.Valid {
        result["phone"] = submission.Phone.String
    }
    if submission.Document.Valid {
        result["document"] = submission.Document.String
    }
    
    return result, nil
}

func (p *PostgresKlonDB) UpdateSubmission(ctx context.Context, submissionID int, title, content string) (map[string]interface{}, error) {
    _, err := p.db.ExecContext(ctx, `UPDATE submissions SET title=$1, content=$2 WHERE submission_id=$3`, title, content, submissionID)
    if err != nil {
        return nil, err
    }
    return p.GetSubmission(ctx, submissionID)
}

func (p *PostgresKlonDB) DeleteSubmission(ctx context.Context, submissionID int) error {
    _, err := p.db.ExecContext(ctx, `DELETE FROM submissions WHERE submission_id=$1`, submissionID)
    return err
}

func (p *PostgresKlonDB) GetSubmissionStatus(ctx context.Context, submissionID int) (map[string]interface{}, error) {
    // return average score and number of scores
    var avg sql.NullFloat64
    var cnt int
    err := p.db.QueryRowContext(ctx, `SELECT AVG(score), COUNT(*) FROM scores WHERE submission_id=$1`, submissionID).Scan(&avg, &cnt)
    if err != nil {
        return nil, err
    }
    m := map[string]interface{}{"submission_id": submissionID, "scores_count": cnt, "avg_score": nil}
    if avg.Valid {
        m["avg_score"] = avg.Float64
    }
    return m, nil
}

func (p *PostgresKlonDB) GetUserSubmissions(ctx context.Context, userID int) ([]map[string]interface{}, error) {
    rows, err := p.db.QueryContext(ctx, `
        SELECT s.submission_id, s.competition_id, s.name, s.email, s.phone, s.level_name, 
               s.title, s.poem_type, s.content, s.document, s.status, s.submitted_at,
               c.title as contest_title
        FROM submissions s
        LEFT JOIN competitions c ON s.competition_id = c.competition_id
        WHERE s.user_id=$1 
        ORDER BY s.submitted_at DESC`, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var submissions []map[string]interface{}
    for rows.Next() {
        var submissionID, competitionID int
        var name, email, phone, levelName, title, poemType, content, status string
        var document, contestTitle sql.NullString
        var submittedAt string
        
        if err := rows.Scan(&submissionID, &competitionID, &name, &email, &phone, &levelName,
            &title, &poemType, &content, &document, &status, &submittedAt, &contestTitle); err != nil {
            continue
        }
        
        submission := map[string]interface{}{
            "submission_id":  submissionID,
            "competition_id": competitionID,
            "name":          name,
            "email":         email,
            "phone":         phone,
            "level_name":    levelName,
            "title":         title,
            "poem_type":     poemType,
            "content":       content,
            "status":        status,
            "submitted_at":  submittedAt,
        }
        if document.Valid {
            submission["document"] = document.String
        }
        if contestTitle.Valid {
            submission["contest_title"] = contestTitle.String
        }
        submissions = append(submissions, submission)
    }
    return submissions, nil
}
