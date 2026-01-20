package klon

import (
    "context"
    "database/sql"
    "encoding/json"
    "fmt"
    "time"
)

// Contests & search
func (p *PostgresKlonDB) ListContests(ctx context.Context) ([]Competition, error) {
    rows, err := p.db.QueryContext(ctx, `SELECT competition_id, title, description, purpose, start_date, end_date, status, poster_url, max_score, created_at, updated_at, COALESCE(organizer_id,0) FROM competitions ORDER BY competition_id`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    res := make([]Competition, 0)
    for rows.Next() {
        var c Competition
        var poster sql.NullString
        var purpose sql.NullString
        var startDate sql.NullTime
        var endDate sql.NullTime
        var maxScore sql.NullInt64
        var updated sql.NullTime
        var organizerID int
        if err := rows.Scan(&c.ID, &c.Title, &c.Description, &purpose, &startDate, &endDate, &c.Status, &poster, &maxScore, &c.CreatedAt, &updated, &organizerID); err != nil {
            return nil, err
        }
        if poster.Valid { c.PosterURL = poster.String }
        
        // Build levels JSON from competition_levels table
        levels, _ := p.fetchLevelsForCompetition(ctx, c.ID)
        if len(levels) > 0 {
            b, _ := json.Marshal(levels)
            c.Levels = json.RawMessage(b)
        }
        
        if startDate.Valid {
            c.StartDate = startDate.Time.Format(time.RFC3339)
            c.RegistrationStart = startDate.Time.Format(time.RFC3339)
        }
        if endDate.Valid {
            c.EndDate = endDate.Time.Format(time.RFC3339)
            c.RegistrationEnd = endDate.Time.Format(time.RFC3339)
        }
        if maxScore.Valid { c.MaxScore = int(maxScore.Int64) }
        if updated.Valid { c.UpdatedAt = updated.Time }
        c.OrganizerID = organizerID
        res = append(res, c)
    }
    return res, nil
}

func (p *PostgresKlonDB) GetContestByID(ctx context.Context, id int) (Competition, error) {
    var c Competition
    var poster sql.NullString
    var purpose sql.NullString
    var startDate sql.NullTime
    var endDate sql.NullTime
    var maxScore sql.NullInt64
    var updated sql.NullTime
    err := p.db.QueryRowContext(ctx, `SELECT competition_id, title, description, purpose, start_date, end_date, status, poster_url, max_score, created_at, updated_at, COALESCE(organizer_id,0) FROM competitions WHERE competition_id=$1`, id).Scan(&c.ID, &c.Title, &c.Description, &purpose, &startDate, &endDate, &c.Status, &poster, &maxScore, &c.CreatedAt, &updated, &c.OrganizerID)
    if err != nil {
        return Competition{}, err
    }
    if poster.Valid { c.PosterURL = poster.String }
    // Build levels JSON from competition_levels table
    levels, _ := p.fetchLevelsForCompetition(ctx, id)
    if len(levels) > 0 {
        b, _ := json.Marshal(levels)
        c.Levels = json.RawMessage(b)
    }
    if startDate.Valid {
        c.StartDate = startDate.Time.Format(time.RFC3339)
        c.RegistrationStart = startDate.Time.Format(time.RFC3339)
    }
    if endDate.Valid {
        c.EndDate = endDate.Time.Format(time.RFC3339)
        c.RegistrationEnd = endDate.Time.Format(time.RFC3339)
    }
    if maxScore.Valid { c.MaxScore = int(maxScore.Int64) }
    if updated.Valid { c.UpdatedAt = updated.Time }
    return c, nil
}

func (p *PostgresKlonDB) SearchContests(ctx context.Context, q string) ([]Competition, error) {
    rows, err := p.db.QueryContext(ctx, `SELECT competition_id, title, description, purpose, start_date, end_date, status, poster_url, max_score, created_at, updated_at, COALESCE(organizer_id,0) FROM competitions WHERE title ILIKE $1 ORDER BY competition_id`, "%"+q+"%")
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    res := make([]Competition, 0)
    for rows.Next() {
        var c Competition
        var poster sql.NullString
        var purpose sql.NullString
        var startDate sql.NullTime
        var endDate sql.NullTime
        var maxScore sql.NullInt64
        var updated sql.NullTime
        var organizerID int
        if err := rows.Scan(&c.ID, &c.Title, &c.Description, &purpose, &startDate, &endDate, &c.Status, &poster, &maxScore, &c.CreatedAt, &updated, &organizerID); err != nil {
            return nil, err
        }
        if poster.Valid { c.PosterURL = poster.String }
        
        // Build levels JSON from competition_levels table
        levels, _ := p.fetchLevelsForCompetition(ctx, c.ID)
        if len(levels) > 0 {
            b, _ := json.Marshal(levels)
            c.Levels = json.RawMessage(b)
        }
        
        if startDate.Valid {
            c.StartDate = startDate.Time.Format(time.RFC3339)
            c.RegistrationStart = startDate.Time.Format(time.RFC3339)
        }
        if endDate.Valid {
            c.EndDate = endDate.Time.Format(time.RFC3339)
            c.RegistrationEnd = endDate.Time.Format(time.RFC3339)
        }
        if maxScore.Valid { c.MaxScore = int(maxScore.Int64) }
        if updated.Valid { c.UpdatedAt = updated.Time }
        c.OrganizerID = organizerID
        res = append(res, c)
    }
    return res, nil
}

// fetchLevelsForCompetition returns a slice of level objects (with poem_types and prizes)
func (p *PostgresKlonDB) fetchLevelsForCompetition(ctx context.Context, competitionID int) ([]map[string]interface{}, error) {
    rows, err := p.db.QueryContext(ctx, `SELECT cl.competition_level_id, l.name as level_name, cl.rules, cl.prizes, cl.topic_enabled, cl.topic_name, cl.poem_type_id FROM competition_levels cl LEFT JOIN levels l ON cl.level_id = l.level_id WHERE cl.competition_id=$1 ORDER BY cl.competition_level_id`, competitionID)
    if err != nil { return nil, err }
    defer rows.Close()
    var out []map[string]interface{}
    for rows.Next() {
        var levelID int
        var levelName string
        var rules sql.NullString
        var prizesBytes []byte
        var topicEnabled bool
        var topicName sql.NullString
        var poemTypeID sql.NullInt64
        if err := rows.Scan(&levelID, &levelName, &rules, &prizesBytes, &topicEnabled, &topicName, &poemTypeID); err != nil { continue }
        lvl := map[string]interface{}{"competition_level_id": levelID, "level_name": levelName}
        if rules.Valid { lvl["rules"] = rules.String }
        lvl["topic_enabled"] = topicEnabled
        if topicName.Valid { lvl["topic_name"] = topicName.String }

        // poem type (resolve name)
        if poemTypeID.Valid {
            var ptName sql.NullString
            _ = p.db.QueryRowContext(ctx, `SELECT name FROM poem_types WHERE poem_type_id=$1`, poemTypeID.Int64).Scan(&ptName)
            if ptName.Valid { lvl["poem_type"] = ptName.String }
        }

        // prizes JSONB
        if len(prizesBytes) > 0 {
            var pr interface{}
            if err := json.Unmarshal(prizesBytes, &pr); err == nil {
                lvl["prizes"] = pr
            }
        }

        out = append(out, lvl)
    }
    return out, nil
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

func (p *PostgresKlonDB) CreateCompetition(ctx context.Context, comp Competition) (Competition, error) {
    // ensure necessary columns exist (safe to run repeatedly)
    _, _ = p.db.ExecContext(ctx, `ALTER TABLE competitions ADD COLUMN IF NOT EXISTS description TEXT`)
    _, _ = p.db.ExecContext(ctx, `ALTER TABLE competitions ADD COLUMN IF NOT EXISTS purpose TEXT`)
    _, _ = p.db.ExecContext(ctx, `ALTER TABLE competitions ADD COLUMN IF NOT EXISTS start_date TIMESTAMP`)
    _, _ = p.db.ExecContext(ctx, `ALTER TABLE competitions ADD COLUMN IF NOT EXISTS end_date TIMESTAMP`)
    _, _ = p.db.ExecContext(ctx, `ALTER TABLE competitions ADD COLUMN IF NOT EXISTS organizer_id INTEGER`)
    _, _ = p.db.ExecContext(ctx, `ALTER TABLE competitions ADD COLUMN IF NOT EXISTS poster_url TEXT`)
    _, _ = p.db.ExecContext(ctx, `ALTER TABLE competitions ADD COLUMN IF NOT EXISTS max_score INTEGER DEFAULT 10`)
    _, _ = p.db.ExecContext(ctx, `ALTER TABLE competitions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP`)

    var id int
    // Use registration dates as start/end dates
    var startDate interface{} = nil
    var endDate interface{} = nil
    if comp.RegistrationStart != "" {
        startDate = comp.RegistrationStart
    }
    if comp.RegistrationEnd != "" {
        endDate = comp.RegistrationEnd
    }

    // Extract purpose from payload
    var purpose sql.NullString
    if comp.Purpose != "" {
        purpose = sql.NullString{String: comp.Purpose, Valid: true}
    }

    err := p.db.QueryRowContext(ctx, `INSERT INTO competitions (title, description, purpose, start_date, end_date, status, organizer_id, poster_url, max_score, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW()) RETURNING competition_id`, comp.Title, comp.Description, purpose, startDate, endDate, comp.Status, comp.OrganizerID, comp.PosterURL, comp.MaxScore).Scan(&id)
    if err != nil {
        return Competition{}, err
    }
    comp.ID = id
    // If judges provided as part of payload, try to insert them into judges table
    if len(comp.Judges) > 0 {
        fmt.Printf("Processing %d judges\n", len(comp.Judges))
        for _, j := range comp.Judges {
            fmt.Printf("Judge data: %+v\n", j)
            // Extract user_id
            var uid int
            if v, ok := j["user_id"].(float64); ok {
                uid = int(v)
            } else if email, ok := j["email"].(string); ok {
                // resolve by email
                _ = p.db.QueryRowContext(ctx, `SELECT user_id FROM users WHERE email=$1`, email).Scan(&uid)
            }
            
            if uid > 0 {
                // Extract levels array
                var levels []string
                if lvls, ok := j["levels"].([]interface{}); ok {
                    for _, l := range lvls {
                        if levelName, ok := l.(string); ok {
                            levels = append(levels, levelName)
                        }
                    }
                }
                
                // Insert one row per level
                for _, levelName := range levels {
                    // Resolve level_id from level name
                    var levelID int
                    err := p.db.QueryRowContext(ctx, `SELECT level_id FROM levels WHERE name=$1`, levelName).Scan(&levelID)
                    if err != nil {
                        fmt.Printf("Failed to resolve level_id for '%s': %v\n", levelName, err)
                        continue
                    }
                    
                    // Insert judge assignment for this level
                    _, err = p.db.ExecContext(ctx, `
                        INSERT INTO judges (user_id, competition_id, level_id, status) 
                        VALUES ($1, $2, $3, 'pending') 
                        ON CONFLICT (user_id, competition_id, level_id) 
                        DO UPDATE SET assigned_at = CURRENT_TIMESTAMP
                    `, uid, id, levelID)
                    
                    if err != nil {
                        fmt.Printf("Failed to insert judge for level %s: %v\n", levelName, err)
                    } else {
                        fmt.Printf("Successfully assigned judge (user_id=%d) to level %s (level_id=%d)\n", uid, levelName, levelID)
                    }
                }
            }
        }
    }
    // If assistants provided, insert into assistants table
    if len(comp.Assistants) > 0 {
        fmt.Printf("Processing %d assistants\n", len(comp.Assistants))
        for _, a := range comp.Assistants {
            fmt.Printf("Assistant data: %+v\n", a)
            var uid int
            if v, ok := a["user_id"].(float64); ok { uid = int(v) }
            if uid == 0 {
                if email, ok := a["email"].(string); ok { _ = p.db.QueryRowContext(ctx, `SELECT user_id FROM users WHERE email=$1`, email).Scan(&uid) }
            }
            
            // Extract boolean permissions
            canView := true // default
            canEdit := false
            canViewScores := false
            canAddAssistant := false
            
            if v, ok := a["can_view"].(bool); ok { canView = v }
            if v, ok := a["can_edit"].(bool); ok { canEdit = v }
            if v, ok := a["can_view_scores"].(bool); ok { canViewScores = v }
            if v, ok := a["can_add_assistant"].(bool); ok { canAddAssistant = v }
            
            fmt.Printf("Inserting assistant: uid=%d, comp_id=%d, canView=%v, canEdit=%v, canViewScores=%v, canAddAssistant=%v\n", uid, id, canView, canEdit, canViewScores, canAddAssistant)
            
            if uid > 0 {
                result, err := p.db.ExecContext(ctx, `INSERT INTO assistants (user_id, competition_id, status, can_view, can_edit, can_view_scores, can_add_assistant) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (user_id, competition_id) DO UPDATE SET status = EXCLUDED.status, can_view = EXCLUDED.can_view, can_edit = EXCLUDED.can_edit, can_view_scores = EXCLUDED.can_view_scores, can_add_assistant = EXCLUDED.can_add_assistant, assigned_at = CURRENT_TIMESTAMP`, uid, id, "pending", canView, canEdit, canViewScores, canAddAssistant)
                if err != nil {
                    fmt.Printf("Error inserting assistant: %v\n", err)
                } else {
                    fmt.Printf("Assistant inserted successfully: %+v\n", result)
                }
            } else {
                fmt.Printf("Skipping assistant with uid=0\n")
            }
        }
    } else {
        fmt.Println("No assistants to process")
    }
    // If Levels JSON was provided, parse and insert into competition_levels table
    if len(comp.Levels) > 0 {
        var levelsPayload []map[string]interface{}
        if err := json.Unmarshal(comp.Levels, &levelsPayload); err == nil {
            for _, lp := range levelsPayload {
                // extract level name and resolve to level_id
                var levelName string
                if v, ok := lp["level_name"].(string); ok { levelName = v } else if v, ok := lp["label"].(string); ok { levelName = v } else if v, ok := lp["level"].(string); ok { levelName = v }
                
                // resolve level_name to level_id
                var levelID interface{} = nil
                if levelName != "" {
                    var lid int
                    if err := p.db.QueryRowContext(ctx, `SELECT level_id FROM levels WHERE name=$1`, levelName).Scan(&lid); err == nil {
                        levelID = lid
                    }
                }
                if levelID == nil {
                    continue // skip if level not found
                }
                
                // rules
                var rules sql.NullString
                if v, ok := lp["rules"].(string); ok { rules = sql.NullString{String: v, Valid: true} }

                // topic: handle object with topicEnabled and topicName
                var topicEnabled bool
                var topicName sql.NullString
                if topicObj, ok := lp["topic"].(map[string]interface{}); ok {
                    if te, ok := topicObj["topicEnabled"].(bool); ok { topicEnabled = te }
                    if tn, ok := topicObj["topicName"].(string); ok && tn != "" { topicName = sql.NullString{String: tn, Valid: true} }
                }

                // poem_types: handle array - take first one for now (schema supports only one poem_type_id)
                var poemTypeID interface{} = nil
                if ptArray, ok := lp["poem_types"].([]interface{}); ok && len(ptArray) > 0 {
                    if ptName, ok := ptArray[0].(string); ok {
                        var ptID int
                        if err := p.db.QueryRowContext(ctx, `SELECT poem_type_id FROM poem_types WHERE name=$1`, ptName).Scan(&ptID); err == nil {
                            poemTypeID = ptID
                        }
                    }
                } else if v, ok := lp["poem_type"].(string); ok {
                    var ptID int
                    if err := p.db.QueryRowContext(ctx, `SELECT poem_type_id FROM poem_types WHERE name=$1`, v).Scan(&ptID); err == nil {
                        poemTypeID = ptID
                    }
                }

                // prizes: accept array (JSON)
                var prizesBytes []byte
                if prs, ok := lp["prizes"]; ok {
                    if b, err := json.Marshal(prs); err == nil { prizesBytes = b }
                }

                // insert level row with level_id
                if poemTypeID != nil {
                    _, _ = p.db.ExecContext(ctx, `INSERT INTO competition_levels (competition_id, level_id, poem_type_id, rules, prizes, topic_enabled, topic_name) VALUES ($1,$2,$3,$4,$5,$6,$7)`, comp.ID, levelID, poemTypeID, rules, prizesBytes, topicEnabled, topicName)
                } else {
                    _, _ = p.db.ExecContext(ctx, `INSERT INTO competition_levels (competition_id, level_id, rules, prizes, topic_enabled, topic_name) VALUES ($1,$2,$3,$4,$5,$6)`, comp.ID, levelID, rules, prizesBytes, topicEnabled, topicName)
                }
            }
        }
    }
    return comp, nil
}

func (p *PostgresKlonDB) UpdateCompetition(ctx context.Context, id int, comp Competition) (Competition, error) {
    var startDate interface{} = nil
    var endDate interface{} = nil
    if fmt.Sprintf("%v", comp.StartDate) != "" {
        startDate = comp.StartDate
    }
    if fmt.Sprintf("%v", comp.EndDate) != "" {
        endDate = comp.EndDate
    }

    _, err := p.db.ExecContext(ctx, `UPDATE competitions SET title=$1, description=$2, start_date=$3, end_date=$4, status=$5 WHERE competition_id=$6`, comp.Title, comp.Description, startDate, endDate, comp.Status, id)
    if err != nil {
        return Competition{}, err
    }
    return p.GetContestByID(ctx, id)
}

// Backwards-compatible wrapper (some callers expect GetCompetitionByID)
func (p *PostgresKlonDB) GetCompetitionByID(ctx context.Context, id int) (Competition, error) {
    return p.GetContestByID(ctx, id)
}

// Backwards-compatible alias for ListCompetitions
func (p *PostgresKlonDB) ListCompetitions(ctx context.Context) ([]Competition, error) {
    return p.ListContests(ctx)
}

func (p *PostgresKlonDB) DeleteCompetition(ctx context.Context, id int) error {
    _, err := p.db.ExecContext(ctx, `DELETE FROM competitions WHERE competition_id=$1`, id)
    return err
}

func (p *PostgresKlonDB) MyContests(ctx context.Context, userID int) ([]Competition, error) {
    rows, err := p.db.QueryContext(ctx, `SELECT competition_id, title, description, purpose, start_date, end_date, status, created_at, COALESCE(organizer_id,0) FROM competitions WHERE organizer_id=$1 OR EXISTS (SELECT 1 FROM coorganizers c WHERE c.competition_id = competitions.competition_id AND c.user_id = $1) ORDER BY competition_id`, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    res := make([]Competition, 0)
    for rows.Next() {
        var c Competition
        var purpose sql.NullString
        var startDate sql.NullTime
        var endDate sql.NullTime
        if err := rows.Scan(&c.ID, &c.Title, &c.Description, &purpose, &startDate, &endDate, &c.Status, &c.CreatedAt, &c.OrganizerID); err != nil {
            return nil, err
        }
        if startDate.Valid { c.RegistrationStart = startDate.Time.Format(time.RFC3339) }
        if endDate.Valid { c.RegistrationEnd = endDate.Time.Format(time.RFC3339) }
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
    rows, err := p.db.QueryContext(ctx, `SELECT w.work_id, w.submission_id, w.title, w.content, w.submitted_at FROM works w JOIN submissions s ON w.submission_id = s.submission_id WHERE s.competition_id=$1 ORDER BY w.work_id`, competitionID)
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
    err = p.db.QueryRowContext(ctx, `SELECT COUNT(DISTINCT s.work_id) FROM scores s JOIN works w ON s.work_id = w.work_id JOIN applicants a ON w.applicant_id = a.applicant_id WHERE a.competition_id = $1`, competitionID).Scan(&scored)
    if err != nil { return nil, err }
    return map[string]int{"total_submissions": total, "scored_submissions": scored}, nil
}

func (p *PostgresKlonDB) PostResults(ctx context.Context, competitionID int) error {
    _, err := p.db.ExecContext(ctx, `UPDATE competitions SET status='results_published' WHERE competition_id=$1`, competitionID)
    return err
}
